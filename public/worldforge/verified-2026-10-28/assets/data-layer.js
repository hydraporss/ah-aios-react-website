/* WorldForge data-layer primitives. Loaded as a classic script; no framework dependency. */
(function (root) {
  'use strict';
  const CURRENT_PACKAGE_VERSION = '1.0.0';
  const CURRENT_SCHEMA_VERSION = '1.0.0';
  const WORKFLOW = new Set(['proposed','investigating','needs_evidence','validated','approved','rejected','superseded']);
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
    const result = {packageType:'ah-aios-worldforge',schemaVersion:CURRENT_PACKAGE_VERSION,exportedAt:source.exportedAt || null,worlds:[],entities:[],relationships:[],claims:[],sources:source.sources || [],evidence:source.evidence || [],auditLog:Array.isArray(source.auditLog)?source.auditLog:[],migrationHistory:Array.isArray(source.migrationHistory)?source.migrationHistory:[]};
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
    result.migrationHistory.push({from,to:CURRENT_PACKAGE_VERSION,migratedAt:new Date().toISOString(),strategy:'preserve-record-identities-and-governance-status'});
    const check = validateWorkspace(result);
    if (!check.valid) throw new Error('Migrated workspace failed integrity validation: '+check.errors.map(e=>e.code+' at '+e.path).join(', '));
    return result;
  }
  function makeRevision(previous, next, actor, reason) {
    if (!previous || !next || previous.id !== next.id) throw new Error('Revision must preserve the record ID.');
    const expected = Number(previous.version || 1);
    return {...clone(next),id:previous.id,version:expected+1,updatedAt:new Date().toISOString(),updatedBy:actor || 'system',revisionReason:reason || ''};
  }
  root.WorldForgeDataLayer = Object.freeze({CURRENT_PACKAGE_VERSION,CURRENT_SCHEMA_VERSION,validateWorkspace,migrateWorkspace,makeRevision});
})(typeof window !== 'undefined' ? window : globalThis);
