import { useEffect, useMemo, useState } from 'react';
import type { RoundProps } from './types';
import { checkMission, generateMission, missionText, stepText } from './ruimteLogic';
import { speak } from '../core/speech';
import { Button } from '../components/ui';
import { Feedback, Gentle, Instruction } from './shared';

/** B2 Ruimtemissie + B5 Instructies in stukjes. */
export function RuimteMissieExercise({ level, support, onDone }: RoundProps) {
  const m = useMemo(() => generateMission(level), [level]);
  const text = missionText(m);
  const [placed, setPlaced] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [chunks, setChunks] = useState(false);
  const [replays, setReplays] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<ReturnType<typeof checkMission> | null>(null);
  const [done, setDone] = useState<'goed' | 'uitleg' | null>(null);

  useEffect(() => speak(text), [text]);

  const cellThing = (c: number) => {
    const a = m.anchors.find((x) => x.cell === c);
    if (a) return { thing: a.thing, anchor: true };
    const id = Object.keys(placed).find((k) => placed[k] === c);
    const t = id ? m.tray.find((x) => x.id === id) : undefined;
    return t ? { thing: t, anchor: false } : null;
  };

  const tapCell = (c: number) => {
    if (done) return;
    const occ = cellThing(c);
    if (occ?.anchor) return;
    if (occ && !occ.anchor) {
      // terugpakken
      const next = { ...placed };
      delete next[occ.thing.id];
      setPlaced(next);
      setSelected(occ.thing.id);
      return;
    }
    if (!selected) return;
    setPlaced({ ...placed, [selected]: c });
    setSelected(null);
    setResult(null);
  };

  const check = () => {
    const r = checkMission(m, placed);
    const a = attempts + 1;
    setAttempts(a);
    setResult(r);
    if (r.allOk) {
      setDone('goed');
      speak('Missie geslaagd!');
    } else if (a >= 2) {
      setDone('uitleg');
    } else speak('Bijna! Kijk nog eens naar de opdracht.', true);
  };

  const inTray = m.tray.filter((t) => placed[t.id] === undefined);

  return (
    <div className="flex flex-col gap-4 fade-in">
      <Instruction text={chunks ? 'Jouw opdracht in stukjes:' : text} speakText={text} />
      {chunks && (
        <ol className="flex flex-col gap-2">
          {m.steps.map((s, i) => (
            <li key={i} className={`card rounded-2xl p-3 text-lg font-bold flex items-center gap-3 ${result?.stepOk[i] ? 'border-leaf' : ''}`}>
              <span className="w-9 h-9 rounded-full bg-sea text-night flex items-center justify-center shrink-0">{i + 1}</span>
              <span className="flex-1">{stepText(s)}</span>
              <button onClick={() => speak(stepText(s), true)} className="text-2xl" aria-label={`Stap ${i + 1} voorlezen`}>🔊</button>
            </li>
          ))}
        </ol>
      )}
      <div className="grid gap-2 mx-auto w-full max-w-sm" style={{ gridTemplateColumns: `repeat(${m.size}, minmax(0, 1fr))` }}>
        {Array.from({ length: m.size * m.size }, (_, c) => {
          const occ = cellThing(c);
          return (
            <button
              key={c}
              onClick={() => tapCell(c)}
              aria-label={occ ? occ.thing.short : 'leeg vak'}
              className={`aspect-square rounded-xl text-4xl flex items-center justify-center border-2 ${
                occ?.anchor ? 'bg-white/10 border-white/20' : occ ? 'bg-sea/30 border-sea' : selected ? 'bg-night-3 border-sun/50 border-dashed' : 'bg-night-3 border-white/10'
              }`}
            >
              {occ?.thing.emoji}
            </button>
          );
        })}
      </div>
      {!done && (
        <>
          <p className="text-white/80 text-lg">{selected ? 'Tik nu op een leeg vak.' : 'Pak eerst een ding hieronder. Tik dan op een vak.'}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            {inTray.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(selected === t.id ? null : t.id)}
                aria-label={`Pak ${t.name}`}
                className={`w-20 h-20 rounded-2xl text-5xl flex items-center justify-center border-2 ${selected === t.id ? 'border-sun bg-sun/20' : 'border-white/10 bg-night-3'}`}
              >
                {t.emoji}
              </button>
            ))}
          </div>
          {result && !result.allOk && (
            <Gentle>
              {result.extra.length ? 'Er staat iets op het bord dat niet in de opdracht staat. ' : ''}
              {result.stepOk.some((x) => !x) ? 'Eén stap klopt nog niet. Tik op een ding om het terug te pakken.' : ''}
            </Gentle>
          )}
          <div className="flex flex-wrap gap-3">
            <Button onClick={check} disabled={Object.keys(placed).length === 0} className="flex-1">✓ Klaar! Klopt het?</Button>
            {m.steps.length > 1 && !chunks && (
              <Button variant="ghost" className={support ? 'ring-2 ring-sun' : ''} onClick={() => setChunks(true)}>✂️ In stukjes</Button>
            )}
            <Button variant="ghost" onClick={() => { setReplays((r) => r + 1); speak(text, true); }}>🔁 Nog eens horen</Button>
          </div>
        </>
      )}
      {done && (
        <Feedback
          kind={done}
          title={done === 'goed' ? (chunks ? 'Missie geslaagd! Slim dat je de opdracht in stukjes knipte.' : 'Missie geslaagd!') : 'Dit was een lastige missie. Zo moest het:'}
          text={done === 'uitleg' ? m.steps.map(stepText).join(' ') : undefined}
          onNext={() => onDone({ itemId: text, correct: done === 'goed', attempts, hintsUsed: chunks ? 1 : 0, replays })}
        />
      )}
    </div>
  );
}
