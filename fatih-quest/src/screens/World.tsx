import { useState } from 'react';
import { WORLDS, EXERCISES } from '../core/catalog';
import { go } from '../core/router';
import { Button, Container, Page, TopBar } from '../components/ui';
import { TOPICS } from '../content/ontdek';
import { AFFIRMATIONS } from '../content/emoties';
import { Breathing } from '../components/Breathing';
import { SKDD } from '../components/SKDD';
import { speak } from '../core/speech';
import { useProfile } from '../core/store';
import { isExerciseAvailable } from '../core/availability';

export function World({ id }: { id: string }) {
  const w = WORLDS.find((x) => x.id === id);
  const [tool, setTool] = useState<'adem' | 'skdd' | null>(null);
  const { profile } = useProfile();
  if (!w || !profile) return null;
  const unlocked = profile.settings.unlockedTopics;
  const nature = id === 'taal' || id === 'emotie' || id === 'ontdek';

  return (
    <Page nature={nature}>
      <TopBar title={`${w.emoji} ${w.title}`} onBack={() => (tool ? setTool(null) : go('home'))} />
      <Container>
        {tool === 'adem' && (
          <div className="card rounded-3xl p-6 flex flex-col items-center gap-3">
            <h2 className="text-2xl font-extrabold">Rustig ademhalen</h2>
            <Breathing rounds={5} onDone={() => setTool(null)} />
          </div>
        )}
        {tool === 'skdd' && <SKDD onDone={() => setTool(null)} />}

        {!tool && id !== 'ontdek' && (
          <div className="flex flex-col gap-3 mt-2">
            {w.exercises.map((e) => {
              const m = EXERCISES[e];
              const open = isExerciseAvailable(e, unlocked);
              return (
                <button key={e} disabled={!open} onClick={() => go(`oefen/${e}`)} className="card rounded-3xl p-5 flex items-center gap-4 text-left hover:border-sea/50 active:scale-[.99] transition disabled:opacity-45 disabled:active:scale-100">
                  <div className="text-5xl" aria-hidden>{m.emoji}</div>
                  <div className="flex-1">
                    <div className="text-xl font-extrabold">{m.title}</div>
                    <div className="text-white/70">{open ? m.childGoal : 'Komt later. Papa of mama zet deze voor je aan.'}</div>
                  </div>
                  <div className="text-2xl" aria-hidden>{open ? '→' : '🔒'}</div>
                </button>
              );
            })}
            {id === 'concentratie' && (
              <button onClick={() => setTool('skdd')} className="card rounded-3xl p-5 flex items-center gap-4 text-left hover:border-sea/50">
                <div className="text-5xl" aria-hidden>🛑</div>
                <div className="flex-1">
                  <div className="text-xl font-extrabold">Stop – Kijk – Denk – Doe</div>
                  <div className="text-white/70">Onze vaste routine voor elke opdracht.</div>
                </div>
              </button>
            )}
            {id === 'emotie' && (
              <>
                <button onClick={() => setTool('adem')} className="card rounded-3xl p-5 flex items-center gap-4 text-left hover:border-sea/50">
                  <div className="text-5xl" aria-hidden>🌬️</div>
                  <div className="flex-1">
                    <div className="text-xl font-extrabold">Rustig ademhalen</div>
                    <div className="text-white/70">Adem samen met de cirkel.</div>
                  </div>
                </button>
                <div className="card rounded-3xl p-5">
                  <h2 className="text-xl font-extrabold mb-3">💪 Zinnen die helpen</h2>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {AFFIRMATIONS.map((a) => (
                      <button key={a} onClick={() => speak(a, true)} className="rounded-2xl bg-sun/15 border border-sun/30 p-3 text-lg font-bold text-left">
                        "{a}"
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-white/60 text-sm">
                  Voor ouders: deze oefeningen zijn bedoeld om over gevoelens te leren. Ze stellen geen diagnose en
                  antwoorden worden niet opgeslagen. Maakt u zich zorgen over uw kind? Neem contact op met de huisarts of
                  de jeugdverpleegkundige.
                </p>
              </>
            )}
          </div>
        )}

        {!tool && id === 'ontdek' && (
          <>
            <p className="text-lg text-white/80 mt-2 mb-4">Kies een onderwerp. Je kunt het verhaal ook laten voorlezen.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TOPICS.map((t) => (
                <button key={t.id} onClick={() => go(`oefen/ontdek/${t.id}`)} className="card rounded-3xl p-5 text-left hover:border-sea/50 active:scale-[.98] transition">
                  <div className="text-5xl" aria-hidden>{t.emoji}</div>
                  <div className="text-lg font-extrabold mt-2">{t.title}</div>
                </button>
              ))}
            </div>
          </>
        )}
        {!tool && (
          <Button variant="ghost" className="w-full mt-6" onClick={() => go('home')}>
            🏠 Terug naar de basis
          </Button>
        )}
      </Container>
    </Page>
  );
}
