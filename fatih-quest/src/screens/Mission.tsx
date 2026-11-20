import { useEffect, useMemo, useRef, useState } from 'react';
import { useProfile } from '../core/store';
import { planMission } from '../core/mission';
import { go } from '../core/router';
import { Button, Container, Page, TopBar } from '../components/ui';
import { SKDD } from '../components/SKDD';
import { Breathing } from '../components/Breathing';
import { ExerciseRunner, type RunSummary } from '../exercises/ExerciseRunner';
import { useSessionRecorder } from '../core/useSession';
import { speak } from '../core/speech';
import { AFFIRMATIONS } from '../content/emoties';
import { EXERCISES } from '../core/catalog';

const COMPLETE_BONUS = 3;

export function Mission() {
  const { profile, addStars } = useProfile();
  const plan = useMemo(() => planMission(profile?.settings.missionMinutes ?? 12), [profile?.settings.missionMinutes]);
  const { session, add, tick, finish } = useSessionRecorder('missie');
  const [blockIdx, setBlockIdx] = useState(-1); // -1 = overzicht
  const [startStep, setStartStep] = useState<'adem' | 'skdd'>('adem');
  const [earned, setEarned] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const startedAt = useRef(Date.now());
  const affirmation = useMemo(() => AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)], []);

  const block = blockIdx >= 0 ? plan.blocks[blockIdx] : null;

  useEffect(() => {
    if (blockIdx === -1) speak(`Missie: ${plan.title}. ${plan.blocks.length - 1} korte stukjes.`);
  }, [blockIdx, plan]);

  const startSeconds = useRef(0);
  const nextBlock = () => {
    if (blockIdx === -1) startedAt.current = Date.now();
    if (blockIdx === 0) startSeconds.current = Math.round((Date.now() - startedAt.current) / 1000);
    setBlockIdx((i) => i + 1);
  };

  const onExerciseExit = async (s: RunSummary) => {
    setEarned((e) => e + s.stars);
    if (block?.exerciseId) {
      await add(block.exerciseId, s.activeSeconds, s.pauses);
      setDone((d) => [...d, block.title]);
    }
    if (s.stoppedEarly) {
      setBlockIdx(plan.blocks.length - 1);
      return;
    }
    nextBlock();
  };

  useEffect(() => {
    if (block?.kind === 'afsluiting') {
      (async () => {
        const completed = done.length >= plan.blocks.filter((b) => b.kind === 'oefening').length;
        if (completed) {
          await addStars(COMPLETE_BONUS);
          setEarned((e) => e + COMPLETE_BONUS);
        }
        await finish(completed, !completed, startSeconds.current);
        speak(completed ? `Missie voltooid! ${affirmation}` : `Goed gewerkt vandaag! ${affirmation}`);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block?.kind]);

  if (!profile) return null;
  const nature = plan.theme === 'natuur';

  return (
    <Page nature={nature}>
      <TopBar
        title={plan.title}
        onBack={() => {
          if (blockIdx > 0 && block?.kind !== 'afsluiting') finish(false, true);
          go('home');
        }}
      />
      <Container>
        {blockIdx === -1 && (
          <div className="flex flex-col gap-4 fade-in">
            <div className="card rounded-3xl p-6">
              <p className="text-sea font-bold uppercase tracking-wider text-sm">Missie</p>
              <h2 className="text-3xl font-extrabold">{plan.title}</h2>
              <p className="text-white/70">{plan.blocks.length - 1} korte activiteiten · {profile.settings.missionMinutes} minuten</p>
            </div>
            <ol className="flex flex-col gap-3">
              {plan.blocks.slice(0, -1).map((b, i) => (
                <li key={i} className="card rounded-2xl p-4 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-sea text-night font-extrabold flex items-center justify-center shrink-0">{i + 1}</span>
                  <div className="flex-1">
                    <p className="font-extrabold text-lg">{b.title}</p>
                    <p className="text-white/70">{b.subtitle}</p>
                  </div>
                  <span className="text-white/60 font-bold whitespace-nowrap">{Math.max(1, Math.round(b.seconds / 60))} min</span>
                </li>
              ))}
            </ol>
            <p className="text-white/70">Je mag altijd pauzeren of stoppen. Stoppen is ook oké.</p>
            <Button onClick={nextBlock}>🚀 Klaar voor vertrek!</Button>
          </div>
        )}

        {block?.kind === 'start' && (
          <div className="flex flex-col gap-4 fade-in">
            <h2 className="text-2xl font-extrabold">Klaar voor vertrek</h2>
            {startStep === 'adem' ? (
              <>
                <p className="text-lg">We beginnen rustig. Adem drie keer samen met de cirkel.</p>
                <Breathing rounds={3} onDone={() => setStartStep('skdd')} />
                <Button variant="ghost" onClick={() => setStartStep('skdd')}>Overslaan</Button>
              </>
            ) : (
              <>
                <p className="text-lg">Dit is onze vaste routine. Die gebruik je bij elke opdracht.</p>
                <SKDD task={`Mijn missie: ${plan.blocks.filter((b) => b.exerciseId).map((b) => EXERCISES[b.exerciseId!].title.toLowerCase()).join(', ')}.`} onDone={nextBlock} />
              </>
            )}
          </div>
        )}

        {block?.kind === 'oefening' && block.exerciseId && (
          <div className="flex flex-col gap-3">
            <p className="text-white/70 font-bold">
              Stukje {blockIdx} van {plan.blocks.length - 2}: {block.title}
            </p>
            <ExerciseRunner
              key={blockIdx}
              exerciseId={block.exerciseId}
              sessionId={session.id}
              timeLimitSec={block.seconds}
              maxRounds={12}
              onProgress={(d) => tick(block.exerciseId!, d)}
              onExit={onExerciseExit}
            />
          </div>
        )}

        {block?.kind === 'afsluiting' && (
          <div className="flex flex-col gap-5 fade-in text-center items-center">
            <div className="text-8xl float" aria-hidden>{done.length >= 3 ? '🏆' : '🌟'}</div>
            <h2 className="text-3xl font-extrabold">{done.length >= 3 ? 'Missie voltooid!' : 'Goed gewerkt!'}</h2>
            <p className="text-xl">Je verdiende vandaag <strong>{earned} sterren</strong> ⭐</p>
            {done.length > 0 && (
              <div className="card rounded-3xl p-5 w-full text-left">
                <p className="font-extrabold mb-2">Dit heb je gedaan:</p>
                <ul className="flex flex-col gap-1 text-lg">
                  {done.map((d, i) => (
                    <li key={i}>✅ {d}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="rounded-3xl bg-sun/15 border border-sun/40 p-5 w-full">
              <p className="text-sm uppercase tracking-wider font-bold text-sun">Onthoud</p>
              <p className="text-2xl font-extrabold">"{affirmation}"</p>
            </div>
            <Button className="w-full" onClick={() => go('home')}>Terug naar de basis 🏠</Button>
          </div>
        )}
      </Container>
    </Page>
  );
}
