import type { ExerciseId, SkillId } from './types';

export interface ExerciseMeta {
  id: ExerciseId;
  title: string;
  childGoal: string; // korte uitleg voor het kind
  emoji: string;
  skill: SkillId;
  world: 'concentratie' | 'geheugen' | 'taal' | 'rekenen' | 'emotie' | 'ontdek';
  /** Aantal rondes bij vrij spelen. */
  freeRounds: number;
}

export const EXERCISES: Record<ExerciseId, ExerciseMeta> = {
  zoek: { id: 'zoek', title: 'Zoek de ontdekking', childGoal: 'Zoek het ene ding dat je moet vinden.', emoji: '🔎', skill: 'aandacht', world: 'concentratie', freeRounds: 6 },
  luister: { id: 'luister', title: 'Luister en kies', childGoal: 'Luister goed en tik op het goede plaatje.', emoji: '👂', skill: 'aandacht', world: 'concentratie', freeRounds: 6 },
  wacht: { id: 'wacht', title: 'Eerst luisteren, dan doen', childGoal: 'Wacht op het startsignaal. Doe het dan rustig.', emoji: '🚦', skill: 'aandacht', world: 'concentratie', freeRounds: 6 },
  missie: { id: 'missie', title: 'Blijf bij je missie', childGoal: 'Tel alleen de dingen van je missie.', emoji: '🎯', skill: 'aandacht', world: 'concentratie', freeRounds: 5 },
  dieren: { id: 'dieren', title: 'Onthoud de dieren', childGoal: 'Kijk welke dieren langskomen. Tik ze daarna in dezelfde volgorde.', emoji: '🐾', skill: 'werkgeheugen', world: 'geheugen', freeRounds: 6 },
  ruimtemissie: { id: 'ruimtemissie', title: 'Ruimtemissie', childGoal: 'Voer de opdracht uit. Je mag hem in stukjes knippen.', emoji: '🚀', skill: 'werkgeheugen', world: 'geheugen', freeRounds: 6 },
  eerstlaatst: { id: 'eerstlaatst', title: 'Wat kwam eerst?', childGoal: 'Onthoud de volgorde van de dingen.', emoji: '🔢', skill: 'werkgeheugen', world: 'geheugen', freeRounds: 6 },
  route: { id: 'route', title: 'Herhaal de route', childGoal: 'Kijk naar de route van de raket. Tik daarna dezelfde route.', emoji: '🗺️', skill: 'werkgeheugen', world: 'geheugen', freeRounds: 6 },
  woorden: { id: 'woorden', title: 'Ontdek nieuwe woorden', childGoal: 'Leer wat een woord betekent.', emoji: '📖', skill: 'woordenschat', world: 'taal', freeRounds: 6 },
  dehet: { id: 'dehet', title: 'De of het?', childGoal: 'Kies het goede lidwoord.', emoji: '🏷️', skill: 'taal', world: 'taal', freeRounds: 8 },
  woordsoort: { id: 'woordsoort', title: 'Woordsoorten', childGoal: 'Is het een ding, iets wat je doet, of zegt het hoe iets is?', emoji: '🧩', skill: 'taal', world: 'taal', freeRounds: 6 },
  zinsdeel: { id: 'zinsdeel', title: 'Zinnen ontleden', childGoal: 'Zoek de persoonsvorm of het onderwerp.', emoji: '✂️', skill: 'taal', world: 'taal', freeRounds: 6 },
  rekenen: { id: 'rekenen', title: 'Rekenraket', childGoal: 'Reken rustig uit en controleer je antwoord.', emoji: '🧮', skill: 'rekenen', world: 'rekenen', freeRounds: 8 },
  verhaalsom: { id: 'verhaalsom', title: 'Verhaalsommen', childGoal: 'Zoek eerst de vraag. Reken dan uit.', emoji: '📜', skill: 'rekenen', world: 'rekenen', freeRounds: 5 },
  klokgeld: { id: 'klokgeld', title: 'Klok en geld', childGoal: 'Hoe laat is het? Hoeveel geld is het?', emoji: '🕒', skill: 'rekenen', world: 'rekenen', freeRounds: 6 },
  emotie: { id: 'emotie', title: 'Gevoelens ontdekken', childGoal: 'Wat zou jij voelen? En wat helpt dan?', emoji: '💛', skill: 'emotie', world: 'emotie', freeRounds: 3 },
  ontdek: { id: 'ontdek', title: 'Ontdekverhaal', childGoal: 'Lees een verhaal en beantwoord drie vragen.', emoji: '🔭', skill: 'lezen', world: 'ontdek', freeRounds: 1 },
};

export const SKILL_LABEL: Record<SkillId, string> = {
  aandacht: 'Aandacht en concentratie',
  werkgeheugen: 'Onthouden en instructies',
  woordenschat: 'Woordenschat',
  taal: 'Taal',
  rekenen: 'Rekenen',
  lezen: 'Begrijpend lezen',
  emotie: 'Gevoelens en zelfvertrouwen',
};

export const WORLDS = [
  { id: 'concentratie', title: 'Concentratie', emoji: '🎯', color: 'from-teal-500/30', exercises: ['zoek', 'luister', 'wacht', 'missie'] as ExerciseId[] },
  { id: 'geheugen', title: 'Geheugen', emoji: '🧠', color: 'from-sky-500/30', exercises: ['dieren', 'ruimtemissie', 'eerstlaatst', 'route'] as ExerciseId[] },
  { id: 'taal', title: 'Taalwereld', emoji: '📖', color: 'from-emerald-500/30', exercises: ['woorden', 'dehet', 'woordsoort', 'zinsdeel'] as ExerciseId[] },
  { id: 'rekenen', title: 'Rekenwereld', emoji: '🧮', color: 'from-amber-500/30', exercises: ['rekenen', 'verhaalsom', 'klokgeld'] as ExerciseId[] },
  { id: 'emotie', title: 'Emotiewereld', emoji: '💛', color: 'from-rose-500/30', exercises: ['emotie'] as ExerciseId[] },
  { id: 'ontdek', title: 'Ontdekkingswereld', emoji: '🔭', color: 'from-indigo-500/30', exercises: ['ontdek'] as ExerciseId[] },
] as const;
