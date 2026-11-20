/**
 * Herhaalsysteem voor woorden (Leitner, 5 bakjes).
 * - Zelfstandig goed  -> een bakje hoger (langer wachten tot herhaling)
 * - Goed met hulp     -> zelfde bakje, morgen opnieuw
 * - Nog niet          -> terug naar bakje 1, later in dezelfde sessie / morgen
 */
import type { Outcome, WordCard } from './types';

const DAY = 24 * 60 * 60 * 1000;
export const BOX_INTERVAL_DAYS = [0, 1, 2, 4, 7, 14]; // index = bakje

export function newCard(wordId: string, now = Date.now()): WordCard {
  return { wordId, box: 1, due: now, seen: 0, correct: 0 };
}

export function reviewCard(card: WordCard, outcome: Outcome, now = Date.now()): WordCard {
  let box = card.box;
  if (outcome === 'zelfstandig') box = Math.min(5, box + 1);
  else if (outcome === 'nogNiet') box = 1;
  const days = outcome === 'nogNiet' ? 0 : outcome === 'metHulp' ? 1 : BOX_INTERVAL_DAYS[box];
  const due = outcome === 'nogNiet' ? now + 10 * 60 * 1000 : now + days * DAY;
  return {
    ...card,
    box,
    due,
    seen: card.seen + 1,
    correct: card.correct + (outcome === 'nogNiet' ? 0 : 1),
  };
}

/**
 * Kiest het volgende woord: eerst woorden die aan de beurt zijn (laagste bakje eerst),
 * daarna nieuwe woorden (max `maxNew` nieuwe per sessie), anders het minst recent geziene.
 */
export function chooseNextWord(
  allIds: string[],
  cards: Record<string, WordCard>,
  now: number,
  newIntroduced: number,
  maxNew = 3,
  exclude: string[] = [],
): { wordId: string; isNew: boolean } {
  const ex = new Set(exclude);
  const due = Object.values(cards)
    .filter((c) => c.due <= now && !ex.has(c.wordId) && allIds.includes(c.wordId))
    .sort((a, b) => a.box - b.box || a.due - b.due);
  if (due.length) return { wordId: due[0].wordId, isNew: false };
  const unseen = allIds.filter((id) => !cards[id] && !ex.has(id));
  if (unseen.length && newIntroduced < maxNew) return { wordId: unseen[0], isNew: true };
  const known = Object.values(cards)
    .filter((c) => !ex.has(c.wordId) && allIds.includes(c.wordId))
    .sort((a, b) => a.due - b.due);
  if (known.length) return { wordId: known[0].wordId, isNew: false };
  const any = allIds.find((id) => !ex.has(id)) ?? allIds[0];
  return { wordId: any, isNew: !cards[any] };
}
