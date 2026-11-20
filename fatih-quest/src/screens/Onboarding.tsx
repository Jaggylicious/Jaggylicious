import { useState } from 'react';
import { useProfile } from '../core/store';
import { hashPin, isValidPin, makeSalt } from '../core/pin';
import { Button, Container, Page } from '../components/ui';

/** Eerste keer: uitleg en instellingen door de ouder, met expliciete toestemming. */
export function Onboarding() {
  const { update } = useProfile();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('Fatih');
  const [minutes, setMinutes] = useState(12);
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [consent, setConsent] = useState(false);
  const [read, setRead] = useState(false);
  const [err, setErr] = useState('');

  const save = async () => {
    if (!isValidPin(pin)) return setErr('Kies een pincode van 4 tot 6 cijfers.');
    if (pin !== pin2) return setErr('De twee pincodes zijn niet gelijk.');
    const salt = makeSalt();
    const hash = await hashPin(pin, salt);
    await update((p) => ({
      ...p,
      onboarded: true,
      consentLocalStorage: true,
      consentGivenAt: Date.now(),
      parentPinHash: hash,
      parentPinSalt: salt,
      settings: { ...p.settings, childName: name.trim() || 'Fatih', missionMinutes: minutes },
    }));
  };

  return (
    <Page>
      <Container className="pt-10">
        {step === 0 && (
          <div className="flex flex-col items-center text-center gap-5 fade-in">
            <div className="text-8xl float" aria-hidden>🪐</div>
            <h1 className="text-4xl font-extrabold">Fatih Quest</h1>
            <p className="text-2xl text-sea font-bold">Ontdek. Leer. Groei.</p>
            <p className="text-lg max-w-xl text-white/80">
              Een rustige oefenomgeving voor korte ontdekkingstochten van 6 tot 15 minuten. Eerst richt een ouder de app in.
            </p>
            <Button onClick={() => setStep(1)} className="w-full max-w-sm">Ik ben de ouder. Inrichten →</Button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-5 fade-in">
            <h1 className="text-3xl font-extrabold">Goed om te weten</h1>
            <div className="card rounded-3xl p-5 flex flex-col gap-3 text-lg">
              <p>✅ Fatih Quest is een <strong>oefenapp</strong>. Het is <strong>geen medisch hulpmiddel</strong>: de app stelt geen diagnoses en meet of behandelt geen ADHD, IQ of andere cognitieve eigenschappen.</p>
              <p>✅ De spellen oefenen <strong>concrete vaardigheden en strategieën</strong>, zoals instructies opdelen, woordenschat, rustig controleren en omgaan met frustratie. Er is geen sterk bewijs dat geheugenspellen algemene concentratie of intelligentie verbeteren.</p>
              <p>✅ Er is <strong>geen tijdsdruk, geen strafpunten, geen ranglijsten en geen streaks</strong>. Niet spelen op een dag is prima.</p>
              <p>🔒 Alle gegevens blijven <strong>alleen op dit apparaat</strong>. Geen account, geen advertenties, geen tracking, geen delen met school of zorgverleners.</p>
            </div>
            <label className="flex items-start gap-3 text-lg">
              <input type="checkbox" checked={read} onChange={(e) => setRead(e.target.checked)} className="w-6 h-6 mt-1 accent-yellow-400" />
              Ik heb dit gelezen.
            </label>
            <Button disabled={!read} onClick={() => setStep(2)}>Verder →</Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5 fade-in">
            <h1 className="text-3xl font-extrabold">Instellingen</h1>
            <label className="flex flex-col gap-2 text-lg font-bold">
              Naam van uw kind (alleen voor de begroeting)
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} className="rounded-2xl bg-night-3 border border-white/20 px-4 h-14 text-xl font-normal" />
            </label>
            <label className="flex flex-col gap-2 text-lg font-bold">
              Duur van de dagelijkse missie: {minutes} minuten
              <input type="range" min={6} max={15} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="accent-yellow-400" />
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="flex flex-col gap-2 text-lg font-bold">
                Ouder-pincode (4–6 cijfers)
                <input type="password" inputMode="numeric" autoComplete="new-password" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} maxLength={6} className="rounded-2xl bg-night-3 border border-white/20 px-4 h-14 text-xl tracking-[.5em]" />
              </label>
              <label className="flex flex-col gap-2 text-lg font-bold">
                Herhaal pincode
                <input type="password" inputMode="numeric" autoComplete="new-password" value={pin2} onChange={(e) => setPin2(e.target.value.replace(/\D/g, ''))} maxLength={6} className="rounded-2xl bg-night-3 border border-white/20 px-4 h-14 text-xl tracking-[.5em]" />
              </label>
            </div>
            <label className="flex items-start gap-3 text-lg card rounded-2xl p-4">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="w-6 h-6 mt-1 accent-yellow-400" />
              <span>
                Ik geef als ouder/verzorger toestemming om oefenresultaten (welke oefening, goed/met hulp, tijd) <strong>lokaal op dit apparaat</strong> op te slaan.
                Antwoorden in de emotiewereld worden niet opgeslagen. Ik kan alles altijd bekijken, exporteren en verwijderen.
              </span>
            </label>
            {err && <p className="text-rose-300 font-bold">{err}</p>}
            <Button disabled={!consent} onClick={save}>Opslaan en beginnen 🚀</Button>
          </div>
        )}
      </Container>
    </Page>
  );
}
