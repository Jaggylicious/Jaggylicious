import { useCallback, useEffect, useRef, useState } from 'react';
import type { ExerciseId, ExerciseState, RoundResult } from '../core/types';
import { EXERCISES } from '../core/catalog';
import { getState, recentItemIds } from '../core/db';
import { recordRound } from '../core/session';
import { useProfile } from '../core/store';
import { ROUND_COMPONENTS } from './registry';
import { Button } from '../components/ui';
import { Breathing } from '../components/Breathing';
import { speak, stopSpeaking } from '../core/speech';
import { CARDS } from '../content/kaarten';

export interface RunSummary {
  rounds: number;
  stars: number;
  stoppedEarly: boolean;
  activeSeconds: number;
  pauses: number;
}

interface Props {
  exerciseId: ExerciseId;
  sessionId: string;
  param?: string;
  maxRounds?: number;
  timeLimitSec?: number;
  onExit: (s: RunSummary) => void;
  /** Na elke ronde: nieuw verstreken actieve seconden (voor tussentijds opslaan). */
  onProgress?: (deltaSec: number) => void;
  /** Toon de korte uitleg vooraf. */
  intro?: boolean;
}

/**
 * Draait rondes van één oefening: haalt niveau op, registreert uitkomsten,
 * past moeilijkheid aan, beheert pauze en stopt na tijd of aantal rondes.
 */
export function ExerciseRunner({ exerciseId, sessionId, param, maxRounds, timeLimitSec, onExit, onProgress, intro = true }: Props) {
  const meta = EXERCISES[exerciseId];
  const { profile, addStars } = useProfile();
  const [state, setState] = useState<ExerciseState | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [phase, setPhase] = useState<'intro' | 'ronde' | 'nieuwNiveau'>(intro ? 'intro' : 'ronde');
  const [round, setRound] = useState(0);
  const [stars, setStars] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [breathing, setBreathing] = useState(false);
  const [pauses, setPauses] = useState(0);
  const activeMs = useRef(0);
  const lastStart = useRef<number | null>(intro ? null : Date.now());
  const saving = useRef(false);
  const reported = useRef(0);
  /** Seconden sinds de laatste melding; markeert ze als gemeld. */
  const takeUnreported = () => {
    const now = elapsedSec();
    const d = Math.max(0, Math.round(now - reported.current));
    reported.current += d;
    return d;
  };

  useEffect(() => {
    (async () => {
      setState(await getState(exerciseId));
      setRecent(await recentItemIds(exerciseId));
    })();
  }, [exerciseId]);

  useEffect(() => {
    if (phase === 'intro') speak(`${meta.title}. ${meta.childGoal}`);
  }, [phase, meta]);

  // Bij verlaten (terugknop, app sluiten): nog niet gemelde oefentijd alsnog doorgeven
  const progressRef = useRef(onProgress);
  progressRef.current = onProgress;
  useEffect(
    () => () => {
      stopSpeaking();
      const d = takeUnreported();
      if (d > 0) progressRef.current?.(d);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [saveError, setSaveError] = useState(false);

  const elapsedSec = () => (activeMs.current + (lastStart.current ? Date.now() - lastStart.current : 0)) / 1000;

  const summary = useCallback(
    (stoppedEarly: boolean): RunSummary => ({ rounds: round, stars, stoppedEarly, activeSeconds: takeUnreported(), pauses }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [round, stars, pauses],
  );

  const pause = () => {
    if (lastStart.current) activeMs.current += Date.now() - lastStart.current;
    lastStart.current = null;
    stopSpeaking();
    setPaused(true);
    setPauses((p) => p + 1);
  };
  const resume = () => {
    lastStart.current = Date.now();
    setPaused(false);
    setBreathing(false);
  };

  const onDone = async (r: RoundResult) => {
    if (!state || saving.current) return;
    saving.current = true;
    let res: Awaited<ReturnType<typeof recordRound>>;
    let gained = 0;
    let msg: string | null = null;
    try {
      res = await recordRound(exerciseId, state.level, r, sessionId);
      if (res.star) {
        gained = 1;
        msg = `⭐ ${res.starReason}`;
        const fresh = await addStars(1);
        if (fresh.length) {
          const c = CARDS.find((x) => x.id === fresh[0]);
          if (c) msg = `🎁 Nieuwe ontdekkingskaart: ${c.emoji} ${c.title}!`;
        }
      }
      setSaveError(false);
    } catch {
      // Opslag mislukt (bijv. privévenster of volle opslag): gewoon doorgaan, niet vastlopen
      setSaveError(true);
      res = { state, change: null, star: false, starReason: null };
    } finally {
      saving.current = false;
    }
    const nextRound = round + 1;
    const newStars = stars + gained;
    setStars(newStars);
    setRound(nextRound);
    setState(res.state);
    if (r.itemId) setRecent((x) => [...x, r.itemId!].slice(-15));
    setToast(msg);

    onProgress?.(takeUnreported());
    const timeUp = timeLimitSec !== undefined && elapsedSec() >= timeLimitSec;
    const roundsUp = maxRounds !== undefined && nextRound >= maxRounds;
    if (timeUp || roundsUp) {
      onExit({ rounds: nextRound, stars: newStars, stoppedEarly: false, activeSeconds: takeUnreported(), pauses });
      return;
    }
    if (res.change === 'omhoog') {
      setPhase('nieuwNiveau');
      speak('Super! Je bent klaar voor een nieuwe uitdaging.');
    }
  };

  if (!state || !profile) return <p className="p-6 text-lg">Even laden…</p>;
  const Comp = ROUND_COMPONENTS[exerciseId];
  const progress =
    timeLimitSec !== undefined ? Math.min(1, elapsedSec() / timeLimitSec) : maxRounds ? Math.min(1, round / maxRounds) : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 no-print">
        <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden" aria-label="Voortgang">
          <div className="h-full bg-sea rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="font-bold">⭐ {stars}</div>
        {phase === 'ronde' && (
          <button onClick={pause} className="rounded-full bg-white/10 hover:bg-white/20 h-12 px-4 font-bold" aria-label="Pauze">
            ⏸ Pauze
          </button>
        )}
      </div>

      {toast && phase === 'ronde' && (
        <div className="rounded-2xl bg-sun/15 border border-sun/40 px-4 py-2 font-bold fade-in" role="status">
          {toast}
        </div>
      )}

      {phase === 'intro' && (
        <div className="flex flex-col gap-5 fade-in">
          <div className="card rounded-3xl p-6 text-center flex flex-col items-center gap-3">
            <div className="text-7xl float" aria-hidden>{meta.emoji}</div>
            <h2 className="text-3xl font-extrabold">{meta.title}</h2>
            <p className="text-xl">{meta.childGoal}</p>
            <button className="text-2xl" onClick={() => speak(meta.childGoal, true)} aria-label="Voorlezen">🔊</button>
          </div>
          <Button
            onClick={() => {
              lastStart.current = Date.now();
              setPhase('ronde');
            }}
          >
            Start →
          </Button>
        </div>
      )}

      {phase === 'nieuwNiveau' && (
        <div className="card rounded-3xl p-8 text-center flex flex-col items-center gap-4 pop">
          <div className="text-7xl">🌟</div>
          <h2 className="text-3xl font-extrabold">Nieuwe uitdaging!</h2>
          <p className="text-xl">Dit ging zo goed, dat je een stapje verder mag. Het mag best wat moeilijker voelen.</p>
          <Button onClick={() => setPhase('ronde')}>Kom maar op →</Button>
        </div>
      )}

      {saveError && (
        <p className="rounded-2xl bg-white/10 px-4 py-2 text-sm" role="status">
          Let op: voortgang kon niet worden opgeslagen op dit apparaat. Oefenen kan gewoon doorgaan.
        </p>
      )}

      {/* De ronde blijft gemonteerd tijdens pauze, zodat dezelfde opdracht terugkomt (geen 'overslaan' via pauze). */}
      {phase === 'ronde' && (
        <div hidden={paused}>
        <Comp
          key={`${exerciseId}-${round}`}
          level={state.level}
          support={state.support}
          recentIds={recent}
          unlocked={profile.settings.unlockedTopics}
          allowDistraction={profile.settings.allowDistraction}
          param={param}
          sessionId={sessionId}
          onDone={onDone}
        />
        </div>
      )}

      {paused && (
        <div className="card rounded-3xl p-6 flex flex-col items-center gap-4 text-center fade-in">
          <div className="text-6xl">⏸</div>
          <h2 className="text-3xl font-extrabold">Pauze</h2>
          <p className="text-lg">Even rust. Dat is slim. Ga verder wanneer je wilt.</p>
          {breathing ? <Breathing rounds={3} onDone={() => setBreathing(false)} /> : (
            <Button variant="ghost" onClick={() => setBreathing(true)}>🌬️ Samen rustig ademen</Button>
          )}
          <div className="flex gap-3 w-full flex-wrap">
            <Button className="flex-1" onClick={resume}>▶ Verder</Button>
            <Button variant="ghost" className="flex-1" onClick={() => onExit(summary(true))}>Stoppen voor nu</Button>
          </div>
        </div>
      )}
    </div>
  );
}
