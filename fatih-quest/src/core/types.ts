/** Gedeelde typen voor Fatih Quest. */

export type SkillId =
  | 'aandacht'
  | 'werkgeheugen'
  | 'woordenschat'
  | 'taal'
  | 'rekenen'
  | 'lezen'
  | 'emotie';

export type ExerciseId =
  | 'zoek' // A1
  | 'luister' // A2
  | 'wacht' // A3
  | 'missie' // A4
  | 'dieren' // B1
  | 'ruimtemissie' // B2 + B5
  | 'eerstlaatst' // B3
  | 'route' // B4
  | 'woorden' // C woordenschat (herhaalsysteem)
  | 'dehet' // C lidwoorden
  | 'woordsoort' // C woordsoorten
  | 'zinsdeel' // C onderwerp / persoonsvorm
  | 'rekenen' // D
  | 'verhaalsom' // D
  | 'klokgeld' // D
  | 'emotie' // E
  | 'ontdek'; // F

/**
 * Uitkomst van één opdracht (ronde). Bewust drie categorieën in plaats van goed/fout:
 * - zelfstandig: goed in één keer, zonder hint
 * - metHulp: goed na een hint, herhaling of tweede poging
 * - nogNiet: (nog) niet gelukt of overgeslagen
 */
export type Outcome = 'zelfstandig' | 'metHulp' | 'nogNiet';

export interface RoundResult {
  itemId?: string;
  correct: boolean;
  attempts: number;
  hintsUsed: number;
  replays: number;
  checked?: boolean; // heeft "Klopt mijn antwoord?" gebruikt
  skipped?: boolean;
  /** Niet meetellen voor adaptiviteit (bijv. emotie-oefening zonder goed/fout). */
  unscored?: boolean;
}

export interface AttemptRecord extends RoundResult {
  id?: number;
  exerciseId: ExerciseId;
  level: number;
  outcome: Outcome;
  timestamp: number;
  sessionId: string;
}

export interface ExerciseState {
  exerciseId: ExerciseId;
  level: number;
  /** Uitkomsten op het huidige niveau, nieuwste achteraan (max 10). */
  recent: Outcome[];
  /** Extra ondersteuning aan: voorbeelden en hints worden eerder aangeboden. */
  support: boolean;
  roundsTotal: number;
  updatedAt: number;
}

export interface SessionRecord {
  id: string;
  kind: 'missie' | 'vrij';
  startedAt: number;
  endedAt?: number;
  /** Actieve oefentijd in seconden (pauzes niet meegeteld). */
  activeSeconds: number;
  exercises: ExerciseId[];
  pauses: number;
  completed: boolean;
  stoppedEarly: boolean;
}

/** Woordkaart in het herhaalsysteem (Leitner-bakjes 1–5). */
export interface WordCard {
  wordId: string;
  box: number;
  due: number; // timestamp
  seen: number;
  correct: number;
}

export interface Settings {
  missionMinutes: number; // 6–15
  readAloud: boolean;
  reduceMotion: boolean;
  sound: boolean;
  /** Achtergrondafleiding in 'Blijf bij je missie' (optioneel). */
  allowDistraction: boolean;
  /** Door ouder vrijgegeven lesonderwerpen. */
  unlockedTopics: string[];
  /** Maximaal niveau per oefening dat de ouder toestaat (optioneel). */
  childName: string;
}

export interface Profile {
  id: 'main';
  createdAt: number;
  stars: number;
  unlockedCards: string[];
  parentPinHash?: string;
  parentPinSalt?: string;
  consentLocalStorage: boolean;
  consentGivenAt?: number;
  onboarded: boolean;
  settings: Settings;
}

export const DEFAULT_SETTINGS: Settings = {
  missionMinutes: 12,
  readAloud: true,
  reduceMotion: false,
  sound: false,
  allowDistraction: false,
  unlockedTopics: ['optellen', 'aftrekken', 'tafels-basis', 'klok-hele-halve', 'lidwoorden', 'woordsoorten-basis'],
  childName: 'Fatih',
};
