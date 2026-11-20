import { describe, expect, it } from 'vitest';
import { initialState, outcomeOf, pickFresh, updateState, MAX_LEVEL } from '../core/adaptive';
import type { ExerciseState, Outcome } from '../core/types';

const run = (s: ExerciseState, outcomes: Outcome[]) => outcomes.reduce((st, o) => updateState(st, o).state, s);

describe('outcomeOf', () => {
  it('zelfstandig bij eerste poging zonder hulp', () => {
    expect(outcomeOf({ correct: true, attempts: 1, hintsUsed: 0, replays: 0 })).toBe('zelfstandig');
  });
  it('metHulp bij hint, herhaling of tweede poging', () => {
    expect(outcomeOf({ correct: true, attempts: 1, hintsUsed: 1, replays: 0 })).toBe('metHulp');
    expect(outcomeOf({ correct: true, attempts: 2, hintsUsed: 0, replays: 0 })).toBe('metHulp');
    expect(outcomeOf({ correct: true, attempts: 1, hintsUsed: 0, replays: 1 })).toBe('metHulp');
  });
  it('nogNiet bij niet gelukt of overgeslagen', () => {
    expect(outcomeOf({ correct: false, attempts: 2, hintsUsed: 0, replays: 0 })).toBe('nogNiet');
    expect(outcomeOf({ correct: true, attempts: 1, hintsUsed: 0, replays: 0, skipped: true })).toBe('nogNiet');
  });
});

describe('updateState', () => {
  it('gaat niet omhoog na slechts enkele successen', () => {
    const s = run(initialState('rekenen'), ['zelfstandig', 'zelfstandig', 'zelfstandig', 'zelfstandig']);
    expect(s.level).toBe(1);
  });
  it('gaat omhoog na 4 van 5 zelfstandig', () => {
    const s = run(initialState('rekenen'), ['zelfstandig', 'metHulp', 'zelfstandig', 'zelfstandig', 'zelfstandig']);
    expect(s.level).toBe(2);
    expect(s.recent).toEqual([]); // telling begint opnieuw
  });
  it('één fout verlaagt het niveau nooit', () => {
    let s: ExerciseState = { ...initialState('rekenen'), level: 3 };
    s = run(s, ['zelfstandig', 'nogNiet', 'zelfstandig']);
    expect(s.level).toBe(3);
    s = run({ ...initialState('rekenen'), level: 3 }, ['nogNiet']);
    expect(s.level).toBe(3);
  });
  it('twee fouten op rij verlagen ook nog niet', () => {
    const s = run({ ...initialState('rekenen'), level: 3 }, ['nogNiet', 'nogNiet']);
    expect(s.level).toBe(3);
  });
  it('verlaagt pas na 3 van 4 keer nogNiet en zet ondersteuning aan', () => {
    const s = run({ ...initialState('rekenen'), level: 3 }, ['nogNiet', 'zelfstandig', 'nogNiet', 'nogNiet']);
    expect(s.level).toBe(2);
    expect(s.support).toBe(true);
  });
  it('gaat nooit onder niveau 1 of boven het maximum', () => {
    expect(run(initialState('dehet'), Array(8).fill('nogNiet')).level).toBe(1);
    const top = run(initialState('dehet'), Array(40).fill('zelfstandig'));
    expect(top.level).toBe(MAX_LEVEL.dehet);
  });
  it('ondersteuning gaat aan bij herhaald hulp nodig en uit na 3 zelfstandig', () => {
    let s = run(initialState('woorden'), ['metHulp', 'metHulp']);
    expect(s.support).toBe(true);
    s = run(s, ['zelfstandig', 'zelfstandig', 'zelfstandig']);
    expect(s.support).toBe(false);
  });
  it('met hulp telt niet als reden om het niveau te verlagen', () => {
    const s = run({ ...initialState('rekenen'), level: 2 }, Array(10).fill('metHulp'));
    expect(s.level).toBe(2);
  });
  it('telt rondes', () => {
    expect(run(initialState('zoek'), ['zelfstandig', 'nogNiet']).roundsTotal).toBe(2);
  });
});

describe('pickFresh', () => {
  it('vermijdt recent gebruikte items', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
    for (let i = 0; i < 50; i++) {
      const p = pickFresh(items, ['a', 'b']);
      expect(['c', 'd']).toContain(p.id);
    }
  });
  it('valt terug op alle items als alles recent is', () => {
    expect(['a']).toContain(pickFresh([{ id: 'a' }], ['a']).id);
  });
});
