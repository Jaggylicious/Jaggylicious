import { describe, expect, it } from 'vitest';
import { exerciseStats, recommendations, skillTrends, weeklyMinutes } from '../core/analytics';
import type { AttemptRecord, Outcome } from '../core/types';
import { initialState } from '../core/adaptive';

const att = (exerciseId: AttemptRecord['exerciseId'], outcome: Outcome, t: number, level = 1): AttemptRecord => ({
  exerciseId, outcome, level, timestamp: t, sessionId: 's', correct: outcome !== 'nogNiet', attempts: 1, hintsUsed: outcome === 'metHulp' ? 1 : 0, replays: 0,
});

describe('analyse voor ouders', () => {
  it('onderscheidt beheersing en zelfstandigheid', () => {
    const s = exerciseStats([att('dehet', 'zelfstandig', 1), att('dehet', 'metHulp', 2), att('dehet', 'nogNiet', 3), att('dehet', 'metHulp', 4)])[0];
    expect(s.mastery).toBe(0.75);
    expect(s.independence).toBe(0.25);
    expect(s.hintRate).toBe(0.5);
  });
  it('trend vergelijkt alleen met eigen eerdere rondes', () => {
    const list = [
      ...Array.from({ length: 6 }, (_, i) => att('rekenen', 'nogNiet', i)),
      ...Array.from({ length: 6 }, (_, i) => att('rekenen', 'zelfstandig', 10 + i, 2)),
    ];
    const t = skillTrends(list)[0];
    expect(t.progressing).toBe(true);
  });
  it('te weinig data geeft geen conclusie', () => {
    expect(skillTrends([att('rekenen', 'zelfstandig', 1)])[0].earlier).toBeNull();
  });
  it('weekminuten', () => {
    const now = new Date(2026, 10, 20, 12).getTime();
    const w = weeklyMinutes([{ id: 'a', kind: 'missie', startedAt: now - 1000, activeSeconds: 600, exercises: [], pauses: 0, completed: true, stoppedEarly: false }], 4, now);
    expect(w).toHaveLength(4);
    expect(w[3].minutes).toBe(10);
  });
  it('aanbevelingen zijn neutraal en zonder diagnoses', () => {
    const attempts = Array.from({ length: 12 }, (_, i) => att('dehet', 'zelfstandig', i, 3));
    const recs = recommendations(exerciseStats(attempts), [{ ...initialState('dehet'), level: 3 }], [{ id: 'a', kind: 'missie', startedAt: Date.now(), activeSeconds: 600, exercises: [], pauses: 0, completed: true, stoppedEarly: false }], 'Fatih');
    expect(recs.join(' ')).toMatch(/beheerst de meeste oefeningen/);
    expect(recs.join(' ')).not.toMatch(/ADHD|IQ|werkgeheugen is verbeterd|%/);
  });
});
