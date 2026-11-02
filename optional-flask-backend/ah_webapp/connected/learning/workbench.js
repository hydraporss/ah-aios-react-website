/* Local-first Instructor + Admin workbench and cross-domain search (additive).
   Overlay only: never edits curriculum-data.js or theory records. Roles are CLIENT-SIDE
   and are NOT security: any user of this browser can switch role. */
(function(root,factory){const api=factory();if(typeof module!=="undefined"&&module.exports)module.exports=api;if(root)root.AHWorkbench=api;})(typeof window!=="undefined"?window:globalThis,function(){
  const KEY="ah-aios-learning-workbench-v1",ROLES=["learner","instructor","admin"];
  const FLOW={"Specified":["Authored draft"],"Authored draft":["Reviewed","Specified"],"Reviewed":["Published","Authored draft"],"Published":["Authored draft"]};
  const PERM={author:["instructor","admin"],review:["instructor","admin"],publish:["admin"],admin:["admin"]};
  const blank=()=>({schema:"ah-aios-learning-workbench",version:1,lessons:{},audit:[]});
  function allow(role,action){if(!ROLES.includes(role)||!(PERM[action]||[]).includes(role))throw new Error("Role '"+role+"' may not "+action+".");}
  function log(s,role,action,target,detail){s.audit.unshift({when:new Date().toISOString(),role,action,target,detail:detail||""});s.audit=s.audit.slice(0,500);}
  function baseStatus(data,id){for(const c of data.courses)for(const l of c.lessons)if(c.id+"/"+l.id===id)return l.status;return null;}
  const effective=(data,s,id)=>(s.lessons[id]&&s.lessons[id].status)||baseStatus(data,id);
  function saveDraft(data,s,role,id,text){allow(role,"author");const b=baseStatus(data,id);if(!b)throw new Error("Unknown lesson "+id);
    const t=String(text||"").trim();if(!t)throw new Error("Draft text is empty.");
    const e=s.lessons[id]=s.lessons[id]||{};e.text=t;const cur=e.status||b;if(cur==="Specified"||cur==="Reviewed"||cur==="Published")e.status="Authored draft";log(s,role,"saveDraft",id);return s;}
  function transition(data,s,role,id,to){const cur=effective(data,s,id);if(!cur)throw new Error("Unknown lesson "+id);
    if(!(FLOW[cur]||[]).includes(to))throw new Error("Illegal transition "+cur+" → "+to+".");
    allow(role,to==="Published"?"publish":"review");
    if(to==="Reviewed"||to==="Published"){const e=s.lessons[id];if(!(e&&e.text)&&!baseHasContent(data,id))throw new Error("No draft content to "+(to==="Published"?"publish":"review")+".");}
    (s.lessons[id]=s.lessons[id]||{}).status=to;log(s,role,"transition",id,cur+" → "+to);return s;}
  function baseHasContent(data,id){for(const c of data.courses)for(const l of c.lessons)if(c.id+"/"+l.id===id)return !!l.content;return false;}
  function statusCounts(data,s){const n={};data.courses.forEach(c=>c.lessons.forEach(l=>{const k=effective(data,s,c.id+"/"+l.id);n[k]=(n[k]||0)+1}));return n;}
  function integrity(data,theories){const lessons=data.courses.reduce((a,c)=>a+c.lessons.length,0),by={};data.courses.forEach(c=>by[c.domain]=(by[c.domain]||0)+1);
    const t=theories||[],reg=t.filter(r=>(r.origin||r.collection)==="registry").length,syn=t.filter(r=>(r.origin||r.collection)==="synthesized").length;
    return{courses:data.courses.length,lessons,byProgramme:by,coursesOk:data.courses.length===24&&lessons===96,
      theories:{loaded:t.length,registry:reg,synthesized:syn,ok:t.length===82&&reg===68&&syn===14,note:t.length?"":"No theory records imported (data-import gap)."}};}
  function searchAll(data,theories,query){const q=String(query||"").trim().toLowerCase();if(!q)return[];const out=[],has=x=>String(x||"").toLowerCase().includes(q);
    data.courses.forEach(c=>{if(has(c.id)||has(c.title)||has(c.outcome)||has(c.domain))out.push({type:"course",id:c.id,title:c.title,href:"#courses"});
      c.lessons.forEach(l=>{if(has(l.title)||has(l.exercise)||has(c.id+"/"+l.id))out.push({type:"lesson",id:c.id+"/"+l.id,title:l.title,sub:c.title,href:"#courses"})})});
    (data.projects||[]).forEach(p=>{if(has(JSON.stringify(p)))out.push({type:"project",id:p.id||p.title,title:p.title||p.id,href:"#projects"})});
    (theories||[]).forEach(t=>{if(has(JSON.stringify(t)))out.push({type:"theory",id:t.id,title:t.title,href:"#theories"})});return out;}
  const STATUSES=["Specified","Authored draft","Reviewed","Published"],MAX_TEXT=200000;
  const isRec=v=>!!v&&typeof v==="object"&&!Array.isArray(v);
  // Strict structural + referential validation of a workbench overlay (used for import AND for stored state).
  function validateState(data,x){const errors=[];
    if(!isRec(x))return{valid:false,errors:["File is not a workbench overlay object."]};
    if(x.schema!=="ah-aios-learning-workbench")errors.push("Wrong schema (expected ah-aios-learning-workbench).");
    if(x.version!==1)errors.push("Unsupported version (expected 1).");
    if(!isRec(x.lessons))errors.push("lessons must be an object.");
    if(!Array.isArray(x.audit))errors.push("audit must be an array.");
    if(errors.length)return{valid:false,errors};
    for(const[id,e]of Object.entries(x.lessons)){
      if(baseStatus(data,id)===null){errors.push("Unknown lesson id: "+id+".");continue}
      if(!isRec(e)){errors.push("Lesson "+id+": entry must be an object.");continue}
      if(e.text!==undefined&&(typeof e.text!=="string"||e.text.length>MAX_TEXT))errors.push("Lesson "+id+": text must be a string of at most "+MAX_TEXT+" characters.");
      if(e.status!==undefined&&!STATUSES.includes(e.status))errors.push("Lesson "+id+": invalid status "+JSON.stringify(e.status)+".");
      if((e.status==="Reviewed"||e.status==="Published")&&!(typeof e.text==="string"&&e.text.trim())&&!baseHasContent(data,id))errors.push("Lesson "+id+": "+e.status+" without any draft content.");
    }
    if(x.audit.length>500)errors.push("audit has more than 500 entries.");
    x.audit.forEach((a,i)=>{if(!isRec(a)||["when","role","action","target"].some(k=>typeof a[k]!=="string")||(a.detail!==undefined&&typeof a.detail!=="string"))errors.push("Audit entry "+(i+1)+" is malformed.")});
    return{valid:errors.length===0,errors};}
  // Parse + validate + normalise. NEVER mutates the current state; returns a NEW state or throws.
  function importState(data,s,role,text){allow(role,"admin");let x;try{x=JSON.parse(text)}catch{throw new Error("Import rejected: file is not valid JSON. Existing workbench data preserved.")}
    const r=validateState(data,x);if(!r.valid)throw new Error("Import rejected: "+r.errors.slice(0,5).join(" ")+(r.errors.length>5?" … and "+(r.errors.length-5)+" more.":"")+" Existing workbench data preserved.");
    const n={schema:x.schema,version:1,lessons:JSON.parse(JSON.stringify(x.lessons)),audit:JSON.parse(JSON.stringify(x.audit))};log(n,role,"import","workbench",Object.keys(n.lessons).length+" lesson record(s) restored");return n;}
  function load(st,data){try{const v=JSON.parse(st.getItem(KEY)||"null");if(!(v&&v.schema==="ah-aios-learning-workbench"&&v.version===1&&v.lessons&&Array.isArray(v.audit)))return blank();if(data&&!validateState(data,v).valid)return blank();return v}catch{return blank()}}
  const save=(st,s)=>st.setItem(KEY,JSON.stringify(s));
  return{KEY,ROLES,FLOW,STATUSES,blank,allow,saveDraft,transition,effective,statusCounts,integrity,searchAll,validateState,importState,load,save};
});
(function(){
  if(typeof document==="undefined")return;
  const W=window.AHWorkbench,D=window.AH_LEARNING_CURRICULUM,main=document.querySelector("main");if(!W||!D||!main)return;
  const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  let S=W.load(localStorage,D),role=sessionStorage.getItem("ah-ls-role")||"learner";
  const theories=()=>{try{const v=JSON.parse(localStorage.getItem("ah-aios-learning-theories-v1")||"[]");return Array.isArray(v)?v:[]}catch{return[]}};
  const sec=(id,h)=>{const s=document.createElement("section");s.className="section";s.id=id;s.setAttribute("aria-label",h);const g=main.querySelector("#govern");main.insertBefore(s,g||null);return s};
  const ins=sec("instructor","Instructor workbench"),adm=sec("admin","Administration workbench");
  const sb=document.querySelector("#sidebar .side-group");if(sb)sb.insertAdjacentHTML("beforeend",'<a class="side-link" href="#instructor">✎ <span>Instructor</span></a><a class="side-link" href="#admin">⚙ <span>Administration</span></a>');
  const commit=fn=>{try{fn();W.save(localStorage,S);err("")}catch(e){err(e.message)}draw()};
  let ERR="";const err=m=>{ERR=m||"";const el=document.querySelector("#wb-err");if(el)el.textContent=ERR};
  function draw(){
    const opts=[].concat(...D.courses.map(c=>c.lessons.map(l=>({id:c.id+"/"+l.id,t:c.id+" · "+l.id+" · "+l.title}))));
    const sel=(document.querySelector("#wb-lesson")||{}).value||opts[0].id;
    const cur=W.effective(D,S,sel),counts=W.statusCounts(D,S),can=a=>{try{W.allow(role,a);return true}catch{return false}};
    ins.innerHTML='<div class="section-title"><div><h2>Instructor &amp; Content Workbench (local)</h2><p>Draft → Reviewed → Published, stored in this browser as an overlay. Source curriculum is never modified. Roles here are not security controls.</p></div><label>Role <select id="wb-role">'+W.ROLES.map(r=>'<option'+(r===role?" selected":"")+'>'+r+'</option>').join("")+'</select></label></div>'+
    '<div class="notice"><b>Status counts</b><p>'+Object.entries(counts).map(([k,v])=>esc(k)+": "+v).join(" · ")+'</p><p id="wb-err" role="alert" style="color:#ff9d9d">'+esc(ERR)+'</p></div>'+
    '<div class="feature-card"><label for="wb-lesson">Lesson</label><select id="wb-lesson" style="max-width:100%">'+opts.map(o=>'<option value="'+esc(o.id)+'"'+(o.id===sel?" selected":"")+'>'+esc(o.t)+'</option>').join("")+'</select><p>Current status: <b>'+esc(cur)+'</b></p>'+
    '<label for="wb-text">Instructor draft text (your own authored content)</label><textarea id="wb-text" rows="5" style="width:100%">'+esc((S.lessons[sel]||{}).text||"")+'</textarea>'+
    '<div class="button-row"><button class="outline-btn" id="wb-save"'+(can("author")?"":" disabled")+'>Save draft</button><button class="outline-btn" id="wb-review"'+(can("review")?"":" disabled")+'>Mark reviewed</button><button class="outline-btn" id="wb-publish"'+(can("publish")?"":" disabled")+'>Publish</button><button class="outline-btn" id="wb-revert"'+(can("review")?"":" disabled")+'>Return to draft</button></div></div>';
    const c=W.integrity(D,theories());
    adm.innerHTML='<div class="section-title"><div><h2>Administration &amp; Governance (local)</h2><p>Integrity checks, audit history, backup. Admin-only actions are enforced in code but this is client-side, not authentication.</p></div></div>'+
    '<div class="feature-grid"><article class="feature-card"><h3>Integrity</h3><p>Courses '+c.courses+' · Lessons '+c.lessons+' → <b>'+(c.coursesOk?"OK (24/96)":"MISMATCH")+'</b></p><p>Theories: '+c.theories.loaded+' loaded (68 registry / 14 synthesized expected; found '+c.theories.registry+' / '+c.theories.synthesized+') → <b>'+(c.theories.ok?"OK":"NOT COMPLETE")+'</b></p><p>'+esc(c.theories.note)+'</p></article>'+
    '<article class="feature-card"><h3>Backup</h3><div class="button-row"><button class="outline-btn" id="wb-export"'+(can("admin")?"":" disabled")+'>Export workbench JSON</button><button class="outline-btn" id="wb-import"'+(can("admin")?"":" disabled")+'>Import workbench JSON</button><input type="file" id="wb-import-file" accept="application/json,.json" hidden aria-label="Workbench JSON file"><button class="outline-btn" id="wb-clear"'+(can("admin")?"":" disabled")+'>Clear workbench overlay</button></div></article></div>'+
    '<h3>Audit history ('+S.audit.length+')</h3><div style="max-height:220px;overflow:auto"><table><tbody>'+(S.audit.slice(0,50).map(a=>'<tr><td>'+esc(a.when.slice(0,19))+'</td><td>'+esc(a.role)+'</td><td>'+esc(a.action)+'</td><td>'+esc(a.target)+'</td><td>'+esc(a.detail)+'</td></tr>').join("")||'<tr><td>No actions recorded.</td></tr>')+'</tbody></table></div>';
  }
  document.addEventListener("change",e=>{if(e.target.id==="wb-role"){ERR="";role=e.target.value;sessionStorage.setItem("ah-ls-role",role);draw()}if(e.target.id==="wb-lesson"){ERR="";draw()}});
  document.addEventListener("click",e=>{const id=e.target.id,l=(document.querySelector("#wb-lesson")||{}).value;
    if(id==="wb-save")commit(()=>W.saveDraft(D,S,role,l,document.querySelector("#wb-text").value));
    if(id==="wb-review")commit(()=>W.transition(D,S,role,l,"Reviewed"));
    if(id==="wb-publish")commit(()=>W.transition(D,S,role,l,"Published"));
    if(id==="wb-revert")commit(()=>W.transition(D,S,role,l,"Authored draft"));
    if(id==="wb-export"){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,2)],{type:"application/json"}));a.download="learning-studio-workbench.json";a.click()}
    if(id==="wb-import")document.querySelector("#wb-import-file").click();
    if(id==="wb-clear"&&confirm("Clear all workbench drafts, statuses and audit history on this device?"))commit(()=>{W.allow(role,"admin");S=W.blank()});});
  document.addEventListener("change",e=>{if(e.target.id!=="wb-import-file")return;const file=e.target.files&&e.target.files[0];e.target.value="";if(!file)return;
    const rd=new FileReader();rd.onerror=()=>{err("Import rejected: the file could not be read. Existing workbench data preserved.")};
    rd.onload=()=>{try{const n=W.importState(D,S,role,String(rd.result));if(!confirm("Replace this device's workbench drafts, statuses and audit history with the imported file?"))return;S=n;W.save(localStorage,S);err("")}catch(x){err(x.message)}draw()};rd.readAsText(file)});
  const gs=document.querySelector("#global-search"),modal=document.querySelector("#modal"),mc=document.querySelector("#modal-content");
  if(gs&&modal&&mc)gs.addEventListener("keydown",e=>{if(e.key!=="Enter")return;const r=W.searchAll(D,theories(),gs.value);
    mc.innerHTML='<h2 id="modal-title">Search: '+esc(gs.value)+'</h2><p>'+r.length+' result(s) across courses, lessons, projects and theories.</p><ul>'+r.slice(0,100).map(x=>'<li><a href="'+x.href+'" data-close>'+esc(x.type)+' · '+esc(x.id)+' — '+esc(x.title)+'</a></li>').join("")+'</ul>'+(theories().length?"":'<p><small>Theories are not searchable until the registry is imported.</small></p>');
    modal.classList.remove("hidden");});
  mc&&mc.addEventListener("click",e=>{if(e.target.closest("[data-close]"))modal.classList.add("hidden")});
  draw();
})();
