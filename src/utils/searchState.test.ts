import test from 'node:test';
import assert from 'node:assert/strict';
import { searchState, levenshteinDistance } from './searchState';

test('levenshteinDistance computes edit distance correctly', () => {
  assert.equal(levenshteinDistance('TX', 'TX'), 0);
  assert.equal(levenshteinDistance('TX', 'TY'), 1);
  assert.equal(levenshteinDistance('CAL', 'CA'), 1);
  assert.equal(levenshteinDistance('Texas', 'Texaz'), 1);
});

test('exact abbreviation lookup works for standard states', () => {
  const resTX = searchState('TX');
  assert.equal(resTX.matchType, 'exact_code');
  assert.equal(resTX.state?.id, 'TX');
  assert.equal(resTX.state?.name, 'Texas');

  const resCA = searchState('ca');
  assert.equal(resCA.matchType, 'exact_code');
  assert.equal(resCA.state?.id, 'CA');
  assert.equal(resCA.state?.name, 'California');

  const resIL = searchState('IL');
  assert.equal(resIL.matchType, 'exact_code');
  assert.equal(resIL.state?.id, 'IL');
  assert.equal(resIL.state?.capital, 'Springfield');
});

test('Wyoming-W alias matches Wyoming per user specification', () => {
  const resW = searchState('W');
  assert.equal(resW.state?.id, 'WY');
  assert.equal(resW.state?.name, 'Wyoming');

  const resWY = searchState('WY');
  assert.equal(resWY.matchType, 'exact_code');
  assert.equal(resWY.state?.id, 'WY');
});

test('Territories are supported (PR, GU, VI, MP, AS, TT)', () => {
  const resPR = searchState('PR');
  assert.equal(resPR.state?.name, 'Puerto Rico');

  const resGU = searchState('GU');
  assert.equal(resGU.state?.name, 'Guam');

  const resTT = searchState('TT');
  assert.equal(resTT.state?.name, 'Trust Territories');
});

test('Full state name queries match correctly', () => {
  const res = searchState('california');
  assert.equal(res.matchType, 'exact_name');
  assert.equal(res.state?.id, 'CA');
});

test('Typo handling detects error and returns closest correct state', () => {
  // Common typo CAL -> California CA
  const resCAL = searchState('CAL');
  assert.equal(resCAL.matchType, 'fuzzy');
  assert.equal(resCAL.state?.id, 'CA');

  // Common typo TEX -> Texas TX
  const resTEX = searchState('TEX');
  assert.equal(resTEX.matchType, 'fuzzy');
  assert.equal(resTEX.state?.id, 'TX');

  // Typo in 2-letter abbreviation e.g. "TI" -> "TX" or similar
  const resTI = searchState('TI');
  assert.ok(resTI.state !== null);
  assert.equal(resTI.matchType, 'fuzzy');
});

test('Empty query returns none', () => {
  const res = searchState('');
  assert.equal(res.matchType, 'none');
  assert.equal(res.state, null);
});
