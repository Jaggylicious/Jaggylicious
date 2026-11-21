/**
 * Adaptief leersysteem – bewust eenvoudig en uitlegbaar.
 *
 * Regels (zie ook README.md, sectie 'Adaptieve oefenlogica'):
 * 1. Elke ronde krijgt een uitkomst: zelfstandig, metHulp of nogNiet.
 * 2. OMHOOG: minstens 5 rondes op dit niveau gespeeld én van de laatste 5 rondes
 *    zijn er minstens 4 zelfstandig gelukt. (Meerdere succesvolle oefenmomenten.)
 * 3. OMLAAG: van de laatste 4 rondes zijn er minstens 3 'nogNiet'.
 *    Eén fout leidt dus NOOIT tot een lager niveau.
 * 4. ONDERSTEUNING: als van de laatste 4 rondes er minstens 2 niet zelfstandig waren,
 *    gaat 'support' aan (voorbeeld + hint eerder zichtbaar). Gaat uit na
 *    3 zelfstandige rondes op rij.
 * 5. Na een niveauwijziging begint de telling opnieuw, zodat het kind eerst
 *    kan wennen aan het nieuwe niveau.
 */
import type { ExerciseId, ExerciseState, Outcome, RoundResult } from './types';

export const MAX_LEVEL: Record<ExerciseId, number> = {
  zoek: 5,
  luister: 4,
  wacht: 4,
  missie: 4,
  dieren: 5,
  ruimtemissie: 4,
  eerstlaatst: 4,
  route: 5,
  woorden: 4,
  dehet: 3,
  woordsoort: 3,
  zinsdeel: 3,
  rekenen: 6,
  verhaalsom: 3,
  klokgeld: 4,
  emotie: 1,
  ontdek: 1,
};

export const UP_WINDOW = 5;
export const UP_NEEDED = 4;
export const DOWN_WINDOW = 4;
export const DOWN_NEEDED = 3;
export const RECENT_MAX = 10;

export function outcomeOf(r: RoundResult): Outcome {
  if (!r.correct || r.skipped) return 'nogNiet';
  if (r.attempts <= 1 && r.hintsUsed === 0 && r.replays === 0) return 'zelfstandig';
  return 'metHulp';
}

export function initialState(exerciseId: ExerciseId, now = Date.now()): ExerciseState {
  return { exerciseId, level: 1, recent: [], support: false, roundsTotal: 0, updatedAt: now };
}

export type LevelChange = 'omhoog' | 'omlaag' | null;

export interface UpdateResult {
  state: ExerciseState;
  change: LevelChange;
}

export function updateState(
  prev: ExerciseState,
  outcome: Outcome,
  now = Date.now(),
): UpdateResult {
  const max = MAX_LEVEL[prev.exerciseId] ?? 1;
  const recent = [...prev.recent, outcome].slice(-RECENT_MAX);
  let level = prev.level;
  let change: LevelChange = null;

  const lastUp = recent.slice(-UP_WINDOW);
  const lastDown = recent.slice(-DOWN_WINDOW);
  const count = (arr: Outcome[], o: Outcome) => arr.filter((x) => x === o).length;

  if (recent.length >= UP_WINDOW && count(lastUp, 'zelfstandig') >= UP_NEEDED && level < max) {
    level += 1;
    change = 'omhoog';
  } else if (
    lastDown.length >= DOWN_WINDOW &&
    count(lastDown, 'nogNiet') >= DOWN_NEEDED &&
    level > 1
  ) {
    level -= 1;
    change = 'omlaag';
  }

  let support = prev.support;
  const notIndependent = lastDown.filter((o) => o !== 'zelfstandig').length;
  if (lastDown.length >= 2 && notIndependent >= 2) support = true;
  const last3 = recent.slice(-3);
  if (last3.length === 3 && last3.every((o) => o === 'zelfstandig')) support = false;
  if (change === 'omlaag') support = true;
  if (change === 'omhoog') support = false;

  return {
    state: {
      ...prev,
      level,
      recent: change ? [] : recent,
      support,
      roundsTotal: prev.roundsTotal + 1,
      updatedAt: now,
    },
    change,
  };
}

/** Uitleg in gewone taal voor de ouder. */
export function explainState(s: ExerciseState): string {
  const max = MAX_LEVEL[s.exerciseId];
  const z = s.recent.filter((o) => o === 'zelfstandig').length;
  const parts = [`Niveau ${s.level} van ${max}.`];
  if (s.recent.length) parts.push(`Laatste ${s.recent.length} rondes op dit niveau: ${z} zelfstandig gelukt.`);
  if (s.support) parts.push('Extra ondersteuning staat aan (voorbeelden en hints komen eerder).');
  if (s.level < max)
    parts.push(`Volgende niveau: als 4 van de 5 rondes zelfstandig lukken.`);
  else parts.push('Hoogste niveau bereikt.');
  return parts.join(' ');
}

/**
 * Kiest een item uit een lijst en vermijdt recent gebruikte items,
 * zodat Fatih niet steeds dezelfde opdracht krijgt.
 */
export function pickFresh<T extends { id: string }>(
  items: T[],
  recentIds: string[],
  rand: () => number = Math.random,
): T {
  if (items.length === 0) throw new Error('Geen items om uit te kiezen');
  const avoid = new Set(recentIds.slice(-Math.max(1, Math.floor(items.length * 0.7))));
  const fresh = items.filter((i) => !avoid.has(i.id));
  const pool = fresh.length ? fresh : items;
  return pool[Math.floor(rand() * pool.length)];
}
