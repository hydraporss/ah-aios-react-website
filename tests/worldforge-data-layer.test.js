import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

const schemaDir = join(process.cwd(), 'schemas', 'v1');
test('all registered JSON schemas parse and declare Draft 2020-12', () => {
  const registry = JSON.parse(readFileSync(join(schemaDir,'registry.json'),'utf8'));
  assert.equal(registry.schema_dialect,'https://json-schema.org/draft/2020-12/schema');
  for (const item of registry.schemas) {
    const schema = JSON.parse(readFileSync(join(schemaDir,item.path),'utf8'));
    assert.equal(schema.$schema,registry.schema_dialect, item.path+' dialect');
    assert.ok(schema.$id, item.path+' id');
  }
  assert.ok(readdirSync(schemaDir).includes('common.schema.json'));
});

const sandbox = { console, Date, Set, Map, JSON, Object, Array, String, Number, Error };
vm.createContext(sandbox);
vm.runInContext(readFileSync(join(process.cwd(),'public/worldforge/verified-2026-10-28/assets/data-layer.js'),'utf8'),sandbox);
const api = sandbox.WorldForgeDataLayer;
const base = {
  packageType:'ah-aios-worldforge',schemaVersion:'0.1.0',
  worlds:[{id:'world-a',name:'World A'}],
  entities:[{id:'entity-a',worldId:'world-a'},{id:'entity-b',worldId:'world-a'}],
  relationships:[{id:'edge-a',sourceId:'entity-a',targetId:'entity-b',type:'allied'}],
  claims:[{id:'claim-a',statement:'A claim',sourceRef:'source-a'}],sources:[],evidence:[],auditLog:[]
};
test('integrity validator accepts a well-formed workspace',()=>assert.equal(api.validateWorkspace(base).valid,true));
test('integrity validator rejects duplicate IDs and dangling endpoints',()=>{
  const bad={...base,entities:[...base.entities,{id:'entity-a',worldId:'world-a'}],relationships:[{id:'edge-b',sourceId:'entity-a',targetId:'missing'}]};
  const result=api.validateWorkspace(bad);
  assert.ok(result.errors.some(x=>x.code==='DUPLICATE_ID'));
  assert.ok(result.errors.some(x=>x.code==='DANGLING_TARGET'));
});
test('migration preserves record IDs and does not promote canon status',()=>{
  const input={...base,claims:[{id:'claim-a',statement:'A claim',sourceRef:'source-a',canonStatus:'not_canon',version:2}]};
  const out=api.migrateWorkspace(input);
  assert.equal(out.claims[0].id,'claim-a');
  assert.equal(out.claims[0].version,2);
  assert.equal(out.claims[0].canonStatus,'not_canon');
  assert.equal(out.migrationHistory.length,1);
});
test('revision preserves identity and increments version',()=>{
  const r=api.makeRevision({id:'entity-a',version:4},{id:'entity-a',name:'Updated'},'test-user','edit');
  assert.equal(r.id,'entity-a'); assert.equal(r.version,5); assert.equal(r.updatedBy,'test-user');
});
test('migration rejects unsupported versions',()=>assert.throws(()=>api.migrateWorkspace({...base,schemaVersion:'9.0.0'}),/Unsupported schema version/));

test('Supabase adapter preserves governance boundaries and optimistic concurrency',()=>{
  const service=readFileSync(join(process.cwd(),'public/worldforge/verified-2026-10-28/assets/supabase-service.js'),'utf8');
  assert.match(service,/record_version:existing\.record_version\+1/);
  assert.match(service,/\.eq\('record_version',existing\.record_version\)/);
  assert.match(service,/Governance terminal states require a separate authorized review action/);
  assert.match(service,/delete next\.canon_status/);
  assert.doesNotMatch(readFileSync(join(process.cwd(),'public/worldforge/verified-2026-10-28/assets/supabase-config.js'),'utf8'),/service_role|secret_key/i);
});
