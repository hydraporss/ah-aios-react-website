import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root=process.cwd();
const now='2026-10-30T10:00:00.000Z';
const common={schema_version:'1.0.0',created_at:now,updated_at:now,created_by:'test-runner',updated_by:'test-runner',record_version:1,workflow_status:'proposed',source_refs:[]};
const records={
  world:{...common,id:'world-a',record_type:'world',world_id:null,name:'World A',description:'Fixture',status:'active',metadata:{}},
  entity:{...common,id:'entity-a',record_type:'entity',world_id:'world-a',name:'Entity A',entity_type:'person',description:'Fixture',identity_notes:'',attributes:{}},
  relationship:{...common,id:'edge-a',record_type:'relationship',world_id:'world-a',source_id:'entity-a',target_id:'entity-b',relationship_type:'allied-with',directionality:'directed',context:'Fixture',allow_self_link:false,allow_cycle:false},
  claim:{...common,id:'claim-a',record_type:'claim',world_id:'world-a',statement:'A test claim.',claim_type:'interpretation',evidence_refs:[],evidence_state:'unknown',canon_status:'not_canon',uncertainty:'',contradiction_refs:[],reviewer_refs:[]},
  source:{...common,id:'source-a',record_type:'source',world_id:'world-a',title:'Fixture source',source_type:'document',origin_locator:'fixture:test',attribution:'Test',access_classification:'unknown'},
  evidence:{...common,id:'evidence-a',record_type:'evidence',world_id:'world-a',claim_id:'claim-a',source_id:'source-a',relation:'supports',locator:'section 1',excerpt:'Fixture excerpt',review_state:'unreviewed'},
  manifest:{package_type:'ah-aios-worldforge',schema_version:'1.0.0',exported_at:now,record_counts:{worlds:1,entities:2,relationships:1,claims:1,sources:1,evidence:1}}
};
function validate(schema,dataPath){
 const args=['dlx','--package=ajv-cli@5.0.0','ajv','validate','--spec=draft2020','-s',resolve(root,'schemas/v1/'+schema+'.schema.json')];
 if(schema!=='manifest')args.push('-r',resolve(root,'schemas/v1/common.schema.json'));
 args.push('-d',dataPath);
 return spawnSync('pnpm',args,{cwd:root,encoding:'utf8',timeout:120000});
}
test('all WorldForge record schemas validate positive instances and reject invalid instances with Ajv Draft 2020-12',()=>{
 const dir=mkdtempSync(join(tmpdir(),'worldforge-schema-'));
 try{
  for(const [type,record] of Object.entries(records)){
   const good=join(dir,type+'-valid.json'),bad=join(dir,type+'-invalid.json');
   writeFileSync(good,JSON.stringify(record));
   const missing={...record};delete missing[type==='manifest'?'schema_version':'id'];
   writeFileSync(bad,JSON.stringify(missing));
   const valid=validate(type,good);
   assert.equal(valid.status,0,type+' valid fixture failed: '+valid.stdout+' '+valid.stderr);
   const invalid=validate(type,bad);
   assert.notEqual(invalid.status,0,type+' invalid fixture unexpectedly passed.');
  }
 }finally{rmSync(dir,{recursive:true,force:true})}
});
