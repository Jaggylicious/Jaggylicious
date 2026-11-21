/**
 * Dagelijkse missie: rustig starten → aandacht → werkgeheugen → taal/rekenen → afsluiting.
 * De verdeling schaalt mee met de door de ouder ingestelde duur (6–15 minuten).
 * Oefeningen rouleren per dag zodat het afwisselend blijft.
 */
import type { ExerciseId } from './types';
import { isExerciseAvailable } from './availability';

export type BlockKind = 'start' | 'oefening' | 'afsluiting';

export interface MissionBlock {
  kind: BlockKind;
  exerciseId?: ExerciseId;
  title: string;
  subtitle: string;
  seconds: number;
}

export interface MissionPlan {
  theme: 'ruimte' | 'natuur';
  title: string;
  blocks: MissionBlock[];
}

const ATTENTION: ExerciseId[] = ['zoek', 'luister', 'wacht', 'missie'];
const MEMORY: ExerciseId[] = ['dieren', 'route', 'ruimtemissie', 'eerstlaatst'];
const LEARN: ExerciseId[] = ['woorden', 'rekenen', 'dehet', 'klokgeld', 'woorden', 'verhaalsom', 'zinsdeel', 'rekenen', 'woordsoort'];

const TITLES: Record<ExerciseId, string> = {
  zoek: 'Zoek de juiste planeet',
  luister: 'Luister naar de missieleider',
  wacht: 'Wacht op het startsignaal',
  missie: 'Blijf bij je missie',
  dieren: 'Onthoud de dieren',
  route: 'Onthoud de sterrenroute',
  ruimtemissie: 'Voer de ruimtemissie uit',
  eerstlaatst: 'Wat kwam eerst?',
  woorden: 'Ontdek nieuwe woorden',
  rekenen: 'Rekenraket',
  dehet: 'De of het?',
  klokgeld: 'Klok en geld',
  verhaalsom: 'Verhaalsommen',
  zinsdeel: 'Zinnen ontleden',
  woordsoort: 'Woordsoorten',
  emotie: 'Gevoelens ontdekken',
  ontdek: 'Ontdekverhaal',
};

const SUB: Partial<Record<ExerciseId, string>> = {
  zoek: 'Concentratie en aandacht oefenen',
  luister: 'Goed luisteren oefenen',
  wacht: 'Rustig handelen oefenen',
  missie: 'Bij je taak blijven',
  dieren: 'Volgorde onthouden',
  route: 'Instructies in stappen uitvoeren',
  ruimtemissie: 'Instructies in stappen uitvoeren',
  eerstlaatst: 'Volgorde onthouden',
};

export function dayIndex(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
}

export function planMission(minutes: number, date = new Date(), unlocked?: string[]): MissionPlan {
  const m = Math.min(15, Math.max(6, Math.round(minutes)));
  const total = m * 60;
  const d = dayIndex(date);
  const start = Math.round(total * (2 / 12));
  const end = Math.max(45, Math.round(total * (1 / 12)));
  const rest = total - start - end;
  const att = Math.round(rest * 0.33);
  const mem = Math.round(rest * 0.33);
  const learn = rest - att - mem;
  const a = ATTENTION[d % ATTENTION.length];
  const w = MEMORY[d % MEMORY.length];
  const learn_ = unlocked ? LEARN.filter((x) => isExerciseAvailable(x, unlocked)) : LEARN;
  const l = learn_[d % learn_.length];
  const theme = d % 2 === 0 ? 'ruimte' : 'natuur';
  return {
    theme,
    title: theme === 'ruimte' ? 'Ontdek de ruimte' : 'Ontdek de natuur',
    blocks: [
      { kind: 'start', title: 'Klaar voor vertrek', subtitle: 'Rustig starten en de opdracht bekijken', seconds: start },
      { kind: 'oefening', exerciseId: a, title: TITLES[a], subtitle: SUB[a] ?? '', seconds: att },
      { kind: 'oefening', exerciseId: w, title: TITLES[w], subtitle: SUB[w] ?? '', seconds: mem },
      { kind: 'oefening', exerciseId: l, title: TITLES[l], subtitle: l === 'woorden' ? 'Woordenschat en begrijpend lezen' : 'Taal of rekenen oefenen', seconds: learn },
      { kind: 'afsluiting', title: 'Missie voltooid', subtitle: 'Terugkijken op wat je hebt gedaan', seconds: end },
    ],
  };
}
