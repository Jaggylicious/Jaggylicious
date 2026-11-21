import { useEffect, useRef, useState } from 'react';
import { speak } from '../core/speech';

/** Rustige ademhalingsoefening: 4 tellen in, 4 tellen uit. */
export function Breathing({ rounds = 3, onDone }: { rounds?: number; onDone?: () => void }) {
  const [phase, setPhase] = useState<'in' | 'uit'>('in');
  const [count, setCount] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    speak(phase === 'in' ? 'Adem in' : 'Adem uit');
    const t = setTimeout(() => {
      if (phase === 'in') setPhase('uit');
      else {
        const c = count + 1;
        setCount(c);
        if (c >= rounds) doneRef.current?.();
        else setPhase('in');
      }
    }, 4000);
    return () => clearTimeout(t);
  }, [phase, count, rounds]);

  return (
    <div className="flex flex-col items-center gap-4 py-4" aria-live="polite">
      <div
        className="w-40 h-40 rounded-full bg-sea/40 border-4 border-sea flex items-center justify-center text-xl font-extrabold transition-transform duration-[4000ms] ease-in-out"
        style={{ transform: phase === 'in' ? 'scale(1.1)' : 'scale(0.75)' }}
      >
        {phase === 'in' ? 'Adem in…' : 'Adem uit…'}
      </div>
      <p className="text-white/70">
        {Math.min(count + 1, rounds)} van {rounds}
      </p>
    </div>
  );
}
