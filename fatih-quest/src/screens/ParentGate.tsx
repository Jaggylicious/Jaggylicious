import { useMemo, useState } from 'react';
import { lockRemainingMs, registerFail, registerSuccess } from '../core/lockout';
import { deleteAll } from '../core/db';
import { useProfile } from '../core/store';
import { verifyPin } from '../core/pin';
import { go } from '../core/router';
import { Button, Container, Page, TopBar } from '../components/ui';

let unlockedUntil = 0;
export const isParentUnlocked = () => Date.now() < unlockedUntil;
export const lockParent = () => {
  unlockedUntil = 0;
};

/** Pincodecontrole. Na 5 foute pogingen 30 seconden wachten. Ontgrendeling geldt 10 minuten. */
export function ParentGate({ onUnlock }: { onUnlock: () => void }) {
  const { profile, reload } = useProfile();
  const [forgot, setForgot] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');
  // Rekenvraag als extra drempel bij 'pincode vergeten' (lastig voor een kind van 9)
  const challenge = useMemo(() => {
    const a = 23 + Math.floor(Math.random() * 60);
    const b = 13 + Math.floor(Math.random() * 20);
    return { a, b, answer: a * b };
  }, []);
  const [challengeInput, setChallengeInput] = useState('');

  const submit = async () => {
    if (!profile?.parentPinHash || !profile.parentPinSalt || pin.length < 4) return;
    const wait = lockRemainingMs();
    if (wait > 0) {
      setErr(`Even wachten: probeer het over ${Math.ceil(wait / 1000)} seconden opnieuw.`);
      return;
    }
    if (await verifyPin(pin, profile.parentPinSalt, profile.parentPinHash)) {
      unlockedUntil = Date.now() + 10 * 60 * 1000;
      registerSuccess();
      onUnlock();
    } else {
      setPin('');
      const w = registerFail();
      setErr(w ? `Te vaak een verkeerde pincode. Probeer het over ${Math.ceil(w / 1000)} seconden opnieuw.` : 'Deze pincode klopt niet.');
    }
  };

  return (
    <Page>
      <TopBar title="🔒 Ouderomgeving" onBack={() => go('home')} />
      <Container className="max-w-md">
        <div className="card rounded-3xl p-6 flex flex-col gap-4 mt-4">
          <p className="text-lg">Dit deel is voor ouders. Voer de pincode in.</p>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            value={pin}
            maxLength={6}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            aria-label="Pincode"
            className="rounded-2xl bg-night-3 border border-white/20 px-4 h-16 text-3xl text-center tracking-[.6em]"
          />
          {err && <p className="text-rose-300 font-bold" role="alert">{err}</p>}
          <Button onClick={submit} disabled={pin.length < 4}>Openen</Button>
          <Button variant="ghost" onClick={() => go('home')}>Terug</Button>
          <button className="text-white/60 underline text-sm" onClick={() => setForgot(!forgot)}>Pincode vergeten?</button>
          {forgot && (
            <div className="rounded-2xl bg-white/5 p-4 flex flex-col gap-3">
              <p>Zonder pincode kunt u de app alleen opnieuw inrichten. Daarbij worden <strong>alle gegevens op dit apparaat gewist</strong>.</p>
              <label className="flex flex-col gap-1">
                Ter controle (voor volwassenen): hoeveel is {challenge.a} × {challenge.b}?
                <input inputMode="numeric" value={challengeInput} onChange={(e) => setChallengeInput(e.target.value.replace(/\D/g, ''))} className="rounded-xl bg-night-3 border border-white/20 px-3 h-12" />
              </label>
              <label className="flex flex-col gap-1">
                Typ <strong>WISSEN</strong>
                <input value={confirm} onChange={(e) => setConfirm(e.target.value)} className="rounded-xl bg-night-3 border border-white/20 px-3 h-12" />
              </label>
              <Button variant="danger" disabled={confirm !== 'WISSEN' || Number(challengeInput) !== challenge.answer} onClick={async () => { await deleteAll(false); registerSuccess(); await reload(); go('home'); }}>
                Alles wissen en opnieuw inrichten
              </Button>
            </div>
          )}
        </div>
      </Container>
    </Page>
  );
}
