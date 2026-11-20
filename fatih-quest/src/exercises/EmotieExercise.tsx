import { useEffect, useMemo, useState } from 'react';
import type { RoundProps } from './types';
import { FEELINGS, SCENARIOS, STRATEGIES } from '../content/emoties';
import { pickFresh } from '../core/adaptive';
import { shuffle } from '../core/random';
import { speak } from '../core/speech';
import { Button, SpeakButton } from '../components/ui';
import { Breathing } from '../components/Breathing';
import { Gentle } from './shared';

/**
 * E: Gevoelens ontdekken. Er zijn geen foute gevoelens.
 * Keuzes worden NIET opgeslagen – alleen dat de oefening gedaan is.
 */
export function EmotieExercise({ recentIds, onDone }: RoundProps) {
  const sc = useMemo(() => pickFresh(SCENARIOS, recentIds), [recentIds]);
  const options = useMemo(
    () =>
      shuffle([
        ...shuffle(sc.helpful).slice(0, 2).map((id) => ({ ...STRATEGIES[id], helpful: true, why: '' })),
        { id: 'minder', label: sc.lessHelpful.label, emoji: sc.lessHelpful.emoji, helpful: false, why: sc.lessHelpful.why },
      ]),
    [sc],
  );
  const [step, setStep] = useState<'voel' | 'help' | 'adem' | 'klaar'>('voel');
  const [feeling, setFeeling] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => speak(`${sc.text} Wat zou jij voelen?`), [sc]);

  return (
    <div className="flex flex-col gap-5 fade-in">
      <div className="card rounded-3xl p-5 flex items-center gap-4">
        <div className="text-6xl" aria-hidden>{sc.emoji}</div>
        <p className="text-2xl font-bold flex-1">{sc.text}</p>
        <SpeakButton text={sc.text} />
      </div>

      {step === 'voel' && (
        <>
          <h2 className="text-2xl font-extrabold">Wat zou jij voelen?</h2>
          <p className="text-white/70 -mt-3">Er is geen goed of fout. Je mag ook overslaan.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FEELINGS.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setFeeling(f.label);
                  speak(`Je zou je ${f.label} voelen. Dat kan. Alle gevoelens mogen er zijn.`);
                  setTimeout(() => setStep('help'), 50);
                }}
                className="rounded-2xl bg-night-3 border-2 border-white/10 hover:border-sea/60 p-3 flex flex-col items-center gap-1"
              >
                <span className="text-5xl" aria-hidden>{f.emoji}</span>
                <span className="text-lg font-bold">{f.label}</span>
              </button>
            ))}
          </div>
          <Button variant="ghost" onClick={() => setStep('help')}>Overslaan</Button>
        </>
      )}

      {step === 'help' && (
        <>
          {feeling && <Gentle>Je zou je <strong>{feeling}</strong> voelen. Dat kan. Alle gevoelens mogen er zijn.</Gentle>}
          <h2 className="text-2xl font-extrabold">Wat kan dan helpen?</h2>
          <div className="flex flex-col gap-3">
            {options.map((o) => (
              <Button
                key={o.id}
                variant="choice"
                className="text-left flex items-center gap-3"
                onClick={() => {
                  if (o.helpful) {
                    speak(`Goed idee! ${sc.tip}`);
                    if (o.id === 'ademen') setStep('adem');
                    else setStep('klaar');
                  } else {
                    setNote(o.why);
                    speak(o.why, true);
                  }
                }}
              >
                <span className="text-3xl" aria-hidden>{o.emoji}</span> {o.label}
              </Button>
            ))}
          </div>
          {note && <Gentle>🤔 {note}</Gentle>}
        </>
      )}

      {step === 'adem' && (
        <>
          <h2 className="text-2xl font-extrabold">Laten we het samen proberen</h2>
          <Breathing rounds={3} onDone={() => setStep('klaar')} />
          <Button variant="ghost" onClick={() => setStep('klaar')}>Klaar</Button>
        </>
      )}

      {step === 'klaar' && (
        <div className="rounded-3xl p-5 bg-leaf/20 border border-leaf/50 pop">
          <p className="text-xl font-extrabold mb-2">Goed idee! 💛</p>
          <p className="text-2xl font-bold">"{sc.tip}"</p>
          <Button className="mt-4 w-full" onClick={() => onDone({ itemId: sc.id, correct: true, attempts: 1, hintsUsed: 0, replays: 0, unscored: true })}>
            Verder →
          </Button>
        </div>
      )}
    </div>
  );
}
