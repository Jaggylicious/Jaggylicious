/** Registreert rondes: opslaan, adaptief niveau bijwerken, sterren bepalen. */
import { addAttempt, getState, putState } from './db';
import { outcomeOf, updateState, type LevelChange } from './adaptive';
import type { ExerciseId, ExerciseState, RoundResult } from './types';

export interface RoundOutcome {
  state: ExerciseState;
  change: LevelChange;
  star: boolean;
  starReason: string | null;
}

/** Sterren belonen inzet en strategie, niet alleen goede antwoorden. */
export function starFor(r: RoundResult): string | null {
  if (r.unscored) return 'Je dacht goed na over gevoelens.';
  if (r.correct && r.attempts > 1) return 'Je probeerde het opnieuw.';
  if (r.correct && r.checked) return 'Je controleerde rustig je antwoord.';
  if (r.correct && r.hintsUsed > 0) return 'Je gebruikte slim een tip.';
  if (r.correct) return 'Opdracht gelukt.';
  if (r.attempts > 1) return 'Je bleef het proberen.';
  return null;
}

export async function recordRound(
  exerciseId: ExerciseId,
  level: number,
  r: RoundResult,
  sessionId: string,
): Promise<RoundOutcome> {
  const outcome = outcomeOf(r);
  await addAttempt({ ...r, exerciseId, level, outcome, timestamp: Date.now(), sessionId });
  const prev = await getState(exerciseId);
  if (r.unscored) {
    const s = { ...prev, roundsTotal: prev.roundsTotal + 1, updatedAt: Date.now() };
    await putState(s);
    const reason = starFor(r);
    return { state: s, change: null, star: !!reason, starReason: reason };
  }
  const { state, change } = updateState(prev, outcome);
  await putState(state);
  const reason = starFor(r);
  return { state, change, star: !!reason, starReason: reason };
}
