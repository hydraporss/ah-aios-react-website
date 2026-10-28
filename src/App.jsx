
import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

const afterHumanityDocument = "<!doctype html>\n<html lang=\"en\">\n<head><base href=\"https://hydraporss.github.io/ah-aios-react-website/worldforge/\" target=\"_top\">\n<meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<meta name=\"theme-color\" content=\"#080d1c\"><title>After Humanity — Worldbuilding Archive</title>\n<style>\n:root{--bg:#080d1c;--panel:#0d1728;--line:#24344d;--gold:#d9b85d;--text:#eef3ff;--muted:#9eacc2;--cyan:#73c9e8}*{box-sizing:border-box}body{margin:0;background:radial-gradient(ellipse at 50% -30%,#273d69 0,transparent 60%),var(--bg);color:var(--text);font:14px/1.5 Inter,ui-sans-serif,system-ui,Segoe UI,sans-serif}button,input{font:inherit;color:inherit}button{cursor:pointer}.shell{max-width:1440px;margin:auto;padding:16px}.topbar{height:66px;display:flex;align-items:center;gap:25px;padding:0 22px;background:#09111fee;border:1px solid var(--line);border-radius:14px;position:sticky;top:10px;z-index:5;backdrop-filter:blur(16px)}.brand{display:flex;align-items:center;gap:12px;min-width:230px}.sigil{height:40px;width:40px;border:1px solid var(--gold);border-radius:50%;display:grid;place-items:center;color:var(--gold);font-size:23px}.brand strong{display:block;font:20px Georgia,serif;letter-spacing:.13em}.brand small{color:var(--muted);letter-spacing:.2em;font-size:9px}.nav{display:flex;gap:6px;align-items:center;flex:1}.nav button,.iconbtn{border:0;background:none;color:var(--muted);padding:10px 12px;border-radius:8px}.nav button:hover,.nav button.active{color:var(--gold);background:#ffffff0a}.nav button.active{box-shadow:inset 0 -2px var(--gold)}.search{position:relative}.search input{width:210px;background:#0b1424;border:1px solid var(--line);border-radius:22px;padding:9px 34px 9px 14px;outline:none}.search input:focus{border-color:var(--gold)}.search span{position:absolute;right:12px;top:7px;color:var(--muted)}.iconbtn{font-size:18px}.layout{display:grid;grid-template-columns:190px minmax(0,1fr);gap:16px;margin-top:16px}.side,.box{background:linear-gradient(145deg,#111d31,#0a1221);border:1px solid var(--line);border-radius:12px}.side{padding:12px;height:max-content;position:sticky;top:92px}.side h3{font-size:10px;letter-spacing:.18em;color:var(--muted);padding:0 8px;margin:8px 0}.side button{display:flex;width:100%;text-align:left;align-items:center;gap:10px;background:none;color:#c6d2e5;border:0;border-radius:8px;padding:10px 8px;font-size:12px}.side button:hover,.side button.active{background:#ffffff0b;color:var(--gold)}.side .ico{font-size:17px;width:22px;text-align:center}.side small{display:block;color:#8191aa;font-size:9px}.main{min-width:0}.hero{min-height:350px;border:1px solid #36425a;border-radius:13px;overflow:hidden;position:relative;display:flex;align-items:center;padding:clamp(24px,5vw,68px);background:linear-gradient(90deg,#07101bea 0%,#091323c9 38%,#11182d44 76%),linear-gradient(0deg,#08101ddd,transparent 35%),radial-gradient(ellipse at 76% 55%,#f5b36c 0,transparent 18%),radial-gradient(ellipse at 72% 60%,#ac6bc0 0,transparent 32%),radial-gradient(ellipse at 63% 40%,#3785bd 0,transparent 40%),linear-gradient(130deg,#142346,#252954 40%,#723a68 68%,#f2a96e);isolation:isolate}.hero:before{content:\"\";position:absolute;inset:0;z-index:-1;background:radial-gradient(circle at 72% 28%,#d9eaff 0 1px,transparent 2px),radial-gradient(circle at 87% 30%,#fff 0 1px,transparent 2px),radial-gradient(circle at 60% 17%,#fff 0 1px,transparent 2px),radial-gradient(circle at 53% 67%,#b9eaff 0 1px,transparent 2px);background-size:150px 130px,190px 170px,230px 210px,170px 160px;opacity:.8}.hero:after{content:\"\";position:absolute;z-index:-1;right:5%;bottom:-45px;width:47%;height:60%;background:linear-gradient(180deg,#86d9eeaa,#334f80 42%,#131b38 44%,#0c1327);clip-path:polygon(0 100%,8% 65%,17% 70%,25% 24%,32% 64%,43% 8%,53% 66%,62% 35%,72% 69%,84% 22%,100% 100%);filter:drop-shadow(0 0 20px #69bfe0)}.hero-content{max-width:570px}.eyebrow{color:var(--gold);letter-spacing:.25em;text-transform:uppercase;font-size:10px}.hero h1{font:clamp(38px,6vw,64px)/.98 Georgia,serif;letter-spacing:.03em;margin:12px 0}.hero .sub{font:14px Georgia,serif;letter-spacing:.34em;color:#e5c56e}.hero p{color:#d2d9e8;max-width:430px}.goldbtn{border:1px solid var(--gold);background:#0a1425aa;color:var(--gold);border-radius:24px;padding:11px 18px;letter-spacing:.1em;font-size:11px;font-weight:700;margin-top:10px}.goldbtn:hover{background:var(--gold);color:#111}.sectionhead{display:flex;align-items:end;justify-content:space-between;margin:22px 2px 12px}.sectionhead h2{font:23px Georgia,serif;margin:0}.sectionhead p{margin:3px 0 0;color:var(--muted);font-size:12px}.textbtn{border:0;background:none;color:var(--gold);font-size:12px}.content-grid{display:grid;grid-template-columns:repeat(5,minmax(130px,1fr)) minmax(205px,1.4fr);gap:10px}.card{border:1px solid var(--line);border-radius:11px;overflow:hidden;background:#0c1524;min-width:0;transition:.2s transform,.2s border-color}.card:hover{transform:translateY(-3px);border-color:#9b8450}.art{height:155px;display:flex;align-items:center;justify-content:center;font-size:57px;position:relative;overflow:hidden;background:var(--art)}.art:after{content:\"\";position:absolute;inset:35% 0 0;background:linear-gradient(transparent,#09111de8)}.art span{filter:drop-shadow(0 4px 8px #0008);z-index:1}.cardbody{padding:12px}.cardbody h3{font:16px Georgia,serif;letter-spacing:.05em;margin:0 0 4px}.cardbody p{font-size:11px;color:var(--muted);margin:0;min-height:32px}.arrow{display:block;color:var(--gold);text-align:right;margin-top:7px}.updates{padding:14px}.updates h3{font:18px Georgia,serif;margin:0 0 6px}.update{display:grid;grid-template-columns:47px 1fr;gap:9px;padding:10px 0;border-bottom:1px solid #ffffff12}.thumb{height:40px;border-radius:6px;background:var(--art);display:grid;place-items:center;font-size:20px}.update b{display:block;font-size:11px;font-weight:600}.update small{font-size:9px;color:var(--muted)}.quote{margin:12px 0 2px;color:#aab6c8;font:italic 12px Georgia,serif}.empty{padding:30px;text-align:center;color:var(--muted)}.toast{position:fixed;bottom:20px;left:50%;transform:translate(-50%,20px);background:#e8d08a;color:#151b28;padding:11px 17px;border-radius:24px;opacity:0;transition:.25s;pointer-events:none;z-index:10}.toast.show{opacity:1;transform:translate(-50%,0)}.mobilemenu{display:none}.footer{color:#718098;text-align:center;font-size:10px;padding:25px}\n@media(max-width:1050px){.content-grid{grid-template-columns:repeat(3,1fr)}.updates{grid-column:span 3}.updates-list{display:grid;grid-template-columns:repeat(2,1fr);gap:0 18px}.brand{min-width:190px}.search input{width:165px}}\n@media(max-width:720px){.shell{padding:8px}.topbar{height:auto;min-height:58px;padding:8px 12px;gap:8px;top:5px}.brand{min-width:0;flex:1}.brand strong{font-size:15px}.brand small{font-size:7px}.sigil{width:34px;height:34px}.nav{display:none}.search input{width:clamp(100px,30vw,180px)}.iconbtn{display:none}.mobilemenu{display:block}.layout{grid-template-columns:1fr;margin-top:9px}.side{display:none;position:fixed;z-index:6;top:72px;left:8px;max-width:230px;box-shadow:0 10px 40px #000b}.side.open{display:block}.hero{min-height:360px;padding:27px 23px;align-items:flex-start}.hero:after{width:75%;right:-8%;height:50%}.hero h1{font-size:43px}.hero .sub{font-size:10px}.content-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.card:last-of-type:nth-child(odd){grid-column:span 2}.updates{grid-column:auto}.updates-list{display:block}.art{height:130px}}\n</style></head>\n<body><div class=\"shell\">\n<header class=\"topbar\"><button class=\"iconbtn mobilemenu\" id=\"menuToggle\" aria-label=\"Open menu\">☰</button><div class=\"brand\"><div class=\"sigil\">✥</div><div><strong>AFTER HUMANITY</strong><small>WORLD BUILDING · LORE · CANON</small></div></div><nav class=\"nav\" aria-label=\"Main navigation\"><button class=\"active\" data-section=\"Home\">Home</button><button data-section=\"Worlds\">Worlds</button><button data-section=\"Characters\">Characters</button><button data-section=\"Races\">Races</button><button data-section=\"Lore\">Lore</button><button data-section=\"Gallery\">Gallery</button><button data-section=\"Tools\">Tools</button></nav><label class=\"search\"><input id=\"search\" placeholder=\"Search the universe…\" aria-label=\"Search the universe\"><span>⌕</span></label><button class=\"iconbtn\" id=\"profile\" aria-label=\"Profile\">♙</button><button class=\"iconbtn\" id=\"menuMore\" aria-label=\"More\">☷</button></header>\n<div class=\"layout\"><aside class=\"side\" id=\"side\"><h3>✧ &nbsp; EXPLORE</h3><button class=\"active\" data-section=\"Worlds\"><span class=\"ico\">◎</span><span>World Atlas<small>Planets · Locations · Timelines</small></span></button><button data-section=\"Characters\"><span class=\"ico\">♙</span><span>Identity Archive<small>Characters · Races · Technologies</small></span></button><button data-section=\"Relationships\"><span class=\"ico\">⌘</span><span>Relationship Explorer<small>Alliances · Conflicts · Lineages</small></span></button><button data-section=\"Sources\"><span class=\"ico\">◉</span><span>Source & Evidence Registry<small>Sources · Claims · Verification</small></span></button><button data-section=\"Canon\"><span class=\"ico\">⚙</span><span>Canon Governance<small>Proposals · Reviews · Decisions</small></span></button><button data-section=\"Gallery\"><span class=\"ico\">✧</span><span>Visual Archive Studio<small>Images · Prompts · Assessments</small></span></button></aside>\n<main class=\"main\"><section class=\"hero\"><div class=\"hero-content\"><div class=\"eyebrow\">A living universe · preserved through knowledge</div><h1>AFTER HUMANITY</h1><div class=\"sub\">A UNIVERSE TO EXPLORE</div><p>Explore the worlds, races, characters, and stories of a living universe of possibility, preserved through knowledge and governed by canon.</p><button class=\"goldbtn\" id=\"explore\">EXPLORE THE UNIVERSE &nbsp; →</button></div></section>\n<div class=\"sectionhead\"><div><h2 id=\"sectionTitle\">Explore the universe</h2><p id=\"sectionDesc\">Choose a path into the archive.</p></div><button class=\"textbtn\" id=\"reset\">Reset view ↺</button></div>\n<div class=\"content-grid\" id=\"cards\"></div>\n<div class=\"footer\">AFTER HUMANITY · KNOWLEDGE · EXPLORATION · PRESERVATION · CANON</div></main></div></div><div class=\"toast\" id=\"toast\" role=\"status\"></div>\n<script>\nconst entries=[\n {title:'WORLDS',section:'Worlds',desc:'Planets, locations, timelines and civilizations.',icon:'🪐',art:'radial-gradient(circle at 55% 38%,#d9efff,#348ed4 20%,#142d6a 48%,#10152b 73%)'},\n {title:'CHARACTERS',section:'Characters',desc:'Heroes, allies, and the stories that connect them.',icon:'👩🏻‍🚀',art:'radial-gradient(ellipse at 50% 32%,#f5c39f,#974c67 27%,#252149 58%,#0d1427)'},\n {title:'RACES',section:'Races',desc:'Species, origins, traits and cultures.',icon:'🧝🏽‍♀️',art:'radial-gradient(ellipse at 52% 32%,#ffb8cb,#a546a7 30%,#47226d 58%,#10152b)'},\n {title:'LORE',section:'Lore',desc:'History, events, theories and discoveries.',icon:'🌌',art:'radial-gradient(circle at 50% 45%,#e1c0ff,#7255d9 12%,#162361 42%,#080e20)'},\n {title:'VISUAL ARCHIVE',section:'Gallery',desc:'Approved images, concepts and artwork.',icon:'💎',art:'radial-gradient(ellipse at 50% 48%,#fff5cf,#63e8d2 14%,#197488 35%,#09182c 68%)'},\n];\nconst updates=[['WORLD','The ORI: Ascension and Beyond','Oct 25, 2025','🌅'],['NEW WORLD','Veyr Prime — Research Outpost','Oct 24, 2025','🪐'],['CHARACTER','Mara — Profile Updated','Oct 22, 2025','👩🏻‍🚀'],['VISUALS','The Cosmic Garden — Gallery','Oct 20, 2025','💠']];\nconst cards=document.querySelector('#cards'),toast=document.querySelector('#toast');let timer;\nfunction showToast(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),2200)}\nfunction render(filter=''){cards.innerHTML='';const q=filter.trim().toLowerCase();let shown=0;entries.filter(x=>!q||`${x.title} ${x.section} ${x.desc}`.toLowerCase().includes(q)).forEach(x=>{shown++;const card=document.createElement('article');card.className='card';card.innerHTML=`<div class=\"art\" style=\"--art:${x.art}\"><span>${x.icon}</span></div><div class=\"cardbody\"><h3>${x.title}</h3><p>${x.desc}</p><span class=\"arrow\">→</span></div>`;card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label',`Open ${x.title}`);const destinations={Worlds:'world-atlas.html',Characters:'characters.html',Races:'races.html',Lore:'lore.html',Gallery:'gallery.html'};card.onclick=()=>window.top.location.href=destinations[x.section]||'universe-explorer.html';card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.click()}};cards.append(card)});if(!q){const box=document.createElement('aside');box.className='box updates';box.innerHTML='<h3>Latest updates <button class=\"textbtn\" style=\"float:right\" id=\"viewAll\">View all →</button></h3><div class=\"updates-list\">'+updates.map(u=>`<div class=\"update\"><div class=\"thumb\" style=\"--art:${entries.find(e=>e.section===u[0]||e.title===u[0])?.art||'linear-gradient(135deg,#233a6b,#b66d84)'}\">${u[3]}</div><div><small>${u[0]}</small><b>${u[1]}</b><small>${u[2]}</small></div></div>`).join('')+'</div><p class=\"quote\">“Not all that is lost is gone. Some things simply wait for a new world.”</p>';cards.append(box);box.querySelector('#viewAll').onclick=()=>window.top.location.href='latest-updates.html';box.querySelectorAll('.update').forEach((item,i)=>{item.tabIndex=0;item.setAttribute('role','link');item.onclick=()=>window.top.location.href=i===1?'world-atlas.html#veyr':i===2?'identity-archive.html#mara':i===3?'visual-archive-studio.html#cosmic-garden':'latest-updates.html';item.onkeydown=e=>{if(e.key==='Enter')item.click()}})}if(!shown)cards.innerHTML='<div class=\"empty\">No archive entries match that search.</div>'}\nrender();document.querySelector('#search').addEventListener('input',e=>render(e.target.value));document.querySelectorAll('[data-section]').forEach(b=>b.addEventListener('click',()=>{const section=b.dataset.section;if(section==='Worlds'){window.top.location.href=b.closest('.side')?'world-atlas.html':'world-atlas.html';return}if(section==='Characters'){window.top.location.href=b.closest('.side')?'identity-archive.html':'identity-archive.html';return}if(section==='Relationships'){window.top.location.href='relationship-explorer.html';return}if(section==='Sources'){window.top.location.href='evidence-registry.html';return}if(section==='Canon'){window.top.location.href='canon-governance.html';return}if(section==='Races'){window.top.location.href='races.html';return}if(section==='Lore'){window.top.location.href='lore.html';return}if(section==='Gallery'){window.top.location.href=b.closest('.side')?'visual-archive-studio.html':'visual-archive-studio.html';return}if(section==='Tools'){window.top.location.href='tools.html';return}document.querySelectorAll('[data-section]').forEach(x=>x.classList.toggle('active',x===b));document.querySelector('#sectionTitle').textContent=section==='Home'?'Explore the universe':section;document.querySelector('#sectionDesc').textContent=section==='Home'?'Choose a path into the archive.':`Browse the ${section.toLowerCase()} archive.`;document.querySelector('#search').value=section==='Home'?'':section;render(document.querySelector('#search').value);document.querySelector('#side').classList.remove('open')}));document.querySelector('#explore').onclick=()=>window.top.location.href='universe-explorer.html';document.querySelector('#reset').onclick=()=>{document.querySelector('#search').value='';document.querySelector('#sectionTitle').textContent='Explore the universe';document.querySelector('#sectionDesc').textContent='Choose a path into the archive.';render();showToast('View reset')};document.querySelector('#menuToggle').onclick=()=>document.querySelector('#side').classList.toggle('open');document.querySelector('#profile').onclick=()=>showToast('Profile menu — customize this action');document.querySelector('#menuMore').onclick=()=>showToast('More tools — customize this action');\n</script><script>(function(){const report=()=>window.parent.postMessage({source:'ah-after-humanity',height:document.documentElement.scrollHeight},'*');new ResizeObserver(report).observe(document.documentElement);window.addEventListener('load',report);setTimeout(report,0)})()</script></body></html>";

function App() {
  const [workspaceData, setWorkspaceData] = useState(() => {
    try {
      const saved = localStorage.getItem('ah-aios-worldforge');
      const parsed = saved ? JSON.parse(saved) : {};
      return {
        records: parsed.records || [],
        relationships: parsed.relationships || [],
        sources: parsed.sources || [],
        decisions: parsed.decisions || [],
        changeRequests: parsed.changeRequests || [],
        reviews: parsed.reviews || [],
        changeProposals: parsed.changeProposals || [],
        claims: parsed.claims || [],
        activityLog: parsed.activityLog || [],
        exports: parsed.exports || []
      };
    } catch {
      return {
        records: [],
        relationships: [],
        sources: [],
        decisions: [],
        changeRequests: [],
        reviews: [],
        changeProposals: [],
        claims: [],
        activityLog: [],
        exports: []
      };
    }
  });

  const [activeView, setActiveView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [expandedRecords, setExpandedRecords] = useState({});
  const [promptInput, setPromptInput] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [afterHumanityHeight, setAfterHumanityHeight] = useState(1080);
  const afterHumanityFrameRef = useRef(null);

  useEffect(() => {
    const handleArchiveResize = (event) => {
      if (event.source !== afterHumanityFrameRef.current?.contentWindow || event.data?.source !== 'ah-after-humanity') return;
      setAfterHumanityHeight(Math.max(600, Math.min(Number(event.data.height) || 1080, 4000)));
    };
    window.addEventListener('message', handleArchiveResize);
    return () => window.removeEventListener('message', handleArchiveResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('ah-aios-worldforge', JSON.stringify(workspaceData));
  }, [workspaceData]);

  const addRecord = (e) => {
    e.preventDefault();
    const title = document.getElementById('record-title').value;
    const description = document.getElementById('record-description').value;
    const type = document.getElementById('record-type').value;
    const canon = document.getElementById('canon-label').value;
    const status = document.getElementById('record-status').value;

    if (!title) return;

    const record = {
      id: Date.now().toString(36),
      version: 1,
      type,
      title,
      description,
      canon,
      status,
      createdAt: new Date().toISOString(),
      tags: ['synthetic', 'draft']
    };

    setWorkspaceData({
      ...workspaceData,
      records: [...workspaceData.records, record],
      activityLog: [
        ...workspaceData.activityLog,
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          action: 'Record created',
          target: record.title,
          type: record.type
        }
      ]
    });

    document.getElementById('record-form').reset();
    setExpandedRecords(prev => ({...prev, [record.id]: true}));
  };

  const findRecordTitle = (id) => {
    return workspaceData.records.find(r => r.id === id)?.title || 'Unknown';
  };

  const resolveClaimVersion = (claimId, version) => {
    const claim = workspaceData.claims.find(c => c.id === claimId);
    if (!claim) return null;
    const versions = claim.versions || [];
    if (version !== undefined) {
      return versions.find(v => v.version === version) || null;
    }
    return versions.length > 0 ? versions[versions.length - 1] : null;
  };

  const findClaimById = (claimId) => {
    return workspaceData.claims.find(c => c.id === claimId);
  };

  const findCurrentClaimVersion = (claimId) => {
    const claim = findClaimById(claimId);
    if (!claim) return null;
    const versions = claim.versions || [];
    return versions.length > 0 ? versions[versions.length - 1] : null;
  };

  const getNextClaimVersion = (claim) => {
    const versions = claim.versions || [];
    return versions.length > 0 ? versions[versions.length - 1].version + 1 : 1;
  };

  const createClaim = (e) => {
    e.preventDefault();
    const entityId = document.getElementById('claim-entity').value;
    const statement = document.getElementById('claim-statement').value;
    const status = document.getElementById('claim-status').value || 'Proposed';

    if (!entityId || !statement) return;

    const claimId = `claim_${Date.now().toString(36)}`;
    const version = 1;
    const now = new Date().toISOString();

    const claim = {
      id: claimId,
      entityId,
      statement,
      status: status || 'Proposed',
      canonState: status || 'Proposed',
      version,
      previousVersion: null,
      versions: [{
        version: 1,
        entityId,
        statement,
        status: status || 'Proposed',
        canonState: status || 'Proposed',
        sourceIds: [],
        evidenceLinks: [],
        createdAt: now,
        createdBy: 'local-user',
        changeType: 'Created',
        changeProposalId: null,
        reviewId: null,
        restoredFromVersion: null
      }],
      createdAt: now,
      updatedAt: now
    };

    setWorkspaceData({
      ...workspaceData,
      claims: [...workspaceData.claims, claim],
      activityLog: [
        ...workspaceData.activityLog,
        {
          id: Date.now(),
          timestamp: now,
          action: 'Claim created',
          target: statement,
          type: 'claim'
        }
      ]
    });

    document.getElementById('claim-form').reset();
  };

  const createClaimChangeProposal = (e) => {
    e.preventDefault();
    const claimId = document.getElementById('proposal-claim').value;
    const statement = document.getElementById('proposal-statement').value;
    const reason = document.getElementById('proposal-reason').value;
    const proposedBy = document.getElementById('proposal-by').value || 'local-user';

    const claim = findClaimById(claimId);
    if (!claim) {
      alert('Target claim not found.');
      return;
    }

    const currentVersion = findCurrentClaimVersion(claimId);
    if (!currentVersion) {
      alert('Claim has no versions.');
      return;
    }

    if (claim.status === 'Approved') {
      alert('Approved claims cannot be modified directly. Use a change proposal instead.');
      return;
    }

    const baseVersion = currentVersion.version;
    const proposedChanges = {};
    if (statement && statement !== currentVersion.statement) {
      proposedChanges.statement = statement;
    }

    if (Object.keys(proposedChanges).length === 0) {
      alert('No changes specified.');
      return;
    }

    const proposalId = `ccp_${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const proposal = {
      id: proposalId,
      claimId,
      baseVersion,
      status: 'Proposed',
      reason,
      proposedChanges,
      proposedBy,
      createdAt: now,
      resolvedAt: null,
      reviewId: null
    };

    setWorkspaceData({
      ...workspaceData,
      changeProposals: [...workspaceData.changeProposals, proposal],
      activityLog: [
        ...workspaceData.activityLog,
        {
          id: Date.now(),
          timestamp: now,
          action: 'Claim proposal created',
          target: `Claim ${claimId} v${baseVersion}`,
          type: 'claim-proposal'
        }
      ]
    });

    document.getElementById('proposal-form').reset();
    document.getElementById('proposal-by').value = 'local-user';
  };

  const reviewChangeProposal = (proposalId, decision, reviewer) => {
    const proposal = workspaceData.changeProposals.find(p => p.id === proposalId);
    if (!proposal) return;

    const claim = findClaimById(proposal.claimId);
    if (!claim) return;

    const currentVersion = findCurrentClaimVersion(proposal.claimId);
    if (!currentVersion) return;

    if (proposal.baseVersion !== currentVersion.version) {
      alert('Conflict: claim has changed since proposal was created. Create a fresh proposal.');
      return;
    }

    const now = new Date().toISOString();

    const review = {
      id: `review_${Date.now().toString(36)}`,
      targetType: 'ClaimChangeProposal',
      targetId: proposalId,
      claimId: proposal.claimId,
      decision: decision,
      fromState: proposal.status,
      toState: decision,
      reviewer: reviewer || 'local-user',
      rationale: document.getElementById('review-rationale').value || '',
      createdAt: now
    };

    const approvalEvent = {
      id: `evt_${Date.now().toString(36)}`,
      at: now,
      actor: reviewer || 'local-user',
      action: `Claim proposal ${decision.toLowerCase()}`,
      targetType: 'ClaimChangeProposal',
      targetId: proposalId,
      claimId: claim.id,
      claimVersion: currentVersion.version,
      detail: decision === 'Approved' ? `Approved proposal ${proposalId}; version ${currentVersion.version + 1} created.` : 'Proposal rejected.'
    };

    setWorkspaceData({
      ...workspaceData,
      changeProposals: workspaceData.changeProposals.map(p =>
        p.id === proposalId
          ? {
              ...p,
              status: decision,
              resolvedAt: now,
              reviewId: review.id
            }
          : p
      ),
      reviews: [...workspaceData.reviews, review],
      activityLog: [
        ...workspaceData.activityLog,
        {
          id: Date.now(),
          timestamp: now,
          action: `Claim proposal ${decision.toLowerCase()}`,
          target: `Claim ${proposal.claimId} v${currentVersion.version}`,
          type: 'claim-proposal-review'
        },
        {
          id: Date.now() + 1,
          timestamp: now,
          action: decision === 'Approved' ? 'Version created' : 'Proposal rejected',
          target: `Claim ${proposal.claimId}`,
          type: decision === 'Approved' ? 'version-creation' : 'claim-proposal-rejection'
        }
      ]
    });

    document.getElementById('review-rationale').value = '';
  };

  const getNextClaimEventId = () => {
    const ids = workspaceData.activityLog.filter(a => a.type === 'audit-event').map(a => parseInt(a.id));
    return Math.max(...ids, 0) + 1;
  };

  const filteredRecords = workspaceData.records.filter(record => {
    const matchesSearch = record.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesType;
  });

  const findCurrentVersion = (recordId) => {
    return workspaceData.records
      .filter(r => r.id === recordId)
      .sort((a, b) => b.version - a.version)[0];
  };

  const findSupersededVersions = (recordId) => {
    return workspaceData.records
      .filter(r => r.id === recordId)
      .sort((a, b) => b.version - a.version);
  };

  const createChangeRequest = (e) => {
    e.preventDefault();
    const targetId = document.getElementById('cr-target').value;
    const targetType = document.getElementById('cr-target-type').value;
    const targetTitle = document.getElementById('cr-target-title').value;
    const description = document.getElementById('cr-description').value;
    const reason = document.getElementById('cr-reason').value;

    if (!targetId || !targetTitle) return;

    const current = findCurrentVersion(targetId);
    if (!current) {
      alert('Target entity not found.');
      return;
    }

    const changeRequest = {
      id: `cr_${Date.now().toString(36)}`,
      targetType,
      targetId,
      targetTitle,
      targetVersion: current.version,
      proposedChanges: {
        description: description || current.description,
        population: description || current.description
      },
      reason,
      status: 'Proposed',
      createdBy: 'local-user',
      createdAt: new Date().toISOString(),
      reviewedBy: null,
      reviewedAt: null,
      decisionRationale: ''
    };

    setWorkspaceData({
      ...workspaceData,
      changeRequests: [...workspaceData.changeRequests, changeRequest],
      activityLog: [
        ...workspaceData.activityLog,
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          action: 'Change request created',
          target: `${targetTitle} v${current.version}`,
          type: 'change-request'
        }
      ]
    });

    document.getElementById('cr-form').reset();
  };

  const approveChangeRequest = (crId) => {
    const request = workspaceData.changeRequests.find(cr => cr.id === crId);
    if (!request) return;

    const current = findCurrentVersion(request.targetId);
    if (!current) return;

    const newVersion = {
      id: current.id,
      version: current.version + 1,
      type: current.type,
      title: current.title,
      description: request.proposedChanges.description || current.description,
      canon: request.proposedChanges.canon || current.canon,
      status: current.status,
      createdAt: new Date().toISOString(),
      tags: current.tags
    };

    setWorkspaceData({
      ...workspaceData,
      records: [
        ...workspaceData.records.map(r =>
          r.id === current.id && r.version === current.version
            ? { ...r, canon: 'Superseded' }
            : r
        ),
        newVersion
      ],
      changeRequests: workspaceData.changeRequests.map(cr =>
        cr.id === crId
          ? { ...cr, status: 'Approved', reviewedBy: 'local-user', reviewedAt: new Date().toISOString(), decisionRationale: '' }
          : cr
      ),
      activityLog: [
        ...workspaceData.activityLog,
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          action: 'Change request approved',
          target: `${current.title} v${current.version} -> v${newVersion.version}`,
          type: 'change-request-approval'
        },
        {
          id: Date.now() + 1,
          timestamp: new Date().toISOString(),
          action: 'Version created',
          target: `${current.title} v${newVersion.version}`,
          type: 'version-creation'
        }
      ]
    });
  };

  const rejectChangeRequest = (crId) => {
    const request = workspaceData.changeRequests.find(cr => cr.id === crId);
    if (!request) return;

    setWorkspaceData({
      ...workspaceData,
      changeRequests: workspaceData.changeRequests.map(cr =>
        cr.id === crId
          ? { ...cr, status: 'Rejected', reviewedBy: 'local-user', reviewedAt: new Date().toISOString(), decisionRationale: 'Rejected by reviewer' }
          : cr
      ),
      activityLog: [
        ...workspaceData.activityLog,
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          action: 'Change request rejected',
          target: `${request.targetTitle} v${request.targetVersion}`,
          type: 'change-request-rejection'
        }
      ]
    });
  };

  const addAuditEvent = (eventType, entityId, fromVersion, toVersion) => {
    const id = getNextClaimEventId();
    setWorkspaceData({
      ...workspaceData,
      activityLog: [
        ...workspaceData.activityLog,
        {
          id,
          timestamp: new Date().toISOString(),
          action: eventType,
          target: entityId,
          type: 'audit-event'
        }
      ]
    });
  };


  const checkDuplicateRelationship = (from, to) => {
    return workspaceData.relationships.some(rel =>
      (rel.from === from && rel.to === to) || (rel.from === to && rel.to === from)
    );
  };

  const findOrphanRelationships = (recordId) => {
    return workspaceData.relationships.filter(rel =>
      rel.from === recordId || rel.to === recordId
    );
  };

  const addRelationship = (e) => {
    e.preventDefault();
    const from = document.getElementById('rel-from').value;
    const to = document.getElementById('rel-to').value;
    const type = document.getElementById('rel-type').value;

    if (!from || !to || from === to) return;

    if (checkDuplicateRelationship(from, to)) {
      alert('Duplicate relationship: this pair already exists.');
      return;
    }

    const fromRecord = workspaceData.records.find(r => r.id === from);
    const toRecord = workspaceData.records.find(r => r.id === to);
    if (!fromRecord || !toRecord) {
      alert('Orphan detection: both records must exist.');
      return;
    }

    const relationship = {
      id: Date.now().toString(36),
      from,
      to,
      type
    };

    setWorkspaceData({
      ...workspaceData,
      relationships: [...workspaceData.relationships, relationship],
      activityLog: [
        ...workspaceData.activityLog,
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          action: 'Relationship created',
          target: `${fromRecord.title} ${type} ${toRecord.title}`,
          type: 'relationship'
        }
      ]
    });

    document.getElementById('rel-form').reset();
  };

  const addSource = (e) => {
    e.preventDefault();
    const title = document.getElementById('source-title').value;
    const type = document.getElementById('source-type').value;

    if (!title) return;

    const source = {
      id: Date.now().toString(36),
      title,
      type,
      createdAt: new Date().toISOString()
    };

    setWorkspaceData({
      ...workspaceData,
      sources: [...workspaceData.sources, source],
      activityLog: [
        ...workspaceData.activityLog,
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          action: 'Source registered',
          target: title,
          type: 'source'
        }
      ]
    });

    document.getElementById('source-form').reset();
  };

  const addDecision = (e) => {
    e.preventDefault();
    const title = document.getElementById('decision-title').value;
    const rationale = document.getElementById('decision-rationale').value;
    const reviewers = document.getElementById('decision-reviewers').value;

    if (!title) return;

    const decision = {
      id: Date.now().toString(36),
      title,
      rationale,
      status: 'Proposed',
      createdAt: new Date().toISOString()
    };

    setWorkspaceData({
      ...workspaceData,
      decisions: [...workspaceData.decisions, decision],
      activityLog: [
        ...workspaceData.activityLog,
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          action: 'Decision proposed',
          target: title,
          type: 'decision'
        }
      ]
    });

    document.getElementById('decision-form').reset();
  };

  const generateComponent = (prompt) => {
    const title = prompt.slice(0, 50) || 'My World';
    return `import React from 'react';

export default function ${title.replace(/[^a-zA-Z0-9]/g, '')}() {
  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      background: '#0f172a',
      color: '#f1f5f9'
    }}>
      <header style={{textAlign: 'center', padding: '3rem 0'} }>
        <h1 style={{color: '#59d1ff'}}>${title}</h1>
      </header>
      <main style={{padding: '2rem'}}>
        <p>Generated world content goes here.</p>
      </main>
    </div>
  );
}`;
  };

  const getGeneratedComponent = () => {
    return generateComponent(promptInput);
  };

  const copyComponent = () => {
    const code = getGeneratedComponent();
    navigator.clipboard.writeText(code);
    setCopyStatus('Copied to clipboard!');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  const downloadComponent = () => {
    const code = getGeneratedComponent();
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workspaceData.records.length + 1}-${workspaceData.records.find(r => r.title)?.toLowerCase().replace(/\s+/g, '-')}`.slice(0, 50) || 'generated-component';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-logo">
          <div className="logo-icon">✦</div>
          <span>AH-AIOS WorldForge</span>
        </div>
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li><a href="#dashboard" onClick={() => setActiveView('dashboard')}>Dashboard</a></li>
          <li><a href="#worlds" onClick={() => setActiveView('worlds')}>Worlds</a></li>
          <li><a href="#relationships" onClick={() => setActiveView('relationships')}>Relationships</a></li>
          <li><a href="#sources" onClick={() => setActiveView('sources')}>Sources</a></li>
          <li><a href="#governance" onClick={() => setActiveView('governance')}>Governance</a></li>
          <li><a href="#import-export" onClick={() => setActiveView('import-export')}>Import/Export</a></li>
          <li><a href="#prompt" onClick={() => setActiveView('prompt')}>Prompt Builder</a></li>
          <li><a href="#after-humanity" onClick={() => setActiveView('sample')}>After Humanity Sample</a></li>
        </ul>
        <button
          className="nav-cta"
          style={{ backgroundColor: 'transparent', color: 'var(--text)', padding: '8px 16px', border: '1px solid var(--border)', cursor: 'pointer', gap: '8px', display: 'flex', alignItems: 'center' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span style={{ fontSize: '1.2rem' }}>&#9776;</span>
        </button>
      </nav>

      <section id="after-humanity" className="sample-world-section" style={{ scrollMarginTop: '82px' }}>
        <iframe
          ref={afterHumanityFrameRef}
          title="After Humanity worldbuilding archive"
          srcDoc={afterHumanityDocument}
          sandbox="allow-scripts allow-top-navigation-by-user-activation"
          style={{ display: 'block', width: '100%', height: afterHumanityHeight, border: 0 }}
        />
      </section>

      <section id="after-humanity-video" className="after-humanity-video-section" aria-labelledby="after-humanity-video-title">
        <div className="container">
          <div className="after-humanity-video-heading">
            <span className="eyebrow">AFTER HUMANITY · FEATURED VIDEO</span>
            <h2 id="after-humanity-video-title">AH The Refraction of the Four Nines</h2>
            <p>Watch the universe unfold on the After Humanity YouTube channel.</p>
          </div>
          <div className="after-humanity-video-frame">
            <iframe
              src="https://www.youtube-nocookie.com/embed/TGheUWZO43s"
              title="AH The Refraction of the Four Nines"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <a className="after-humanity-video-link" href="https://www.youtube.com/watch?v=TGheUWZO43s" target="_blank" rel="noreferrer">Watch on YouTube ↗</a>
        </div>
      </section>

      <section id="home" className="hero">
        <div className="container">
          <aside className="data-notice" aria-label="Local data notice">
            <div>
              <strong>Your world data is stored in this browser.</strong>
              <p>It is not synced or backed up online. Export a workspace backup regularly; clearing this browser’s site data can erase it.</p>
            </div>
            <a href="#import-export" className="data-notice-link">Back up workspace</a>
          </aside>
          <h1>WorldForge</h1>
          <p className="subtitle">Worldbuilding for narrative and game development.</p>
          <p className="lede">
            Design worlds, people, and stories. Track decisions. Explore relationships.
            All local, all yours.
          </p>
          <div className="hero-buttons">
            <a href="#dashboard" className="btn btn-primary">Open Dashboard &rarr;</a>
            <a href="#worlds" className="btn btn-secondary">Browse Worlds</a>
            <a href="#after-humanity" className="btn btn-secondary">Explore Sample World</a>
          </div>
        </div>
      </section>

      <section id="dashboard" className="dashboard-section">
        <div className="container">
          <div className="dashboard-header">
            <h2>Dashboard Overview</h2>
            <p>Synthetic examples only &mdash; no external data or AI models are connected.</p>
          </div>

          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-value">{workspaceData.records.length}</div>
              <div className="stat-label">Worlds Created</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{workspaceData.decisions.length}</div>
              <div className="stat-label">Decisions Recorded</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{workspaceData.sources.length}</div>
              <div className="stat-label">Sources Registered</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{workspaceData.relationships.length}</div>
              <div className="stat-label">Relationships</div>
            </div>
          </div>

          <div className="recent-works">
            <h3>Recent Works</h3>
            <div className="recent-list">
              {workspaceData.records.slice(-5).reverse().map(record => (
                <div key={record.id} className="recent-item">
                  <span className={`canon-badge ${record.canon.toLowerCase()}`}>{record.canon}</span>
                  <span className="record-title">{record.title}</span>
                  <span className="record-type">{record.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="activity-feed">
            <h3>Activity Feed</h3>
            {workspaceData.activityLog.slice(-5).reverse().map((log, i) => (
              <div key={i} className="activity-item">
                <span className="activity-time">{new Date(log.timestamp).toLocaleString()}</span>
                <span className="activity-action">{log.action}</span>
                <span className="activity-target">{log.target}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="worlds" className="dashboard-section">
        <div className="container">
          <h2>World Model &amp; Records</h2>
          <p>Create and manage world records. All data stored locally in your browser.</p>

          <div className="search-filter">
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="search-select">
              <option value="all">All Types</option>
              <option value="World">World</option>
              <option value="Nation">Nation</option>
              <option value="Character">Character</option>
              <option value="Faction">Faction</option>
              <option value="Location">Location</option>
              <option value="Historical Event">Historical Event</option>
            </select>
          </div>

          <div className="records-list">
            {filteredRecords.map(record => (
              <div key={record.id} className="record-card">
                <div className="record-header">
                  <span className={`canon-badge ${record.canon.toLowerCase()}`}>{record.canon}</span>
                  <span className={`status-badge ${record.status.toLowerCase()}`}>{record.status}</span>
                  <span className="record-type">{record.type}</span>
                </div>
                <div className="record-content">
                  <h4>{record.title}</h4>
                  <p>{record.description}</p>
                </div>
                <button className="btn-sm" onClick={() => setExpandedRecords(!expandedRecords[record.id])}>
                  {expandedRecords[record.id] ? 'Hide' : 'Edit'}
                </button>
                {expandedRecords[record.id] && (
                  <div className="record-details">
                    <p><strong>Created:</strong> {new Date(record.createdAt).toLocaleString()}</p>
                    <p><strong>Tags:</strong> {record.tags?.join(', ') || 'none'}</p>
                    <textarea
                      className="form-input"
                      value={record.description}
                      onChange={(e) => {
                        const newRecords = workspaceData.records.map(r =>
                          r.id === record.id ? {...r, description: e.target.value} : r
                        );
                        setWorkspaceData({...workspaceData, records: newRecords});
                      }}
                      rows="3"
                    />
                  </div>
                )}
              </div>
            ))}
            {filteredRecords.length === 0 && (
              <div className="empty-state">
                <p>No records found. Create your first world record!</p>
              </div>
            )}
          </div>

          <div className="record-form">
            <h3>Create New Record</h3>
            <form id="record-form">
              <div className="form-group">
                <label className="form-label">Record Type</label>
                <select className="form-input" id="record-type">
                  <option>World</option>
                  <option>Nation</option>
                  <option>Character</option>
                  <option>Faction</option>
                  <option>Location</option>
                  <option>Historical Event</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Record title"
                  id="record-title"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  id="record-description"
                  rows="4"
                  placeholder="Describe this world record..."
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Canon Label</label>
                <select className="form-input" id="canon-label">
                  <option value="Proposed">Proposed</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input" id="record-status">
                  <option value="Draft">Draft</option>
                  <option value="Proposed">Proposed</option>
                  <option value="Validated">Validated</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
              <button type="button" className="btn btn-primary" onClick={addRecord}>
                Add Record
              </button>
            </form>
          </div>
        </div>
      </section>

      <section id="relationships" className="dashboard-section">
        <div className="container">
          <h2>Typed Relationships</h2>
          <p>Create and browse relationships between world records.</p>

          <div className="relationship-form">
            <h4>Create Relationship</h4>
            <form id="rel-form">
              <div className="form-group">
                <label>From</label>
                <select className="form-input" id="rel-from">
                  {workspaceData.records.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>To</label>
                <select className="form-input" id="rel-to">
                  {workspaceData.records.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Type</label>
                <select className="form-input" id="rel-type">
                  <option>supports</option>
                  <option>contradicts</option>
                  <option>belongs_to</option>
                  <option>authored_by</option>
                  <option>approved_by</option>
                  <option>location_of</option>
                </select>
              </div>
              <button type="button" className="btn btn-primary" onClick={addRelationship}>
                Add Relationship
              </button>
            </form>
          </div>

          <div className="relationship-list">
            <h4>Relationships ({workspaceData.relationships.length})</h4>
            {workspaceData.relationships.map((rel, i) => (
              <div key={i} className="relationship-item">
                <span>{rel.from ? workspaceData.records.find(r => r.id === rel.from)?.title : 'Unknown'}</span>
                <span className="relationship-type">{rel.type}</span>
                <span>{rel.to ? workspaceData.records.find(r => r.id === rel.to)?.title : 'Unknown'}</span>
              </div>
            ))}
            {workspaceData.relationships.length === 0 && (
              <p className="empty-state">No relationships yet. Create one above.</p>
            )}
          </div>

          <div className="relationship-explorer">
            <h4>Relationship Explorer</h4>
            <p className="section-hint">Browse and analyze relationships between records.</p>
            <div className="relationship-filters">
              <input
                type="text"
                placeholder="Filter relationships..."
                className="search-input"
                style={{ flex: '1', minWidth: '150px' }}
              />
              <select className="search-select" style={{ minWidth: '140px' }}>
                <option value="all">All Types</option>
                <option value="supports">supports</option>
                <option value="contradicts">contradicts</option>
                <option value="belongs_to">belongs_to</option>
                <option value="authored_by">authored_by</option>
                <option value="approved_by">approved_by</option>
                <option value="location_of">location_of</option>
              </select>
            </div>
            <div className="relationship-grid">
              {workspaceData.relationships.map((rel, i) => (
                <div key={i} className="relationship-card">
                  <div className="relationship-card-header">
                    <span className="relationship-card-from">{findRecordTitle(rel.from)}</span>
                    <span className="relationship-card-arrow">&rarr;</span>
                    <span className="relationship-card-to">{findRecordTitle(rel.to)}</span>
                    <span className="relationship-card-type">{rel.type}</span>
                  </div>
                  <div className="relationship-card-stats">
                    <span className="connection-count">{workspaceData.relationships.filter(r => r.from === rel.to || r.to === rel.to).length} incoming, {workspaceData.relationships.filter(r => r.from === rel.from || r.to === rel.from).length} outgoing</span>
                  </div>
                </div>
              ))}
              {workspaceData.relationships.length === 0 && (
                <p className="empty-state">No relationships yet. Create one above.</p>
              )}
            </div>
          </div>

          <div className="entity-connections">
            <h4>Entity Connection Views</h4>
            <p className="section-hint">Explore how records connect to each other.</p>
            <div className="entity-connection-list">
              {workspaceData.records.map(record => {
                const connections = findOrphanRelationships(record.id);
                if (connections.length === 0) return null;
                return (
                  <div key={record.id} className="entity-connection-group">
                    <h5>{record.title} ({connections.length} connections)</h5>
                    <div className="entity-connection-list">
                      {connections.map((conn, i) => (
                        <span key={i} className="entity-connection-tag">
                          {conn.from === record.id ? 'connected from ' : 'connected to '}
                          {findRecordTitle(conn.from === record.id ? conn.to : conn.from)}
                          <small>{conn.type}</small>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
              {workspaceData.records.every(r => findOrphanRelationships(r.id).length === 0) && (
                <p className="empty-state">No connections yet. Create relationships to see them here.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="sources" className="dashboard-section">
        <div className="container">
          <h2>Source Registry</h2>
          <p>Register sources and link them to records for evidence tracking.</p>

          <div className="source-form">
            <h4>Register New Source</h4>
            <form id="source-form">
              <div className="form-group">
                <label className="form-label">Source Title</label>
                <input type="text" className="form-input" id="source-title" placeholder="e.g., The Lord of the Rings" />
              </div>
              <div className="form-group">
                <label className="form-label">Source Type</label>
                <select className="form-input" id="source-type">
                  <option>Book</option>
                  <option>Film</option>
                  <option>Game</option>
                  <option>Article</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" id="source-description" rows="3" placeholder="Describe the source..."></textarea>
              </div>
              <button type="button" className="btn btn-primary" onClick={addSource}>
                Register Source
              </button>
            </form>
          </div>

          <div className="sources-list">
            <h4>Registered Sources ({workspaceData.sources.length})</h4>
            {workspaceData.sources.map(source => (
              <div key={source.id} className="source-item">
                <h4>{source.title}</h4>
                <span className="source-type">{source.type}</span>
              </div>
            ))}
            {workspaceData.sources.length === 0 && (
              <p className="empty-state">No sources registered yet.</p>
            )}
          </div>
        </div>
      </section>

      <section id="governance" className="dashboard-section">
        <div className="container">
          <h2>Governance &amp; Decisions</h2>
          <p>Track decisions and canon statuses. All data stays in your browser.</p>

          <div className="decision-form">
            <h4>Propose a Decision</h4>
            <form id="decision-form">
              <div className="form-group">
                <label className="form-label">Decision Title</label>
                <input type="text" className="form-input" id="decision-title" placeholder="e.g., Adopt Unified Nexus Protocol" />
              </div>
              <div className="form-group">
                <label className="form-label">Rationale</label>
                <textarea className="form-input" id="decision-rationale" rows="3" placeholder="Why is this decision needed?"></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Reviewer(s)</label>
                <input type="text" className="form-input" id="decision-reviewers" placeholder="e.g., Governance Lead" />
              </div>
              <button type="button" className="btn btn-primary" onClick={addDecision}>
                Propose Decision
              </button>
            </form>
          </div>

          <div className="decisions-list">
            <h4>Decisions ({workspaceData.decisions.length})</h4>
            {workspaceData.decisions.map(decision => (
              <div key={decision.id} className="decision-item">
                <span className="canon-badge proposed">{decision.status}</span>
                <h5>{decision.title}</h5>
                <p>{decision.rationale}</p>
                <span className="decision-date">{new Date(decision.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
            {workspaceData.decisions.length === 0 && (
              <p className="empty-state">No decisions proposed yet.</p>
            )}
          </div>

          <div className="change-request-panel">
            <h4>Change Requests ({workspaceData.changeRequests.length})</h4>
            <div className="change-request-list">
              {workspaceData.changeRequests.map(cr => {
                const current = findCurrentVersion(cr.targetId);
                const versions = workspaceData.records.filter(r => r.id === cr.targetId);
                return (
                  <div key={cr.id} className="change-request-item">
                    <div className="change-request-header">
                      <strong>CR: {cr.id}</strong>
                      <span className={`canon-badge ${cr.status.toLowerCase()}`}>{cr.status}</span>
                    </div>
                    <p className="change-request-target">
                      Target: {cr.targetTitle} (v{cr.targetVersion} {cr.targetType})
                    </p>
                    <p className="change-request-reason">Reason: {cr.reason}</p>
                    <p className="change-request-proposed">
                      Proposed: {cr.proposedChanges.description || current?.description || 'No changes specified'}
                    </p>
                    <div className="change-request-actions">
                      {cr.status === 'Proposed' && (
                        <div className="change-request-actions-row">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => approveChangeRequest(cr.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => rejectChangeRequest(cr.id)}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {workspaceData.changeRequests.length === 0 && (
                <p className="empty-state">No change requests yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="import-export" className="dashboard-section">
        <div className="container">
          <h2>JSON Import / Export</h2>
          <p>Back up your workspace or share it with others. Import replaces current data.</p>

          <div className="import-export-grid">
            <div className="import-export-card">
              <h4>Export Workspace</h4>
              <button className="btn btn-primary" onClick={async () => {
                const data = JSON.stringify({
                  version: 3,
                  records: workspaceData.records,
                  relationships: workspaceData.relationships,
                  sources: workspaceData.sources,
                  decisions: workspaceData.decisions,
                  changeRequests: workspaceData.changeRequests,
                  reviews: workspaceData.reviews,
                  activityLog: workspaceData.activityLog,
                  exports: workspaceData.exports
                }, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `worldforge-export-${new Date().toISOString().slice(0,10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}>
                Download Backup
              </button>
            </div>
            <div className="import-export-card">
              <h4>Import Workspace</h4>
              <input
                type="file"
                id="import-file"
                accept=".json"
                style={{ marginTop: "8px" }}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const text = await file.text();
                  try {
                    const imported = JSON.parse(text);
                    if (imported.records && Array.isArray(imported.records)) {
                      setWorkspaceData({
                        records: imported.records,
                        relationships: imported.relationships || [],
                        sources: imported.sources || [],
                        decisions: imported.decisions || [],
                        changeRequests: imported.changeRequests || [],
                        reviews: imported.reviews || [],
                        activityLog: imported.activityLog || [],
                        exports: imported.exports || []
                      });
                    } else {
                      alert("Unexpected file format.");
                    }
                  } catch {
                    alert("Invalid JSON file.");
                  }
                }}
              />
              <p className="form-hint">Select a JSON file to import. This replaces current workspace data.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="claims" className="dashboard-section">
        <div className="container">
          <h2>Claims Registry</h2>
          <p>Track claims as first-class objects with version history, reviews, and audit events.</p>

          <div className="search-filter">
            <input
              type="text"
              placeholder="Search claims..."
              className="search-input"
              style={{ flex: '1', minWidth: '200px' }}
            />
            <select className="search-select" style={{ minWidth: '140px' }}>
              <option value="all">All Types</option>
              <option value="Proposed">Proposed</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Draft">Draft</option>
              <option value="Superseded">Superseded</option>
            </select>
          </div>

          <div className="claims-list">
            {workspaceData.claims.map(claim => {
              const currentVersion = findCurrentClaimVersion(claim.id);
              const versions = claim.versions || [];
              const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null;
              return (
                <div key={claim.id} className="claim-card">
                  <div className="claim-card-header">
                    <div className="claim-card-main">
                      <span className={`canon-badge ${claim.canonState?.toLowerCase() || 'proposed'}`}>{claim.canonState?.toUpperCase()}</span>
                      <h4>{claim.statement}</h4>
                      <span className="claim-entity">Entity: {claim.entityId}</span>
                    </div>
                    <div className="claim-card-meta">
                      <span className="claim-version">v{claim.version}</span>
                      <span className="claim-created">{new Date(claim.createdAt).toLocaleDateString()}</span>
                      <span className="claim-status">{claim.status}</span>
                    </div>
                  </div>
                  <div className="claim-card-body">
                    <details>
                      <summary>Version History ({versions.length})</summary>
                      <div className="claim-versions">
                        {versions.map(v => (
                          <div key={v.version} className="claim-version-item">
                            <span className="claim-version-number">v{v.version}</span>
                            <span className={`canon-badge ${v.status?.toLowerCase() || 'proposed'}`}>{v.status || 'Proposed'}</span>
                            <span className="claim-version-date">{new Date(v.createdAt).toLocaleDateString()}</span>
                            <span className="claim-version-type">{v.changeType || 'Created'}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                    <details>
                      <summary>Proposal & Review History</summary>
                      <div className="claim-proposals">
                        {workspaceData.changeProposals.filter(p => p.claimId === claim.id).map(p => (
                          <div key={p.id} className="claim-proposal-item">
                            <strong>{p.status}</strong>
                            <span>Base v{p.baseVersion}</span>
                            <span>Proposed by: {p.proposedBy}</span>
                            <span>{(new Date(p.createdAt).toLocaleString())}</span>
                          </div>
                        ))}
                        {workspaceData.reviews.filter(r => r.claimId === claim.id).map(r => (
                          <div key={r.id} className="claim-review-item">
                            <strong>{r.decision}</strong>
                            <span>Reviewed by: {r.reviewer}</span>
                            <span>{(new Date(r.createdAt).toLocaleString())}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                </div>
              );
            })}
            {workspaceData.claims.length === 0 && (
              <div className="empty-state">
                <p>No claims yet. Create your first claim using the form below.</p>
              </div>
            )}
          </div>

          <div className="claim-form-section">
            <h3>Create a New Claim</h3>
            <form id="claim-form">
              <div className="form-group">
                <label className="form-label">Entity</label>
                <select className="form-input" id="claim-entity">
                  <option>World</option>
                  <option>Nation</option>
                  <option>Character</option>
                  <option>Faction</option>
                  <option>Location</option>
                  <option>Historical Event</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Statement</label>
                <textarea className="form-input" id="claim-statement" rows="4" placeholder="e.g. Aurelis was founded in 850 AE."></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input" id="claim-status">
                  <option value="Draft">Draft</option>
                  <option value="Proposed">Proposed</option>
                  <option value="Validated">Validated</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Superseded">Superseded</option>
                </select>
              </div>
              <button type="button" className="btn btn-primary" onClick={createClaim}>
                Create Claim
              </button>
            </form>
          </div>

          <div className="claim-form-section">
            <h3>Change Proposal</h3>
            <form id="proposal-form">
              <div className="form-group">
                <label className="form-label">Target Claim</label>
                <select className="form-input" id="proposal-claim">
                  {workspaceData.claims.map(c => (
                    <option key={c.id} value={c.id}>{c.statement} (v{c.version})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Proposed Statement</label>
                <textarea className="form-input" id="proposal-statement" rows="3" placeholder="New claim statement..."></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <input type="text" className="form-input" id="proposal-reason" placeholder="Why does the claim need to change?" />
              </div>
              <div className="form-group">
                <label className="form-label">Proposer</label>
                <input type="text" className="form-input" id="proposal-by" value="local-user" readOnly />
              </div>
              <button type="button" className="btn btn-primary" onClick={createClaimChangeProposal}>
                Submit Proposal
              </button>
            </form>
          </div>
        </div>
      </section>

      <section id="reviews" className="dashboard-section">
        <div className="container">
          <h2>Claim Reviews & Decision Traceability</h2>
          <p>Track review records, linked decisions, and evidence for each claim.</p>

          <div className="reviews-list">
            {workspaceData.reviews.length === 0 && (
              <div className="empty-state">
                <p>No reviews yet. Propose changes to claims to create review records.</p>
              </div>
            )}
            {workspaceData.reviews.map(review => {
              const proposal = workspaceData.changeProposals.find(p => p.id === review.targetId);
              const claim = findClaimById(proposal?.claimId);
              return (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <span className={`canon-badge ${review.decision?.toLowerCase() || ''}`}>{review.decision}</span>
                    <span className="review-type">{review.targetType}</span>
                    <span className="review-date">{new Date(review.createdAt).toLocaleString()}</span>
                  </div>
                  <h5>Review: {review.id}</h5>
                  <p className="review-rationale">{review.rationale || 'No rationale provided'}</p>
                  {proposal && (
                    <>
                      <p className="review-target">Target: Proposal {proposal.id} for claim {claim?.statement || proposal.claimId}</p>
                      <p className="review-state">From: {review.fromState} → To: {review.toState}</p>
                    </>
                  )}
                  {claim && (
                    <p className="review-claim">Claim: {claim.statement} (v{claim.version})</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="analytics" className="dashboard-section">
        <div className="container">
          <h2>Analytics Dashboard</h2>
          <p>Illustrative trend, weekly activity, and workflow-stage visualizations implemented with SVG and CSS. No production data source is connected.</p>

          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Trend Visualization</h3>
              <div className="chart-wrapper">
                <svg viewBox="0 0 600 200" width="100%" height="200">
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#59d1ff" stop-opacity="0.3" />
                      <stop offset="100%" stop-color="#59d1ff" stop-opacity="0.05" />
                    </linearGradient>
                  </defs>
                  {[10, 30, 60, 45, 80, 120, 90, 150, 110, 180, 140, 200].map((h, i) => (
                    <rect
                      key={i}
                      x={i * 50 + 10}
                      y={200 - h}
                      width="40"
                      height={h}
                      rx="4"
                      fill={i % 2 === 0 ? "rgba(89, 209, 255, 0.4)" : "rgba(89, 209, 255, 0.2)"}
                      stroke="rgba(89, 209, 255, 0.3)"
                      strokeWidth="1"
                    />
                  ))}
                  <line x1="10" y1="200" x2="610" y2="200" stroke="var(--border)" strokeWidth="1" />
                </svg>
              </div>
              <p className="chart-legend">
                <span>Rising</span>
                <span>Stable</span>
                <span>Declining</span>
              </p>
            </div>

            <div className="analytics-card">
              <h3>Weekly Activity</h3>
              <div className="chart-wrapper">
                <svg viewBox="0 0 400 200" width="100%" height="200">
                  {[45, 78, 120, 95, 140, 110, 80].map((h, i) => (
                    <rect
                      key={i}
                      x={i * 50 + 5}
                      y={200 - h}
                      width="40"
                      height={h}
                      rx="4"
                      fill={i === 6 ? "rgba(52, 211, 153, 0.4)" : "rgba(52, 211, 153, 0.2)"}
                      stroke="rgba(52, 211, 153, 0.3)"
                      strokeWidth="1"
                    />
                  ))}
                  <text x="200" y="30" textAnchor="middle" fill="var(--text-muted)" fontSize="12" fontFamily="monospace">Weekly</text>
                  <line x1="5" y1="200" x2="395" y2="200" stroke="var(--border)" strokeWidth="1" />
                </svg>
              </div>
              <p className="chart-legend">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </p>
            </div>

            <div className="analytics-card">
              <h3>Workflow Stage</h3>
              <div className="chart-wrapper">
                <svg viewBox="0 0 600 200" width="100%" height="200">
                  {[
                    { label: 'Draft', value: 30, color: 'rgba(89, 209, 255, 0.6)' },
                    { label: 'Proposed', value: 25, color: 'rgba(251, 191, 36, 0.6)' },
                    { label: 'Validated', value: 20, color: 'rgba(52, 211, 153, 0.6)' },
                    { label: 'Approved', value: 15, color: 'rgba(223, 187, 112, 0.6)' },
                    { label: 'Rejected', value: 10, color: 'rgba(248, 113, 113, 0.6)' },
                  ].map((stage, i) => (
                    <rect
                      key={i}
                      x={i * 120 + 10}
                      y={200 - (stage.value * 1.5)}
                      width="100"
                      height={stage.value * 1.5}
                      rx="4"
                      fill={stage.color}
                      stroke="rgba(255, 255, 255, 0.15)"
                      strokeWidth="1"
                    />
                  ))}
                  <text x="60" y="90" textAnchor="middle" fill="var(--cyan)" fontSize="12" fontFamily="monospace" fontWeight="600">Draft</text>
                  <text x="180" y="90" textAnchor="middle" fill="var(--amber)" fontSize="12" fontFamily="monospace" fontWeight="600">Proposed</text>
                  <text x="300" y="90" textAnchor="middle" fill="var(--green)" fontSize="12" fontFamily="monospace" fontWeight="600">Validated</text>
                  <text x="420" y="90" textAnchor="middle" fill="var(--gold)" fontSize="12" fontFamily="monospace" fontWeight="600">Approved</text>
                  <text x="540" y="90" textAnchor="middle" fill="var(--red)" fontSize="12" fontFamily="monospace" fontWeight="600">Rejected</text>
                  <line x1="10" y1="200" x2="610" y2="200" stroke="var(--border)" strokeWidth="1" />
                </svg>
              </div>
              <p className="chart-legend">
                <span>Draft</span>
                <span>Proposed</span>
                <span>Validated</span>
                <span>Approved</span>
                <span>Rejected</span>
              </p>
            </div>
          </div>

          <div className="analytics-summary">
            <h3>Activity Summary</h3>
            <div className="summary-grid">
              <div>
                <span className="summary-value">{workspaceData.records.length}</span>
                <span className="summary-label">Records</span>
              </div>
              <div>
                <span className="summary-value">{workspaceData.relationships.length}</span>
                <span className="summary-label">Relationships</span>
              </div>
              <div>
                <span className="summary-value">{workspaceData.sources.length}</span>
                <span className="summary-label">Sources</span>
              </div>
              <div>
                <span className="summary-value">{workspaceData.claims.length}</span>
                <span className="summary-label">Claims</span>
              </div>
              <div>
                <span className="summary-value">{workspaceData.decisions.length}</span>
                <span className="summary-label">Decisions</span>
              </div>
              <div>
                <span className="summary-value">{workspaceData.activityLog.length}</span>
                <span className="summary-label">Events</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="prompt" className="dashboard-section">
        <div className="container">
          <h2>Prompt Builder</h2>
          <aside className="data-notice prompt-builder-notice" role="note" aria-label="Prompt Builder notice"><div><strong>Notice: This does not generate images or use AI.</strong><p>Enter a brief to preview a deterministic landing page and generate React component code. Copy or download the .jsx output below.</p></div></aside>

          <div className="prompt-builder">
            <div className="prompt-form">
              <textarea
                className="form-input"
                placeholder="Describe your world brief, e.g. &quot;A steampunk city floating among the clouds...&quot;"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows="6"
              />
              <div className="prompt-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => setPromptInput(promptInput)}
                >
                  Generate
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={copyComponent}
                  disabled={!promptInput}
                >
                  {copyStatus || "Copy .jsx"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={downloadComponent}
                  disabled={!promptInput}
                >
                  Download .jsx
                </button>
              </div>
              {copyStatus && <p className="copy-status">{copyStatus}</p>}
            </div>

            <div className="prompt-preview">
              <div className="preview-header">
                <h4>Landing Page Preview</h4>
                <span className="preview-badge">Deterministic</span>
              </div>
              <div className="preview-body">
                {promptInput ? (
                  <div className="preview-card">
                    <h3>{promptInput.slice(0, 60)}</h3>
                    <p>Generated landing page for: {promptInput}</p>
                    <details>
                      <summary>View generated .jsx</summary>
                      <pre className="jsx-preview">{getGeneratedComponent().slice(0, 800)}</pre>
                    </details>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>Enter a world brief and click Generate.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 AH-AIOS WorldForge Prototype &mdash; Local browser workflow. Built with React 19 + Vite.</p>
      </footer>
    </div>
  );
}

export default App;

