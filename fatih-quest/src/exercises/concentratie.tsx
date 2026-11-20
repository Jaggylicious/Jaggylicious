import { useEffect, useMemo, useRef, useState } from 'react';
import type { RoundProps } from './types';
import { THINGS, COLORS, SHAPES, type Thing } from '../content/objects';
import { pickN, randInt, shuffle } from '../core/random';
import { speak, speechAvailable } from '../core/speech';
import { Button } from '../components/ui';
import { Feedback, Gentle, HintBox, Instruction, ShapeIcon } from './shared';

// ---------- A1. Zoek de ontdekking ----------
export function ZoekExercise({ level, support, onDone }: RoundProps) {
  const size = [4, 6, 9, 12, 16][Math.min(level, 5) - 1];
  const round = useMemo(() => {
    const target = THINGS[randInt(0, THINGS.length - 1)];
    // Hogere niveaus: afleiders uit dezelfde groep (lijken meer op elkaar)
    const pool = level >= 4 ? THINGS.filter((t) => t.group === target.group && t.id !== target.id) : THINGS.filter((t) => t.id !== target.id);
    const others: Thing[] = [];
    while (others.length < size - 1) others.push(...pickN(pool, Math.min(pool.length, size - 1 - others.length)));
    return { target, cells: shuffle([target, ...others.slice(0, size - 1)]) };
  }, [level, size]);
  const [wrong, setWrong] = useState<number[]>([]);
  const [hint, setHint] = useState(false);
  const [done, setDone] = useState<'goed' | 'uitleg' | null>(null);
  const [replays, setReplays] = useState(0);
  const targetIndex = round.cells.findIndex((c) => c === round.target);
  const cols = size <= 4 ? 2 : size <= 9 ? 3 : 4;
  const text = `Zoek ${round.target.name}.`;

  useEffect(() => speak(text), [text]);

  const tap = (i: number) => {
    if (done || wrong.includes(i)) return;
    if (i === targetIndex) {
      setDone('goed');
      speak('Gevonden!');
    } else {
      const w = [...wrong, i];
      setWrong(w);
      if (w.length >= 3) setDone('uitleg');
      else speak(`Dat is ${round.cells[i].name}. Zoek ${round.target.name}.`);
    }
  };
  const hintRow = Math.floor(targetIndex / cols);

  return (
    <div className="flex flex-col gap-5 fade-in">
      <Instruction text={text}>
        <div className="text-5xl" aria-hidden>{round.target.emoji}</div>
      </Instruction>
      <div className="grid gap-3 mx-auto w-full max-w-lg" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {round.cells.map((c, i) => {
          const inHintRow = hint && Math.floor(i / cols) === hintRow;
          const reveal = done && i === targetIndex;
          return (
            <button
              key={i}
              onClick={() => tap(i)}
              aria-label={c.short}
              className={`aspect-square rounded-2xl text-4xl sm:text-5xl flex items-center justify-center border-2 transition ${
                reveal ? 'bg-leaf/40 border-leaf' : wrong.includes(i) ? 'opacity-30 border-transparent bg-white/5' : inHintRow ? 'border-sun bg-night-3' : 'border-white/10 bg-night-3 hover:border-sea/60'
              }`}
            >
              {c.emoji}
            </button>
          );
        })}
      </div>
      {!done && (
        <div className="flex gap-3 flex-wrap">
          <Button variant="ghost" className={support && !hint ? 'ring-2 ring-sun' : ''} onClick={() => setHint(true)}>💡 Tip</Button>
          <Button variant="ghost" onClick={() => { setReplays((r) => r + 1); speak(text, true); }}>🔁 Nog eens horen</Button>
        </div>
      )}
      {!done && hint && <HintBox>Kijk in de rij met de gele rand. Kijk rustig van links naar rechts.</HintBox>}
      {!done && wrong.length > 0 && <Gentle>Bijna! Kijk nog eens goed. Je zoekt {round.target.name} {round.target.emoji}.</Gentle>}
      {done && (
        <Feedback
          kind={done}
          title={done === 'goed' ? (wrong.length ? 'Gevonden! Goed doorgezocht.' : 'Gevonden! Goed gekeken.') : 'Hier is hij! Hij zat goed verstopt.'}
          onNext={() => onDone({ itemId: round.target.id, correct: done === 'goed', attempts: wrong.length + (done === 'goed' ? 1 : 0), hintsUsed: hint ? 1 : 0, replays })}
        />
      )}
    </div>
  );
}

// ---------- A2. Luister en kies ----------
interface ShapeItem { shape: string; color: string; key: string }
function describe(s: ShapeItem) {
  const c = COLORS.find((x) => x.id === s.color)!;
  const sh = SHAPES.find((x) => x.id === s.shape)!;
  return `de ${c.label} ${sh.label}`;
}

export function LuisterExercise({ level, support, onDone }: RoundProps) {
  const round = useMemo(() => {
    const n = [3, 4, 6, 6][Math.min(level, 4) - 1];
    const items: ShapeItem[] = [];
    const used = new Set<string>();
    while (items.length < n) {
      const shape = level === 1 ? 'planeet' : SHAPES[randInt(0, SHAPES.length - 1)].id;
      const color = COLORS[randInt(0, COLORS.length - 1)].id;
      const key = `${shape}-${color}`;
      if (used.has(key)) continue;
      used.add(key);
      items.push({ shape, color, key });
    }
    // Vanaf niveau 2: zorg dat kleur alleen niet genoeg is (zelfde kleur, andere vorm)
    if (level >= 2) {
      const t = items[0];
      const otherShape = SHAPES.find((s) => s.id !== t.shape)!.id;
      const twinKey = `${otherShape}-${t.color}`;
      if (!used.has(twinKey)) items[items.length - 1] = { shape: otherShape, color: t.color, key: twinKey };
    }
    const shuffled = shuffle(items);
    const targets = level >= 4 ? [items[0], items[1]] : [items[0]];
    return { items: shuffled, targets };
  }, [level]);
  const text =
    round.targets.length === 2
      ? `Tik eerst op ${describe(round.targets[0])}. Tik daarna op ${describe(round.targets[1])}.`
      : `Tik op ${describe(round.targets[0])}.`;
  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [showText, setShowText] = useState(!speechAvailable());
  const [replays, setReplays] = useState(0);
  const [done, setDone] = useState<'goed' | 'uitleg' | null>(null);
  const [tapped, setTapped] = useState<string[]>([]);

  useEffect(() => {
    const t = setTimeout(() => speak(text, true), 300);
    return () => clearTimeout(t);
  }, [text]);

  const tap = (it: ShapeItem) => {
    if (done || tapped.includes(it.key)) return;
    if (it.key === round.targets[step].key) {
      setTapped([...tapped, it.key]);
      if (step + 1 >= round.targets.length) {
        setDone('goed');
        speak('Goed geluisterd!');
      } else setStep(step + 1);
    } else {
      const w = [...wrong, it.key];
      setWrong(w);
      if (w.length >= 2) setDone('uitleg');
      else speak('Nog niet. Luister nog eens.', true);
    }
  };

  return (
    <div className="flex flex-col gap-5 fade-in">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl md:text-3xl font-extrabold flex-1">Luister goed 👂</h2>
        <Button variant="secondary" onClick={() => { setReplays((r) => r + 1); speak(text, true); }}>🔊 Luister</Button>
      </div>
      {showText ? (
        <p className="card rounded-2xl p-4 text-xl font-bold">{text}</p>
      ) : (
        <button className="text-left text-white/70 underline text-lg" onClick={() => setShowText(true)}>
          Liever lezen? Toon de opdracht
        </button>
      )}
      {step > 0 && !done && <Gentle>Goed! Nu de tweede.</Gentle>}
      <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto w-full">
        {round.items.map((it) => {
          const isTarget = round.targets.some((t) => t.key === it.key);
          return (
            <button
              key={it.key}
              onClick={() => tap(it)}
              aria-label={describe(it)}
              className={`aspect-square rounded-2xl flex items-center justify-center border-2 transition ${
                tapped.includes(it.key) || (done === 'uitleg' && isTarget) ? 'border-leaf bg-leaf/20' : wrong.includes(it.key) ? 'opacity-40 border-transparent bg-white/5' : 'border-white/10 bg-night-3 hover:border-sea/60'
              }`}
            >
              <ShapeIcon shape={it.shape} color={it.color} />
            </button>
          );
        })}
      </div>
      {support && !done && !showText && <HintBox>Tip: tik op 🔊 Luister. Zeg de opdracht zachtjes na.</HintBox>}
      {done && (
        <Feedback
          kind={done}
          title={done === 'goed' ? 'Goed geluisterd!' : 'Kijk, deze waren het.'}
          text={text}
          onNext={() => onDone({ itemId: round.targets.map((t) => t.key).join('+'), correct: done === 'goed', attempts: wrong.length + (done === 'goed' ? 1 : 0), hintsUsed: showText && speechAvailable() ? 1 : 0, replays })}
        />
      )}
    </div>
  );
}

// ---------- A3. Eerst luisteren, dan doen ----------
export function WachtExercise({ level, onDone }: RoundProps) {
  const round = useMemo(() => {
    const n = [2, 3, 4, 4][Math.min(level, 4) - 1];
    const items = pickN(THINGS, n);
    const target = items[0];
    const noGo = level >= 4 && Math.random() < 0.3; // soms: STOP = niet tikken
    return { items: shuffle(items), target, noGo, wait: randInt(1500, 1500 + level * 700) };
  }, [level]);
  const [phase, setPhase] = useState<'klaar' | 'wachten' | 'start' | 'stop' | 'goed' | 'uitleg'>('klaar');
  const [early, setEarly] = useState(0);
  const [wrong, setWrong] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const text = round.noGo
    ? `Wacht op het licht. Bij groen: tik op ${round.target.name}. Bij STOP: niets doen.`
    : `Wacht op het groene licht. Tik dan op ${round.target.name}.`;

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => speak(text), [text]);

  const begin = () => {
    setPhase('wachten');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (round.noGo) {
        setPhase('stop');
        speak('Stop!', true);
        timer.current = setTimeout(() => {
          setPhase('goed');
          speak('Goed zo, je hebt rustig gewacht!');
        }, 2500);
      } else {
        setPhase('start');
        speak('Start!', true);
      }
    }, round.wait);
  };

  const tap = (t: Thing) => {
    if (phase === 'wachten' || phase === 'klaar') {
      clearTimeout(timer.current);
      setEarly((e) => e + 1);
      setPhase('klaar');
      speak('Oeps, nog even wachten op groen. We beginnen opnieuw.', true);
      return;
    }
    if (phase === 'stop') {
      clearTimeout(timer.current);
      setEarly((e) => e + 1);
      setPhase('uitleg');
      return;
    }
    if (phase !== 'start') return;
    if (t.id === round.target.id) {
      setPhase('goed');
      speak('Goed zo!');
    } else {
      setWrong((w) => w + 1);
      if (wrong + 1 >= 2) setPhase('uitleg');
      else speak(`Dat is ${t.name}. Zoek ${round.target.name}.`, true);
    }
  };

  const light = phase === 'start' ? 'bg-green-400' : phase === 'stop' ? 'bg-rose-500' : phase === 'wachten' ? 'bg-amber-400' : 'bg-slate-500';

  return (
    <div className="flex flex-col gap-5 fade-in">
      <Instruction text={text} />
      <div className="flex items-center justify-center gap-4">
        <div className={`w-24 h-24 rounded-full ${light} shadow-inner flex items-center justify-center text-night font-extrabold text-xl transition-colors`} aria-live="polite">
          {phase === 'start' ? 'START!' : phase === 'stop' ? 'STOP' : phase === 'wachten' ? 'wacht…' : ''}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto w-full">
        {round.items.map((t) => (
          <button key={t.id} onClick={() => tap(t)} aria-label={t.short} className="aspect-square rounded-2xl text-5xl bg-night-3 border-2 border-white/10 hover:border-sea/60 flex items-center justify-center">
            {t.emoji}
          </button>
        ))}
      </div>
      {phase === 'klaar' && (
        <>
          {early > 0 && <Gentle>Dat was nog vóór het signaal. Geeft niks! Probeer het rustig nog eens. 🧘</Gentle>}
          <Button onClick={begin}>Ik ben klaar. Begin!</Button>
        </>
      )}
      {(phase === 'goed' || phase === 'uitleg') && (
        <Feedback
          kind={phase}
          title={phase === 'goed' ? (round.noGo ? 'Knap! Je deed niets bij STOP.' : 'Rustig gewacht en goed gedaan!') : round.noGo ? 'Bij STOP doe je niets. Volgende keer weer!' : `Het was ${round.target.name} ${round.target.emoji}.`}
          onNext={() => onDone({ itemId: round.target.id, correct: phase === 'goed', attempts: 1 + early + wrong, hintsUsed: 0, replays: 0 })}
        />
      )}
    </div>
  );
}

// ---------- A4. Blijf bij je missie ----------
const PLURAL: Record<string, string> = {
  ster: 'sterren', maan: 'manen', raket: 'raketten', planeet: 'planeten',
  komeet: 'kometen', satelliet: 'satellieten', aarde: 'aardes', zon: 'zonnen',
};
export function MissieExercise({ level, support, allowDistraction, onDone }: RoundProps) {
  const round = useMemo(() => {
    const [minT, maxT, total] = [[2, 4, 6], [3, 6, 10], [4, 8, 14], [5, 9, 18]][Math.min(level, 4) - 1];
    const target = THINGS[randInt(0, 7)]; // ruimte-objecten
    const count = randInt(minT, maxT);
    const pool = level >= 3 ? THINGS.filter((t) => t.group === target.group && t.id !== target.id) : THINGS.filter((t) => t.id !== target.id);
    const others = Array.from({ length: total - count }, () => pool[randInt(0, pool.length - 1)]);
    const cells = shuffle([...Array.from({ length: count }, () => target), ...others]);
    const opts = shuffle([...new Set([count, count + 1, Math.max(1, count - 1), count + 2])].slice(0, 3));
    if (!opts.includes(count)) opts[0] = count;
    return { target, count, cells, options: shuffle(opts) };
  }, [level]);
  const [marked, setMarked] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number[]>([]);
  const [done, setDone] = useState<'goed' | 'uitleg' | null>(null);
  const [hint, setHint] = useState(false);
  const text = `Je missie: tel alle ${PLURAL[round.target.id] ?? round.target.short}.`;
  useEffect(() => speak(text), [text]);

  const answer = (n: number) => {
    if (done) return;
    if (n === round.count) setDone('goed');
    else {
      const w = [...wrong, n];
      setWrong(w);
      setMarked([]);
      if (w.length >= 2) setDone('uitleg');
    }
  };

  return (
    <div className="flex flex-col gap-5 fade-in relative overflow-hidden">
      <Instruction text={text}>
        <div className="text-5xl" aria-hidden>{round.target.emoji}</div>
      </Instruction>
      {allowDistraction && !done && (
        <div aria-hidden className="pointer-events-none absolute top-24 left-0 text-4xl opacity-60" style={{ animation: 'drift 12s linear infinite' }}>
          🛸
        </div>
      )}
      <p className="text-white/70">Tik op elk plaatje dat je telt. Dan weet je welke je al hebt gehad.</p>
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-w-xl mx-auto w-full">
        {round.cells.map((c, i) => (
          <button
            key={i}
            onClick={() => setMarked((m) => (m.includes(i) ? m.filter((x) => x !== i) : [...m, i]))}
            className={`aspect-square rounded-xl text-3xl flex items-center justify-center border-2 ${
              marked.includes(i) ? 'border-sun bg-sun/20' : done === 'uitleg' && c === round.target ? 'border-leaf' : 'border-white/5 bg-night-3'
            }`}
            aria-label={c.short}
          >
            {c.emoji}
          </button>
        ))}
      </div>
      {!done && (
        <>
          <p className="text-lg font-bold">Hoeveel heb je er geteld? {marked.length > 0 && <span className="text-sun">(Je hebt er {marked.length} aangetikt.)</span>}</p>
          <div className="grid grid-cols-3 gap-3">
            {round.options.map((o) => (
              <Button key={o} variant="choice" disabled={wrong.includes(o)} onClick={() => answer(o)} className="text-2xl">
                {o}
              </Button>
            ))}
          </div>
          <Button variant="ghost" className={support && !hint ? 'ring-2 ring-sun' : ''} onClick={() => setHint(true)}>💡 Tip</Button>
          {hint && <HintBox>Begin linksboven. Ga rij voor rij, net als bij lezen. Tik elke {round.target.short} aan.</HintBox>}
          {wrong.length > 0 && <Gentle>Bijna! Tel nog een keer rustig. Tik ze één voor één aan.</Gentle>}
        </>
      )}
      {done && (
        <Feedback
          kind={done}
          title={done === 'goed' ? 'Missie geslaagd! Je bleef goed bij je taak.' : `Het waren er ${round.count}. Goed geprobeerd!`}
          onNext={() => onDone({ itemId: `${round.target.id}-${round.count}`, correct: done === 'goed', attempts: wrong.length + (done === 'goed' ? 1 : 0), hintsUsed: hint ? 1 : 0, replays: 0 })}
        />
      )}
    </div>
  );
}
