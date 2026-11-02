const test = require('node:test');
const assert = require('node:assert');
const AH = require('./site-data.js');

test('13 workbench modules in 5 groups with unique ids', () => {
  assert.strictEqual(AH.modules.length, 13);
  assert.strictEqual(new Set(AH.modules.map(m => m.group)).size, 5);
  assert.strictEqual(new Set(AH.modules.map(m => m.id)).size, 13);
  AH.modules.forEach(m => assert.ok(m.name && m.purpose && m.functions.length >= 4, m.name));
});
test('nine layers and nine roadmap phases', () => {
  assert.strictEqual(AH.layers.length, 9);
  assert.strictEqual(AH.road.length, 9);
  assert.strictEqual(AH.life.length, 12);
});
test('every transition target is a known state', () => {
  const all = [...AH.states.primary, ...AH.states.intermediate, ...AH.states.terminal];
  assert.deepStrictEqual(Object.keys(AH.transitions).sort(), [...all].sort());
  Object.values(AH.transitions).flat().forEach(t => assert.ok(all.includes(t), t));
  AH.states.terminal.forEach(s => assert.strictEqual(AH.transitions[s].length, 0));
});
test('invalid transitions are rejected', () => {
  assert.strictEqual(AH.canTransition('PROPOSED', 'RUNNING', []).ok, false);
  assert.strictEqual(AH.canTransition('FAILED', 'RUNNING', []).ok, false);
  assert.strictEqual(AH.canTransition('NOPE', 'RUNNING', []).ok, false);
  assert.strictEqual(AH.canTransition('PROPOSED', 'VALIDATED', []).ok, true);
});
test('SUCCEEDED requires all six verification outcomes', () => {
  assert.strictEqual(AH.outcomes.length, 6);
  assert.strictEqual(AH.canTransition('RUNNING', 'SUCCEEDED', []).ok, false);
  assert.strictEqual(AH.canTransition('RUNNING', 'SUCCEEDED', [true, true, true, true, true, false]).ok, false);
  assert.strictEqual(AH.canTransition('RUNNING', 'SUCCEEDED', [true, true, true, true, true, true]).ok, true);
});
