import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RoundProps } from './types';
import { ANIMALS, THINGS, type Thing } from '../content/objects';
import { pickN, randInt, shuffle } from '../core/random';
import { speak } from '../core/speech';
import { Button } from '../components/ui';
import { Feedback, Gentle, HintBox, Instruction } from './shared';

/** Toont een reeks één voor één. Geeft show() terug om (opnieuw) af te spelen. */
function useSequencePlayer(length: number, ms: number) {
  const [showing, setShowing] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const play = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPlaying(true);
    for (let i = 0; i < length; i++) {
      timers.current.push(setTimeout(() => setShowing(i), 400 + i * ms));
    }
    timers.current.push(
      setTimeout(() => {
        setShowing(-1);
        setPlaying(false);
      }, 400 + length * ms),
    );
  }, [length, ms]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  return { showing, playing, play };
}

// ---------- B1. Onthoud de dieren ----------
export function DierenExercise({ level, support, onDone }: RoundProps) {
  const len = [2, 3, 3, 4, 5][Math.min(level, 5) - 1];
  const round = useMemo(() => {
    const seq = pickN(ANIMALS, len);
    const extra = pickN(ANIMALS.filter((a) => !seq.includes(a)), level >= 3 ? 2 : 1);
    return { seq, options: shuffle([...seq, ...extra]) };
  }, [len, level]);
  const ms = level >= 4 ? 1100 : 1400;
  const { showing, playing, play } = useSequencePlayer(round.seq.length, ms);
  const [phase, setPhase] = useState<'kijk' | 'tik' | 'goed' | 'uitleg'>('kijk');
  const [input, setInput] = useState<Thing[]>([]);
  const [attempts, setAttempts] = useState(1);
  const [replays, setReplays] = useState(0);
  const [hint, setHint] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started && !playing && phase === 'kijk') setPhase('tik');
  }, [playing, started, phase]);

  const start = () => {
    setStarted(true);
    play();
    if (hint || support) speak(round.seq.map((s) => s.short).join(', '));
  };

  const tap = (a: Thing) => {
    if (phase !== 'tik') return;
    const next = [...input, a];
    if (round.seq[next.length - 1] !== a) {
      if (attempts >= 2) {
        setInput(next);
        setPhase('uitleg');
      } else {
        setAttempts(2);
        setInput([]);
        speak('Bijna. Probeer het nog eens vanaf het begin.', true);
      }
      return;
    }
    setInput(next);
    if (next.length === round.seq.length) {
      setPhase('goed');
      speak('Goed onthouden!');
    }
  };

  return (
    <div className="flex flex-col gap-5 fade-in">
      <Instruction text={phase === 'kijk' ? `Kijk goed. Er komen ${len} dieren langs.` : 'Tik de dieren in dezelfde volgorde.'} />
      <div className="card rounded-3xl h-44 flex items-center justify-center text-8xl" aria-live="polite">
        {phase === 'kijk' && showing >= 0 ? <span key={showing} className="pop">{round.seq[showing].emoji}</span> : phase === 'kijk' ? <span className="text-xl text-white/60">{started ? '…' : 'Klaar? Tik op Start.'}</span> : (
          <div className="flex gap-2 text-5xl">
            {round.seq.map((_, i) => (
              <span key={i} className={`w-16 h-16 rounded-2xl flex items-center justify-center ${input[i] ? 'bg-leaf/30' : 'bg-white/5 border-2 border-dashed border-white/20'}`}>
                {input[i]?.emoji ?? i + 1}
              </span>
            ))}
          </div>
        )}
      </div>
      {phase === 'kijk' && !started && (
        <>
          {(support || hint) && <HintBox>Tip: zeg de namen van de dieren zachtjes na. Dat helpt onthouden!</HintBox>}
          <Button onClick={start}>▶ Start</Button>
        </>
      )}
      {phase === 'tik' && (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg mx-auto w-full">
            {round.options.map((a) => (
              <button key={a.id} onClick={() => tap(a)} aria-label={a.short} className="aspect-square rounded-2xl text-5xl bg-night-3 border-2 border-white/10 hover:border-sea/60 flex items-center justify-center">
                {a.emoji}
              </button>
            ))}
          </div>
          {attempts > 1 && <Gentle>Geeft niks! Nog een keer vanaf het eerste dier.</Gentle>}
          <div className="flex gap-3 flex-wrap">
            <Button variant="ghost" onClick={() => { setReplays((r) => r + 1); setInput([]); setPhase('kijk'); play(); }}>🔁 Nog eens kijken</Button>
            {!hint && <Button variant="ghost" onClick={() => setHint(true)}>💡 Tip</Button>}
          </div>
          {hint && <HintBox>Het eerste dier was {round.seq[0].name} {round.seq[0].emoji}.</HintBox>}
        </>
      )}
      {(phase === 'goed' || phase === 'uitleg') && (
        <Feedback
          kind={phase}
          title={phase === 'goed' ? 'Goed onthouden!' : 'De volgorde was:'}
          text={phase === 'uitleg' ? round.seq.map((s) => `${s.emoji} ${s.short}`).join('  →  ') : undefined}
          onNext={() => onDone({ itemId: round.seq.map((s) => s.id).join('-'), correct: phase === 'goed', attempts, hintsUsed: hint ? 1 : 0, replays })}
        />
      )}
    </div>
  );
}

// ---------- B3. Wat kwam eerst? ----------
export function EerstLaatstExercise({ level, support, onDone }: RoundProps) {
  const round = useMemo(() => {
    const len = [3, 4, 5, 5][Math.min(level, 4) - 1];
    const seq = pickN(THINGS, len);
    const kinds = level >= 3 ? ['eerst', 'laatst', 'na'] : ['eerst', 'laatst'];
    const kind = kinds[randInt(0, kinds.length - 1)];
    let q = '';
    let answer: Thing;
    if (kind === 'eerst') { q = 'Wat kwam als eerste?'; answer = seq[0]; }
    else if (kind === 'laatst') { q = 'Wat kwam als laatste?'; answer = seq[seq.length - 1]; }
    else {
      const i = randInt(0, seq.length - 2);
      q = `Wat kwam direct na ${seq[i].name}?`;
      answer = seq[i + 1];
    }
    return { seq, q, answer, options: shuffle(seq) };
  }, [level]);
  const { showing, playing, play } = useSequencePlayer(round.seq.length, 1300);
  const [phase, setPhase] = useState<'kijk' | 'vraag' | 'goed' | 'uitleg'>('kijk');
  const [started, setStarted] = useState(false);
  const [wrong, setWrong] = useState<string[]>([]);
  const [replays, setReplays] = useState(0);

  useEffect(() => {
    if (started && !playing && phase === 'kijk') {
      setPhase('vraag');
      speak(round.q);
    }
  }, [playing, started, phase, round.q]);

  const choose = (t: Thing) => {
    if (phase !== 'vraag' || wrong.includes(t.id)) return;
    if (t === round.answer) setPhase('goed');
    else {
      const w = [...wrong, t.id];
      setWrong(w);
      if (w.length >= 2) setPhase('uitleg');
    }
  };

  return (
    <div className="flex flex-col gap-5 fade-in">
      <Instruction text={phase === 'kijk' ? 'Kijk goed naar de volgorde.' : round.q} />
      <div className="card rounded-3xl h-40 flex items-center justify-center text-8xl">
        {showing >= 0 ? <span key={showing} className="pop">{round.seq[showing].emoji}</span> : <span className="text-xl text-white/60">{phase === 'kijk' ? (started ? '…' : 'Klaar? Tik op Start.') : '❓'}</span>}
      </div>
      {phase === 'kijk' && !started && (
        <>
          {support && <HintBox>Tip: zeg zachtjes "eerst …, dan …" terwijl je kijkt.</HintBox>}
          <Button onClick={() => { setStarted(true); play(); }}>▶ Start</Button>
        </>
      )}
      {phase === 'vraag' && (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {round.options.map((t) => (
              <button key={t.id} disabled={wrong.includes(t.id)} onClick={() => choose(t)} aria-label={t.short} className={`aspect-square rounded-2xl text-5xl flex items-center justify-center border-2 ${wrong.includes(t.id) ? 'opacity-30 border-transparent' : 'bg-night-3 border-white/10 hover:border-sea/60'}`}>
                {t.emoji}
              </button>
            ))}
          </div>
          {wrong.length > 0 && <Gentle>Nog niet. Denk rustig terug: wat zag je?</Gentle>}
          <Button variant="ghost" onClick={() => { setReplays((r) => r + 1); setPhase('kijk'); play(); }}>🔁 Nog eens kijken</Button>
        </>
      )}
      {(phase === 'goed' || phase === 'uitleg') && (
        <Feedback
          kind={phase}
          title={phase === 'goed' ? 'Goed onthouden!' : `Het was ${round.answer.name} ${round.answer.emoji}.`}
          text={`De volgorde was: ${round.seq.map((s) => s.emoji).join(' → ')}`}
          onNext={() => onDone({ itemId: round.seq.map((s) => s.id).join('-'), correct: phase === 'goed', attempts: wrong.length + (phase === 'goed' ? 1 : 0), hintsUsed: 0, replays })}
        />
      )}
    </div>
  );
}

// ---------- B4. Herhaal de route ----------
export function makeRoute(size: number, steps: number, r = Math.random): number[] {
  for (let tries = 0; tries < 50; tries++) {
    const start = Math.floor(r() * size * size);
    const path = [start];
    while (path.length < steps + 1) {
      const cur = path[path.length - 1];
      const x = cur % size, y = Math.floor(cur / size);
      const nb = [
        [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1],
      ].filter(([a, b]) => a >= 0 && b >= 0 && a < size && b < size).map(([a, b]) => b * size + a).filter((c) => !path.includes(c));
      if (!nb.length) break;
      path.push(nb[Math.floor(r() * nb.length)]);
    }
    if (path.length === steps + 1) return path;
  }
  return [0, 1];
}

export function RouteExercise({ level, support, onDone }: RoundProps) {
  const [size, steps] = [[3, 2], [3, 3], [4, 4], [4, 5], [5, 6]][Math.min(level, 5) - 1];
  const path = useMemo(() => makeRoute(size, steps), [size, steps]);
  const { showing, playing, play } = useSequencePlayer(path.length, 800);
  const [phase, setPhase] = useState<'kijk' | 'tik' | 'goed' | 'uitleg'>('kijk');
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState<number[]>([path[0]]);
  const [attempts, setAttempts] = useState(1);
  const [replays, setReplays] = useState(0);

  useEffect(() => {
    if (started && !playing && phase === 'kijk') setPhase('tik');
  }, [playing, started, phase]);

  const tap = (c: number) => {
    if (phase !== 'tik') return;
    const next = [...input, c];
    if (path[next.length - 1] !== c) {
      if (attempts >= 2) { setPhase('uitleg'); return; }
      setAttempts(2);
      setInput([path[0]]);
      speak('Bijna. Begin weer bij de raket.', true);
      return;
    }
    setInput(next);
    if (next.length === path.length) { setPhase('goed'); speak('Goed gevolgd!'); }
  };

  const visible = phase === 'kijk' ? path.slice(0, showing + 1) : phase === 'uitleg' ? path : input;

  return (
    <div className="flex flex-col gap-5 fade-in">
      <Instruction text={phase === 'kijk' ? `Kijk hoe de raket ${steps} stappen vliegt.` : 'Tik dezelfde route. Begin naast de raket.'} />
      <div className="grid gap-2 mx-auto w-full max-w-sm" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
        {Array.from({ length: size * size }, (_, c) => {
          const idx = visible.indexOf(c);
          const isStart = c === path[0];
          const isCurrent = phase === 'kijk' && path[showing] === c;
          return (
            <button
              key={c}
              onClick={() => tap(c)}
              aria-label={`Vak ${c + 1}`}
              className={`aspect-square rounded-xl flex items-center justify-center text-2xl font-extrabold border-2 transition ${
                isCurrent ? 'bg-sun text-night border-sun' : idx >= 0 ? 'bg-sea/40 border-sea' : 'bg-night-3 border-white/10'
              }`}
            >
              {isStart ? '🚀' : idx > 0 && (phase !== 'kijk' || support) ? idx : isCurrent ? '⭐' : ''}
            </button>
          );
        })}
      </div>
      {phase === 'kijk' && !started && (
        <>
          {support && <HintBox>Tip: zeg de stappen hardop, bijvoorbeeld "omhoog, rechts, rechts".</HintBox>}
          <Button onClick={() => { setStarted(true); play(); }}>▶ Start</Button>
        </>
      )}
      {phase === 'tik' && (
        <>
          {attempts > 1 && <Gentle>Geeft niks! Probeer het nog eens vanaf de raket.</Gentle>}
          <Button variant="ghost" onClick={() => { setReplays((r) => r + 1); setInput([path[0]]); setPhase('kijk'); play(); }}>🔁 Nog eens kijken</Button>
        </>
      )}
      {(phase === 'goed' || phase === 'uitleg') && (
        <Feedback
          kind={phase}
          title={phase === 'goed' ? 'Goed gevolgd! De raket is aangekomen.' : 'Zo ging de route. De cijfers laten de volgorde zien.'}
          onNext={() => onDone({ itemId: path.join('-'), correct: phase === 'goed', attempts, hintsUsed: 0, replays })}
        />
      )}
    </div>
  );
}
