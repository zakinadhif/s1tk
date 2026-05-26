import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findCycle } from '../scripts/validate-prereqs.ts';

test('findCycle returns null for an empty graph', () => {
  assert.equal(findCycle({}), null);
});

test('findCycle returns null for a single-node graph with no prereqs', () => {
  assert.equal(findCycle({ a: [] }), null);
});

test('findCycle returns null for a linear acyclic chain', () => {
  const graph = {
    a: [],
    b: ['a'],
    c: ['b'],
    d: ['c'],
  };
  assert.equal(findCycle(graph), null);
});

test('findCycle returns null for a branching acyclic graph', () => {
  const graph = {
    a: [],
    b: ['a'],
    c: ['a'],
    d: ['b', 'c'],
  };
  assert.equal(findCycle(graph), null);
});

test('findCycle returns cycle path for a simple A→B→A loop', () => {
  const graph = { a: ['b'], b: ['a'] };
  const cycle = findCycle(graph);
  assert.notEqual(cycle, null);
  assert.ok(cycle!.includes('a'));
  assert.ok(cycle!.includes('b'));
});

test('findCycle returns cycle path for a three-node cycle A→B→C→A', () => {
  const graph = { a: ['b'], b: ['c'], c: ['a'] };
  const cycle = findCycle(graph);
  assert.notEqual(cycle, null);
  assert.ok(cycle!.length >= 3);
});

test('findCycle returns null for the seed content prereq chain', () => {
  const graph = {
    'aktivitas-1-nmosfet-dasar':    [],
    'aktivitas-2-pmosfet-simetri':  ['aktivitas-1-nmosfet-dasar'],
    'aktivitas-3-bias-q-point':     ['aktivitas-2-pmosfet-simetri'],
    'aktivitas-4-common-source':    ['aktivitas-3-bias-q-point'],
    'aktivitas-5-source-follower':  ['aktivitas-4-common-source'],
    'aktivitas-6-common-gate':      ['aktivitas-4-common-source'],
  };
  assert.equal(findCycle(graph), null);
});

test('findCycle detects deliberate cycle in seed content prereq chain', () => {
  // Aktivitas 1 prereq'd on Aktivitas 2 creates A1 → A2 → A1
  const graph = {
    'aktivitas-1-nmosfet-dasar':    ['aktivitas-2-pmosfet-simetri'],
    'aktivitas-2-pmosfet-simetri':  ['aktivitas-1-nmosfet-dasar'],
    'aktivitas-3-bias-q-point':     ['aktivitas-2-pmosfet-simetri'],
    'aktivitas-4-common-source':    ['aktivitas-3-bias-q-point'],
    'aktivitas-5-source-follower':  ['aktivitas-4-common-source'],
    'aktivitas-6-common-gate':      ['aktivitas-4-common-source'],
  };
  const cycle = findCycle(graph);
  assert.notEqual(cycle, null);
});
