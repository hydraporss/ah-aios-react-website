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
function workflow(v){const x=String(v||'Draft').toLowerCase().replaceAll(' ','_');if(['approved','rejected','superseded'].includes(x))throw new Error('Governance terminal states require a separate authorized review action.');return ({proposed:'Proposed',investigating:'Investigated',needs_evidence:'Needs Evidence',validated:'Validated',draft:'Draft'})[x]||'Draft'}
async function requireUser(db){const {data,error}=await db.auth.getUser();if(error)throw error;if(!data.user)throw new Error('Sign in to use the shared WorldForge workspace.');return data.user}
async function signIn(email,password){const db=await client();const r=await db.auth.signInWithPassword({email,password});if(r.error)throw r.error;return r.data.user}
async function signUp(email,password){const db=await client();const r=await db.auth.signUp({email,password});if(r.error)throw r.error;return {user:r.data.user,session:r.data.session,confirmationRequired:!r.data.session}}
async function signOut(){const db=await client();const r=await db.auth.signOut();if(r.error)throw r.error}
async function session(){const db=await client();const r=await db.auth.getSession();if(r.error)throw r.error;return r.data.session}
async function listWorlds(){const db=await client();await requireUser(db);const r=await db.from('projects').select('id,slug,name,description,governance_state,record_version,updated_at').order('created_at');if(r.error)throw r.error;return r.data}
async function syncWorkspace(workspace){
 const validator=root.WorldForgeDataLayer;if(!validator)throw new Error('WorldForge data validator is unavailable.');
 const report=validator.validateWorkspace(workspace);if(!report.valid)throw new Error('Local workspace failed integrity checks: '+report.errors.slice(0,4).map(x=>x.code).join(', '));
 const db=await client(),user=await requireUser(db),map=idMap();
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
     map.lastSyncedVersions[key]=data.record_version||1;map.lastSyncedHashes[key]=payloadHash;synced[type]++;return data;
   }
   const last=map.lastSyncedVersions[key];
   if(last===undefined||existing.record_version!==last){conflicts.push({type,id:local.id,reason:'Remote revision changed since last sync.'});return null}
   if(map.lastSyncedHashes[key]===payloadHash){synced[type]++;return existing}
   const next={...fields,record_version:existing.record_version+1};
   delete next.canon_status;delete next.governance_state;delete next.owner_id;delete next.created_by;
   const {data,error}=await db.from(table).update(next).eq('id',remoteId).eq('record_version',existing.record_version).select('id,record_version').maybeSingle();
   if(error)throw error;
   if(!data){conflicts.push({type,id:local.id,reason:'Optimistic concurrency check failed.'});return null}
   map.lastSyncedVersions[key]=data.record_version;map.lastSyncedHashes[key]=payloadHash;synced[type]++;return data;
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
root.WorldForgeSupabase=Object.freeze({configured:()=>!!(config()&&config().url&&config().publishableKey),client,signIn,signUp,signOut,session,listWorlds,syncWorkspace});
})(window);
