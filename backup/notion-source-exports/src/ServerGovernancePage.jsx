<!-- Notion source export 40966662-b29d-81ca-bb7f-d23f4f9ab128; original repository path src/ServerGovernancePage.jsx; exported 2026-10-30. -->

<b>Repository:</b> [hydraporss/ah-aios-react-website](https://github.com/hydraporss/ah-aios-react-website)
<b>Branch:</b> `main`
<b>Source path:</b> `src/ServerGovernancePage.jsx`
<b>Size:</b> 12432 bytes
<b>Git blob SHA:</b> `e97e43af6e31a61f381c22ce82fc54cdce1439d6`
<b>GitHub source:</b> [Open original](https://github.com/hydraporss/ah-aios-react-website/blob/main/src/ServerGovernancePage.jsx)

---

```javascript
import React, { useCallback, useEffect, useState } from 'react';

function csrfToken() {
  const entry = document.cookie.split('; ').find(value => value.startsWith('csrftoken='));
  return entry ? decodeURIComponent(entry.slice('csrftoken='.length)) : '';
}

async function api(path, options = {}) {
  const method = options.method || 'GET';
  const response = await fetch(path, {
    ...options,
    credentials: 'same-origin',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(['GET', 'HEAD'].includes(method) ? {} : { 'X-CSRFToken': csrfToken() }),
      ...options.headers,
    },
  });
  const payload = response.status === 204 ? {} : await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = Array.isArray(payload.detail) ? payload.detail.join(' ') : payload.detail;
    throw new Error(detail || payload.error || `Request failed (${response.status}).`);
  }
  return payload;
}

export default function ServerGovernancePage() {
  const [user, setUser] = useState(null);
  const [worlds, setWorlds] = useState([]);
  const [worldId, setWorldId] = useState('');
  const [role, setRole] = useState('');
  const [claims, setClaims] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const selectedWorld = worlds.find(world => String(world.id) === String(worldId));

  const loadWorlds = useCallback(async () => {
    const data = await api('/api/worlds/');
    setWorlds(data.worlds);
    setWorldId(current => data.worlds.some(world => String(world.id) === String(current)) ? current : String(data.worlds[0]?.id || ''));
  }, []);

  const loadWorkspace = useCallback(async () => {
    if (!worldId) { setClaims([]); setEvidence([]); setProposals([]); return; }
    const [worldData, claimData, archive] = await Promise.all([
      api(`/api/worlds/${worldId}/`),
      api(`/api/worlds/${worldId}/claims/`),
      api(`/api/worlds/${worldId}/archive/`),
    ]);
    setRole(claimData.role || worldData.role || 'member');
    setClaims(claimData.claims);
    setEvidence(archive.evidence);
    setProposals(archive.proposals);
  }, [worldId]);

  useEffect(() => {
    api('/api/session/').then(data => { setUser(data.user); return loadWorlds(); })
      .catch(error => { if (error.message !== 'authentication_required') setMessage(error.message); });
  }, [loadWorlds]);

  useEffect(() => {
    if (user && worldId) loadWorkspace().catch(error => setMessage(error.message));
  }, [user, worldId, loadWorkspace]);

  async function run(action) {
    setBusy(true); setMessage('');
    try { await action(); }
    catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }

  async function login(event) {
    event.preventDefault();
    await run(async () => {
      const result = await api('/api/login/', { method: 'POST', body: JSON.stringify({ username, password }) });
      setUser(result.user); setPassword(''); await loadWorlds(); setMessage(`Signed in as ${result.user}.`);
    });
  }

  async function logout() {
    await run(async () => { await api('/api/logout/', { method: 'POST', body: '{}' }); setUser(null); setWorlds([]); setWorldId(''); setClaims([]); setEvidence([]); setProposals([]); setMessage('Signed out.'); });
  }

  async function createWorld(event) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    await run(async () => {
      const result = await api('/api/worlds/', { method: 'POST', body: JSON.stringify({ title: form.get('title'), premise: form.get('premise') }) });
      await loadWorlds(); setWorldId(String(result.world.id)); setMessage('Workspace created on the Django server.');
    });
  }

  async function createClaim(event) {
    event.preventDefault(); const formElement = event.currentTarget; const form = new FormData(formElement);
    await run(async () => {
      const result = await api(`/api/worlds/${worldId}/claims/`, { method: 'POST', body: JSON.stringify({ statement: form.get('statement') }) });
      formElement.reset(); await loadWorkspace(); setMessage(`Claim ${result.claim.id} persisted as draft.`);
    });
  }

  async function attachEvidence(event, claimId) {
    event.preventDefault(); const formElement = event.currentTarget; const form = new FormData(formElement);
    await run(async () => {
      await api(`/api/claims/${claimId}/evidence/`, { method: 'POST', body: JSON.stringify(Object.fromEntries(form.entries())) });
      formElement.reset(); await loadWorkspace(); setMessage('Original source excerpt and its assessment were persisted.');
    });
  }

  async function submitProposal(event, claimId) {
    event.preventDefault(); const formElement = event.currentTarget; const form = new FormData(formElement);
    await run(async () => {
      await api(`/api/claims/${claimId}/proposals/`, { method: 'POST', body: JSON.stringify(Object.fromEntries(form.entries())) });
      formElement.reset(); await loadWorkspace(); setMessage('Proposal submitted for canon authority review.');
    });
  }

  async function decide(event, proposalId, decision) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    await run(async () => {
      await api(`/api/proposals/${proposalId}/decision/`, { method: 'POST', body: JSON.stringify({ decision, rationale: form.get('decision_rationale') }) });
      await loadWorkspace(); setMessage(`Proposal ${decision} by ${user}.`);
    });
  }

  async function exportArchive() {
    await run(async () => {
      const archive = await api(`/api/worlds/${worldId}/archive/`);
      const blob = new Blob([JSON.stringify(archive, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob); const link = document.createElement('a');
      link.href = url; link.download = `${selectedWorld?.title || 'worldforge'}-archive.json`; link.click(); URL.revokeObjectURL(url);
      setMessage('Server archive exported.');
    });
  }

  return <>
    <PageHead eyebrow="SERVER-BACKED ACCEPTANCE WORKFLOW" title="Governance API" subtitle="This page sends authenticated mutations to Django. The server session and workspace membership determine authority." />
    <div className="model-notice"><strong>Authoritative boundary</strong><span>Changes here persist on the Django server. The prototype pages remain browser-local; their demo actor selector does not grant API permissions.</span></div>
    {message && <p className="exchange-status" role="status" aria-live="polite">{message}</p>}
    {!user ? <section className="panel server-auth-panel"><h2>Sign in to the governance API</h2><form className="form-grid" onSubmit={login}>
      <label>Username<input autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} required /></label>
      <label>Password<input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></label>
      <button className="button-primary" disabled={busy}>Sign in</button>
    </form></section> : <>
      <section className="panel server-world-panel"><div className="panel-head"><div><h2>Server workspace</h2><p>Signed in as <strong>{user}</strong> · server role: <strong>{role || 'loading'}</strong></p></div><button className="button-secondary" onClick={logout} disabled={busy}>Sign out</button></div>
        {worlds.length > 0 && <label>Workspace<select aria-label="Server workspace" value={worldId} onChange={event => setWorldId(event.target.value)}>{worlds.map(world => <option key={world.id} value={world.id}>{world.title} · v{world.version}</option>)}</select></label>}
        <form className="form-grid" onSubmit={createWorld}><h3>Create a server workspace</h3><label>World title<input name="title" required maxLength="240" /></label><label>Premise<textarea name="premise" maxLength="20000" /></label><button className="button-secondary" disabled={busy}>Create workspace</button></form>
        {selectedWorld && <p className="form-help">Selected: {selectedWorld.title} · database version {selectedWorld.version}</p>}
      </section>
      {selectedWorld && <>
        <section className="panel server-claim-panel"><h2>Create a claim</h2><form className="form-grid" onSubmit={createClaim}><label>Claim statement<textarea name="statement" required maxLength="10000" /></label><button className="button-primary" disabled={busy}>Save claim to server</button></form></section>
        <section className="server-claim-list" aria-label="Persisted claims">{claims.map(claim => {
          const claimEvidence = evidence.filter(item => item.claim_id === claim.id);
          const claimProposals = proposals.filter(item => item.claim_id === claim.id);
          return <article className="panel server-claim-card" key={claim.id} data-claim-id={claim.id}>
            <div className="panel-head"><div><h2>{claim.statement}</h2><p>Claim {claim.id} · v{claim.version} · {claim.canon_state} · created by {claim.created_by}</p></div></div>
            <h3>Evidence and source provenance</h3>{claimEvidence.map(item => <blockquote key={item.id}><strong>{item.source_title}</strong> · {item.assessment}<p>{item.original_excerpt}</p><small>{item.source_author} · {item.source_reference} · attached by {item.created_by}</small>{item.interpretation && <p>Interpretation: {item.interpretation}</p>}</blockquote>)}
            <form className="form-grid" onSubmit={event => attachEvidence(event, claim.id)}><h4>Attach evidence</h4><label>Source title<input name="source_title" required maxLength="300" /></label><label>Source author<input name="source_author" maxLength="240" /></label><label>Source reference<input name="source_reference" maxLength="1000" placeholder="URL, archive ID, or citation" /></label><label>Original excerpt<textarea name="original_excerpt" required maxLength="20000" /></label><label>Interpretation<textarea name="interpretation" maxLength="10000" /></label><label>Assessment<select name="assessment"><option value="unassessed">Unassessed</option><option value="supports">Supports</option><option value="contradicts">Contradicts</option><option value="context">Context</option></select></label><button className="button-secondary" disabled={busy}>Attach evidence</button></form>
            <form className="form-grid" onSubmit={event => submitProposal(event, claim.id)}><h4>Submit canon proposal</h4><label>Proposed statement<textarea name="proposed_statement" required maxLength="10000" defaultValue={claim.statement} /></label><label>Proposal rationale<textarea name="rationale" required maxLength="5000" /></label><button className="button-primary" disabled={busy || !claimEvidence.length}>Submit proposal</button>{!claimEvidence.length && <small>Add evidence before submitting a proposal.</small>}</form>
            {claimProposals.map(proposal => <div className="server-proposal" key={proposal.id} data-proposal-id={proposal.id}><h4>Proposal · {proposal.status}</h4><p>{proposal.proposed_statement}</p><p>Proposed by {proposal.proposed_by} · {proposal.rationale}</p>{proposal.decided_by && <p>Decision by {proposal.decided_by}: {proposal.decision_rationale}</p>}{proposal.status === 'proposed' && role === 'canon_authority' && <form className="form-grid" onSubmit={event => decide(event, proposal.id, 'approved')}><label>Decision rationale<textarea name="decision_rationale" required maxLength="5000" /></label><button className="button-primary" disabled={busy}>Authorize canon change</button></form>}</div>)}
          </article>;
        })}</section>
        <section className="panel server-archive-panel"><div className="panel-head"><div><h2>Archive and audit</h2><p>Export the server-authoritative claims, evidence, proposals, revisions, and audit events.</p></div><button className="button-secondary" onClick={exportArchive} disabled={busy}>Export server archive</button><button className="button-secondary" onClick={() => run(loadWorkspace)} disabled={busy}>Reload from server</button></div></section>
      </>}
    </>}
  </>;
}

function PageHead({ eyebrow, title, subtitle }) {
  return <div className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div></div>;
}

```
