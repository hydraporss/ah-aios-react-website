/* Optional authenticated Supabase repository adapter for the existing AH-AIOS schema. */
(function(root){
'use strict';
const MAP_KEY='worldforge_supabase_id_map_v1';
let clientPromise=null;
function config(){return root.WORLDFORGE_SUPABASE_CONFIG||null}
async function client(){
 const c=config();if(!c||!c.url||!c.publishableKey)throw new Error('Supabase browser configuration is missing.');
 if(!clientPromise)clientPromise=import('https://esm.sh/@supabase/supabase-js@2.118.0').then(m=>m.createClient(c.url,c.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}));
 return clientPromise;
}
function idMap(){try{return JSON.parse(localStorage.getItem(MAP_KEY)||'{}')}catch{return {}}}
function saveMap(m){localStorage.setItem(MAP_KEY,JSON.stringify(m))}
function uuid(){return crypto.randomUUID()}
function workflow(v){const x=String(v||'Draft').toLowerCase().replaceAll(' ','_');if(['approved','rejected','superseded'].includes(x))throw new Error('Governance terminal states require a separate authorized review action.');const states={proposed:'Proposed',investigating:'Investigated',needs_evidence:'Needs Evidence',validated:'Validated',draft:'Draft'};if(!states[x])throw new Error('Unknown workflow state: '+v);return states[x]}
async function requireUser(db){const {data,error}=await db.auth.getUser();if(error)throw error;if(!data.user)throw new Error('Sign in to use the shared WorldForge workspace.');return data.user}
async function signIn(email,password){const db=await client();const r=await db.auth.signInWithPassword({email,password});if(r.error)throw r.error;return r.data.user}
async function signUp(email,password){const db=await client();const r=await db.auth.signUp({email,password});if(r.error)throw r.error;return {user:r.data.user,session:r.data.session,confirmationRequired:!r.data.session}}
async function signOut(){const db=await client();const r=await db.auth.signOut();if(r.error)throw r.error}
async function session(){const db=await client();const r=await db.auth.getSession();if(r.error)throw r.error;return r.data.session}
async function listWorlds(){const db=await client();await requireUser(db);const r=await db.from('projects').select('id,slug,name,description,governance_state,record_version,updated_at').order('created_at');if(r.error)throw r.error;return r.data}
async function syncWorkspace(workspace){
 const validator=root.WorldForgeDataLayer;if(!validator)throw new Error('WorldForge data validator is unavailable.');
 const report=validator.validateWorkspace(workspace);if(!report.valid)throw new Error('Local workspace failed integrity checks: '+report.errors.slice(0,4).map(x=>x.code).join(', '));if(validator.validateWorkspaceSchemas){const schemaReport=await validator.validateWorkspaceSchemas(workspace);if(!schemaReport.valid)throw new Error('JSON Schema validation failed: '+schemaReport.errors.slice(0,4).map(x=>x.path+': '+x.message).join('; '));}
 const db=await client(),user=await requireUser(db),map=idMap();
 map.lastSyncedLocalSnapshots=map.lastSyncedLocalSnapshots||{};for(const name of ['worlds','entities','relationships','claims','sources'])for(const record of workspace[name]||[]){const key=name+':'+record.id,base=map.lastSyncedLocalSnapshots[key],projection=validator.comparable?validator.comparable(({worlds:'world',entities:'entity',relationships:'relationship',sources:'source',claims:'claim'}[name]||name),record):record;if(!base||validator.stable(projection)!==validator.stable(base))workflow(record.workflowStatus||'Draft');}
 for(const k of ['worlds','entities','relationships','claims','sources'])map[k]=map[k]||{};
 map.lastSyncedVersions=map.lastSyncedVersions||{};map.lastSyncedHashes=map.lastSyncedHashes||{};
 const conflicts=[],synced={worlds:0,entities:0,relationships:0,claims:0,sources:0};
 async function writeRecord(table,type,local,projectId,fields){
   let remoteId=map[type][local.id];if(!remoteId){remoteId=uuid();map[type][local.id]=remoteId}
   const {data:existing,error:readError}=await db.from(table).select('id,record_version,created_by,owner_id,canon_status').eq('id',remoteId).maybeSingle();
   if(readError)throw readError;
   const key=type+':'+local.id, payloadHash=JSON.stringify(fields);
   if(!existing){
     const payload={id:remoteId,...fields};
     if(table==='projects')payload.owner_id=user.id;
     else if(table==='entities'||table==='relationships'||table==='claims'||table==='sources')payload.created_by=user.id;
     const {data,error}=await db.from(table).insert(payload).select('id,record_version').single();
     if(error)throw new Error('Could not create '+type+' "'+(local.name||local.title||local.id)+'": '+error.message);
     map.lastSyncedVersions[key]=data.record_version||1;map.lastSyncedHashes[key]=payloadHash;map.lastSyncedLocalSnapshots[key]=validator.comparable?validator.comparable(({worlds:'world',entities:'entity',relationships:'relationship',sources:'source',claims:'claim'}[type]||type),local):local;saveMap(map);synced[type]++;return data;
   }
   const last=map.lastSyncedVersions[key];
   if(last===undefined||existing.record_version!==last){conflicts.push({type,id:local.id,reason:'Remote revision changed since last sync.'});return null}
   if(map.lastSyncedHashes[key]===payloadHash){map.lastSyncedLocalSnapshots[key]=validator.comparable?validator.comparable(({worlds:'world',entities:'entity',relationships:'relationship',sources:'source',claims:'claim'}[type]||type),local):local;saveMap(map);synced[type]++;return existing}
   const next={...fields,record_version:existing.record_version+1};
   delete next.canon_status;delete next.governance_state;delete next.owner_id;delete next.created_by;
   const {data,error}=await db.from(table).update(next).eq('id',remoteId).eq('record_version',existing.record_version).select('id,record_version').maybeSingle();
   if(error)throw error;
   if(!data){conflicts.push({type,id:local.id,reason:'Optimistic concurrency check failed.'});return null}
   map.lastSyncedVersions[key]=data.record_version;map.lastSyncedHashes[key]=payloadHash;map.lastSyncedLocalSnapshots[key]=validator.comparable?validator.comparable(({worlds:'world',entities:'entity',relationships:'relationship',sources:'source',claims:'claim'}[type]||type),local):local;saveMap(map);synced[type]++;return data;
 }
 const worldIds={};
 for(const w of workspace.worlds||[]){
   const res=await writeRecord('projects','worlds',w,null,{slug:String(w.id).slice(0,120),name:w.name,description:w.description||'',governance_state:'Draft'});
   if(res)worldIds[w.id]=res.id;
 }
 const entityIds={};
 for(const e of workspace.entities||[]){
   const projectId=worldIds[e.worldId]||map.worlds[e.worldId];if(!projectId){conflicts.push({type:'entities',id:e.id,reason:'Owning world was not synchronized.'});continue}
   const fields={project_id:projectId,entity_type:e.type||e.entityType||'Other',name:e.name||'Unnamed entity',description:e.description||'',attributes:{worldforge_id:e.id,identity:e.identity||'',source_refs:e.sourceRefs||[]},workflow_status:workflow(e.workflowStatus),schema_version:'1.0.0'};
   const res=await writeRecord('entities','entities',e,projectId,fields);if(res)entityIds[e.id]=res.id;
 }
 for(const r of workspace.relationships||[]){
   const source=entityIds[r.sourceId]||map.entities[r.sourceId],target=entityIds[r.targetId]||map.entities[r.targetId];
   if(!source||!target){conflicts.push({type:'relationships',id:r.id,reason:'Endpoint entity was not synchronized.'});continue}
   const sourceLocal=(workspace.entities||[]).find(x=>x.id===r.sourceId);
   const projectId=worldIds[sourceLocal?.worldId]||map.worlds[sourceLocal?.worldId];
   if(!projectId){conflicts.push({type:'relationships',id:r.id,reason:'Owning world is missing.'});continue}
   const res=await writeRecord('relationships','relationships',r,projectId,{project_id:projectId,source_entity_id:source,target_entity_id:target,relationship_type:r.type||r.relationshipType||'Related to',status:workflow(r.workflowStatus),attributes:{worldforge_id:r.id,direction:r.direction||'directed',context:r.context||''}});
   
 }
 for(const source of workspace.sources||[]){
   const sourceWorld=source.worldId||((workspace.claims||[]).find(c=>c.sourceId===source.id)||{}).worldId;const worldId=sourceWorld?worldIds[sourceWorld]||map.worlds[sourceWorld]:null;
   if(!worldId){conflicts.push({type:'sources',id:source.id,reason:'A project/world scope is required by the existing service schema.'});continue}
   const res=await writeRecord('sources','sources',source,worldId,{project_id:worldId,title:source.name||source.title||'Untitled source',source_type:source.type||'document',uri:source.reference||source.uri||'',content_hash:source.contentHash||null,provenance:{worldforge_id:source.id,source_refs:source.sourceRefs||[]},workflow_status:workflow(source.workflowStatus),schema_version:'1.0.0'});
   
 }
 for(const c of workspace.claims||[]){
   const projectId=c.worldId?worldIds[c.worldId]||map.worlds[c.worldId]:null;
   if(!projectId){conflicts.push({type:'claims',id:c.id,reason:'A project/world scope is required by the existing service schema.'});continue}
   const res=await writeRecord('claims','claims',c,projectId,{project_id:projectId,statement:c.statement||c.title||'Untitled claim',status:workflow(c.workflowStatus),provenance:{worldforge_id:c.id,claim_type:c.type||'Interpretation',source_refs:c.sourceRefs||[],source_id:c.sourceId||null,source_ref:c.sourceRef||'',uncertainty:c.uncertainty||'',evidence_state:c.evidenceState||'Unknown'},schema_version:'1.0.0'});
   
 }
 saveMap(map);
 return {synced,conflicts,at:new Date().toISOString(),note:conflicts.length?'Some records were skipped to avoid overwriting remote changes. Resolve conflicts and sync again.':'Sync completed; canon status was never promoted by sync.'};
}

function norm(v){return String(v||'Draft').toLowerCase().replaceAll(' ','_')}
function tableRows(db,table){return (async()=>{const out=[],size=500;for(let offset=0;;offset+=size){const r=await db.from(table).select('*').order('created_at').range(offset,offset+size-1);if(r.error)throw r.error;out.push(...(r.data||[]));if(!r.data||r.data.length<size)break}return out})()}
function rowFields(type,row,localId,projectLocalId,entityLocalIds){
 if(type==='worlds')return {slug:row.slug,name:row.name,description:row.description||'',governance_state:'Draft'};
 if(type==='entities')return {project_id:row.project_id,entity_type:row.entity_type,name:row.name,description:row.description||'',attributes:{worldforge_id:localId,identity:row.attributes?.identity||'',source_refs:row.attributes?.source_refs||[]},workflow_status:row.workflow_status,schema_version:row.schema_version||'1.0.0'};
 if(type==='relationships')return {project_id:row.project_id,source_entity_id:row.source_entity_id,target_entity_id:row.target_entity_id,relationship_type:row.relationship_type,status:row.status,attributes:{worldforge_id:localId,direction:row.attributes?.direction||'directed',context:row.attributes?.context||''}};
 if(type==='sources')return {project_id:row.project_id,title:row.title,source_type:row.source_type,uri:row.uri||'',content_hash:row.content_hash||null,provenance:{worldforge_id:localId,source_refs:row.provenance?.source_refs||[]},workflow_status:row.workflow_status,schema_version:row.schema_version||'1.0.0'};
 if(type==='claims')return {project_id:row.project_id,statement:row.statement,status:row.status,provenance:{worldforge_id:localId,claim_type:row.provenance?.claim_type||'Interpretation',source_refs:row.provenance?.source_refs||[],source_id:row.provenance?.source_id||null,source_ref:row.provenance?.source_ref||'',uncertainty:row.provenance?.uncertainty||'',evidence_state:row.provenance?.evidence_state||'Unknown'},schema_version:row.schema_version||'1.0.0'};
 return {};
}
function remoteLocal(type,row,localId,worldByRemote,entityByRemote){
 const worldId=worldByRemote[row.project_id]||null;
 if(type==='worlds')return {id:localId,name:row.name||'Unnamed world',description:row.description||'',status:'active',workflowStatus:'draft',version:row.record_version||1,updatedAt:row.updated_at,remoteId:row.id};
 if(type==='entities')return {id:localId,worldId,type:row.entity_type||'Other',name:row.name||'Unnamed entity',description:row.description||'',identity:row.attributes?.identity||'',sourceRefs:row.attributes?.source_refs||[],workflowStatus:norm(row.workflow_status),version:row.record_version||1,updatedAt:row.updated_at,remoteId:row.id};
 if(type==='relationships')return {id:localId,sourceId:entityByRemote[row.source_entity_id]||row.source_entity_id,targetId:entityByRemote[row.target_entity_id]||row.target_entity_id,worldId,type:row.relationship_type||'Related to',direction:row.attributes?.direction||'directed',context:row.attributes?.context||'',workflowStatus:norm(row.status),version:row.record_version||1,updatedAt:row.updated_at,remoteId:row.id};
 if(type==='sources')return {id:localId,worldId,name:row.title||'Untitled source',type:row.source_type||'document',reference:row.uri||'',contentHash:row.content_hash||null,sourceRefs:row.provenance?.source_refs||[],workflowStatus:norm(row.workflow_status),version:row.record_version||1,updatedAt:row.updated_at,remoteId:row.id};
 if(type==='claims')return {id:localId,worldId,statement:row.statement||'',type:row.provenance?.claim_type||'Interpretation',sourceRefs:row.provenance?.source_refs||[],sourceId:row.provenance?.source_id||null,sourceRef:row.provenance?.source_ref||'',uncertainty:row.provenance?.uncertainty||'',evidenceState:norm(row.provenance?.evidence_state||'unknown'),workflowStatus:norm(row.status),version:row.record_version||1,updatedAt:row.updated_at,remoteId:row.id};
 return null;
}
function setRecord(workspace,type,record){const key=type;workspace[key]=workspace[key]||[];const i=workspace[key].findIndex(x=>x.id===record.id);if(i>=0){const old=workspace[key][i];workspace[key][i]={...record,...(type==='claims'&&old.canonStatus?{canonStatus:old.canonStatus}:{})}}else workspace[key].push(record)}
function remoteKey(type,row){if(type==='worlds')return row.slug||row.id;if(type==='entities')return row.attributes?.worldforge_id;if(type==='relationships')return row.attributes?.worldforge_id;if(type==='sources')return row.provenance?.worldforge_id;if(type==='claims')return row.provenance?.worldforge_id;return null}
async function syncBidirectional(workspace){
 const validator=root.WorldForgeDataLayer;if(!validator)throw new Error('WorldForge data validator is unavailable.');
 const db=await client(),user=await requireUser(db),map=idMap();map.lastSyncedLocalSnapshots=map.lastSyncedLocalSnapshots||{};map.lastSyncedVersions=map.lastSyncedVersions||{};map.lastSyncedHashes=map.lastSyncedHashes||{};
 const report=validator.validateWorkspace(workspace);if(!report.valid)throw new Error('Local workspace failed integrity checks: '+report.errors.slice(0,4).map(x=>x.code).join(', '));
 if(validator.validateWorkspaceSchemas){const sr=await validator.validateWorkspaceSchemas(workspace);if(!sr.valid)throw new Error('JSON Schema validation failed: '+sr.errors.slice(0,4).map(x=>x.path+': '+x.message).join('; '))}
 for(const type of ['worlds','entities','relationships','claims','sources'])map[type]=map[type]||{};
 const [projects,entities,relationships,sources,claims]=await Promise.all(['projects','entities','relationships','sources','claims'].map(t=>tableRows(db,t)));
 const worldByRemote={},entityByRemote={},remoteSets={worlds:projects,entities,relationships,sources,claims},localTypes={worlds:'worlds',entities:'entities',relationships:'relationships',sources:'sources',claims:'claims'};
 for(const row of projects){const id=remoteKey('worlds',row);if(id){worldByRemote[row.id]=id;map.worlds[id]=row.id}}
 for(const row of entities){const id=remoteKey('entities',row);if(id){entityByRemote[row.id]=id;map.entities[id]=row.id}}
 const conflicts=[],pulled={worlds:0,entities:0,relationships:0,sources:0,claims:0},remoteVersionByConflict={};
 for(const type of ['worlds','entities','relationships','sources','claims']){
  const localKey=localTypes[type],rows=remoteSets[type];
  for(const row of rows){
   const localId=remoteKey(type,row);if(!localId)continue;
   const remote=remoteLocal(type,row,localId,worldByRemote,entityByRemote);if(!remote)continue;
   const remoteId=row.id,scopeProjectId=type==='worlds'?row.id:row.project_id,key=type+':'+localId,local=(workspace[localKey]||[]).find(x=>x.id===localId),base=map.lastSyncedLocalSnapshots[key];
   map[type]=map[type]||{};map[type][localId]=remoteId;
   if(!local&&!base){
    setRecord(workspace,localKey,remote);
    map.lastSyncedVersions[key]=row.record_version||1;
    map.lastSyncedHashes[key]=JSON.stringify(rowFields(type,row,localId,worldByRemote[row.project_id],entityByRemote));
    map.lastSyncedLocalSnapshots[key]=validator.comparable(({worlds:'world',entities:'entity',relationships:'relationship',sources:'source',claims:'claim'}[type]||type),remote);
    pulled[type]++;continue;
   }
   if(!local&&base){conflicts.push({id:uuid(),type,recordId:localId,remoteId,projectId:scopeProjectId,reason:'Local record is missing although a prior sync base exists.',baseSnapshot:base,localSnapshot:null,remoteSnapshot:remote,remoteVersion:row.record_version||1,remotePayloadHash:JSON.stringify(rowFields(type,row,localId,worldByRemote[row.project_id],entityByRemote)),status:'open'});continue}
   if(!base){conflicts.push({id:uuid(),type,recordId:localId,remoteId,projectId:row.project_id,reason:'A local record and remote record exist without a shared sync base.',baseSnapshot:null,localSnapshot:local,remoteSnapshot:remote,remoteVersion:row.record_version||1,remotePayloadHash:JSON.stringify(rowFields(type,row,localId,worldByRemote[row.project_id],entityByRemote)),status:'open'});continue}
   const localProjection=validator.comparable(({worlds:'world',entities:'entity',relationships:'relationship',sources:'source',claims:'claim'}[type]||type),local),remoteProjection=validator.comparable(({worlds:'world',entities:'entity',relationships:'relationship',sources:'source',claims:'claim'}[type]||type),remote);
   const decision=validator.classifyConflict(base,localProjection,remoteProjection);
   if(decision.state==='conflict'){
    conflicts.push({id:uuid(),type,recordId:localId,remoteId,projectId:row.project_id,reason:'Both local and remote versions changed since the last acknowledged base.',baseSnapshot:base,localSnapshot:local,remoteSnapshot:remote,remoteVersion:row.record_version||1,remotePayloadHash:JSON.stringify(rowFields(type,row,localId,worldByRemote[row.project_id],entityByRemote)),status:'open'});continue;
   }
   if(decision.state==='pull'){
    setRecord(workspace,localKey,remote);map.lastSyncedVersions[key]=row.record_version||1;map.lastSyncedHashes[key]=JSON.stringify(rowFields(type,row,localId,worldByRemote[row.project_id],entityByRemote));map.lastSyncedLocalSnapshots[key]=remoteProjection;pulled[type]++;
   }
  }
 }
 // Missing remote rows are never treated as deletions; create an explicit conflict.
 for(const type of ['worlds','entities','relationships','sources','claims']){
  const remoteIds=new Set((remoteSets[type]||[]).map(r=>r.id));
  for(const local of workspace[localTypes[type]]||[]){const key=type+':'+local.id,remoteId=map[type]?.[local.id];if(remoteId&&!remoteIds.has(remoteId)){conflicts.push({id:uuid(),type,recordId:local.id,remoteId,reason:'Previously synchronized remote row is missing or no longer visible; deletion is not propagated.',baseSnapshot:map.lastSyncedLocalSnapshots[key]||null,localSnapshot:local,remoteSnapshot:null,remoteVersion:map.lastSyncedVersions[key]||null,status:'open'})}}
 }
 if(conflicts.length){
  workspace.syncConflicts=workspace.syncConflicts||[];
  const existingByKey=new Map(workspace.syncConflicts.filter(c=>c.status==='open').map(c=>[c.type+':'+c.recordId,c]));
  for(const c of conflicts){const k=c.type+':'+c.recordId,old=existingByKey.get(k);if(old){Object.assign(old,c,{id:old.id,status:'open'});c.id=old.id}else{workspace.syncConflicts.push(c);existingByKey.set(k,c)}}
  if(workspace.syncConflicts.length>500)workspace.syncConflicts=workspace.syncConflicts.slice(-500);
  for(const c of conflicts){
   if(!c.projectId)continue;
   const values={remote_record_id:c.remoteId,base_version:map.lastSyncedVersions[c.type+':'+c.recordId]||null,remote_version:c.remoteVersion,base_snapshot:c.baseSnapshot,local_snapshot:c.localSnapshot,remote_snapshot:c.remoteSnapshot,updated_at:new Date().toISOString()};
   const prior=await db.from('sync_conflicts').update(values).eq('project_id',c.projectId).eq('record_type',c.type).eq('local_record_id',c.recordId).eq('status','open').select('id').maybeSingle();
   if(prior.error){console.warn('Conflict was retained locally; remote refresh failed.',prior.error.message);continue}
   if(prior.data){c.id=prior.data.id;}else{const ins=await db.from('sync_conflicts').insert({id:c.id,project_id:c.projectId,record_type:c.type,local_record_id:c.recordId,...values,status:'open',created_by:user.id}).select('id').single();if(ins.error){if(ins.error.code==='23505'){const existing=await db.from('sync_conflicts').select('id').eq('project_id',c.projectId).eq('record_type',c.type).eq('local_record_id',c.recordId).eq('status','open').maybeSingle();if(existing.error||!existing.data){console.warn('Conflict was retained locally but its remote identity could not be recovered.',existing.error?.message||'No open conflict row found.');continue;}c.id=existing.data.id;}else{console.warn('Conflict was retained locally but could not be stored remotely.',ins.error.message);continue;}}else if(ins.data)c.id=ins.data.id;}
  }
  saveMap(map);return {pulled, pushed:{worlds:0,entities:0,relationships:0,claims:0,sources:0},conflicts:workspace.syncConflicts.filter(c=>c.status==='open'),blocked:true,at:new Date().toISOString(),note:'Conflict resolution is required before any push; no conflicting records were overwritten.'};
 }
 // Push local-only or local-only changes after remote changes have been pulled.
 saveMap(map);
 const pushed=await syncWorkspace(workspace);
 return {pulled,pushed:pushed.synced,conflicts:[],blocked:false,at:new Date().toISOString(),note:'Bidirectional sync completed. Canon status was not promoted.'};
}
async function resolveConflict(workspace,conflictId,choice){
 const validator=root.WorldForgeDataLayer;if(!validator)throw new Error('WorldForge data validator is unavailable.');
 const conflict=(workspace.syncConflicts||[]).find(c=>c.id===conflictId&&c.status==='open');if(!conflict)throw new Error('Open conflict was not found.');
 if(!['local','remote','defer'].includes(choice))throw new Error('Unsupported conflict resolution choice.');
 const db=await client();const user=await requireUser(db);
 const table={worlds:'projects',entities:'entities',relationships:'relationships',sources:'sources',claims:'claims'}[conflict.type];
 if(!table)throw new Error('Unsupported conflict record type: '+conflict.type);
 const map=idMap(),key=conflict.type+':'+conflict.recordId;
 if(choice==='local'){
  if(!(workspace[conflict.type]||[]).some(x=>x.id===conflict.recordId))throw new Error('No local record exists to keep. Restore or recreate it through an explicit reviewed workflow.');
  if(!conflict.remoteSnapshot||!conflict.remoteId||!conflict.remoteVersion)throw new Error('Cannot keep a local record against a missing remote record without explicit recreate review.');
  const remote=await db.from(table).select('id,record_version').eq('id',conflict.remoteId).maybeSingle();if(remote.error)throw remote.error;
  if(!remote.data||remote.data.record_version!==conflict.remoteVersion)throw new Error('Remote record changed again while resolving. Run bidirectional sync to refresh the conflict.');
 }
 if(choice==='remote'&&!conflict.remoteSnapshot)throw new Error('Remote record is missing; deletion cannot be auto-accepted. Export a backup and resolve the missing record manually.');
 if(conflict.projectId){
  const patch=choice==='defer'?{status:'deferred',updated_at:new Date().toISOString()}:{status:'resolved',resolution:choice==='remote'?'keep_remote':'keep_local',updated_at:new Date().toISOString(),resolved_at:new Date().toISOString(),resolved_by:user.id};
  let persisted=await db.from('sync_conflicts').update(patch).eq('id',conflict.id).select('id').maybeSingle();
  if(persisted.error)throw persisted.error;
  if(!persisted.data){
   persisted=await db.from('sync_conflicts').update(patch).eq('project_id',conflict.projectId).eq('record_type',conflict.type).eq('local_record_id',conflict.recordId).eq('status','open').select('id').maybeSingle();
   if(persisted.error)throw persisted.error;
   if(!persisted.data)throw new Error('The persistent conflict record could not be found or updated. Local resolution was not applied.');
   conflict.id=persisted.data.id;
  }
 }
 if(choice==='defer'){
  conflict.status='deferred';conflict.deferredAt=new Date().toISOString();
  workspace.auditLog=workspace.auditLog||[];workspace.auditLog.push({id:uuid(),action:'sync-conflict-deferred',detail:conflict.type+':'+conflict.recordId,at:conflict.deferredAt});
  return {resolved:false,workspace,conflict};
 }
 if(choice==='remote'){
  setRecord(workspace,conflict.type,conflict.remoteSnapshot);
  map.lastSyncedLocalSnapshots=map.lastSyncedLocalSnapshots||{};map.lastSyncedVersions=map.lastSyncedVersions||{};map.lastSyncedHashes=map.lastSyncedHashes||{};
  map.lastSyncedLocalSnapshots[key]=validator.comparable(({worlds:'world',entities:'entity',relationships:'relationship',sources:'source',claims:'claim'}[conflict.type]||conflict.type),conflict.remoteSnapshot);
  map.lastSyncedVersions[key]=conflict.remoteVersion;map.lastSyncedHashes[key]=conflict.remotePayloadHash||map.lastSyncedHashes[key];
 }else{
  map.lastSyncedVersions=map.lastSyncedVersions||{};map.lastSyncedVersions[key]=conflict.remoteVersion;
  map.lastSyncedHashes=map.lastSyncedHashes||{};map.lastSyncedHashes[key]=conflict.remotePayloadHash;
  map.lastSyncedLocalSnapshots=map.lastSyncedLocalSnapshots||{};map.lastSyncedLocalSnapshots[key]=validator.comparable(({worlds:'world',entities:'entity',relationships:'relationship',sources:'source',claims:'claim'}[conflict.type]||conflict.type),conflict.remoteSnapshot);
 }
 conflict.status='resolved';conflict.resolution=choice==='remote'?'keep_remote':'keep_local';conflict.resolvedAt=new Date().toISOString();
 saveMap(map);
 workspace.auditLog=workspace.auditLog||[];workspace.auditLog.push({id:uuid(),action:'sync-conflict-resolved',detail:conflict.type+':'+conflict.recordId+' → '+conflict.resolution,at:conflict.resolvedAt});
 return {resolved:true,workspace,conflict};
}

root.WorldForgeSupabase=Object.freeze({configured:()=>!!(config()&&config().url&&config().publishableKey),client,signIn,signUp,signOut,session,listWorlds,syncWorkspace,syncBidirectional,resolveConflict});
})(window);
