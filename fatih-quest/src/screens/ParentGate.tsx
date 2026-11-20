import { useRef, useState } from 'react';
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
  const fails = useRef(0);
  const lockedUntil = useRef(0);

  const submit = async () => {
    if (!profile?.parentPinHash || !profile.parentPinSalt) return;
    if (Date.now() < lockedUntil.current) {
      setErr('Even wachten en dan opnieuw proberen.');
      return;
    }
    if (await verifyPin(pin, profile.parentPinSalt, profile.parentPinHash)) {
      unlockedUntil = Date.now() + 10 * 60 * 1000;
      fails.current = 0;
      onUnlock();
    } else {
      fails.current++;
      setPin('');
      if (fails.current >= 5) {
        lockedUntil.current = Date.now() + 30000;
        fails.current = 0;
        setErr('Te vaak een verkeerde pincode. Probeer het over 30 seconden opnieuw.');
      } else setErr('Deze pincode klopt niet.');
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
              <p>Zonder pincode kunt u de app alleen opnieuw inrichten. Daarbij worden alle gegevens op dit apparaat gewist. Typ <strong>WISSEN</strong>.</p>
              <input value={confirm} onChange={(e) => setConfirm(e.target.value)} aria-label="Bevestiging" className="rounded-xl bg-night-3 border border-white/20 px-3 h-12" />
              <Button variant="danger" disabled={confirm !== 'WISSEN'} onClick={async () => { await deleteAll(false); await reload(); go('home'); }}>
                Alles wissen en opnieuw inrichten
              </Button>
            </div>
          )}
        </div>
      </Container>
    </Page>
  );
}
