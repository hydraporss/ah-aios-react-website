/* Theory Explorer enhancement (additive). Reads the already-validated collection from localStorage;
   never modifies it and never invents records. */
(function(root,factory){const api=factory();if(typeof module!=="undefined"&&module.exports)module.exports=api;if(root)root.AHTheoryExplorer=api;})(typeof window!=="undefined"?window:globalThis,function(){
  const KEY="ah-aios-learning-theories-v1";
  const kindOf=r=>r.origin||r.collection||"unspecified";
  function searchTheories(records,query,kind){
    const q=String(query||"").trim().toLowerCase();
    return (records||[]).filter(r=>(!kind||kind==="all"||kindOf(r)===kind)&&(!q||JSON.stringify(r).toLowerCase().includes(q)));
  }
  function relatedOf(record,records){
    const raw=record.relationships||record.related||record.relatedTheories||[];
    const refs=(Array.isArray(raw)?raw:[raw]).map(x=>typeof x==="string"?x:(x&&(x.id||x.target))).filter(Boolean);
    const byId=new Map((records||[]).map(r=>[r.id,r]));
    return refs.map(id=>({id,record:byId.get(id)||null}));
  }
  function load(storage){try{const v=JSON.parse(storage.getItem(KEY)||"null");return Array.isArray(v)?v:[]}catch{return[]}}
  return{searchTheories,relatedOf,kindOf,load,KEY};
});
(function(){
  if(typeof document==="undefined")return;
  const X=window.AHTheoryExplorer,list=document.querySelector("#theory-list");if(!list)return;
  const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const tools=document.createElement("div");tools.className="button-row";
  tools.innerHTML='<label class="sr-only" for="theory-q">Search theories</label><input id="theory-q" type="search" placeholder="Search theories by id, title or any field…" style="flex:1;min-width:220px"><label class="sr-only" for="theory-kind">Classification</label><select id="theory-kind"><option value="all">All</option><option value="registry">Registry (68)</option><option value="synthesized">Synthesized (14)</option></select><span id="theory-count" role="status" aria-live="polite"></span>';
  list.parentNode.insertBefore(tools,list);
  let records=[];
  function draw(){
    const q=tools.querySelector("#theory-q").value,k=tools.querySelector("#theory-kind").value,hits=X.searchTheories(records,q,k);
    tools.querySelector("#theory-count").textContent=records.length?hits.length+" of "+records.length+" shown":"No records loaded — import the authoritative registry JSON above.";
    list.innerHTML=hits.map(t=>'<article class="theory-card"><b>'+esc(t.id)+'</b><h3><button type="button" class="link-btn" data-theory="'+esc(t.id)+'">'+esc(t.title)+'</button></h3><small>'+esc(X.kindOf(t))+'</small></article>').join("")||(records.length?'<p>No theories match.</p>':"");
  }
  function sync(){records=X.load(localStorage);draw()}
  tools.addEventListener("input",draw);
  list.addEventListener("click",e=>{
    const b=e.target.closest("[data-theory]");if(!b)return;const t=records.find(r=>r.id===b.dataset.theory);if(!t)return;
    const rel=X.relatedOf(t,records).map(r=>'<li>'+esc(r.id)+(r.record?' — '+esc(r.record.title):' <em>(not in loaded collection)</em>')+'</li>').join("");
    const rows=Object.keys(t).filter(k=>!/^(relationships|related|relatedTheories)$/.test(k)).map(k=>'<tr><th scope="row">'+esc(k)+'</th><td>'+esc(typeof t[k]==="object"?JSON.stringify(t[k]):t[k])+'</td></tr>').join("");
    const m=document.querySelector("#modal"),c=document.querySelector("#modal-content");if(!m||!c)return;
    c.innerHTML='<p class="eyebrow">THEORY · '+esc(X.kindOf(t))+'</p><h2 id="modal-title">'+esc(t.title)+'</h2><table>'+rows+'</table><h3>Relationships</h3>'+(rel?'<ul>'+rel+'</ul>':'<p>No relationship data in this record.</p>')+'<p><small>Read-only view of the imported record.</small></p>';
    m.classList.remove("hidden");
  });
  new MutationObserver(sync).observe(document.querySelector("#theory-status")||list,{childList:true,characterData:true,subtree:true});
  sync();
})();
