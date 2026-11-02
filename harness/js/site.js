(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function pick(btns,fn){btns.forEach(b=>b.addEventListener('click',()=>{btns.forEach(x=>x.setAttribute('aria-pressed',x===b));fn(b)}))}
if($('#stack')){
 const P=$('#panel'),show=(h,s,b,L)=>P.innerHTML='<h2>'+esc(h)+'</h2><p><b>'+esc(s)+'</b></p><p>'+esc(b)+'</p>'+(L?'<p class="pl">'+L.map(l=>'<a href="'+l[1]+'">'+esc(l[0])+' →</a>').join('')+'</p>':'');
 const CR=['AH-HAR-120','AH-HAR-130','AH-HAR-110','AH-HAR-140','AH-HAR-130','AH-HAR-150','AH-HAR-150'],TL={core:[['Open AH-AIOS Core','../learning/domains/core.html']],har:[['Open the workbench','workbench.html'],['Command Builder','index.html']],app:[['Open WorldForge','../learning/domains/worldforge.html'],['Open Learning Studio','../learning/index.html']]};
 pick($$('.tier'),b=>show(...AH.tiers[b.dataset.t],TL[b.dataset.t]));
 $('#caps').innerHTML=AH.caps.map((c,i)=>'<li><button id="cap-'+i+'" data-i="'+i+'" aria-pressed="false"><i>'+c[0]+'</i><span><b>'+esc(c[1])+'</b>'+esc(c[2])+'</span></button></li>').join('');
 pick($$('#caps button'),b=>{const i=+b.dataset.i,c=AH.caps[i];show(c[1],c[2],c[3],[[CR[i]+' course','../learning/index.html?q='+CR[i]+'#courses'],['Back to AI Harness','../learning/domains/harness.html#cap-'+i]]);try{history.replaceState(null,'','#cap-'+i)}catch(e){}});
 const hm=/^#cap-(\d+)$/.exec(location.hash||'');
 if(hm){const cb=$('#caps button[data-i="'+hm[1]+'"]');if(cb){cb.click();const go=()=>$('#stack').scrollIntoView();addEventListener('load',()=>setTimeout(go,0));if(document.readyState==='complete')go()}}
 window.addEventListener('hashchange',()=>{const m=/^#cap-(\d+)$/.exec(location.hash||'');const b=m&&$('#caps button[data-i="'+m[1]+'"]');if(b)b.click()});
 $('#flow').innerHTML=AH.life.map((l,i)=>'<button aria-pressed="'+(i==0)+'" data-i="'+i+'">'+(i+1)+'. '+esc(l[0])+'</button>').join('');
 const fd=$('#flowdesc'),sf=i=>fd.textContent=AH.life[i][0]+': '+AH.life[i][1];sf(0);
 pick($$('#flow button'),b=>sf(b.dataset.i));
 $('#layers').innerHTML=AH.layers.map((l,i)=>'<tr><td>'+(i+1)+'</td><td>'+esc(l[0])+'</td><td>'+esc(l[1])+'</td></tr>').join('');
 $('#road').innerHTML=AH.road.map(r=>'<details><summary>'+esc(r[0])+' <span class="tag">Not started</span></summary><p>'+esc(r[1])+'</p></details>').join('');
}
if($('#wb')){
 let h='',g='';AH.modules.forEach((m,i)=>{if(m.group!==g){g=m.group;h+='<h4>'+esc(g.toUpperCase())+'</h4>'}h+='<button data-n="'+i+'" aria-pressed="false">'+m.id+' '+esc(m.name)+'</button>'});
 $('#list').innerHTML=h;
 const out=$('#detail');
 function sim(){
  let cur='PROPOSED';const v=AH.outcomes.map(()=>false);
  const all=[...AH.states.primary,...AH.states.intermediate,...AH.states.terminal];
  const root=document.createElement('div');root.className='sim';
  root.innerHTML='<b>Try the state model</b> <span class="demo">Local demonstration. No run is executed.</span><p class="cur" id="cur"></p><div class="st" id="sts"></div><p style="margin:10px 0 4px"><b>Verification outcomes</b> (kept separate, never one success flag)</p>'+AH.outcomes.map((o,i)=>'<label><input type="checkbox" data-v="'+i+'"> '+esc(o)+'</label>').join('')+'<ol id="log" aria-live="polite"></ol>';
  const log=(t,c)=>{const li=document.createElement('li');li.className=c;li.textContent=t;$('#log',root).prepend(li)};
  const draw=()=>{$('#cur',root).textContent=cur;$('#sts',root).innerHTML=all.map(s=>'<button data-s="'+s+'">'+s+'</button>').join('')};
  root.addEventListener('click',e=>{const s=e.target.dataset&&e.target.dataset.s;if(!s)return;const r=AH.canTransition(cur,s,v);if(r.ok){log(cur+' to '+s+' accepted','good');cur=s;draw()}else log('Rejected: '+r.why,'bad')});
  root.addEventListener('change',e=>{if(e.target.dataset.v!==undefined)v[e.target.dataset.v]=e.target.checked});
  draw();return root;
 }
 function render(n){const m=AH.modules[n];
  out.innerHTML='<h2 class="t">'+m.id+' '+esc(m.name)+'</h2><p class="lead">'+esc(m.purpose)+'</p>'+
  (m.name==='Dashboard'?'<p><span class="demo">No live service connected. Values are unavailable, not zero.</span></p><div class="kv">'+['Active runs','Providers online','Pending approvals','Failed runs'].map(k=>'<div><b>n/a</b><span>'+k+'</span></div>').join('')+'</div>':'')+
  '<h3>Planned functions</h3><ul class="fn">'+m.functions.map(f=>'<li>'+esc(f)+'</li>').join('')+'</ul>'+
  m.facts.map(f=>'<h3>'+esc(f[0])+'</h3><div class="chips">'+f[1].map(x=>'<span>'+esc(x)+'</span>').join('')+'</div>').join('')+
  '<p><span class="tag">Status: Proposed, not implemented</span></p>';
  if(m.name==='Execution Console')out.appendChild(sim());
  location.hash=m.id}
 pick($$('#list button'),b=>render(+b.dataset.n));
 const start=AH.modules.findIndex(m=>m.id===location.hash.slice(1));
 $$('#list button')[start<0?0:start].click();
 $('#q').addEventListener('input',e=>{const v=e.target.value.toLowerCase();$$('#list button').forEach(b=>b.style.display=b.textContent.toLowerCase().includes(v)?'':'none')});
}
})();
