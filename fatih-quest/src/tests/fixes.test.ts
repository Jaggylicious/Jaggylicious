import { describe, expect, it, beforeEach } from 'vitest';
import { planMission } from '../core/mission';
import { isExerciseAvailable, isTopicAvailable } from '../core/availability';
import { lockRemainingMs, registerFail, registerSuccess } from '../core/lockout';
import { weeklyMinutes } from '../core/analytics';
import { DEHET_ITEMS, ZINSDEEL_ITEMS } from '../content/taal';
import { DEFAULT_SETTINGS } from '../core/types';

describe('vrijgave van lesonderwerpen', () => {
  it('standaard: persoonsvorm dicht, de/het open', () => {
    expect(isExerciseAvailable('zinsdeel', DEFAULT_SETTINGS.unlockedTopics)).toBe(false);
    expect(isExerciseAvailable('dehet', DEFAULT_SETTINGS.unlockedTopics)).toBe(true);
    expect(isExerciseAvailable('rekenen', [])).toBe(true);
  });
  it('dagmissie plant nooit een dichtgezette oefening (60 dagen)', () => {
    for (let d = 0; d < 60; d++) {
      const plan = planMission(12, new Date(2026, 0, 1 + d), DEFAULT_SETTINGS.unlockedTopics);
      for (const b of plan.blocks) if (b.exerciseId) expect(isExerciseAvailable(b.exerciseId, DEFAULT_SETTINGS.unlockedTopics)).toBe(true);
    }
  });
  it('onderwerp-items volgen de vrijgave', () => {
    expect(DEHET_ITEMS.every((i) => isTopicAvailable(i.topic, ['lidwoorden']))).toBe(true);
    expect(ZINSDEEL_ITEMS.some((i) => isTopicAvailable(i.topic, []))).toBe(false);
  });
});

describe('pincode-blokkade', () => {
  beforeEach(() => registerSuccess());
  it('blokkeert na 5 fouten en verdubbelt daarna', () => {
    const t = 1_000_000;
    for (let i = 0; i < 4; i++) expect(registerFail(t)).toBe(0);
    expect(registerFail(t)).toBe(30_000);
    expect(lockRemainingMs(t)).toBe(30_000);
    for (let i = 0; i < 4; i++) registerFail(t + 40_000);
    expect(registerFail(t + 40_000)).toBe(60_000);
  });
  it('succes reset alles', () => {
    for (let i = 0; i < 5; i++) registerFail(0);
    registerSuccess();
    expect(lockRemainingMs(0)).toBe(0);
  });
});

describe('weken rond zomertijd', () => {
  it('weekgrenzen vallen op maandag 00:00, ook over de klokwissel heen', () => {
    const now = new Date(2026, 3, 8, 12).getTime(); // april, na zomertijd
    const w = weeklyMinutes([], 6, now);
    for (const b of w) {
      const d = new Date(b.start);
      expect(d.getDay()).toBe(1);
      expect(d.getHours()).toBe(0);
    }
  });
});
