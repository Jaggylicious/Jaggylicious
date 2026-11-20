import { useEffect, useMemo, useState } from 'react';
import type { RoundProps } from './types';
import { STORY_PROBLEMS } from '../content/verhaalsommen';
import { numberOptions, shuffle } from '../content/rekenen';
import { pickFresh } from '../core/adaptive';
import { speak } from '../core/speech';
import { Button, SpeakButton } from '../components/ui';
import { Feedback, Gentle, HintBox } from './shared';

export function VerhaalsomExercise({ level, support, recentIds, onDone }: RoundProps) {
  const p = useMemo(() => {
    const exact = STORY_PROBLEMS.filter((x) => x.level === level);
    return pickFresh(exact.length ? exact : STORY_PROBLEMS, recentIds);
  }, [level, recentIds]);
  const qOptions = useMemo(() => shuffle([p.question, ...p.sentences]), [p]);
  const nOptions = useMemo(() => numberOptions(p.answer), [p]);
  const full = `${p.sentences[0]} ${p.sentences[1]} ${p.question}`;
  const [step, setStep] = useState<'vraag' | 'reken' | 'goed' | 'uitleg'>('vraag');
  const [qWrong, setQWrong] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [hint, setHint] = useState(false);

  useEffect(() => speak(full + ' Wat is de vraag?'), [full]);

  const pickQ = (q: string) => {
    if (q === p.question) {
      setStep('reken');
      speak('Goed, dat is de vraag! Welke som hoort erbij?');
    } else {
      setQWrong((n) => n + 1);
      speak('Dat is een zin uit het verhaal. De vraag eindigt met een vraagteken.', true);
    }
  };

  const check = () => {
    if (!sel) return;
    if (Number(sel) === p.answer) { setStep('goed'); speak('Goed zo!'); }
    else {
      const w = [...wrong, sel];
      setWrong(w);
      setSel(null);
      if (w.length >= 2) setStep('uitleg');
    }
  };

  return (
    <div className="flex flex-col gap-5 fade-in">
      <div className="card rounded-3xl p-5 flex gap-4 items-start">
        <div className="text-5xl" aria-hidden>{p.emoji}</div>
        <p className="text-xl leading-relaxed flex-1">
          {p.sentences[0]} {p.sentences[1]}{' '}
          <span className={step !== 'vraag' ? 'bg-sun text-night rounded px-1 font-bold' : ''}>{p.question}</span>
        </p>
        <SpeakButton text={full} />
      </div>

      {step === 'vraag' && (
        <>
          <h2 className="text-2xl font-extrabold">Stap 1: Wat is de vraag?</h2>
          <div className="flex flex-col gap-3">
            {qOptions.map((q) => (
              <Button key={q} variant="choice" className="text-left" onClick={() => pickQ(q)}>{q}</Button>
            ))}
          </div>
          {(qWrong > 0 || support) && <HintBox>De vraag eindigt met een vraagteken (?).</HintBox>}
        </>
      )}

      {step === 'reken' && (
        <>
          <h2 className="text-2xl font-extrabold">Stap 2: Reken uit</h2>
          {(hint || support) && (
            <HintBox>
              De som is: <strong>{p.sum} = ?</strong>
            </HintBox>
          )}
          <div className="grid grid-cols-2 gap-3">
            {nOptions.map((o) => (
              <button key={o} disabled={wrong.includes(o)} onClick={() => setSel(o)} className={`rounded-2xl min-h-16 text-2xl font-bold border-2 ${wrong.includes(o) ? 'opacity-30 line-through border-transparent' : sel === o ? 'bg-sea text-night border-sea' : 'bg-night-3 border-white/10'}`}>
                {o} <span className="text-base font-semibold opacity-70">{p.unit}</span>
              </button>
            ))}
          </div>
          {wrong.length > 0 && <Gentle>Nog niet. Lees de vraag nog eens en reken rustig opnieuw.</Gentle>}
          <div className="flex gap-3 flex-wrap">
            <Button disabled={!sel} onClick={check} className="flex-1">✓ Klopt mijn antwoord?</Button>
            {!hint && !support && <Button variant="ghost" onClick={() => setHint(true)}>💡 Welke som?</Button>}
          </div>
        </>
      )}

      {(step === 'goed' || step === 'uitleg') && (
        <Feedback
          kind={step}
          title={step === 'goed' ? 'Goed gedaan! Je zocht eerst de vraag. Slim!' : 'Kijk, zo reken je het uit:'}
          text={`${p.sum} = ${p.answer} ${p.unit}`}
          onNext={() => onDone({ itemId: p.id, correct: step === 'goed', attempts: wrong.length + qWrong + (step === 'goed' ? 1 : 0), hintsUsed: hint ? 1 : 0, replays: 0, checked: true })}
        />
      )}
    </div>
  );
}
