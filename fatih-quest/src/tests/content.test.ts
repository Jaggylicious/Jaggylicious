import { describe, expect, it } from 'vitest';
import { WORDS, WORD_PAIRS } from '../content/words';
import { DEHET_ITEMS, WOORDSOORT_ITEMS, ZINSDEEL_ITEMS } from '../content/taal';
import { STORY_PROBLEMS } from '../content/verhaalsommen';
import { SCENARIOS, STRATEGIES } from '../content/emoties';
import { TOPICS } from '../content/ontdek';
import { CARDS } from '../content/kaarten';
import type { QuizItem } from '../content/quiz';

function checkQuiz(items: QuizItem[]) {
  const ids = new Set<string>();
  for (const it of items) {
    expect(ids.has(it.id), `dubbel id ${it.id}`).toBe(false);
    ids.add(it.id);
    expect(it.options, it.id).toContain(it.answer);
    expect(new Set(it.options).size, `dubbele opties ${it.id}`).toBe(it.options.length);
    expect(it.hint.length).toBeGreaterThan(5);
    expect(it.explain.length).toBeGreaterThan(3);
  }
}

describe('inhoud – minimaal 30 opgaven per educatieve module', () => {
  it('woordenschat: ≥30 woorden + synoniemen', () => {
    expect(WORDS.length + WORD_PAIRS.length).toBeGreaterThanOrEqual(30);
    expect(WORDS.length).toBeGreaterThanOrEqual(30);
    for (const w of WORDS) {
      expect(w.sentence.toLowerCase(), w.id).toContain(w.word.toLowerCase());
      expect(w.meaning.length).toBeGreaterThan(5);
    }
    expect(new Set(WORDS.map((w) => w.id)).size).toBe(WORDS.length);
    for (const p of WORD_PAIRS) expect(p.distractors).not.toContain(p.answer);
  });
  it('taal: lidwoorden, woordsoorten, zinsdelen ≥30 elk en consistent', () => {
    for (const bank of [DEHET_ITEMS, WOORDSOORT_ITEMS, ZINSDEEL_ITEMS]) {
      expect(bank.length).toBeGreaterThanOrEqual(30);
      checkQuiz(bank);
      expect(new Set(bank.map((b) => b.level)).size).toBeGreaterThanOrEqual(3);
    }
  });
  it('woordsoorten: gemarkeerd woord staat in de zin', () => {
    for (const it of WOORDSOORT_ITEMS) {
      const m = it.body!.match(/\[([^\]]+)\]/);
      expect(m, it.id).not.toBeNull();
      expect(it.prompt).toContain(m![1]);
    }
  });
  it('zinsdelen: antwoord komt letterlijk voor in de zin', () => {
    for (const it of ZINSDEEL_ITEMS) expect(it.body, it.id).toContain(it.answer);
  });
  it('verhaalsommen: ≥30 en de som klopt met het antwoord', () => {
    expect(STORY_PROBLEMS.length).toBeGreaterThanOrEqual(30);
    for (const p of STORY_PROBLEMS) {
      const [a, op, b] = p.sum.split(' ');
      const x = Number(a), y = Number(b);
      const v = op === '+' ? x + y : op === '−' ? x - y : op === '×' ? x * y : x / y;
      expect(v, p.id).toBe(p.answer);
      expect(p.question.endsWith('?')).toBe(true);
      for (const s of p.sentences) expect(s.endsWith('?')).toBe(false);
    }
  });
  it('emoties: situaties verwijzen naar bestaande strategieën', () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(10);
    for (const s of SCENARIOS) {
      expect(s.helpful.length).toBeGreaterThanOrEqual(2);
      for (const h of s.helpful) expect(STRATEGIES[h], `${s.id}:${h}`).toBeDefined();
    }
  });
  it('ontdekverhalen: elk 3 vragen met geldig antwoord en uitleg van woorden', () => {
    expect(TOPICS.length).toBeGreaterThanOrEqual(9);
    for (const t of TOPICS) {
      expect(t.questions).toHaveLength(3);
      expect(t.words.length).toBeGreaterThanOrEqual(1);
      for (const q of t.questions) expect(q.options).toContain(q.answer);
    }
  });
  it('kaarten: oplopende kosten, geen kansmechanisme', () => {
    for (let i = 1; i < CARDS.length; i++) expect(CARDS[i].cost).toBeGreaterThan(CARDS[i - 1].cost);
  });
});

describe('inhoud – geen onbewezen claims', () => {
  it('bevat geen claims over IQ/ADHD-verbetering in kindteksten', () => {
    const all = JSON.stringify([WORDS, DEHET_ITEMS, WOORDSOORT_ITEMS, ZINSDEEL_ITEMS, STORY_PROBLEMS, SCENARIOS, TOPICS, CARDS]);
    expect(all).not.toMatch(/\bIQ\b|ADHD|intelligent(er)?|werkgeheugen (verbetert|groeit)/i);
  });
});
