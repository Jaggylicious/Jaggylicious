import { useEffect, useState } from 'react';
import { useProfile } from '../core/store';
import { allAttempts, allSessions, allStates, deleteAll, exportAll } from '../core/db';
import type { AttemptRecord, ExerciseState, Profile, SessionRecord } from '../core/types';
import { exerciseStats, recommendations, skillTrends, weeklyMinutes } from '../core/analytics';
import { EXERCISES } from '../core/catalog';
import { explainState, MAX_LEVEL } from '../core/adaptive';
import { go } from '../core/router';
import { Button, Container, Page, Tile, TopBar } from '../components/ui';
import { PercentRows, WeekBars } from '../components/charts';
import { RELEASABLE_TOPICS, TOPIC_LABEL } from '../content/rekenen';
import { hashPin, isValidPin, makeSalt } from '../core/pin';
import { lockParent } from './ParentGate';

type Tab = 'overzicht' | 'oefeningen' | 'instellingen' | 'gegevens';

export function useParentData() {
  const [data, setData] = useState<{ attempts: AttemptRecord[]; sessions: SessionRecord[]; states: ExerciseState[] } | null>(null);
  const load = async () => setData({ attempts: await allAttempts(), sessions: await allSessions(), states: await allStates() });
  useEffect(() => {
    load();
  }, []);
  return { data, reload: load };
}

export function ParentDashboard() {
  const { profile, update, reload: reloadProfile } = useProfile();
  const { data, reload } = useParentData();
  const [tab, setTab] = useState<Tab>('overzicht');
  if (!profile || !data) return <p className="p-6">Laden…</p>;
  const name = profile.settings.childName;
  const stats = exerciseStats(data.attempts);
  const trends = skillTrends(data.attempts);
  const weeks = weeklyMinutes(data.sessions);
  const recs = recommendations(stats, data.states, data.sessions, name);
  const totalMin = Math.round(data.sessions.reduce((s, x) => s + x.activeSeconds, 0) / 60);
  const hintRounds = data.attempts.filter((a) => !a.unscored && a.hintsUsed > 0).length;
  const scored = data.attempts.filter((a) => !a.unscored).length;

  const tabs: [Tab, string][] = [
    ['overzicht', 'Overzicht'],
    ['oefeningen', 'Oefeningen'],
    ['instellingen', 'Instellingen'],
    ['gegevens', 'Gegevens & privacy'],
  ];

  return (
    <Page>
      <TopBar
        title="Ouderomgeving"
        onBack={() => {
          lockParent();
          go('home');
        }}
        right={
          <Button variant="ghost" className="min-h-10 py-1 text-base" onClick={() => go('ouder/rapport')}>
            📄 Rapport
          </Button>
        }
      />
      <Container className="max-w-4xl">
        <div className="flex gap-2 overflow-x-auto pb-2 no-print" role="tablist">
          {tabs.map(([t, l]) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`rounded-full px-4 h-11 font-bold whitespace-nowrap ${tab === t ? 'bg-sun text-night' : 'bg-white/10'}`}>
              {l}
            </button>
          ))}
        </div>

        {tab === 'overzicht' && (
          <div className="flex flex-col gap-4 mt-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat label="Minuten geoefend" value={totalMin} />
              <Stat label="Sessies" value={data.sessions.length} />
              <Stat label="Opdrachten" value={data.attempts.length} />
              <Stat label="Opdrachten met tip" value={scored ? `${Math.round((hintRounds / scored) * 100)}%` : '–'} />
            </div>
            <Tile>
              <h2 className="text-xl font-extrabold mb-3">💡 Aanbevelingen</h2>
              <ul className="flex flex-col gap-2 text-lg">
                {recs.map((r, i) => (
                  <li key={i} className="flex gap-2"><span aria-hidden>•</span><span>{r}</span></li>
                ))}
              </ul>
            </Tile>
            <div className="grid md:grid-cols-2 gap-4">
              <Tile>
                <WeekBars title="Oefentijd per week (minuten)" unit="minuten" data={weeks.map((w) => ({ label: w.label, value: w.minutes }))} />
              </Tile>
              <Tile>
                {trends.length ? (
                  <PercentRows
                    title="Zelfstandig gelukt per vaardigheid"
                    note="Deel van de opdrachten dat zonder hulp lukte. Dit gaat over oefenresultaten in deze app, niet over aanleg."
                    rows={trends.map((t) => ({
                      label: `${t.label}${t.progressing ? ' ↗' : ''}`,
                      value: t.later ?? exerciseSkillIndependence(stats, t.skill),
                      detail: t.progressing ? 'Vooruitgang ten opzichte van eerdere oefenrondes.' : `${t.rounds} opdrachten`,
                    }))}
                  />
                ) : (
                  <p className="text-white/70">Nog geen oefengegevens.</p>
                )}
              </Tile>
            </div>
            <p className="text-sm text-white/50">
              Let op: dit zijn oefenresultaten binnen Fatih Quest. Ze zijn geen klinische of psychologische beoordeling en geen
              gestandaardiseerde toets. Bij zorgen over ontwikkeling of welzijn: neem contact op met school, huisarts of
              jeugdverpleegkundige.
            </p>
          </div>
        )}

        {tab === 'oefeningen' && (
          <div className="flex flex-col gap-3 mt-2">
            {Object.values(EXERCISES).map((m) => {
              const s = stats.find((x) => x.exerciseId === m.id);
              const st = data.states.find((x) => x.exerciseId === m.id);
              const emoRounds = data.attempts.filter((a) => a.exerciseId === m.id && a.unscored).length;
              const tooHard = s && s.rounds >= 6 && s.recentNogNiet >= 0.5;
              return (
                <Tile key={m.id} className="!p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl" aria-hidden>{m.emoji}</span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-extrabold">{m.title}</h3>
                        {st && MAX_LEVEL[m.id] > 1 && <span className="text-xs rounded-full bg-white/10 px-2 py-0.5">niveau {st.level}/{MAX_LEVEL[m.id]}</span>}
                        {st?.support && <span className="text-xs rounded-full bg-sun/20 px-2 py-0.5">extra ondersteuning</span>}
                        {tooHard && <span className="text-xs rounded-full bg-rose-400/20 px-2 py-0.5">mogelijk te moeilijk</span>}
                      </div>
                      {s ? (
                        <>
                          <p className="text-white/80">
                            {s.rounds} opdrachten · {s.zelfstandig} zelfstandig · {s.metHulp} met hulp · {s.nogNiet} nog niet · tips bij {Math.round(s.hintRate * 100)}% · laatst {new Date(s.lastAt).toLocaleDateString('nl-NL')}
                          </p>
                          <div className="flex h-2.5 rounded-full overflow-hidden mt-2 gap-[2px] bg-white/5" aria-hidden>
                            <div className="bg-sea" style={{ width: `${(s.zelfstandig / s.rounds) * 100}%` }} />
                            <div className="bg-sea/50" style={{ width: `${(s.metHulp / s.rounds) * 100}%` }} />
                          </div>
                          <p className="text-xs text-white/50 mt-1">Beheersing (gelukt, met of zonder hulp): {Math.round(s.mastery * 100)}% · Zelfstandig: {Math.round(s.independence * 100)}%</p>
                          {st && <p className="text-sm text-white/60 mt-1">{explainState(st)}</p>}
                        </>
                      ) : emoRounds ? (
                        <p className="text-white/80">{emoRounds} keer gedaan. (Antwoorden worden bewust niet opgeslagen of beoordeeld.)</p>
                      ) : (
                        <p className="text-white/50">Nog niet geoefend.</p>
                      )}
                    </div>
                  </div>
                </Tile>
              );
            })}
            <p className="text-sm text-white/50">Legenda balk: donker = zelfstandig, licht = met hulp, leeg = nog niet.</p>
          </div>
        )}

        {tab === 'instellingen' && <SettingsTab profile={profile} update={update} />}
        {tab === 'gegevens' && (
          <DataTab
            onDeleted={async () => {
              await reload();
              await reloadProfile();
            }}
            consentAt={profile.consentGivenAt}
            onWithdraw={async () => {
              await deleteAll(false);
              lockParent();
              await reloadProfile();
              go('home');
            }}
          />
        )}
      </Container>
    </Page>
  );
}

function SettingsTab({ profile, update }: { profile: Profile; update: (fn: (p: Profile) => Profile) => Promise<void> }) {
  const s = profile.settings;
  const set = (patch: Partial<typeof s>) => update((p) => ({ ...p, settings: { ...p.settings, ...patch } }));
  const [pin, setPin] = useState('');
  const [msg, setMsg] = useState('');
  return (
    <div className="flex flex-col gap-4 mt-2">
      <Tile>
        <h2 className="text-xl font-extrabold mb-3">Dagelijkse missie</h2>
        <label className="flex flex-col gap-2 font-bold">
          Duur: {s.missionMinutes} minuten
          <input type="range" min={6} max={15} value={s.missionMinutes} onChange={(e) => set({ missionMinutes: Number(e.target.value) })} className="accent-yellow-400" />
        </label>
        <p className="text-sm text-white/60 mt-2">De missie stopt automatisch na deze tijd (na de opdracht waar je kind mee bezig is). Stoppen mag altijd eerder.</p>
      </Tile>
      <Tile>
        <h2 className="text-xl font-extrabold mb-3">Weergave en geluid</h2>
        <Toggle label="Opdrachten automatisch voorlezen" checked={s.readAloud} onChange={(v) => set({ readAloud: v })} />
        <Toggle label="Animaties uitzetten" checked={s.reduceMotion} onChange={(v) => set({ reduceMotion: v })} />
        <Toggle label="Optionele achtergrondafleiding bij 'Blijf bij je missie'" checked={s.allowDistraction} onChange={(v) => set({ allowDistraction: v })} />
        <label className="flex flex-col gap-2 font-bold mt-3">
          Naam in de begroeting
          <input value={s.childName} maxLength={20} onChange={(e) => set({ childName: e.target.value })} className="rounded-xl bg-night-3 border border-white/20 px-3 h-12 font-normal" />
        </label>
      </Tile>
      <Tile>
        <h2 className="text-xl font-extrabold mb-1">Lesonderwerpen vrijgeven</h2>
        <p className="text-sm text-white/60 mb-3">Begin met stof die al op school behandeld is. Geef nieuwe onderwerpen vrij wanneer dat past.</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {RELEASABLE_TOPICS.map((t) => (
            <Toggle
              key={t}
              label={TOPIC_LABEL[t] ?? t}
              checked={s.unlockedTopics.includes(t)}
              onChange={(v) => set({ unlockedTopics: v ? [...s.unlockedTopics, t] : s.unlockedTopics.filter((x) => x !== t) })}
            />
          ))}
        </div>
      </Tile>
      <Tile>
        <h2 className="text-xl font-extrabold mb-3">Pincode wijzigen</h2>
        <div className="flex gap-2 flex-wrap">
          <input type="password" inputMode="numeric" value={pin} maxLength={6} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="Nieuwe pincode" aria-label="Nieuwe pincode" className="rounded-xl bg-night-3 border border-white/20 px-3 h-12 flex-1" />
          <Button
            variant="secondary"
            disabled={!isValidPin(pin)}
            onClick={async () => {
              const salt = makeSalt();
              const hash = await hashPin(pin, salt);
              await update((p) => ({ ...p, parentPinHash: hash, parentPinSalt: salt }));
              setPin('');
              setMsg('Pincode gewijzigd.');
            }}
          >
            Opslaan
          </Button>
        </div>
        {msg && <p className="text-leaf mt-2">{msg}</p>}
      </Tile>
    </div>
  );
}

function exerciseSkillIndependence(stats: ReturnType<typeof exerciseStats>, skill: string) {
  const rel = stats.filter((s) => EXERCISES[s.exerciseId].skill === skill);
  const n = rel.reduce((a, b) => a + b.rounds, 0);
  return n ? rel.reduce((a, b) => a + b.zelfstandig, 0) / n : 0;
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card rounded-2xl p-4">
      <div className="text-3xl font-extrabold">{value}</div>
      <div className="text-white/70 text-sm">{label}</div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 py-2 cursor-pointer">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-6 h-6 accent-yellow-400 shrink-0" />
    </label>
  );
}

function DataTab({ onDeleted, onWithdraw, consentAt }: { onDeleted: () => void; onWithdraw: () => void; consentAt?: number }) {
  const [confirm, setConfirm] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const download = async () => {
    const data = await exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `fatih-quest-gegevens-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <div className="flex flex-col gap-4 mt-2">
      <Tile>
        <h2 className="text-xl font-extrabold mb-2">Wat wordt er opgeslagen?</h2>
        <ul className="list-disc pl-5 flex flex-col gap-1 text-white/90">
          <li>Per opdracht: welke oefening, niveau, goed/met hulp/nog niet, aantal pogingen, tips en herhalingen, tijdstip.</li>
          <li>Per sessie: begintijd, actieve oefentijd, pauzes, of de missie is afgerond.</li>
          <li>Woordenherhaling: welke woorden in welk herhaalbakje zitten.</li>
          <li>Instellingen, sterren en vrijgespeelde kaarten. De pincode alleen als versleutelde hash.</li>
        </ul>
        <p className="mt-2 text-white/80">Niet opgeslagen: gekozen gevoelens of antwoorden in de emotiewereld, gezondheidsgegevens, locatie, contactgegevens.</p>
        <p className="mt-2 text-white/80">Alles staat alleen in de browseropslag van dit apparaat. Er is geen server, account, tracking of advertentie.</p>
        {consentAt && <p className="mt-2 text-sm text-white/60">Toestemming gegeven op {new Date(consentAt).toLocaleString('nl-NL')}.</p>}
      </Tile>
      <Tile>
        <h2 className="text-xl font-extrabold mb-3">Bekijken en exporteren</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={download}>⬇️ Download alle gegevens (JSON)</Button>
          <Button variant="ghost" onClick={async () => setPreview(preview ? null : JSON.stringify(await exportAll(), null, 2))}>
            {preview ? 'Verberg gegevens' : '👁️ Bekijk alle gegevens'}
          </Button>
          <Button variant="ghost" onClick={() => go('ouder/rapport')}>📄 Ouderrapport (PDF)</Button>
        </div>
        {preview && <pre className="mt-3 max-h-96 overflow-auto text-xs bg-black/30 rounded-xl p-3">{preview}</pre>}
      </Tile>
      <Tile>
        <h2 className="text-xl font-extrabold mb-2">Verwijderen</h2>
        <p className="mb-3 text-white/80">Typ <strong>WISSEN</strong> om te bevestigen.</p>
        <input value={confirm} onChange={(e) => setConfirm(e.target.value)} aria-label="Bevestiging" className="rounded-xl bg-night-3 border border-white/20 px-3 h-12 w-full mb-3" />
        <div className="flex flex-wrap gap-3">
          <Button
            variant="danger"
            disabled={confirm !== 'WISSEN'}
            onClick={async () => {
              await deleteAll(true);
              setConfirm('');
              onDeleted();
            }}
          >
            Wis oefengegevens (instellingen blijven)
          </Button>
          <Button variant="danger" disabled={confirm !== 'WISSEN'} onClick={onWithdraw}>
            Toestemming intrekken en alles wissen
          </Button>
        </div>
      </Tile>
    </div>
  );
}
