import { useEffect, useState } from 'react';
import { useProfile } from '../core/store';
import { go } from '../core/router';
import { Container, Page, TopBar } from '../components/ui';
import { CARDS } from '../content/kaarten';
import { allSessions } from '../core/db';
import { speak } from '../core/speech';

/** Kindvriendelijke voortgang: alleen positief, geen vergelijkingen, geen streaks. */
export function Progress() {
  const { profile } = useProfile();
  const [minutes, setMinutes] = useState(0);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    allSessions().then((s) => setMinutes(Math.round(s.reduce((a, b) => a + b.activeSeconds, 0) / 60)));
  }, []);

  if (!profile) return null;
  const next = CARDS.find((c) => profile.stars < c.cost);
  const opened = CARDS.find((c) => c.id === open);

  return (
    <Page>
      <TopBar title="🏆 Mijn ontdekkingen" onBack={() => go('home')} />
      <Container>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="card rounded-3xl p-5 text-center">
            <div className="text-4xl">⭐</div>
            <div className="text-3xl font-extrabold">{profile.stars}</div>
            <div className="text-white/70">sterren verzameld</div>
          </div>
          <div className="card rounded-3xl p-5 text-center">
            <div className="text-4xl">🚀</div>
            <div className="text-3xl font-extrabold">{minutes}</div>
            <div className="text-white/70">minuten op ontdekkingstocht</div>
          </div>
        </div>
        {next && (
          <div className="card rounded-3xl p-5 mt-3">
            <p className="font-bold">Volgende ontdekkingskaart bij {next.cost} sterren</p>
            <div className="h-3 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-sun rounded-full" style={{ width: `${Math.min(100, (profile.stars / next.cost) * 100)}%` }} />
            </div>
          </div>
        )}

        {opened && (
          <div className="rounded-3xl p-6 mt-4 bg-sun/15 border border-sun/40 pop">
            <div className="flex items-center gap-3">
              <span className="text-6xl">{opened.emoji}</span>
              <h2 className="text-2xl font-extrabold flex-1">{opened.title}</h2>
              <button className="text-2xl w-12 h-12 rounded-full hover:bg-white/10" onClick={() => speak(opened.fact, true)} aria-label="Voorlezen">🔊</button>
            </div>
            <p className="text-xl mt-3">{opened.fact}</p>
          </div>
        )}

        <h2 className="text-xl font-extrabold mt-6 mb-3">Ontdekkingskaarten</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {CARDS.map((c) => {
            const has = profile.unlockedCards.includes(c.id);
            return (
              <button
                key={c.id}
                disabled={!has}
                onClick={() => setOpen(c.id)}
                className={`aspect-[3/4] rounded-2xl flex flex-col items-center justify-center gap-1 p-2 border-2 ${has ? 'bg-night-3 border-sea/50' : 'bg-white/5 border-white/5'}`}
              >
                <span className={`text-4xl ${has ? '' : 'grayscale opacity-30'}`}>{has ? c.emoji : '❔'}</span>
                <span className="text-sm font-bold text-center">{has ? c.title : `${c.cost} ⭐`}</span>
              </button>
            );
          })}
        </div>
        <p className="text-white/60 mt-6">Sterren krijg je voor opdrachten afmaken, opnieuw proberen, rustig controleren en slim hulp gebruiken.</p>
      </Container>
    </Page>
  );
}
