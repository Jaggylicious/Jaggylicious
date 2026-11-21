/**
 * Welke oefeningen en items beschikbaar zijn, op basis van de door de ouder vrijgegeven onderwerpen.
 */
import type { ExerciseId } from './types';

/** Oefeningen die volledig afhangen van één vrij te geven onderwerp. */
export const EXERCISE_GATE: Partial<Record<ExerciseId, string>> = {
  dehet: 'lidwoorden',
  woordsoort: 'woordsoorten-basis',
  zinsdeel: 'persoonsvorm',
  verhaalsom: 'verhaalsommen',
};

/** Itemonderwerpen die onder een vrij te geven onderwerp vallen. */
export const TOPIC_GATE: Record<string, string> = {
  lidwoorden: 'lidwoorden',
  'woordsoorten-basis': 'woordsoorten-basis',
  persoonsvorm: 'persoonsvorm',
  onderwerp: 'persoonsvorm',
};

export function isExerciseAvailable(id: ExerciseId, unlocked: string[]): boolean {
  const gate = EXERCISE_GATE[id];
  return !gate || unlocked.includes(gate);
}

export function isTopicAvailable(topic: string | undefined, unlocked: string[]): boolean {
  if (!topic) return true;
  const gate = TOPIC_GATE[topic];
  return !gate || unlocked.includes(gate);
}
