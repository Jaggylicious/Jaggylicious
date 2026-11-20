import { useMemo } from 'react';
import type { RoundProps } from './types';
import { QuizRound } from './QuizRound';
import type { QuizItem } from '../content/quiz';
import { DEHET_ITEMS, WOORDSOORT_ITEMS, ZINSDEEL_ITEMS } from '../content/taal';
import { generateKlokGeld, generateSum, shuffle } from '../content/rekenen';
import { pickFresh } from '../core/adaptive';

/** Kies een item op het huidige niveau (meestal) of een lager niveau (herhaling). */
export function pickByLevel(items: QuizItem[], level: number, recentIds: string[]): QuizItem {
  const exact = items.filter((i) => i.level === level);
  const lower = items.filter((i) => i.level < level);
  const pool = lower.length && (Math.random() < 0.25 || !exact.length) ? lower : exact.length ? exact : items;
  const it = pickFresh(pool, recentIds);
  return { ...it, options: shuffle(it.options) };
}

function makeBankExercise(items: QuizItem[], opts?: { confirm?: boolean; topicGate?: string }) {
  return function BankExercise({ level, support, recentIds, onDone }: RoundProps) {
    const item = useMemo(() => pickByLevel(items, level, recentIds), [level, recentIds]);
    return <QuizRound key={item.id} item={item} support={support} confirm={opts?.confirm} onDone={onDone} />;
  };
}

export const DeHetExercise = makeBankExercise(DEHET_ITEMS);
export const WoordsoortExercise = makeBankExercise(WOORDSOORT_ITEMS);
export const ZinsdeelExercise = makeBankExercise(ZINSDEEL_ITEMS);

export function RekenExercise({ level, support, unlocked, recentIds, onDone }: RoundProps) {
  const item = useMemo(() => {
    let it = generateSum(level, unlocked);
    for (let i = 0; i < 5 && recentIds.includes(it.id); i++) it = generateSum(level, unlocked);
    return it;
  }, [level, unlocked, recentIds]);
  return <QuizRound key={item.id} item={item} support={support} confirm onDone={onDone} />;
}

export function KlokGeldExercise({ level, support, unlocked, recentIds, onDone }: RoundProps) {
  const item = useMemo(() => {
    let it = generateKlokGeld(level, unlocked);
    for (let i = 0; i < 5 && recentIds.includes(it.id); i++) it = generateKlokGeld(level, unlocked);
    return it;
  }, [level, unlocked, recentIds]);
  return <QuizRound key={item.id} item={item} support={support} confirm onDone={onDone} />;
}
