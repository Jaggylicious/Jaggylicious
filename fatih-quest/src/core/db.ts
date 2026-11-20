/**
 * Lokale opslag in IndexedDB. Er gaat niets naar een server.
 */
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type {
  AttemptRecord,
  ExerciseId,
  ExerciseState,
  Profile,
  SessionRecord,
  WordCard,
} from './types';
import { DEFAULT_SETTINGS } from './types';
import { initialState } from './adaptive';

interface FQSchema extends DBSchema {
  profile: { key: string; value: Profile };
  attempts: {
    key: number;
    value: AttemptRecord;
    indexes: { byExercise: string; byTime: number };
  };
  states: { key: string; value: ExerciseState };
  sessions: { key: string; value: SessionRecord; indexes: { byStart: number } };
  words: { key: string; value: WordCard };
}

export const DB_NAME = 'fatih-quest';
let dbPromise: Promise<IDBPDatabase<FQSchema>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<FQSchema>(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore('profile', { keyPath: 'id' });
        const a = db.createObjectStore('attempts', { keyPath: 'id', autoIncrement: true });
        a.createIndex('byExercise', 'exerciseId');
        a.createIndex('byTime', 'timestamp');
        db.createObjectStore('states', { keyPath: 'exerciseId' });
        const s = db.createObjectStore('sessions', { keyPath: 'id' });
        s.createIndex('byStart', 'startedAt');
        db.createObjectStore('words', { keyPath: 'wordId' });
      },
    });
  }
  return dbPromise;
}

/** Alleen voor tests. */
export function resetDBConnection() {
  dbPromise = null;
}

export function defaultProfile(now = Date.now()): Profile {
  return {
    id: 'main',
    createdAt: now,
    stars: 0,
    unlockedCards: [],
    consentLocalStorage: false,
    onboarded: false,
    settings: { ...DEFAULT_SETTINGS },
  };
}

export async function loadProfile(): Promise<Profile> {
  const db = await getDB();
  const p = await db.get('profile', 'main');
  if (p) return { ...defaultProfile(), ...p, settings: { ...DEFAULT_SETTINGS, ...p.settings } };
  return defaultProfile();
}

export async function saveProfile(p: Profile) {
  const db = await getDB();
  await db.put('profile', p);
}

export async function getState(id: ExerciseId): Promise<ExerciseState> {
  const db = await getDB();
  return (await db.get('states', id)) ?? initialState(id);
}

export async function putState(s: ExerciseState) {
  const db = await getDB();
  await db.put('states', s);
}

export async function allStates(): Promise<ExerciseState[]> {
  const db = await getDB();
  return db.getAll('states');
}

export async function addAttempt(a: AttemptRecord) {
  const db = await getDB();
  await db.add('attempts', a);
}

export async function allAttempts(): Promise<AttemptRecord[]> {
  const db = await getDB();
  return db.getAll('attempts');
}

export async function recentItemIds(exerciseId: ExerciseId, n = 15): Promise<string[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex('attempts', 'byExercise', exerciseId);
  return all
    .slice(-n)
    .map((a) => a.itemId)
    .filter((x): x is string => !!x);
}

export async function putSession(s: SessionRecord) {
  const db = await getDB();
  await db.put('sessions', s);
}

export async function allSessions(): Promise<SessionRecord[]> {
  const db = await getDB();
  return db.getAllFromIndex('sessions', 'byStart');
}

export async function allWordCards(): Promise<Record<string, WordCard>> {
  const db = await getDB();
  const all = await db.getAll('words');
  return Object.fromEntries(all.map((c) => [c.wordId, c]));
}

export async function putWordCard(c: WordCard) {
  const db = await getDB();
  await db.put('words', c);
}

export interface ExportBundle {
  app: 'fatih-quest';
  version: 1;
  exportedAt: string;
  profile: Omit<Profile, 'parentPinHash' | 'parentPinSalt'>;
  states: ExerciseState[];
  sessions: SessionRecord[];
  attempts: AttemptRecord[];
  words: WordCard[];
}

export async function exportAll(): Promise<ExportBundle> {
  const db = await getDB();
  const p = await loadProfile();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { parentPinHash: _h, parentPinSalt: _s, ...profile } = p;
  return {
    app: 'fatih-quest',
    version: 1,
    exportedAt: new Date().toISOString(),
    profile,
    states: await db.getAll('states'),
    sessions: await db.getAll('sessions'),
    attempts: await db.getAll('attempts'),
    words: await db.getAll('words'),
  };
}

/** Verwijdert alle oefengegevens. Met keepProfile blijven pincode en instellingen bewaard. */
export async function deleteAll(keepProfile = false) {
  const db = await getDB();
  const stores = ['attempts', 'states', 'sessions', 'words'] as const;
  for (const s of stores) await db.clear(s);
  if (keepProfile) {
    const p = await loadProfile();
    await saveProfile({ ...p, stars: 0, unlockedCards: [] });
  } else {
    await db.clear('profile');
  }
}
