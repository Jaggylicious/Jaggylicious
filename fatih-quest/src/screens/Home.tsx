import { useProfile } from '../core/store';
import { go } from '../core/router';
import { WORLDS } from '../core/catalog';
import { Container, Page, Stars } from '../components/ui';
import { planMission } from '../core/mission';

export function Home() {
  const { profile } = useProfile();
  if (!profile) return null;
  const plan = planMission(profile.settings.missionMinutes, new Date(), profile.settings.unlockedTopics);
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Goedemorgen' : hour < 18 ? 'Hoi' : 'Goedenavond';
  return (
    <Page>
      <header className="flex items-center gap-3 px-4 pt-[max(env(safe-area-inset-top),14px)] pb-2 max-w-3xl mx-auto w-full">
        <div className="flex-1">
          <p className="text-sea font-bold tracking-wide text-sm">FATIH QUEST</p>
          <p className="text-white/60 text-sm">Ontdek. Leer. Groei.</p>
        </div>
        <Stars n={profile.stars} />
        <button onClick={() => go('ouder')} className="rounded-full bg-white/10 h-11 min-w-11 px-3 text-sm font-bold" aria-label="Ouderomgeving">
          🔒 Ouder
        </button>
      </header>
      <Container>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-3">
          {greet} {profile.settings.childName}! <span aria-hidden>👋</span>
        </h1>
        <p className="text-lg text-white/80 mt-1">Waar gaan we vandaag op ontdekkingstocht?</p>

        <button
          onClick={() => go('missie')}
          className="mt-5 w-full text-left rounded-3xl p-6 bg-gradient-to-br from-sea/90 to-teal-700 text-night shadow-xl shadow-black/30 active:scale-[.99] transition"
        >
          <div className="flex items-center gap-4">
            <div className="text-6xl float" aria-hidden>{plan.theme === 'ruimte' ? '🚀' : '🌿'}</div>
            <div className="flex-1">
              <p className="font-bold uppercase text-sm tracking-wider opacity-80">Missie van vandaag</p>
              <p className="text-2xl md:text-3xl font-extrabold">{plan.title}</p>
              <p className="font-semibold opacity-90">
                {plan.blocks.length - 1} korte stukjes · {profile.settings.missionMinutes} minuten
              </p>
            </div>
            <div className="text-4xl" aria-hidden>▶</div>
          </div>
        </button>

        <h2 className="text-xl font-extrabold mt-8 mb-3">Werelden</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {WORLDS.map((w) => (
            <button
              key={w.id}
              onClick={() => go(`wereld/${w.id}`)}
              className={`rounded-3xl p-5 text-left card bg-gradient-to-br ${w.color} to-transparent hover:border-sea/50 active:scale-[.98] transition min-h-32`}
            >
              <div className="text-4xl" aria-hidden>{w.emoji}</div>
              <div className="text-lg font-extrabold mt-2">{w.title}</div>
            </button>
          ))}
        </div>

        <button onClick={() => go('voortgang')} className="mt-4 w-full card rounded-3xl p-5 flex items-center gap-4 text-left hover:border-sea/50">
          <div className="text-4xl" aria-hidden>🏆</div>
          <div className="flex-1">
            <div className="text-lg font-extrabold">Mijn ontdekkingen</div>
            <div className="text-white/70">Bekijk je sterren en ontdekkingskaarten</div>
          </div>
          <div className="text-2xl" aria-hidden>→</div>
        </button>
      </Container>
    </Page>
  );
}
