const test=require("node:test"),assert=require("node:assert"),fs=require("fs"),path=require("path");
const V=require("../theory-validation.js"),X=require("../explorer.js");
const w={};new Function("window",fs.readFileSync(path.join(__dirname,"../curriculum-data.js"),"utf8"))(w);
const D=w.AH_LEARNING_CURRICULUM;
test("curriculum: 24 courses / 96 lessons, declared = actual",()=>{
  assert.equal(D.courses.length,24);assert.equal(D.courseCount,24);
  const n=D.courses.reduce((a,c)=>a+c.lessons.length,0);assert.equal(n,96);assert.equal(D.lessonCount,96);});
test("curriculum: programme split 6/7/8/3",()=>{
  const by={};D.courses.forEach(c=>by[c.domain]=(by[c.domain]||0)+1);
  assert.deepEqual(by,{"AH-AIOS Core":6,"AI Harness":7,"WorldForge":8,"Human Stewardship":3});});
test("curriculum: unique course ids; lesson ids unique within course",()=>{
  assert.equal(new Set(D.courses.map(c=>c.id)).size,24);
  D.courses.forEach(c=>assert.equal(new Set(c.lessons.map(l=>l.id)).size,c.lessons.length,c.id));});
test("curriculum: nothing marked published",()=>{
  D.courses.forEach(c=>assert.ok(!/^published$/i.test(c.publicationStatus||""),c.id));});
const fx=(n,o)=>Array.from({length:n},(_,i)=>({id:o[0]+i,title:"T "+o[0]+i,origin:o}));
const good=()=>fx(68,"registry").map(r=>({...r,id:"R"+r.id.slice(8)||r.id})).concat([]);
function make(){const a=[],b=[];for(let i=0;i<68;i++)a.push({id:"R"+i,title:"Reg "+i,origin:"registry"});for(let i=0;i<14;i++)b.push({id:"S"+i,title:"Syn "+i,origin:"synthesized",relationships:["R0","MISSING"]});return a.concat(b);}
test("validator: accepts 68+14 synthetic fixture",()=>{const r=V.validateTheoryCollection(make());assert.ok(r.valid,r.errors.join());});
test("validator: rejects 81, duplicates, wrong split",()=>{
  assert.equal(V.validateTheoryCollection(make().slice(1)).valid,false);
  const d=make();d[1].id=d[0].id;assert.equal(V.validateTheoryCollection(d).valid,false);
  const s=make();s[0].origin="synthesized";assert.equal(V.validateTheoryCollection(s).valid,false);});
test("explorer: search/filter does not mutate collection",()=>{
  const recs=make(),snap=JSON.stringify(recs);
  assert.equal(X.searchTheories(recs,"reg 7").length,1);
  assert.equal(X.searchTheories(recs,"","synthesized").length,14);
  assert.equal(X.searchTheories(recs,"zzz").length,0);assert.equal(JSON.stringify(recs),snap);});
test("explorer: relationships resolve; unknown refs flagged",()=>{
  const recs=make(),rel=X.relatedOf(recs[70],recs);
  assert.equal(rel[0].record.id,"R0");assert.equal(rel[1].record,null);});
test("explorer: corrupt storage yields empty list",()=>{
  assert.deepEqual(X.load({getItem:()=>"{bad"}),[]);assert.deepEqual(X.load({getItem:()=>null}),[]);});
