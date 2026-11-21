import { useEffect, useRef, useState } from 'react';
import type { RoundProps } from './types';
import { WORDS, WORD_PAIRS, type Word } from '../content/words';
import { QuizRound } from './QuizRound';
import type { QuizItem } from '../content/quiz';
import { allWordCards, putWordCard } from '../core/db';
import { chooseNextWord, newCard, reviewCard } from '../core/srs';
import { outcomeOf, pickFresh } from '../core/adaptive';
import { pickN, shuffle } from '../core/random';
import { Button, SpeakButton } from '../components/ui';
import { speak } from '../core/speech';

/** Aantal nieuwe woorden per sessie (max 3), per sessie-id bijgehouden. */
const introduced = new Map<string, number>();

function meaningItem(w: Word, n: number): QuizItem {
  const others = pickN(WORDS.filter((x) => x.id !== w.id), n - 1).map((x) => x.meaning);
  return {
    id: w.id,
    level: 1,
    prompt: `Wat betekent "${w.word}"?`,
    speak: `Wat betekent ${w.word}?`,
    visual: n <= 2 ? w.emoji : undefined,
    body: w.word,
    options: shuffle([w.meaning, ...others]),
    answer: w.meaning,
    hint: `Luister naar de zin: ${w.sentence}`,
    explain: `"${w.word}" betekent: ${w.meaning}.`,
  };
}

function fillItem(w: Word): QuizItem {
  const re = new RegExp(w.word, 'i');
  const gap = w.sentence.replace(re, '___');
  const others = pickN(WORDS.filter((x) => x.id !== w.id && !!x.article === !!w.article), 2).map((x) => x.word);
  return {
    id: w.id,
    level: 3,
    prompt: 'Welk woord past in de zin?',
    speak: `Welk woord past in de zin? ${gap.replace('___', 'piep')}`,
    body: gap,
    options: shuffle([w.word, ...others]),
    answer: w.word,
    hint: `Het woord betekent: ${w.meaning}.`,
    explain: w.sentence,
  };
}

function pairItem(p: (typeof WORD_PAIRS)[number]): QuizItem {
  return {
    id: p.id,
    level: 4,
    prompt: p.kind === 'synoniem' ? `Welk woord betekent hetzelfde als "${p.word}"?` : `Wat is het tegenovergestelde van "${p.word}"?`,
    body: p.word,
    options: shuffle([p.answer, ...p.distractors]),
    answer: p.answer,
    hint: p.kind === 'synoniem' ? 'Zoek een woord dat je in plaats van dit woord kunt zeggen.' : 'Zoek het woord dat precies het omgekeerde is.',
    explain: p.kind === 'synoniem' ? `"${p.word}" en "${p.answer}" betekenen hetzelfde.` : `Het tegenovergestelde van "${p.word}" is "${p.answer}".`,
  };
}

export function WoordenExercise({ level, support, unlocked, recentIds, sessionId, onDone }: RoundProps) {
  const [word, setWord] = useState<Word | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [phase, setPhase] = useState<'laden' | 'uitleg' | 'vraag'>('laden');
  const [item, setItem] = useState<QuizItem | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      // Niveau 4: soms synoniemen/tegenstellingen (als de ouder dit heeft vrijgegeven)
      if (level >= 4 && unlocked.includes('synoniemen') && Math.random() < 0.5) {
        setItem(pairItem(pickFresh(WORD_PAIRS, recentIds)));
        setPhase('vraag');
        return;
      }
      const maxDiff = level <= 1 ? 1 : level === 2 ? 2 : 3;
      const pool = WORDS.filter((w) => w.difficulty <= maxDiff).map((w) => w.id);
      const cards = await allWordCards();
      const { wordId, isNew } = chooseNextWord(pool, cards, Date.now(), introduced.get(sessionId) ?? 0, 3, recentIds.slice(-2));
      const w = WORDS.find((x) => x.id === wordId)!;
      setWord(w);
      setIsNew(isNew || !cards[w.id]);
      const q = level >= 3 && Math.random() < 0.6 ? fillItem(w) : meaningItem(w, level <= 1 ? 2 : 3);
      setItem(q);
      if (isNew || support) {
        if (isNew) introduced.set(sessionId, (introduced.get(sessionId) ?? 0) + 1);
        setPhase('uitleg');
        speak(`${w.article ? w.article + ' ' : ''}${w.word}. Dat betekent: ${w.meaning}. ${w.sentence}`);
      } else setPhase('vraag');
    })();
  }, [level, unlocked, recentIds, support, sessionId]);

  if (phase === 'laden' || !item) return <p className="text-lg">Even laden…</p>;

  if (phase === 'uitleg' && word) {
    const text = `${word.article ? word.article + ' ' : ''}${word.word}. Dat betekent: ${word.meaning}. ${word.sentence}`;
    return (
      <div className="flex flex-col gap-5 fade-in">
        <p className="text-sea font-bold uppercase tracking-wider text-sm">{isNew ? 'Nieuw woord' : 'Even herhalen'}</p>
        <div className="card rounded-3xl p-6 text-center flex flex-col items-center gap-3">
          <div className="text-7xl" aria-hidden>{word.emoji}</div>
          <h2 className="text-4xl font-extrabold">
            {word.article && <span className="text-white/60 font-bold">{word.article} </span>}
            {word.word}
          </h2>
          <p className="text-xl"><span className="font-bold">Betekenis:</span> {word.meaning}</p>
          <p className="text-xl italic text-white/90">"{word.sentence}"</p>
          <SpeakButton text={text} />
        </div>
        <Button onClick={() => setPhase('vraag')}>Ik snap het. Oefenen! →</Button>
      </div>
    );
  }

  return (
    <QuizRound
      key={item.id}
      item={item}
      support={support}
      onDone={async (r) => {
        if (word) {
          const cards = await allWordCards();
          const card = cards[word.id] ?? newCard(word.id);
          await putWordCard(reviewCard(card, outcomeOf(r)));
        }
        onDone(r);
      }}
    />
  );
}
