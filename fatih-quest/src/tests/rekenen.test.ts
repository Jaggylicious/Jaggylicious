import { describe, expect, it } from 'vitest';
import { formatEuro, generateKlokGeld, generateSum, numberOptions, timeToDutch, REKEN_TOPICS, RELEASABLE_TOPICS } from '../content/rekenen';

function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}
const ALL = RELEASABLE_TOPICS;

function evalSum(body: string) {
  const [a, op, b] = body.replace(' = ?', '').split(' ');
  const x = Number(a), y = Number(b);
  return op === '+' ? x + y : op === '−' ? x - y : op === '×' ? x * y : x / y;
}

describe('rekenopgaven', () => {
  it('genereert correcte sommen op alle niveaus (500x)', () => {
    const r = seeded(42);
    for (let i = 0; i < 500; i++) {
      const level = (i % 6) + 1;
      const it = generateSum(level, ALL, r);
      expect(it.options).toContain(it.answer);
      expect(new Set(it.options).size).toBe(it.options.length);
      for (const o of it.options) expect(Number(o)).toBeGreaterThanOrEqual(0);
      if (it.body && it.body.includes('=')) {
        const v = evalSum(it.body);
        expect(Number.isInteger(v), it.body).toBe(true);
        expect(String(v)).toBe(it.answer);
        expect(v).toBeGreaterThanOrEqual(0);
      }
    }
  });
  it('blijft binnen groep 5-bereik per niveau', () => {
    const r = seeded(7);
    for (let i = 0; i < 200; i++) {
      const it = generateSum(1, ALL, r);
      expect(Number(it.answer)).toBeLessThanOrEqual(20);
      const it2 = generateSum(3, ALL, r);
      expect(Number(it2.answer)).toBeLessThanOrEqual(100);
    }
  });
  it('respecteert vrijgegeven onderwerpen: zonder delen geen deelsommen', () => {
    const r = seeded(3);
    for (let i = 0; i < 200; i++) {
      const it = generateSum(5, ['optellen', 'aftrekken', 'tafels-basis'], r);
      expect(it.body).not.toContain(':');
      expect(['optellen', 'aftrekken', 'tafels-basis']).toContain(it.topic);
    }
  });
  it('elk niveau heeft onderwerpen', () => {
    for (let l = 1; l <= 6; l++) expect(REKEN_TOPICS[l].length).toBeGreaterThan(0);
  });
  it('afleiders zijn uniek en bevatten het antwoord', () => {
    const r = seeded(9);
    for (let a = 0; a < 50; a++) {
      const o = numberOptions(a, r);
      expect(o).toContain(String(a));
      expect(new Set(o).size).toBe(4);
    }
  });
});

describe('klok en geld', () => {
  it('Nederlandse tijdnotatie', () => {
    expect(timeToDutch(3, 0)).toBe('drie uur');
    expect(timeToDutch(3, 30)).toBe('half vier');
    expect(timeToDutch(3, 15)).toBe('kwart over drie');
    expect(timeToDutch(3, 45)).toBe('kwart voor vier');
    expect(timeToDutch(12, 30)).toBe('half één');
    expect(timeToDutch(11, 30)).toBe('half twaalf');
  });
  it('geld wordt goed opgeteld en geformatteerd', () => {
    expect(formatEuro(135)).toBe('€ 1,35');
    expect(formatEuro(5)).toBe('€ 0,05');
    const r = seeded(11);
    for (let i = 0; i < 100; i++) {
      const it = generateKlokGeld(4, ALL, r);
      expect(it.options).toContain(it.answer);
      expect(new Set(it.options).size).toBe(it.options.length);
      if (it.render?.kind === 'geld') expect(it.answer).toBe(formatEuro(it.render.coins.reduce((a, b) => a + b, 0)));
    }
  });
  it('niveau 3 zonder vrijgave van kwartieren geeft alleen hele/halve uren', () => {
    const r = seeded(5);
    for (let i = 0; i < 100; i++) {
      const it = generateKlokGeld(3, ['klok-hele-halve'], r);
      expect(it.answer).not.toMatch(/kwart/);
    }
  });
});
