import { describe, expect, it } from 'vitest';
import { checkMission, generateMission, targetCells } from '../exercises/ruimteLogic';
import { makeRoute } from '../exercises/geheugen';
import { planMission } from '../core/mission';
import { hashPin, isValidPin, makeSalt, verifyPin } from '../core/pin';
import { starFor } from '../core/session';

describe('ruimtemissie', () => {
  it('targetCells respecteert de randen', () => {
    expect(targetCells('naast', 0, 3)).toEqual([1]);
    expect(targetCells('boven', 1, 3)).toEqual([]);
    expect(targetCells('onder', 1, 3)).toEqual([4]);
  });
  it('gegenereerde missies zijn altijd oplosbaar', () => {
    for (let level = 1; level <= 4; level++) {
      for (let i = 0; i < 100; i++) {
        const m = generateMission(level);
        const placed: Record<string, number> = {};
        const taken = new Set(m.anchors.map((a) => a.cell));
        for (const s of m.steps) {
          const a = m.anchors.find((x) => x.thing.id === s.anchor.id)!;
          const c = targetCells(s.relation, a.cell, m.size).find((x) => !taken.has(x));
          expect(c).toBeDefined();
          placed[s.thing.id] = c!;
          taken.add(c!);
        }
        expect(checkMission(m, placed).allOk).toBe(true);
      }
    }
  });
  it('een afleider op het bord is niet goed', () => {
    const m = generateMission(2);
    const extra = m.tray.find((t) => !m.steps.some((s) => s.thing.id === t.id));
    if (extra) expect(checkMission(m, { [extra.id]: 0 }).allOk).toBe(false);
  });
});

describe('route', () => {
  it('maakt aaneengesloten routes zonder herhaling', () => {
    for (let i = 0; i < 100; i++) {
      const p = makeRoute(4, 5);
      expect(p).toHaveLength(6);
      expect(new Set(p).size).toBe(6);
      for (let j = 1; j < p.length; j++) {
        const d = Math.abs(p[j] - p[j - 1]);
        expect(d === 1 || d === 4).toBe(true);
      }
    }
  });
});

describe('dagelijkse missie', () => {
  it('telt op tot de ingestelde duur en clampt 6–15', () => {
    for (const m of [6, 9, 12, 15]) {
      const plan = planMission(m, new Date(2026, 10, 20));
      expect(plan.blocks.reduce((s, b) => s + b.seconds, 0)).toBe(m * 60);
      expect(plan.blocks.filter((b) => b.kind === 'oefening')).toHaveLength(3);
    }
    expect(planMission(30).blocks.reduce((s, b) => s + b.seconds, 0)).toBe(15 * 60);
    expect(planMission(1).blocks.reduce((s, b) => s + b.seconds, 0)).toBe(6 * 60);
  });
  it('rouleert oefeningen per dag', () => {
    const a = planMission(12, new Date(2026, 10, 20)).blocks[1].exerciseId;
    const b = planMission(12, new Date(2026, 10, 21)).blocks[1].exerciseId;
    expect(a).not.toBe(b);
  });
});

describe('pincode', () => {
  it('hash en verificatie', async () => {
    const salt = makeSalt();
    const h = await hashPin('1234', salt);
    expect(h).not.toContain('1234');
    expect(await verifyPin('1234', salt, h)).toBe(true);
    expect(await verifyPin('4321', salt, h)).toBe(false);
  });
  it('validatie', () => {
    expect(isValidPin('123')).toBe(false);
    expect(isValidPin('1234')).toBe(true);
    expect(isValidPin('12a4')).toBe(false);
  });
});

describe('sterren', () => {
  it('beloont opnieuw proberen, controleren en hulp – niet alleen goed', () => {
    expect(starFor({ correct: true, attempts: 2, hintsUsed: 0, replays: 0 })).toMatch(/opnieuw/);
    expect(starFor({ correct: true, attempts: 1, hintsUsed: 0, replays: 0, checked: true })).toMatch(/controleerde/);
    expect(starFor({ correct: true, attempts: 1, hintsUsed: 1, replays: 0 })).toMatch(/tip/);
    expect(starFor({ correct: false, attempts: 2, hintsUsed: 0, replays: 0 })).toMatch(/proberen/);
    expect(starFor({ correct: false, attempts: 1, hintsUsed: 0, replays: 0 })).toBeNull();
  });
});
