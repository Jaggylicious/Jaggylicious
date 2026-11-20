import { useRef } from 'react';
import { putSession } from './db';
import type { ExerciseId, SessionRecord } from './types';

export function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Houdt een sessierecord bij en schrijft het steeds weg (veilig bij afsluiten van de app). */
export function useSessionRecorder(kind: SessionRecord['kind']) {
  const ref = useRef<SessionRecord | null>(null);
  if (!ref.current) {
    ref.current = { id: newId(), kind, startedAt: Date.now(), activeSeconds: 0, exercises: [], pauses: 0, completed: false, stoppedEarly: false };
  }
  /** Na elke opdracht: tijd bijwerken en direct opslaan (ook als de app later abrupt sluit). */
  const tick = async (ex: ExerciseId, seconds: number) => {
    const s = ref.current!;
    if (s.exercises[s.exercises.length - 1] !== ex) s.exercises = [...s.exercises, ex];
    s.activeSeconds += seconds;
    s.endedAt = Date.now();
    await putSession({ ...s });
  };
  const add = async (ex: ExerciseId, activeSeconds: number, pauses: number) => {
    const s = ref.current!;
    if (s.exercises[s.exercises.length - 1] !== ex) s.exercises = [...s.exercises, ex];
    s.activeSeconds += activeSeconds;
    s.pauses += pauses;
    s.endedAt = Date.now();
    await putSession({ ...s });
  };
  const finish = async (completed: boolean, stoppedEarly: boolean, extraSeconds = 0) => {
    const s = ref.current!;
    s.completed = completed;
    s.stoppedEarly = stoppedEarly;
    s.activeSeconds += extraSeconds;
    s.endedAt = Date.now();
    await putSession({ ...s });
  };
  return { session: ref.current, add, tick, finish };
}
