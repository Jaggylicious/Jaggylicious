/**
 * Analyse voor de ouder. Beschrijft OEFENRESULTATEN – geen klinische beoordeling.
 * Er worden geen IQ-, ADHD- of psychologische scores berekend.
 */
import type { AttemptRecord, ExerciseId, ExerciseState, SessionRecord, SkillId } from './types';
import { EXERCISES, SKILL_LABEL } from './catalog';
import { MAX_LEVEL } from './adaptive';

const DAY = 86400000;
const WEEK = 7 * DAY;

export function startOfWeek(ts: number): number {
  const d = new Date(ts);
  const day = (d.getDay() + 6) % 7; // maandag = 0
  d.setHours(0, 0, 0, 0);
  return d.getTime() - day * DAY;
}

export interface WeekBucket {
  start: number;
  label: string;
  minutes: number;
  sessions: number;
}

export function weeklyMinutes(sessions: SessionRecord[], weeks = 6, now = Date.now()): WeekBucket[] {
  const thisWeek = startOfWeek(now);
  const buckets: WeekBucket[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(thisWeek);
    d.setDate(d.getDate() - 7 * i); // kalenderweken, ook correct rond zomer-/wintertijd
    buckets.push({ start: d.getTime(), label: `${d.getDate()}/${d.getMonth() + 1}`, minutes: 0, sessions: 0 });
  }
  const endOf = (i: number) => (i + 1 < buckets.length ? buckets[i + 1].start : (() => { const e = new Date(buckets[i].start); e.setDate(e.getDate() + 7); return e.getTime(); })());
  for (const s of sessions) {
    const b = buckets.find((x, i) => s.startedAt >= x.start && s.startedAt < endOf(i));
    if (b) {
      b.minutes += s.activeSeconds / 60;
      b.sessions += 1;
    }
  }
  return buckets.map((b) => ({ ...b, minutes: Math.round(b.minutes) }));
}

export interface ExerciseStats {
  exerciseId: ExerciseId;
  rounds: number;
  zelfstandig: number;
  metHulp: number;
  nogNiet: number;
  /** Aandeel gelukt (met of zonder hulp) – zegt iets over beheersing van de stof. */
  mastery: number;
  /** Aandeel zelfstandig – zegt iets over benodigde ondersteuning. */
  independence: number;
  hintRate: number;
  replayRate: number;
  recentNogNiet: number; // aandeel nogNiet in laatste 10
  lastAt: number;
}

export function exerciseStats(attempts: AttemptRecord[]): ExerciseStats[] {
  const by = new Map<ExerciseId, AttemptRecord[]>();
  for (const a of attempts) {
    if (a.unscored) continue;
    by.set(a.exerciseId, [...(by.get(a.exerciseId) ?? []), a]);
  }
  return [...by.entries()].map(([exerciseId, list]) => {
    const n = list.length;
    const z = list.filter((a) => a.outcome === 'zelfstandig').length;
    const h = list.filter((a) => a.outcome === 'metHulp').length;
    const nn = n - z - h;
    const last = list.slice(-10);
    return {
      exerciseId,
      rounds: n,
      zelfstandig: z,
      metHulp: h,
      nogNiet: nn,
      mastery: n ? (z + h) / n : 0,
      independence: n ? z / n : 0,
      hintRate: n ? list.filter((a) => a.hintsUsed > 0).length / n : 0,
      replayRate: n ? list.filter((a) => a.replays > 0).length / n : 0,
      recentNogNiet: last.length ? last.filter((a) => a.outcome === 'nogNiet').length / last.length : 0,
      lastAt: Math.max(...list.map((a) => a.timestamp)),
    };
  });
}

export interface SkillTrend {
  skill: SkillId;
  label: string;
  rounds: number;
  earlier: number | null; // zelfstandig-aandeel eerste helft
  later: number | null; // tweede helft
  progressing: boolean;
}

/** Vergelijkt Fatih alleen met zichzelf: eerste helft vs tweede helft van zijn oefenrondes. */
export function skillTrends(attempts: AttemptRecord[]): SkillTrend[] {
  const by = new Map<SkillId, AttemptRecord[]>();
  for (const a of attempts) {
    if (a.unscored) continue;
    const s = EXERCISES[a.exerciseId].skill;
    by.set(s, [...(by.get(s) ?? []), a]);
  }
  return [...by.entries()].map(([skill, list]) => {
    const sorted = [...list].sort((a, b) => a.timestamp - b.timestamp);
    // Hogere niveaus wegen mee: zelfstandig op een hoger niveau telt als vooruitgang
    const score = (arr: AttemptRecord[]) =>
      arr.length ? arr.reduce((s, a) => s + (a.outcome === 'zelfstandig' ? a.level : 0), 0) / arr.reduce((s, a) => s + a.level, 0) : null;
    const enough = sorted.length >= 10;
    const half = Math.floor(sorted.length / 2);
    const earlierArr = sorted.slice(0, half);
    const laterArr = sorted.slice(half);
    const earlier = enough ? score(earlierArr) : null;
    const later = enough ? score(laterArr) : null;
    const avgLevel = (arr: AttemptRecord[]) => arr.reduce((s, a) => s + a.level, 0) / Math.max(1, arr.length);
    const progressing =
      enough && ((later ?? 0) - (earlier ?? 0) > 0.1 || avgLevel(laterArr) - avgLevel(earlierArr) >= 0.5);
    return { skill, label: SKILL_LABEL[skill], rounds: sorted.length, earlier, later, progressing };
  });
}

const RECOMMEND_NEXT: Partial<Record<ExerciseId, string>> = {
  dehet: 'Probeer volgende week eenvoudige zinnen: geef "Persoonsvorm en onderwerp" vrij en kies "Zinnen ontleden".',
  rekenen: 'Overweeg een nieuw rekenonderwerp vrij te geven, bijvoorbeeld alle tafels of delen.',
  klokgeld: 'Overweeg "Klok: kwart over en kwart voor" of "Geld rekenen" vrij te geven.',
  woordsoort: 'Een volgende stap kan zinnen ontleden zijn (persoonsvorm en onderwerp).',
  woorden: 'Geef "Synoniemen en tegenstellingen" vrij voor extra woordenschatuitdaging.',
};

export function recommendations(
  stats: ExerciseStats[],
  states: ExerciseState[],
  sessions: SessionRecord[],
  childName: string,
  now = Date.now(),
): string[] {
  const out: string[] = [];
  const recent = sessions.filter((s) => now - s.startedAt < WEEK);
  if (!sessions.length) {
    out.push(`Er is nog niet geoefend. Start samen met ${childName} de eerste dagelijkse missie.`);
    return out;
  }
  if (!recent.length) out.push('Deze week is er nog niet geoefend. Dat is helemaal oké; er is geen verplichting.');
  for (const s of stats) {
    const st = states.find((x) => x.exerciseId === s.exerciseId);
    const title = EXERCISES[s.exerciseId].title;
    if (!st || s.rounds < 8) continue;
    const atTop = st.level >= MAX_LEVEL[s.exerciseId];
    if (s.mastery >= 0.8 && (atTop || st.level >= MAX_LEVEL[s.exerciseId] - 1)) {
      out.push(`${childName} beheerst de meeste oefeningen bij "${title}". ${RECOMMEND_NEXT[s.exerciseId] ?? 'Overweeg een nieuw onderwerp.'}`);
    } else if (s.recentNogNiet >= 0.5) {
      out.push(`"${title}" lijkt op dit moment pittig. De app biedt automatisch meer ondersteuning. Samen een voorbeeld doen kan helpen.`);
    } else if (s.hintRate >= 0.5) {
      out.push(`${childName} gebruikt bij "${title}" vaak een tip. Hulp gebruiken is een goede strategie; de stof lukt wel, de zelfstandigheid groeit nog.`);
    }
  }
  const pausesHigh = recent.filter((s) => s.stoppedEarly).length >= 3;
  if (pausesHigh) out.push('Sessies worden deze week vaker eerder gestopt. Overweeg een kortere missieduur in de instellingen.');
  if (out.length === 0) out.push(`${childName} oefent op een passend niveau. Ga zo door in een rustig tempo.`);
  return out;
}
