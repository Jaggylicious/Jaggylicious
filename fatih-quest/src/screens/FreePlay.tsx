import { useState } from 'react';
import type { ExerciseId } from '../core/types';
import { EXERCISES } from '../core/catalog';
import { go } from '../core/router';
import { Button, Container, Page, TopBar } from '../components/ui';
import { ExerciseRunner, type RunSummary } from '../exercises/ExerciseRunner';
import { useSessionRecorder } from '../core/useSession';

export function FreePlay({ id, param }: { id: ExerciseId; param?: string }) {
  const meta = EXERCISES[id];
  const { session, add, tick, finish } = useSessionRecorder('vrij');
  const [result, setResult] = useState<RunSummary | null>(null);
  const [runKey, setRunKey] = useState(0);
  const back = () => go(meta.world === 'ontdek' ? 'wereld/ontdek' : `wereld/${meta.world}`);

  if (!meta) return null;
  return (
    <Page nature={meta.world === 'ontdek' || meta.world === 'emotie' || meta.world === 'taal'}>
      <TopBar title={`${meta.emoji} ${meta.title}`} onBack={back} />
      <Container>
        {!result ? (
          <ExerciseRunner
            key={runKey}
            exerciseId={id}
            sessionId={session.id}
            param={param}
            maxRounds={meta.freeRounds}
            intro={id !== 'ontdek'}
            onProgress={(d) => tick(id, d)}
            onExit={async (s) => {
              await add(id, s.activeSeconds, s.pauses);
              await finish(!s.stoppedEarly, s.stoppedEarly);
              setResult(s);
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-5 text-center fade-in mt-6">
            <div className="text-8xl float" aria-hidden>🌟</div>
            <h2 className="text-3xl font-extrabold">{result.stoppedEarly ? 'Goed dat je even stopt!' : 'Klaar!'}</h2>
            <p className="text-xl">
              Je deed {result.rounds} {result.rounds === 1 ? 'opdracht' : 'opdrachten'} en verdiende <strong>{result.stars}</strong> ⭐
            </p>
            <div className="flex flex-col gap-3 w-full">
              {id !== 'ontdek' && !result.stoppedEarly && (
                <Button variant="secondary" onClick={() => { setResult(null); setRunKey((k) => k + 1); }}>
                  Nog een rondje
                </Button>
              )}
              <Button onClick={back}>Terug naar de wereld</Button>
            </div>
          </div>
        )}
      </Container>
    </Page>
  );
}
