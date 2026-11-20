import { useProfile } from '../core/store';
import { useParentData } from './ParentDashboard';
import { exerciseStats, recommendations, skillTrends, weeklyMinutes } from '../core/analytics';
import { EXERCISES } from '../core/catalog';
import { MAX_LEVEL } from '../core/adaptive';
import { go } from '../core/router';
import { Button } from '../components/ui';

/** Printbaar ouderrapport. Via "Opslaan als PDF" in het printvenster wordt het een PDF – volledig offline. */
export function Report() {
  const { profile } = useProfile();
  const { data } = useParentData();
  if (!profile || !data) return <p className="p-6">Laden…</p>;
  const name = profile.settings.childName;
  const stats = exerciseStats(data.attempts);
  const trends = skillTrends(data.attempts);
  const weeks = weeklyMinutes(data.sessions, 8);
  const recs = recommendations(stats, data.states, data.sessions, name);
  const totalMin = Math.round(data.sessions.reduce((s, x) => s + x.activeSeconds, 0) / 60);
  const pct = (x: number) => `${Math.round(x * 100)}%`;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="no-print sticky top-0 bg-night text-white flex gap-3 p-3 justify-between">
        <Button variant="ghost" onClick={() => go('ouder')}>← Terug</Button>
        <Button onClick={() => window.print()}>🖨️ Opslaan als PDF / printen</Button>
      </div>
      <article className="print-area max-w-3xl mx-auto p-8 flex flex-col gap-6 text-[15px] leading-relaxed">
        <header className="border-b-2 border-teal-600 pb-3">
          <h1 className="text-3xl font-extrabold">Fatih Quest – ouderrapport</h1>
          <p>Voor: {name} · Gemaakt op {new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </header>

        <section className="rounded-xl border-2 border-amber-400 bg-amber-50 p-4">
          <h2 className="font-extrabold text-lg">Belangrijk: wat dit rapport wel en niet is</h2>
          <ul className="list-disc pl-5">
            <li><strong>Wel:</strong> een overzicht van <em>oefenresultaten</em> in de app Fatih Quest (wat er is geoefend, hoe vaak het zelfstandig of met hulp lukte).</li>
            <li><strong>Niet:</strong> een klinische, psychologische of orthopedagogische beoordeling, een diagnose, of een gestandaardiseerde toets. Er worden geen IQ-, ADHD- of andere scores berekend.</li>
            <li>Resultaten hangen af van dag, vermoeidheid, en hoe vertrouwd de spelvorm is. Gebruik ze als gespreksstof, niet als oordeel.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">Samenvatting</h2>
          <p>Totaal geoefend: <strong>{totalMin} minuten</strong> in <strong>{data.sessions.length} sessies</strong>, <strong>{data.attempts.length} opdrachten</strong>. Verzamelde sterren: {profile.stars}.</p>
          <table className="w-full mt-3 border-collapse">
            <thead><tr className="border-b"><th className="text-left py-1">Week van</th>{weeks.map((w) => <th key={w.start} className="text-right px-1">{w.label}</th>)}</tr></thead>
            <tbody><tr><td className="py-1">Minuten</td>{weeks.map((w) => <td key={w.start} className="text-right px-1">{w.minutes}</td>)}</tr></tbody>
          </table>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">Oefenresultaten per vaardigheid</h2>
          <table className="w-full border-collapse">
            <thead><tr className="border-b text-left"><th className="py-1">Vaardigheid</th><th>Opdrachten</th><th>Eerder zelfstandig*</th><th>Recent zelfstandig*</th><th>Vooruitgang</th></tr></thead>
            <tbody>
              {trends.map((t) => (
                <tr key={t.skill} className="border-b border-slate-200">
                  <td className="py-1">{t.label}</td>
                  <td>{t.rounds}</td>
                  <td>{t.earlier === null ? 'te weinig data' : pct(t.earlier)}</td>
                  <td>{t.later === null ? 'te weinig data' : pct(t.later)}</td>
                  <td>{t.progressing ? 'ja' : t.earlier === null ? '–' : 'stabiel'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs mt-1">* Gewogen naar niveau: zelfstandig lukken op een hoger niveau telt zwaarder. Vergelijking alleen met eigen eerdere oefenrondes.</p>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">Per oefening</h2>
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b text-left"><th className="py-1">Oefening</th><th>Niveau</th><th>Opdr.</th><th>Zelfstandig</th><th>Met hulp</th><th>Nog niet</th><th>Tips</th></tr></thead>
            <tbody>
              {stats.map((s) => {
                const st = data.states.find((x) => x.exerciseId === s.exerciseId);
                return (
                  <tr key={s.exerciseId} className="border-b border-slate-200">
                    <td className="py-1">{EXERCISES[s.exerciseId].title}</td>
                    <td>{st ? `${st.level}/${MAX_LEVEL[s.exerciseId]}` : '–'}</td>
                    <td>{s.rounds}</td>
                    <td>{pct(s.independence)}</td>
                    <td>{pct(s.metHulp / s.rounds)}</td>
                    <td>{pct(s.nogNiet / s.rounds)}</td>
                    <td>{pct(s.hintRate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-xl font-extrabold mb-2">Suggesties voor thuis</h2>
          <ul className="list-disc pl-5">{recs.map((r, i) => <li key={i}>{r}</li>)}</ul>
        </section>

        <footer className="text-xs border-t pt-3 text-slate-600">
          Emotiewereld: antwoorden worden bewust niet opgeslagen en niet geïnterpreteerd. Bij zorgen over het welzijn of de
          veiligheid van uw kind: neem contact op met de huisarts, de jeugdverpleegkundige (GGD/CJG) of school. In acute
          situaties: bel 112. Dit rapport is lokaal gemaakt; er zijn geen gegevens naar een server verstuurd.
        </footer>
      </article>
    </div>
  );
}
