import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const tempRoot = process.env.WORLDFORGE_E2E_TEMP_DIR;
const baseUrl = process.env.WORLDFORGE_E2E_BASE_URL || 'http://127.0.0.1:5173';
const browserPath = process.env.WORLDFORGE_BROWSER || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
if (!tempRoot || !fs.existsSync(tempRoot)) throw new Error('Set WORLDFORGE_E2E_TEMP_DIR by running tests/run-governance-acceptance.ps1.');

async function requestInPage(page, pathName, method, payload) {
  return page.evaluate(async ({ pathName, method, payload }) => {
    const token = decodeURIComponent(document.cookie.split('; ').find(item => item.startsWith('csrftoken='))?.split('=').slice(1).join('=') || '');
    const response = await fetch(pathName, { method, credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': token },
      body: payload === undefined ? undefined : JSON.stringify(payload) });
    return { status: response.status, body: await response.json().catch(() => ({})) };
  }, { pathName, method, payload });
}

async function signIn(page, user, password) {
  await page.getByLabel('Username').fill(user);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByText(`Signed in as ${user}.`).waitFor();
}

let browser;
try {
  browser = process.env.WORLDFORGE_CDP_URL
    ? await chromium.connectOverCDP(process.env.WORLDFORGE_CDP_URL)
    : await chromium.launch({ headless: true, executablePath: browserPath, args: ['--no-sandbox'] });
  const context = browser.contexts()[0] || await browser.newContext();
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(baseUrl);
  await page.getByRole('button', { name: 'Server Governance' }).click();
  await signIn(page, 'creator', 'creator-pass');
  await page.getByLabel('Server workspace').selectOption({ label: /Acceptance World/ });

  await page.getByLabel('Claim statement').fill('The archipelago drifts east during spring.');
  await page.getByRole('button', { name: 'Save claim to server' }).click();
  const claimCard = page.locator('.server-claim-card').filter({ hasText: 'The archipelago drifts east during spring.' });
  await claimCard.waitFor();
  const claimId = await claimCard.getAttribute('data-claim-id');
  assert.ok(claimId, 'Claim ID must be server-assigned and displayed.');

  await claimCard.getByLabel('Source title').fill('Spring Tide Ledger');
  await claimCard.getByLabel('Source author').fill('Archivist Nera');
  await claimCard.getByLabel('Source reference').fill('archive://tides/spring/14');
  await claimCard.getByLabel('Original excerpt').fill('The islands move eastward with the spring current.');
  await claimCard.getByLabel('Interpretation').fill('The source supports seasonal eastward drift.');
  await claimCard.getByLabel('Assessment').selectOption('supports');
  await claimCard.getByRole('button', { name: 'Attach evidence' }).click();
  await claimCard.getByText('Spring Tide Ledger').waitFor();

  const statement = 'The archipelago drifts east during the spring current.';
  await claimCard.getByLabel('Proposed statement').fill(statement);
  await claimCard.getByLabel('Proposal rationale').fill('The original excerpt specifies the spring current.');
  await claimCard.getByRole('button', { name: 'Submit proposal' }).click();
  await claimCard.getByText('Proposal · proposed').waitFor();
  const proposalId = await claimCard.locator('[data-proposal-id]').getAttribute('data-proposal-id');
  assert.ok(proposalId, 'Proposal ID must be server-assigned.');
  const decisionUrl = `/api/proposals/${proposalId}/decision/`;

  await page.getByRole('button', { name: 'Sign out' }).click();
  const anonymousAttempt = await requestInPage(page, decisionUrl, 'POST', { decision: 'approved', rationale: 'Unauthorized' });
  assert.equal(anonymousAttempt.status, 401, 'Anonymous approval must be rejected by Django.');
  await signIn(page, 'creator', 'creator-pass');
  const creatorAttempt = await requestInPage(page, decisionUrl, 'POST', { decision: 'approved', rationale: 'Unauthorized' });
  assert.equal(creatorAttempt.status, 403, 'Creator must not approve canon changes.');
  const invalidRequest = await requestInPage(page, `/api/worlds/${await page.getByLabel('Server workspace').inputValue()}/claims/`, 'POST', { statement: '' });
  assert.equal(invalidRequest.status, 400, 'Malformed writes must return a validation error.');
  await page.getByRole('button', { name: 'Sign out' }).click();
  await signIn(page, 'reviewer', 'reviewer-pass');
  const reviewerAttempt = await requestInPage(page, decisionUrl, 'POST', { decision: 'approved', rationale: 'Unauthorized' });
  assert.equal(reviewerAttempt.status, 403, 'Reviewer must not approve canon changes.');
  await page.getByRole('button', { name: 'Sign out' }).click();
  await signIn(page, 'authority', 'authority-pass');
  await page.getByLabel('Server workspace').selectOption({ label: /Acceptance World/ });
  const authorityCard = page.locator('.server-claim-card').filter({ hasText: 'The archipelago drifts east during spring.' });
  await authorityCard.getByLabel('Decision rationale').fill('Source and interpretation reviewed; statement scope is supported.');
  await authorityCard.getByRole('button', { name: 'Authorize canon change' }).click();
  await authorityCard.getByText('Proposal · approved').waitFor();
  await authorityCard.getByText('Decision by authority: Source and interpretation reviewed; statement scope is supported.').waitFor();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export server archive' }).click();
  const download = await downloadPromise;
  const archiveFile = path.join(tempRoot, 'worldforge-export.json');
  await download.saveAs(archiveFile);
  const exportedArchive = JSON.parse(fs.readFileSync(archiveFile, 'utf8'));
  assert.equal(exportedArchive.claims[0].id, claimId);
  assert.equal(exportedArchive.claims[0].canon_state, 'approved');
  assert.equal(exportedArchive.evidence[0].original_excerpt, 'The islands move eastward with the spring current.');
  assert.equal(exportedArchive.proposals[0].decided_by, 'authority');
  assert.equal(exportedArchive.proposals[0].decision_rationale, 'Source and interpretation reviewed; statement scope is supported.');

  await page.reload();
  await page.getByRole('button', { name: 'Server Governance' }).click();
  await page.getByText(/Signed in as authority/).waitFor();
  await page.getByText('Proposal · approved').waitFor();
  await page.getByText('Decision by authority: Source and interpretation reviewed; statement scope is supported.').waitFor();

  await page.getByRole('button', { name: 'Sign out' }).click();
  await signIn(page, 'ops', 'ops-pass');
  const backupResponse = await requestInPage(page, '/api/backups/', 'POST', {});
  assert.equal(backupResponse.status, 201, JSON.stringify(backupResponse.body));
  const backup = backupResponse.body.backup;
  assert.equal(backup.status, 'verified');
  const postBackupWorld = await requestInPage(page, '/api/worlds/', 'POST', { title: 'Must be removed by restore', premise: 'Mutation after backup.' });
  assert.equal(postBackupWorld.status, 201);
  const restoreResponse = await requestInPage(page, `/api/backups/${backup.id}/restore/`, 'POST', { confirm: `RESTORE ${backup.filename}` });
  assert.equal(restoreResponse.status, 200, JSON.stringify(restoreResponse.body));
  const verification = await requestInPage(page, '/api/audit/verify/', 'GET');
  assert.equal(verification.status, 200);
  assert.equal(verification.body.valid, true);

  await page.getByRole('button', { name: 'Sign out' }).click();
  await signIn(page, 'creator', 'creator-pass');
  await page.getByLabel('Server workspace').selectOption({ label: /Acceptance World/ });
  const afterRestore = await page.evaluate(async worldId => {
    const response = await fetch(`/api/worlds/${worldId}/archive/`, { credentials: 'same-origin' });
    return response.json();
  }, Number(exportedArchive.world.id));
  assert.deepEqual(afterRestore, exportedArchive, 'Archive data, IDs, evidence links, provenance, decisions and event hashes must round-trip through database recovery.');
  const worldsAfterRestore = await page.evaluate(async () => (await (await fetch('/api/worlds/')).json()).worlds);
  assert.equal(worldsAfterRestore.some(world => world.title === 'Must be removed by restore'), false);
  assert.deepEqual(pageErrors, [], `React runtime errors: ${pageErrors.join('; ')}`);
  console.log('PASS: React-to-Django authorization, claim/evidence/proposal approval, reload, archive export, audit verification, and SQLite restore round-trip.');
} finally {
  if (browser) await browser.close();
}
