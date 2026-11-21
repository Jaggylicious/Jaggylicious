import { useState } from 'react';
import { Button } from './ui';
import { speak } from '../core/speech';

const STEPS = [
  { key: 'STOP', emoji: '🛑', q: 'Wat is mijn opdracht?', color: 'bg-rose-400' },
  { key: 'KIJK', emoji: '👀', q: 'Wat heb ik nodig?', color: 'bg-amber-300' },
  { key: 'DENK', emoji: '💭', q: 'Wat is mijn eerste stap?', color: 'bg-sky-300' },
  { key: 'DOE', emoji: '✅', q: 'Ik begin rustig.', color: 'bg-leaf' },
];

/** A5: vaste vierstappenroutine Stop – Kijk – Denk – Doe. */
export function SKDD({ task, onDone }: { task?: string; onDone: () => void }) {
  const [i, setI] = useState(0);
  const s = STEPS[i];
  const extra = i === 0 && task ? task : i === 1 ? 'Goed kijken en luisteren. Je mag altijd een tip vragen.' : i === 2 ? 'Wat doe ik als eerste?' : '';
  return (
    <div className="flex flex-col gap-4 fade-in">
      <div className="flex gap-2" aria-hidden>
        {STEPS.map((x, j) => (
          <div key={x.key} className={`flex-1 h-2 rounded-full ${j <= i ? x.color : 'bg-white/10'}`} />
        ))}
      </div>
      <div className="card rounded-3xl p-6 flex flex-col items-center text-center gap-3">
        <div className={`w-20 h-20 rounded-full ${s.color} flex items-center justify-center text-4xl`}>{s.emoji}</div>
        <p className="text-3xl font-extrabold tracking-widest">{s.key}</p>
        <p className="text-2xl font-bold">{s.q}</p>
        {extra && <p className="text-lg text-white/80">{extra}</p>}
        <button className="text-2xl w-12 h-12 rounded-full hover:bg-white/10" onClick={() => speak(`${s.key}. ${s.q} ${extra}`, true)} aria-label="Voorlezen">🔊</button>
      </div>
      <Button
        onClick={() => {
          if (i < STEPS.length - 1) {
            setI(i + 1);
            speak(`${STEPS[i + 1].key}. ${STEPS[i + 1].q}`);
          } else onDone();
        }}
      >
        {i < STEPS.length - 1 ? 'Volgende →' : 'Ik begin!'}
      </Button>
    </div>
  );
}
