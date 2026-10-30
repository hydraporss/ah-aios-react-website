(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  if(root)root.AHTheoryValidation=api;
})(typeof window!=="undefined"?window:globalThis,function(){
  const labels=new Set(["registry","synthesized"]);
  function validateTheoryCollection(input){
    const records=Array.isArray(input)?input:input&&Array.isArray(input.records)?input.records:null;
    const errors=[];
    const counts={registry:0,synthesized:0};
    if(!records){return{valid:false,errors:["Expected a JSON array or an object with a records array."],records:null,counts};}
    if(records.length!==82)errors.push("Expected exactly 82 theory records.");
    const ids=new Set();
    records.forEach((record,index)=>{
      const label="Record "+(index+1)+": ";
      if(!record||typeof record!=="object"||Array.isArray(record)){errors.push(label+"expected an object.");return;}
      if(typeof record.id!=="string"||!record.id.trim())errors.push(label+"missing a non-empty string id.");
      else if(ids.has(record.id.trim()))errors.push(label+"duplicate id "+record.id.trim()+".");
      else ids.add(record.id.trim());
      if(typeof record.title!=="string"||!record.title.trim())errors.push(label+"missing a non-empty string title.");
      const markers=[record.origin,record.collection].filter(value=>labels.has(value));
      const unique=new Set(markers);
      if(unique.size!==1){errors.push(label+"must have exactly one unambiguous registry/synthesized classification.");return;}
      counts[[...unique][0]]++;
    });
    if(counts.registry!==68)errors.push("Expected 68 registry records; found "+counts.registry+".");
    if(counts.synthesized!==14)errors.push("Expected 14 synthesized records; found "+counts.synthesized+".");
    return{valid:errors.length===0,errors,records:errors.length===0?records:null,counts};
  }
  return{validateTheoryCollection};
});
