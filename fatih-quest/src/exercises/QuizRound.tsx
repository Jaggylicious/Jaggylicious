import { useEffect, useMemo, useState } from 'react';
import type { QuizItem } from '../content/quiz';
import { Button, Marked, SpeakButton } from '../components/ui';
import { Blocks, Clock, Coins } from '../components/visuals';
import { speak } from '../core/speech';
import type { RoundResult } from '../core/types';

interface Props {
  item: QuizItem;
  support: boolean;
  /** Eerst kiezen, dan bevestigen met "Klopt mijn antwoord?" */
  confirm?: boolean;
  onDone: (r: RoundResult) => void;
  maxAttempts?: number;
}

/** Eén meerkeuzevraag met hint, rustig controleren en positieve feedback. */
export function QuizRound({ item, support, confirm = false, onDone, maxAttempts = 2 }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const [status, setStatus] = useState<'kiezen' | 'goed' | 'uitleg'>('kiezen');
  const [hints, setHints] = useState(0);
  const [replays, setReplays] = useState(0);
  const [checked, setChecked] = useState(false);
  const [showVisual, setShowVisual] = useState(false);
  const speakText = useMemo(
    () => item.speak ?? `${item.prompt}. ${item.body ? item.body.replace(/[[\]]/g, '') : ''}`,
    [item],
  );

  useEffect(() => {
    speak(speakText);
  }, [speakText]);

  const evaluate = (choice: string) => {
    if (choice === item.answer) {
      setStatus('goed');
      speak('Goed zo! ' + item.explain);
      return;
    }
    const w = [...wrong, choice];
    setWrong(w);
    setSelected(null);
    if (w.length >= maxAttempts) {
      setStatus('uitleg');
      speak('Kijk, zo zit het. ' + item.explain);
    } else {
      speak('Nog niet helemaal. Probeer het nog eens.');
    }
  };

  const choose = (o: string) => {
    if (status !== 'kiezen' || wrong.includes(o)) return;
    if (confirm) setSelected(o);
    else evaluate(o);
  };

  const finish = () =>
    onDone({
      itemId: item.id,
      correct: status === 'goed',
      attempts: wrong.length + (status === 'goed' ? 1 : 0),
      hintsUsed: hints,
      replays,
      checked,
    });

  const isMoney = item.render?.kind === 'geld';
  const showBlocks = item.render?.kind === 'blokjes';

  return (
    <div className="flex flex-col gap-5 fade-in">
      <div className="flex items-start gap-3">
        <h2 className="text-2xl md:text-3xl font-extrabold flex-1 leading-snug">{item.prompt}</h2>
        <SpeakButton
          text={speakText}
          label="Opnieuw voorlezen"
        />
      </div>

      <div className="card rounded-3xl p-6 flex flex-col items-center gap-4 text-center min-h-40 justify-center">
        {item.visual && <div className="text-6xl" aria-hidden>{item.visual}</div>}
        {item.render?.kind === 'klok' && <Clock h={item.render.h} m={item.render.m} />}
        {isMoney && item.render?.kind === 'geld' && <Coins coins={item.render.coins} />}
        {item.body && (
          <p className="text-3xl md:text-4xl font-extrabold tracking-wide">
            <Marked text={item.body} />
          </p>
        )}
        {showBlocks && showVisual && item.render?.kind === 'blokjes' && (
          <div className="pt-2">
            <Blocks tens={item.render.tens} ones={item.render.ones} />
          </div>
        )}
      </div>

      <div className={`grid gap-3 ${item.options.length > 3 ? 'grid-cols-2' : item.options.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'}`}>
        {item.options.map((o) => {
          const isWrong = wrong.includes(o);
          const isRight = status !== 'kiezen' && o === item.answer;
          const isSel = selected === o;
          return (
            <button
              key={o}
              onClick={() => choose(o)}
              disabled={status !== 'kiezen' || isWrong}
              className={`rounded-2xl min-h-16 px-4 py-3 text-xl md:text-2xl font-bold border-2 transition ${
                isRight
                  ? 'bg-leaf text-night border-leaf'
                  : isWrong
                    ? 'bg-white/5 text-white/40 border-white/5 line-through'
                    : isSel
                      ? 'bg-sea text-night border-sea'
                      : 'bg-night-3 border-white/10 hover:border-sea/70'
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>

      {status === 'kiezen' && (
        <div className="flex flex-wrap gap-3">
          {confirm && (
            <Button
              disabled={!selected}
              onClick={() => {
                setChecked(true);
                if (selected) evaluate(selected);
              }}
              className="flex-1"
            >
              ✓ Klopt mijn antwoord?
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => {
              if (hints === 0) setHints(1);
              if (showBlocks) setShowVisual(true);
              speak(item.hint, true);
            }}
            className={support && hints === 0 ? 'ring-2 ring-sun' : ''}
          >
            💡 {support && hints === 0 ? 'Wil je een tip?' : 'Tip'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setReplays((r) => r + 1);
              speak(speakText, true);
            }}
            aria-label="Opdracht nog een keer horen"
          >
            🔁 Nog eens horen
          </Button>
        </div>
      )}

      {status === 'kiezen' && hints > 0 && (
        <p className="rounded-2xl bg-sun/15 border border-sun/40 p-4 text-lg fade-in">💡 {item.hint}</p>
      )}
      {status === 'kiezen' && wrong.length > 0 && (
        <p className="rounded-2xl bg-white/8 p-4 text-lg fade-in">
          Nog niet helemaal. Kijk nog eens rustig. Je mag het opnieuw proberen. 💪
        </p>
      )}

      {status !== 'kiezen' && (
        <div className={`rounded-3xl p-5 pop ${status === 'goed' ? 'bg-leaf/20 border border-leaf/50' : 'bg-sea/15 border border-sea/40'}`}>
          <p className="text-xl font-extrabold mb-1">
            {status === 'goed'
              ? wrong.length
                ? 'Goed gedaan! Knap dat je het opnieuw probeerde.'
                : checked
                  ? 'Goed! En knap dat je rustig controleerde.'
                  : 'Goed zo!'
              : 'Dit is een lastige. Kijk, zo zit het:'}
          </p>
          <p className="text-lg">{item.explain}</p>
          <Button onClick={finish} className="mt-4 w-full">
            Verder →
          </Button>
        </div>
      )}
    </div>
  );
}
