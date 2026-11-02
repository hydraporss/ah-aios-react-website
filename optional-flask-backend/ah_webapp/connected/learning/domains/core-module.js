/* AH-AIOS CORE module pages (01-13). Local, browser-only working copy:
   records, acceptance-criteria review and the audit trail live in this browser's localStorage.
   Nothing here authenticates anyone, runs on a server, or carries approval authority. */
(function () {
  'use strict';
  var SPEC = '/hub', HUB = '/hub', KEY = 'ahaios.core.modules.v1';
  var MODS = window.CORE_MODULES, root = document.getElementById('app');
  var id = root.dataset.module, mod = MODS.filter(function (m) { return m.id === id; })[0], idx = MODS.indexOf(mod);
  var REG = { // per-module register: label, singular, statuses
    '02': ['Architecture registry', 'entry', ['Draft', 'Registered', 'Deprecated']],
    '03': ['Users and organizations', 'record', ['Invited', 'Active', 'Suspended', 'Offboarded']],
    '04': ['Authentication methods and events', 'record', ['Proposed', 'Enabled', 'Disabled']],
    '05': ['Roles and permissions', 'role', ['Proposed', 'Approved', 'Retired']],
    '06': ['Policies and decisions', 'policy', ['Draft', 'In review', 'Approved', 'Active', 'Retired']],
    '07': ['Incidents and vulnerabilities', 'item', ['Open', 'Investigating', 'Contained', 'Closed']],
    '08': ['Configuration items (references only)', 'item', ['Proposed', 'Approved', 'Applied', 'Reverted']],
    '09': ['Services and dependencies', 'service', ['Planned', 'Healthy', 'Degraded', 'Down', 'Retired']],
    '11': ['Evidence items', 'item', ['Collected', 'Under review', 'Verified', 'Rejected']],
    '12': ['Risks', 'risk', ['Open', 'Mitigating', 'Accepted', 'Closed']],
    '13': ['Change requests', 'change', ['Draft', 'Awaiting approval', 'Approved', 'Released', 'Rolled back']]
  };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var memory = null;
  function load() {
    var d = null;
    try { d = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { d = null; }
    if (!d || typeof d !== 'object') d = memory || { records: {}, criteria: {}, audit: [] };
    d.records = d.records || {}; d.criteria = d.criteria || {}; d.audit = d.audit || [];
    return d;
  }
  var storageOk = true;
  function save(d) { memory = d; try { localStorage.setItem(KEY, JSON.stringify(d)); storageOk = true; } catch (e) { storageOk = false; } }
  function log(d, m, action, detail) { d.audit.unshift({ t: new Date().toISOString(), module: m, action: action, detail: detail }); d.audit = d.audit.slice(0, 500); }
  function download(name, text, type) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type })); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function stamp(t) { return t.replace('T', ' ').slice(0, 19) + ' UTC'; }

  /* ---------- shell ---------- */
  var side = '<li><a href="core.html"><b>⌂</b>Home</a></li>' + MODS.map(function (m) {
    return '<li><a href="core-' + m.id + '.html"' + (m.id === id ? ' aria-current="page"' : '') + '><b>' + m.id + '</b>' + esc(m.name) + '</a></li>';
  }).join('');
  root.innerHTML =
    '<header class="bar"><a class="logo" href="../index.html" aria-label="Learning Studio home"><b>A</b>AH-AIOS</a><nav aria-label="Domains"><a href="core.html" aria-current="page">AH-AIOS Core</a><a href="harness.html">AI Harness</a><a href="worldforge.html">WorldForge</a><a href="../index.html">Learning Studio</a></nav></header>' +
    '<main><div class="cx cxm"><ol class="side" aria-label="CORE modules">' + side + '</ol><section class="mp" id="mp"></section></div></main>' +
    '<footer class="strip"><span>Governance · Security · Audit · Assurance</span><a href="' + SPEC + '#module-' + id + '">Specification: Module ' + id + '</a><a href="' + HUB + '">Workbench Hub</a></footer>';
  document.title = id + ' ' + mod.name + ' · AH-AIOS CORE';
  var mp = $('#mp');

  function head() {
    return '<p class="eyebrow" style="margin-top:0">CORE MODULE ' + id + ' · SPECIFIED · LOCAL WORKING COPY</p><h1>' + esc(mod.name) + '</h1><p class="lead mpl">' + esc(mod.purpose) + '</p>' +
      '<p class="mpn">Local demonstration: everything on this page is stored in this browser only. No sign-in, server, or approval authority exists yet, so nothing here is an approved record.' + (storageOk ? '' : ' <b>Browser storage is unavailable, so changes last until you leave this page.</b>') + '</p>';
  }
  function pager() {
    var p = MODS[idx - 1], n = MODS[idx + 1];
    return '<div class="mpg">' + (p ? '<a href="core-' + p.id + '.html">← ' + p.id + ' ' + esc(p.name) + '</a>' : '<span></span>') + (n ? '<a href="core-' + n.id + '.html">' + n.id + ' ' + esc(n.name) + ' →</a>' : '<span></span>') + '</div>';
  }
  function sections() {
    return '<div class="panel"><h3>Specification sections</h3><ul class="mpl2">' + mod.sections.map(function (s) {
      return '<li><a href="' + SPEC + '#' + s[1] + '">' + esc(s[0]) + '</a></li>'; }).join('') + '</ul></div>';
  }
  function criteria() {
    var d = load(), done = d.criteria[id] || [];
    var h = '<div class="panel"><h3>Acceptance criteria <i id="cprog">' + done.length + ' / ' + mod.criteria.length + ' reviewed</i></h3><p class="mps">Tick a criterion once you have checked it yourself. This is your own review log, not an automated test result.</p><ul class="mpc">';
    h += mod.criteria.map(function (c, i) { return '<li><label><input type="checkbox" data-i="' + i + '"' + (done.indexOf(i) > -1 ? ' checked' : '') + '> ' + esc(c) + '</label></li>'; }).join('') + '</ul></div>';
    return h;
  }
  function bindCriteria() {
    mp.addEventListener('change', function (e) {
      var i = e.target.dataset && e.target.dataset.i; if (i === undefined || e.target.type !== 'checkbox') return; i = +i;
      var d = load(), a = d.criteria[id] || []; a = e.target.checked ? a.concat(a.indexOf(i) < 0 ? [i] : []) : a.filter(function (x) { return x !== i; });
      d.criteria[id] = a; log(d, id, e.target.checked ? 'criterion reviewed' : 'criterion unchecked', mod.criteria[i]); save(d);
      $('#cprog').textContent = a.length + ' / ' + mod.criteria.length + ' reviewed';
    });
  }

  /* ---------- register (modules 02-09, 11-13) ---------- */
  function register() {
    var r = REG[id], d = load(), list = d.records[id] || [];
    var q = ($('#rq') && $('#rq').value || '').toLowerCase(), f = $('#rf') ? $('#rf').value : '';
    var rows = list.filter(function (x) { return (!f || x.status === f) && (!q || (x.title + ' ' + x.owner + ' ' + x.notes).toLowerCase().indexOf(q) > -1); });
    var tb = rows.map(function (x) {
      return '<tr><td><b>' + esc(x.title) + '</b><br><small>' + esc(x.notes) + '</small></td><td>' + esc(x.owner) + '</td><td><select data-st="' + x.id + '" aria-label="Status">' +
        r[2].map(function (s) { return '<option' + (s === x.status ? ' selected' : '') + '>' + esc(s) + '</option>'; }).join('') + '</select></td><td><small>' + esc(x.created.slice(0, 10)) + '</small></td><td><button class="mpb" data-del="' + x.id + '">Delete</button></td></tr>';
    }).join('') || '<tr><td colspan="5" class="mps">' + (list.length ? 'No records match.' : 'No records yet. Add the first one above.') + '</td></tr>';
    $('#rt').innerHTML = tb; $('#rc').textContent = list.length + ' record' + (list.length === 1 ? '' : 's');
  }
  function registerPanel() {
    var r = REG[id];
    return '<div class="panel"><h3>' + esc(r[0]) + ' <i id="rc"></i></h3>' + (id === '08' ? '<p class="mpw">Store references and descriptions only. Never type a password, key or token here.</p>' : '') +
      '<form class="mpf" id="rf2" autocomplete="off"><input id="ft" placeholder="Name / title" required maxlength="120"><input id="fo" placeholder="Owner" maxlength="80"><select id="fs" aria-label="Status">' + r[2].map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('') + '</select><input id="fn" placeholder="Notes (optional)" maxlength="300"><button class="mpb p" type="submit">Add ' + r[1] + '</button></form>' +
      '<div class="mpf"><input id="rq" placeholder="Search" aria-label="Search"><select id="rf" aria-label="Filter by status"><option value="">All statuses</option>' + r[2].map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('') + '</select><button class="mpb" id="rx">Export JSON</button></div>' +
      '<div class="mpt"><table><thead><tr><th>Record</th><th>Owner</th><th>Status</th><th>Added</th><th></th></tr></thead><tbody id="rt"></tbody></table></div></div>';
  }
  function bindRegister() {
    var r = REG[id];
    $('#rf2').addEventListener('submit', function (e) {
      e.preventDefault(); var d = load(), list = d.records[id] || [];
      var rec = { id: 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), title: $('#ft').value.trim(), owner: $('#fo').value.trim() || 'Unassigned', status: $('#fs').value, notes: $('#fn').value.trim(), created: new Date().toISOString() };
      if (!rec.title) return; list.unshift(rec); d.records[id] = list; log(d, id, 'record added', rec.title + ' [' + rec.status + ']'); save(d); e.target.reset(); register();
    });
    mp.addEventListener('change', function (e) {
      var sid = e.target.dataset && e.target.dataset.st; if (!sid) return;
      var d = load(), x = (d.records[id] || []).filter(function (y) { return y.id === sid; })[0]; if (!x) return;
      log(d, id, 'status changed', x.title + ': ' + x.status + ' → ' + e.target.value); x.status = e.target.value; save(d);
    });
    mp.addEventListener('click', function (e) {
      var did = e.target.dataset && e.target.dataset.del; if (!did) return;
      var d = load(), x = (d.records[id] || []).filter(function (y) { return y.id === did; })[0]; if (!x || !confirm('Delete "' + x.title + '"?')) return;
      d.records[id] = d.records[id].filter(function (y) { return y.id !== did; }); log(d, id, 'record deleted', x.title); save(d); register();
    });
    $('#rq').addEventListener('input', register); $('#rf').addEventListener('change', register);
    $('#rx').addEventListener('click', function () { download('core-' + id + '-' + mod.slug + '.json', JSON.stringify(load().records[id] || [], null, 2), 'application/json'); });
    register();
  }

  /* ---------- 01 dashboard ---------- */
  function dashboard() {
    var d = load(), cnt = function (m, pred) { return (d.records[m] || []).filter(pred || function () { return true; }).length; };
    var cards = [
      ['Open security items', cnt('07', function (x) { return x.status !== 'Closed'; }), '07'],
      ['Pending approvals', cnt('13', function (x) { return x.status === 'Awaiting approval'; }) + cnt('06', function (x) { return x.status === 'In review'; }), '13'],
      ['Unresolved risks', cnt('12', function (x) { return x.status !== 'Closed' && x.status !== 'Accepted'; }), '12'],
      ['Services degraded or down', cnt('09', function (x) { return x.status === 'Degraded' || x.status === 'Down'; }), '09'],
      ['Evidence verified', cnt('11', function (x) { return x.status === 'Verified'; }) + ' / ' + cnt('11'), '11'],
      ['Audit events logged', d.audit.length, '10']
    ];
    var rows = MODS.map(function (m) {
      var c = (d.criteria[m.id] || []).length, n = (d.records[m.id] || []).length, pct = Math.round(100 * c / m.criteria.length);
      return '<tr><td><a href="core-' + m.id + '.html"><b>' + m.id + '</b> ' + esc(m.name) + '</a></td><td>' + (REG[m.id] ? n : '—') + '</td><td>' + c + ' / ' + m.criteria.length + '</td><td><div class="bar2"><i style="width:' + pct + '%"></i></div></td></tr>';
    }).join('');
    var ev = d.audit.slice(0, 8).map(function (a) { return '<li><small>' + esc(stamp(a.t)) + '</small> · <b>' + esc(a.module) + '</b> ' + esc(a.action) + (a.detail ? ' — ' + esc(a.detail) : '') + '</li>'; }).join('') || '<li class="mps">No activity yet.</li>';
    return '<div class="mpk">' + cards.map(function (c) { return '<a href="core-' + c[2] + '.html"><b>' + c[1] + '</b><span>' + c[0] + '</span></a>'; }).join('') + '</div>' +
      '<p class="mps">Reporting period: since this browser\'s data was created. Source: this browser\'s local storage only — there is no live system feed, so health is shown as <b>unavailable</b>, not healthy.</p>' +
      '<div class="panel"><h3>Module progress</h3><div class="mpt"><table><thead><tr><th>Module</th><th>Records</th><th>Criteria reviewed</th><th>Progress</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>' +
      '<div class="panel"><h3>Recent activity</h3><ul class="mpl2">' + ev + '</ul></div>' +
      '<div class="panel"><h3>Local data</h3><div class="mpf"><button class="mpb" id="dx">Export all CORE data</button><button class="mpb" id="dr">Reset local CORE data</button></div></div>';
  }
  function bindDashboard() {
    $('#dx').addEventListener('click', function () { download('core-local-data.json', JSON.stringify(load(), null, 2), 'application/json'); });
    $('#dr').addEventListener('click', function () { if (confirm('Delete all CORE records, review ticks and audit events stored in this browser?')) { var d = { records: {}, criteria: {}, audit: [] }; log(d, '01', 'local data reset', ''); save(d); render(); } });
  }

  /* ---------- 10 audit ---------- */
  function auditPanel() {
    return '<div class="panel"><h3>Audit trail <i id="ac"></i></h3><p class="mps">Every record change and criterion review made in any CORE module on this browser is logged here. The log is read-only; the newest 500 events are kept.</p>' +
      '<div class="mpf"><input id="aq" placeholder="Search events" aria-label="Search events"><select id="am" aria-label="Filter by module"><option value="">All modules</option>' + MODS.map(function (m) { return '<option value="' + m.id + '">' + m.id + ' ' + esc(m.name) + '</option>'; }).join('') + '</select><button class="mpb" id="ae">Export CSV</button></div>' +
      '<div class="mpt"><table><thead><tr><th>Time</th><th>Module</th><th>Action</th><th>Detail</th></tr></thead><tbody id="at"></tbody></table></div></div>';
  }
  function auditRows() {
    var d = load(), q = $('#aq').value.toLowerCase(), m = $('#am').value;
    var rows = d.audit.filter(function (a) { return (!m || a.module === m) && (!q || (a.action + ' ' + a.detail).toLowerCase().indexOf(q) > -1); });
    $('#at').innerHTML = rows.map(function (a) { return '<tr><td><small>' + esc(stamp(a.t)) + '</small></td><td>' + esc(a.module) + '</td><td>' + esc(a.action) + '</td><td>' + esc(a.detail) + '</td></tr>'; }).join('') || '<tr><td colspan="4" class="mps">No events recorded yet. Make a change in any module and it will appear here.</td></tr>';
    $('#ac').textContent = rows.length + ' of ' + d.audit.length + ' events';
  }
  function bindAudit() {
    $('#aq').addEventListener('input', auditRows); $('#am').addEventListener('change', auditRows);
    $('#ae').addEventListener('click', function () {
      var q = function (s) { return '"' + String(s).replace(/"/g, '""') + '"'; };
      download('core-audit-trail.csv', 'time,module,action,detail\n' + load().audit.map(function (a) { return [a.t, a.module, a.action, a.detail].map(q).join(','); }).join('\n'), 'text/csv');
    });
    auditRows();
  }

  var bound = false;
  function render() {
    var main = id === '01' ? dashboard() : id === '10' ? auditPanel() : registerPanel();
    mp.innerHTML = head() + main + criteria() + sections() + pager();
    if (id === '01') bindDashboard(); else if (id === '10') bindAudit(); else bindRegister();
    if (!bound) { bindCriteria(); bound = true; }
  }
  render();
})();
