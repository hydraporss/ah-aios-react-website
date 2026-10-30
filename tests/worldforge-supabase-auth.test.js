import test from 'node:test';
import assert from 'node:assert/strict';

const env=process.env;
const cfg={
 url:env.WORLDFORGE_TEST_SUPABASE_URL,
 key:env.WORLDFORGE_TEST_SUPABASE_PUBLISHABLE_KEY,
 userA:env.WORLDFORGE_TEST_USER_A_EMAIL,
 passA:env.WORLDFORGE_TEST_USER_A_PASSWORD,
 projectA:env.WORLDFORGE_TEST_PROJECT_A_ID,
 userB:env.WORLDFORGE_TEST_USER_B_EMAIL,
 passB:env.WORLDFORGE_TEST_USER_B_PASSWORD,
 projectB:env.WORLDFORGE_TEST_PROJECT_B_ID
};
const ready=Object.values(cfg).every(Boolean);
async function signIn(email,password){
 const r=await fetch(cfg.url.replace(/\/$/, '')+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:cfg.key,'content-type':'application/json'},body:JSON.stringify({email,password})});
 const body=await r.json();assert.equal(r.ok,true,'Test user sign-in failed: '+(body.msg||body.message||r.status));assert.ok(body.access_token,'Auth response missing access token');return body.access_token;
}
async function rows(token,filter){
 const r=await fetch(cfg.url.replace(/\/$/, '')+'/rest/v1/projects?select=id,owner_id&id=eq.'+encodeURIComponent(filter),{headers:{apikey:cfg.key,authorization:'Bearer '+token}});
 assert.equal(r.ok,true,'Project read failed: '+r.status);return r.json();
}
test('authenticated project isolation: owners can read their own project and other users cannot read it',{skip:!ready?'Set two disposable test users, project IDs, and Supabase test credentials to run live RLS tests.':false},async()=>{
 const [tokenA,tokenB]=await Promise.all([signIn(cfg.userA,cfg.passA),signIn(cfg.userB,cfg.passB)]);
 const [aOwn,bSeesA,bOwn,aSeesB]=await Promise.all([rows(tokenA,cfg.projectA),rows(tokenB,cfg.projectA),rows(tokenB,cfg.projectB),rows(tokenA,cfg.projectB)]);
 assert.equal(aOwn.length,1,'User A must see project A');
 assert.equal(bSeesA.length,0,'User B must not see project A');
 assert.equal(bOwn.length,1,'User B must see project B');
 assert.equal(aSeesB.length,0,'User A must not see project B');
});
test('anonymous clients cannot read private project rows',{skip:!ready?'Set the disposable Supabase test environment to run live anonymous RLS tests.':false},async()=>{
 const r=await fetch(cfg.url.replace(/\/$/, '')+'/rest/v1/projects?select=id&id=eq.'+encodeURIComponent(cfg.projectA),{headers:{apikey:cfg.key}});
 assert.equal(r.ok,true,'Anonymous request should be safely handled by RLS');assert.deepEqual(await r.json(),[]);
});
