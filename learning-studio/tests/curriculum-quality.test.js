import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source=fs.readFileSync(new URL("../curriculum-data.js",import.meta.url),"utf8");
const json=source.replace(/^\s*window\.AH_LEARNING_CURRICULUM\s*=\s*/,"").split(";\n\n// Expose")[0];
const curriculum=JSON.parse(json);
const lessons=curriculum.courses.flatMap(course=>course.lessons);
const authored=lessons.filter(lesson=>lesson.content);
const specified=lessons.filter(lesson=>!lesson.content);
const required=["status","purpose","outcomes","prerequisites","sourceBase","explanation","workedExample","guidedPractice","independentExercise","knowledgeCheck","assessmentEvidence","feedback","safetyBoundary","references","reviewStatus"];

test("curriculum preserves the 24-course / 96-lesson source structure",()=>{
  assert.equal(curriculum.source.documentId,"AH-LEARN-MASTER-001");
  assert.equal(curriculum.source.status,"SUGGESTION / PROCESS");
  assert.equal(curriculum.courses.length,24);
  assert.equal(lessons.length,96);
  assert.deepEqual(Object.fromEntries([...new Set(curriculum.courses.map(c=>c.domain))].map(domain=>[domain,curriculum.courses.filter(c=>c.domain===domain).length])),{
    "AH-AIOS Core":6,"AI Harness":7,"WorldForge":8,"Human Stewardship":3
  });
  assert.ok(curriculum.courses.every(course=>course.lessons.length===4));
});

test("course and lesson identifiers are unique within their defined scope",()=>{
  const courseIds=curriculum.courses.map(course=>course.id);
  assert.equal(new Set(courseIds).size,courseIds.length);
  const lessonKeys=curriculum.courses.flatMap(course=>course.lessons.map(lesson=>course.id+"/"+lesson.id));
  assert.equal(new Set(lessonKeys).size,lessonKeys.length);
});

test("authored lesson drafts contain the complete instructional record",()=>{
  assert.equal(authored.length,20);
  assert.equal(specified.length,76);
  for(const lesson of authored){
    assert.equal(lesson.status,"Authored draft",lesson.id);
    const content=lesson.content;
    for(const key of required)assert.ok(Object.hasOwn(content,key),"missing "+key+" in "+lesson.id);
    assert.equal(content.status,"Authored draft");
    assert.equal(content.reviewStatus,"Not reviewed");
    for(const key of ["outcomes","prerequisites","sourceBase","guidedPractice","references"])assert.ok(Array.isArray(content[key])&&content[key].length>0,lesson.id+" requires "+key);
    assert.ok(content.explanation.trim().length>100,lesson.id+" explanation is too short");
    assert.ok(content.workedExample&&content.workedExample.title&&content.workedExample.steps.length>=3,lesson.id+" worked example incomplete");
    assert.ok(content.independentExercise&&content.independentExercise.instructions&&content.independentExercise.deliverables.length>=2,lesson.id+" independent exercise incomplete");
    assert.ok(content.knowledgeCheck.length>=1,lesson.id+" needs at least one knowledge check with rationale");
    for(const check of content.knowledgeCheck){
      assert.ok(check.question&&check.rationale);
      assert.ok(Array.isArray(check.options)&&check.options.length>=2);
      assert.ok(Number.isInteger(check.answer)&&check.answer>=0&&check.answer<check.options.length);
    }
  }
});

test("specified-only lessons and unpublished status are not silently promoted",()=>{
  for(const lesson of specified){
    assert.equal(lesson.status,"Specified",lesson.id);
    assert.equal(lesson.content,undefined,lesson.id);
  }
  for(const course of curriculum.courses){
    assert.notEqual(course.publicationStatus,"Published",course.id);
    assert.ok(["Not published",undefined].includes(course.publicationStatus),course.id);
  }
  assert.ok(authored.every(lesson=>lesson.content.reviewStatus==="Not reviewed"));
});

test("AH-CORE-140 drafts cite the current NIST assessment and audit references",()=>{
  const course=curriculum.courses.find(item=>item.id==="AH-CORE-140");
  assert.ok(course);
  assert.deepEqual(course.lessons.map(lesson=>lesson.id),["M1.1","M1.2","M1.3","M1.4"]);
  for(const id of ["NIST-800-53-R5","NIST-800-53A-R5","NIST-800-92","NIST-LOG-MGMT-PROJECT"]){
    assert.ok(curriculum.sourceCatalog.some(source=>source.id===id),"missing source "+id);
    assert.ok(course.sourceRefs.includes(id),"course does not reference "+id);
  }
});
