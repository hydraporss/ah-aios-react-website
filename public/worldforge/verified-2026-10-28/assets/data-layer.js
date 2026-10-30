/* WorldForge data-layer primitives. Loaded as a classic script; no framework dependency. */
(function (root) {
  'use strict';
  const CURRENT_PACKAGE_VERSION = '1.0.0';
  const CURRENT_SCHEMA_VERSION = '1.0.0';
  const WORKFLOW = new Set(['draft','proposed','investigating','needs_evidence','validated','approved','rejected','superseded']);
  const CANON = new Set(['not_canon','verify_under_review','canon_aligned_interpretation','approved_visualization','established_canon']);
  const EVIDENCE = new Set(['unknown','unsupported','partially_supported','supported','contradicted','mixed']);
  const clone = value => JSON.parse(JSON.stringify(value));
  const allRecords = workspace => ['worlds','entities','relationships','claims','sources','evidence'].flatMap(type => (workspace[type] || []).map(record => ({ type, record })));
  function validateWorkspace(workspace) {
    const errors = [], warnings = [];
    if (!workspace || typeof workspace !== 'object' || Array.isArray(workspace)) return { valid:false, errors:[{code:'INVALID_PACKAGE',path:'$',message:'Package must be a JSON object.'}], warnings };
    if (workspace.packageType !== 'ah-aios-worldforge') errors.push({code:'PACKAGE_TYPE',path:'packageType',message:'Unsupported package type.'});
    if (!['0.1.0','1.0.0'].includes(String(workspace.schemaVersion || ''))) errors.push({code:'SCHEMA_VERSION',path:'schemaVersion',message:'Unsupported workspace schema version.'});
    const seen = new Map();
    for (const type of ['worlds','entities','relationships','claims','sources','evidence']) {
      if (workspace[type] !== undefined && !Array.isArray(workspace[type])) { errors.push({code:'EXPECTED_ARRAY',path:type,message:type+' must be an array.'}); continue; }
      for (const [i, r] of (workspace[type] || []).entries()) {
        const path = type + '[' + i + ']';
        if (!r || typeof r !== 'object' || typeof r.id !== 'string' || !r.id.trim()) { errors.push({code:'MISSING_ID',path,message:'Record requires a stable non-empty id.'}); continue; }
        if (seen.has(r.id)) errors.push({code:'DUPLICATE_ID',path:path+'.id',message:'ID also appears at '+seen.get(r.id)+'.'});
        else seen.set(r.id,path);
        if (r.workflowStatus && !WORKFLOW.has(String(r.workflowStatus).toLowerCase().replaceAll(' ','_'))) errors.push({code:'UNKNOWN_WORKFLOW_STATUS',path:path+'.workflowStatus',message:'Unknown workflow status.'});
        if (r.canonStatus && !CANON.has(String(r.canonStatus).toLowerCase().replaceAll(' ','_'))) errors.push({code:'UNKNOWN_CANON_STATUS',path:path+'.canonStatus',message:'Unknown canon status.'});
        if (r.evidenceState && !EVIDENCE.has(String(r.evidenceState).toLowerCase().replaceAll(' ','_'))) errors.push({code:'UNKNOWN_EVIDENCE_STATE',path:path+'.evidenceState',message:'Unknown evidence state.'});
      }
    }
    const worlds = new Set((workspace.worlds || []).map(x => x.id));
    const entities = new Map((workspace.entities || []).map(x => [x.id,x]));
    for (const [i,e] of (workspace.entities || []).entries()) if (e.worldId && !worlds.has(e.worldId)) errors.push({code:'MISSING_WORLD',path:'entities['+i+'].worldId',message:'Entity world reference does not resolve.'});
    const edgeKeys = new Set();
    for (const [i,r] of (workspace.relationships || []).entries()) {
      const path = 'relationships['+i+']';
      const a = entities.get(r.sourceId), b = entities.get(r.targetId);
      if (!a) errors.push({code:'DANGLING_SOURCE',path:path+'.sourceId',message:'Relationship source entity does not resolve.'});
      if (!b) errors.push({code:'DANGLING_TARGET',path:path+'.targetId',message:'Relationship target entity does not resolve.'});
      if (a && b && a.worldId !== b.worldId && !r.allowCrossWorld) errors.push({code:'CROSS_WORLD_EDGE',path,message:'Cross-world relationship requires explicit allowCrossWorld and justification.'});
      if (a && b && a.id === b.id && !r.allowSelfLink) errors.push({code:'SELF_LINK',path,message:'Self-links are not allowed for this relationship.'});
      const key = [r.sourceId,r.targetId,r.type || r.relationshipType].join('|');
      if (edgeKeys.has(key)) errors.push({code:'DUPLICATE_EDGE',path,message:'Duplicate relationship edge.'});
      edgeKeys.add(key);
    }
    for (const [i,c] of (workspace.claims || []).entries()) {
      if (!c.sourceRef && !(c.sourceRefs || []).length && !(c.sourceName || '').trim()) warnings.push({code:'MISSING_PROVENANCE',path:'claims['+i+']',message:'Claim has no recorded source provenance.'});
    }
    return {valid:errors.length===0,errors,warnings,checkedAt:new Date().toISOString(),schemaVersion:CURRENT_SCHEMA_VERSION};
  }
  function migrateWorkspace(input) {
    const source = clone(input);
    if (!source || source.packageType !== 'ah-aios-worldforge') throw new Error('Unsupported WorldForge package.');
    const from = String(source.schemaVersion || '0.1.0');
    if (!['0.1.0','1.0.0'].includes(from)) throw new Error('Unsupported schema version: '+from);
    const result = {...source,packageType:'ah-aios-worldforge',schemaVersion:CURRENT_PACKAGE_VERSION,exportedAt:source.exportedAt || null,worlds:[],entities:[],relationships:[],claims:[],sources:source.sources || [],evidence:source.evidence || [],auditLog:Array.isArray(source.auditLog)?source.auditLog:[],versionHistory:Array.isArray(source.versionHistory)?source.versionHistory:[],migrationHistory:Array.isArray(source.migrationHistory)?source.migrationHistory:[]};
    for (const key of ['worlds','entities','relationships','claims','sources','evidence']) {
      result[key] = Array.isArray(source[key]) ? source[key].map(record => {
        const r = {...record};
        r.version = Number.isInteger(r.version) && r.version > 0 ? r.version : 1;
        if (r.workflowStatus) r.workflowStatus = String(r.workflowStatus).toLowerCase().replaceAll(' ','_');
        if (r.canonStatus) r.canonStatus = String(r.canonStatus).toLowerCase().replaceAll(' ','_');
        if (r.evidenceState) r.evidenceState = String(r.evidenceState).toLowerCase().replaceAll(' ','_');
        return r;
      }) : [];
    }
    if(from!==CURRENT_PACKAGE_VERSION)result.migrationHistory.push({from,to:CURRENT_PACKAGE_VERSION,migratedAt:new Date().toISOString(),strategy:'preserve-record-identities-and-governance-status'});
    const check = validateWorkspace(result);
    if (!check.valid) throw new Error('Migrated workspace failed integrity validation: '+check.errors.map(e=>e.code+' at '+e.path).join(', '));
    return result;
  }
  function makeRevision(previous, next, actor, reason) {
    if (!previous || !next || previous.id !== next.id) throw new Error('Revision must preserve the record ID.');
    const expected = Number(previous.version || 1);
    return {...clone(next),id:previous.id,version:expected+1,updatedAt:new Date().toISOString(),updatedBy:actor || 'system',revisionReason:reason || ''};
  }

  let schemaValidatorPromise = null;
  const SCHEMA_BASE = new URL('../../schemas/v1/', root.location ? root.location.href : 'http://localhost/worldforge/verified-2026-10-28/studio.html');
  function stable(value) {
    if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
    if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k)+':'+stable(value[k])).join(',') + '}';
    return JSON.stringify(value);
  }
  function comparable(type, record) {
    const copy = clone(record || {});
    for (const key of ['version','record_version','updatedAt','updated_at','createdAt','created_at','remoteId','created_by','updated_by','canonStatus','canon_status','lastSyncedAt']) delete copy[key];
    copy.recordType = type;
    return copy;
  }
  function classifyConflict(base, local, remote) {
    if (!base) return { state: local && remote ? 'conflict' : local ? 'local_only' : remote ? 'remote_only' : 'unchanged' };
    const baseHash = stable(base), localHash = stable(local), remoteHash = stable(remote);
    const localChanged = localHash !== baseHash, remoteChanged = remoteHash !== baseHash;
    return { state: localChanged && remoteChanged ? 'conflict' : localChanged ? 'push' : remoteChanged ? 'pull' : 'unchanged', localChanged, remoteChanged };
  }
  function toCanonicalRecord(type, r, workspace) {
    const now = r.updatedAt || r.updated_at || new Date().toISOString();
    const created = r.createdAt || r.created_at || now;
    const id = String(r.id || '');
    const worldId = r.worldId || r.world_id || null;
    const common = { id, record_type:type, schema_version:'1.0.0', world_id:worldId, created_at:created, updated_at:now, created_by:String(r.createdBy || r.created_by || 'local:browser'), updated_by:String(r.updatedBy || r.updated_by || 'local:browser'), record_version:Number(r.version || r.record_version || 1), workflow_status:String(r.workflowStatus || r.workflow_status || 'proposed').toLowerCase().replaceAll(' ','_'), source_refs:Array.isArray(r.sourceRefs)?r.sourceRefs:(Array.isArray(r.source_refs)?r.source_refs:[]) };
    if (r.canonStatus || r.canon_status) common.canon_status=String(r.canonStatus||r.canon_status).toLowerCase().replaceAll(' ','_');
    if (type==='world') return {...common,world_id:null,name:String(r.name||''),description:String(r.description||''),status:['active','draft','archived','retired'].includes(String(r.status||'active').toLowerCase())?String(r.status||'active').toLowerCase():'active',metadata:r.metadata||{}};
    if (type==='entity') {
      const kind=String(r.type||r.entityType||r.entity_type||'other').toLowerCase();
      return {...common,name:String(r.name||''),entity_type:['person','civilization','place','object','organization','concept','species','technology','other'].includes(kind)?kind:'other',description:String(r.description||''),identity_notes:String(r.identity||r.identity_notes||''),attributes:r.attributes||{}};
    }
    if (type==='relationship') { const sourceId=String(r.sourceId||r.source_id||''),targetId=String(r.targetId||r.target_id||''),source=(workspace.entities||[]).find(x=>x.id===sourceId),target=(workspace.entities||[]).find(x=>x.id===targetId),relationWorld=worldId||(source&&source.worldId)||(target&&target.worldId)||null; return {...common,world_id:relationWorld,source_id:sourceId,target_id:targetId,relationship_type:String(r.type||r.relationshipType||r.relationship_type||'Related to'),directionality:r.directionality==='symmetric'?'symmetric':'directed',context:String(r.context||''),allow_self_link:!!r.allowSelfLink,allow_cycle:!!r.allowCycle}; }
    if (type==='claim') {
      const raw=String(r.type||r.claimType||r.claim_type||'interpretation').toLowerCase().replaceAll(' ','_');
      const claimType=['observation','fact_assertion','inference','interpretation','hypothesis','proposal'].includes(raw)?raw:'interpretation';
      const ev=String(r.evidenceState||r.evidence_state||'unknown').toLowerCase().replaceAll(' ','_');
      return {...common,world_id:worldId,statement:String(r.statement||r.title||''),claim_type:claimType,evidence_refs:Array.isArray(r.evidenceRefs)?r.evidenceRefs:[],evidence_state:['unknown','unsupported','partially_supported','supported','contradicted','mixed'].includes(ev)?ev:'unknown',canon_status:common.canon_status||'not_canon',uncertainty:String(r.uncertainty||''),contradiction_refs:Array.isArray(r.contradictionRefs)?r.contradictionRefs:[],reviewer_refs:Array.isArray(r.reviewerRefs)?r.reviewerRefs:[]};
    }
    if (type==='source') {
      const raw=String(r.type||r.sourceType||r.source_type||'document').toLowerCase();
      const sourceType=['document','conversation','image','audio','video','webpage','book','dataset','other'].includes(raw)?raw:'other';
      const out={...common,world_id:worldId,title:String(r.name||r.title||''),source_type:sourceType,origin_locator:String(r.reference||r.uri||r.origin_locator||''),attribution:String(r.attribution||''),access_classification:'unknown'};
      if (r.contentHash || r.content_hash) out.content_hash=String(r.contentHash||r.content_hash);
      return out;
    }
    if (type==='evidence') return {...common,world_id:worldId,claim_id:String(r.claimId||r.claim_id||''),source_id:String(r.sourceId||r.source_id||''),relation:['supports','contradicts','qualifies','contextualizes'].includes(r.relation)?r.relation:'contextualizes',locator:String(r.locator||''),excerpt:String(r.excerpt||''),review_state:['unreviewed','reviewed','disputed','unavailable'].includes(r.reviewState)?r.reviewState:'unreviewed'};
    return {...common};
  }
  async function loadSchemaValidator() {
    if (schemaValidatorPromise) return schemaValidatorPromise;
    schemaValidatorPromise = (async () => {
      const [ajvModule, formatsModule] = await Promise.all([
        import('https://esm.sh/ajv@8.17.1/dist/2020?bundle'),
        import('https://esm.sh/ajv-formats@3.0.1?bundle')
      ]);
      const Ajv2020 = ajvModule.default;
      const addFormats = formatsModule.default;
      const ajv = new Ajv2020({allErrors:true,strict:false,validateFormats:true,loadSchema:undefined});
      addFormats(ajv);
      const names=['common.schema.json','world.schema.json','entity.schema.json','relationship.schema.json','claim.schema.json','source.schema.json','evidence.schema.json','manifest.schema.json'];
      for (const name of names) {
        const response=await fetch(new URL(name,SCHEMA_BASE),{cache:'force-cache'});
        if(!response.ok)throw new Error('Could not load JSON Schema '+name+' ('+response.status+').');
        const schema=await response.json();
        ajv.addSchema(schema,schema.$id);
      }
      const compiled={};
      for (const type of ['world','entity','relationship','claim','source','evidence']) {
        compiled[type]=ajv.getSchema('https://hydraporss.github.io/ah-aios-react-website/schemas/v1/'+type+'.schema.json');
        if(!compiled[type])throw new Error('Schema compiler did not register '+type+'.');
      }
      compiled.manifest=ajv.getSchema('https://hydraporss.github.io/ah-aios-react-website/schemas/v1/manifest.schema.json');
      return {ajv,compiled};
    })();
    try { return await schemaValidatorPromise; } catch (e) { schemaValidatorPromise=null; throw e; }
  }
  async function validateWorkspaceSchemas(workspace) {
    const structure=validateWorkspace(workspace), errors=structure.errors.map(e=>({...e,validator:'integrity'})), warnings=structure.warnings.map(e=>({...e,validator:'integrity'}));
    if(errors.length) return {valid:false,errors,warnings,checkedAt:new Date().toISOString(),schemaVersion:CURRENT_SCHEMA_VERSION};
    const {compiled}=await loadSchemaValidator();
    const types={world:'worlds',entity:'entities',relationship:'relationships',claim:'claims',source:'sources',evidence:'evidence'};
    for(const [type,key] of Object.entries(types)) {
      for(const [index,record] of (workspace[key]||[]).entries()) {
        const canonical=toCanonicalRecord(type,record,workspace), validator=compiled[type];
        if(!validator(canonical)) for(const err of (validator.errors||[])) errors.push({code:'JSON_SCHEMA_INVALID',path:key+'['+index+']'+(err.instancePath||''),message:(err.keyword||'schema')+': '+err.message,validator:'json-schema',schema:type});
      }
    }
    const manifest={package_type:'ah-aios-worldforge',schema_version:String(workspace.schemaVersion||CURRENT_PACKAGE_VERSION),exported_at:workspace.exportedAt||new Date().toISOString(),record_counts:{worlds:(workspace.worlds||[]).length,entities:(workspace.entities||[]).length,relationships:(workspace.relationships||[]).length,claims:(workspace.claims||[]).length,sources:(workspace.sources||[]).length,evidence:(workspace.evidence||[]).length}};
    if(compiled.manifest&&!compiled.manifest(manifest))for(const err of compiled.manifest.errors||[])errors.push({code:'MANIFEST_SCHEMA_INVALID',path:'manifest'+(err.instancePath||''),message:(err.keyword||'schema')+': '+err.message,validator:'json-schema',schema:'manifest'});
    return {valid:errors.length===0,errors,warnings,checkedAt:new Date().toISOString(),schemaVersion:CURRENT_SCHEMA_VERSION};
  }

  root.WorldForgeDataLayer = Object.freeze({CURRENT_PACKAGE_VERSION,CURRENT_SCHEMA_VERSION,validateWorkspace,validateWorkspaceSchemas,migrateWorkspace,makeRevision,stable,comparable,classifyConflict,toCanonicalRecord});
})(typeof window !== 'undefined' ? window : globalThis);
