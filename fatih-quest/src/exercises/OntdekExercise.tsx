import { useMemo, useState } from 'react';
import type { RoundProps } from './types';
import { TOPICS } from '../content/ontdek';
import { pickFresh } from '../core/adaptive';
import { shuffle } from '../core/random';
import { speak } from '../core/speech';
import { Button, SpeakButton } from '../components/ui';
import { Feedback, Gentle, HintBox } from './shared';

/** F: Ontdekverhaal – lezen (of voorlezen), moeilijke woorden, drie vragen, ontdektaak. */
export function OntdekExercise({ param, recentIds, onDone }: RoundProps) {
  const topic = useMemo(() => TOPICS.find((t) => t.id === param) ?? pickFresh(TOPICS, recentIds), [param, recentIds]);
  const [phase, setPhase] = useState<'lees' | 'vraag' | 'taak'>('lees');
  const [qi, setQi] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [hint, setHint] = useState(false);
  const [qDone, setQDone] = useState<'goed' | 'uitleg' | null>(null);
  const [score, setScore] = useState({ first: 0, hints: 0, attempts: 0 });
  const q = topic.questions[qi];
  const opts = useMemo(() => shuffle(q.options), [q]);
  const storyText = topic.story.join(' ');

  if (phase === 'lees') {
    return (
      <div className="flex flex-col gap-5 fade-in">
        <div className="flex items-center gap-3">
          <span className="text-6xl" aria-hidden>{topic.emoji}</span>
          <h2 className="text-3xl font-extrabold flex-1">{topic.title}</h2>
          <SpeakButton text={`${topic.title}. ${storyText}`} label="Lees het verhaal voor" />
        </div>
        <div className="card rounded-3xl p-6 flex flex-col gap-3 text-xl leading-relaxed bg-cream/5">
          {topic.story.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="card rounded-3xl p-5">
          <h3 className="text-lg font-extrabold mb-2">📘 Moeilijke woorden</h3>
          <ul className="flex flex-col gap-2 text-lg">
            {topic.words.map((w) => (
              <li key={w.word}>
                <strong>{w.word}</strong>: {w.meaning}
              </li>
            ))}
          </ul>
        </div>
        <Button onClick={() => { setPhase('vraag'); speak(topic.questions[qi].q); }}>Ik heb het gelezen. Naar de vragen →</Button>
      </div>
    );
  }

  if (phase === 'taak') {
    return (
      <div className="flex flex-col gap-5 fade-in">
        <div className="rounded-3xl p-6 bg-leaf/15 border border-leaf/40">
          <p className="text-sm uppercase tracking-wider text-leaf font-bold">Ontdektaak</p>
          <p className="text-2xl font-bold mt-2">🔍 {topic.task}</p>
          <p className="text-white/70 mt-3">Je hoeft dit niet nu te doen. Misschien later, samen met papa of mama.</p>
        </div>
        <Button
          onClick={() =>
            onDone({ itemId: topic.id, correct: score.first >= 2, attempts: score.attempts, hintsUsed: score.hints, replays: 0 })
          }
        >
          Klaar →
        </Button>
      </div>
    );
  }

  const answer = (o: string) => {
    if (qDone || wrong.includes(o)) return;
    if (o === q.answer) {
      setQDone('goed');
      setScore((s) => ({ first: s.first + (wrong.length === 0 && !hint ? 1 : 0), hints: s.hints + (hint ? 1 : 0), attempts: s.attempts + wrong.length + 1 }));
      speak('Goed zo!');
    } else {
      const w = [...wrong, o];
      setWrong(w);
      if (w.length >= 2) {
        setQDone('uitleg');
        setScore((s) => ({ ...s, hints: s.hints + (hint ? 1 : 0), attempts: s.attempts + w.length }));
      }
    }
  };

  const next = () => {
    if (qi + 1 < topic.questions.length) {
      setQi(qi + 1);
      setWrong([]);
      setHint(false);
      setQDone(null);
      speak(topic.questions[qi + 1].q);
    } else setPhase('taak');
  };

  return (
    <div className="flex flex-col gap-5 fade-in">
      <p className="text-white/70 font-bold">Vraag {qi + 1} van 3</p>
      <div className="flex items-start gap-3">
        <h2 className="text-2xl md:text-3xl font-extrabold flex-1">{q.q}</h2>
        <SpeakButton text={q.q} />
      </div>
      <div className="flex flex-col gap-3">
        {opts.map((o) => (
          <button
            key={o}
            onClick={() => answer(o)}
            disabled={!!qDone || wrong.includes(o)}
            className={`rounded-2xl min-h-14 px-4 py-3 text-xl font-bold border-2 text-left ${
              qDone && o === q.answer ? 'bg-leaf text-night border-leaf' : wrong.includes(o) ? 'opacity-40 line-through border-transparent' : 'bg-night-3 border-white/10 hover:border-sea/60'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      {!qDone && (
        <div className="flex gap-3 flex-wrap">
          <Button variant="ghost" onClick={() => setHint(true)}>💡 Tip</Button>
          <Button variant="ghost" onClick={() => setPhase('lees')}>📖 Terug naar het verhaal</Button>
        </div>
      )}
      {!qDone && hint && <HintBox>{q.hint}</HintBox>}
      {!qDone && wrong.length > 0 && <Gentle>Nog niet. Zoek het rustig op in het verhaal.</Gentle>}
      {qDone && <Feedback kind={qDone} title={qDone === 'goed' ? 'Goed gelezen!' : `Het antwoord is: ${q.answer}.`} onNext={next} />}
    </div>
  );
}
