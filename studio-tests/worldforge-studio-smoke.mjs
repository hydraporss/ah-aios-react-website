import { chromium } from 'playwright';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = 'http://127.0.0.1:4173/worldforge/verified-2026-10-28/';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ acceptDownloads: true });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const temp = mkdtempSync(join(tmpdir(), 'worldforge-studio-'));

try {
  await page.goto(base + 'studio.html', { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: /World Studio/ }).waitFor();
  await page.locator('[data-tab="worlds"]').click();
  await page.locator('#world-form input[name="name"]').fill('Browser Test World');
  await page.locator('#world-form textarea[name="description"]').fill('Automated acceptance fixture.');
  await page.locator('#world-form button[type="submit"]').click();
  await page.getByText('Browser Test World', { exact: true }).waitFor();

  await page.locator('[data-tab="entities"]').click();
  for (const [name, type] of [['Alpha Entity', 'Civilization'], ['Beta Entity', 'Person']]) {
    await page.locator('#entity-form input[name="name"]').fill(name);
    await page.locator('#entity-form select[name="type"]').selectOption(type);
    await page.locator('#entity-world').selectOption({ label: 'Browser Test World' });
    await page.locator('#entity-form button[type="submit"]').click();
    await page.getByText(name, { exact: true }).waitFor();
  }

  await page.locator('[data-tab="relationships"]').click();
  await page.locator('#relation-source').selectOption({ label: 'Alpha Entity' });
  await page.locator('#relation-target').selectOption({ label: 'Beta Entity' });
  await page.locator('#relationship-form select[name="type"]').selectOption({ label: 'Allied with' });
  await page.locator('#relationship-form button[type="submit"]').click();
  await page.getByText('Alpha Entity → Beta Entity').waitFor();

  await page.locator('[data-tab="claims"]').click();
  await page.locator('#claim-form input[name="title"]').fill('Test claim');
  await page.locator('#claim-form textarea[name="statement"]').fill('A test statement with a recorded source.');
  await page.locator('#claim-world').selectOption({ label: 'Browser Test World' });
  await page.locator('#claim-form input[name="sourceName"]').fill('Acceptance fixture');
  await page.locator('#claim-form input[name="sourceRef"]').fill('tests/fixture.md');
  await page.locator('#claim-form select[name="evidence"]').selectOption('Supported');
  await page.locator('#claim-form button[type="submit"]').click();
  await page.getByText('Test claim', { exact: true }).waitFor();

  await page.locator('[data-tab="integrity"]').click();
  await page.locator('#run-validation').click();
  await page.getByText(/0 errors · 0 warnings/).waitFor();

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#export-btn').click();
  const download = await downloadPromise;
  const exportPath = join(temp, download.suggestedFilename());
  await download.saveAs(exportPath);
  const exported = JSON.parse(readFileSync(exportPath, 'utf8'));
  if (exported.worlds.length !== 1 || exported.entities.length !== 2 || exported.relationships.length !== 1 || exported.claims.length !== 1) {
    throw new Error('Export package did not preserve all created records.');
  }

  page.once('dialog', dialog => dialog.accept());
  await page.locator('#import-btn').click();
  await page.locator('#import-file').setInputFiles(exportPath);
  page.once('dialog', dialog => dialog.accept());
  await page.getByText('Import completed and saved locally.').waitFor();
  await page.locator('#run-validation').click();
  await page.getByText(/0 errors · 0 warnings/).waitFor();

  if (errors.length) throw new Error('Browser runtime errors: ' + errors.join('; '));
  console.log('WorldForge Studio browser acceptance passed: create world/entities/relationship/claim, validate, export, import.');
} finally {
  await context.close();
  await browser.close();
  rmSync(temp, { recursive: true, force: true });
}
