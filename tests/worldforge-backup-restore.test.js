import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

const sandbox={console,Date,Set,Map,JSON,Object,Array,String,Number,Error};
vm.createContext(sandbox);
vm.runInContext(readFileSync(join(process.cwd(),'public/worldforge/verified-2026-10-28/assets/data-layer.js'),'utf8'),sandbox);
const api=sandbox.WorldForgeDataLayer;
const fixture={packageType:'ah-aios-worldforge',schemaVersion:'1.0.0',worlds:[{id:'world-a',name:'World A',status:'active'}],entities:[{id:'entity-a',worldId:'world-a',name:'Entity A'},{id:'entity-b',worldId:'world-a',name:'Entity B'}],relationships:[{id:'edge-a',sourceId:'entity-a',targetId:'entity-b',type:'allied'}],claims:[{id:'claim-a',worldId:'world-a',statement:'A test claim',sourceRef:'source-a',canonStatus:'not_canon'}],sources:[{id:'source-a',worldId:'world-a',name:'Source A',reference:'fixture:test'}],evidence:[],auditLog:[{id:'audit-a',action:'fixture',at:'2026-10-30T10:00:00.000Z'}],versionHistory:[{id:'rev-a',recordId:'claim-a',snapshot:{id:'claim-a',canonStatus:'not_canon'}}],migrationHistory:[]};

test('portable backup/restore round trip preserves stable IDs, relationships, audit lineage, and canon status',()=>{
 const bytes=JSON.stringify(fixture);const checksum=createHash('sha256').update(bytes).digest('hex');
 const backup={format:'ah-aios-worldforge-backup-v1',sha256:checksum,payload:JSON.parse(bytes)};
 assert.equal(createHash('sha256').update(JSON.stringify(backup.payload)).digest('hex'),backup.sha256,'Backup checksum must verify before restore.');
 const tampered=JSON.parse(JSON.stringify(backup));tampered.payload.claims[0].statement='tampered';assert.notEqual(createHash('sha256').update(JSON.stringify(tampered.payload)).digest('hex'),tampered.sha256,'Tampered backup must be detected.');
 const restored=api.migrateWorkspace(JSON.parse(JSON.stringify(backup.payload)));
 const restoredBytes=JSON.stringify(restored);const restoredAgain=api.migrateWorkspace(JSON.parse(restoredBytes));
 assert.equal(restoredAgain.worlds[0].id,'world-a');
 assert.equal(restoredAgain.relationships[0].sourceId,'entity-a');
 assert.equal(restoredAgain.relationships[0].targetId,'entity-b');
 assert.equal(restoredAgain.claims[0].canonStatus,'not_canon');
 assert.equal(restoredAgain.auditLog[0].id,'audit-a');
 assert.equal(restoredAgain.versionHistory[0].id,'rev-a');
 assert.equal(backup.sha256,checksum);
 assert.equal(api.validateWorkspace(restoredAgain).valid,true);
});
