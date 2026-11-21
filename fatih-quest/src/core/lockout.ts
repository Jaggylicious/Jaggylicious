/**
 * Bewaart mislukte pincodepogingen buiten de component (blijft gelden na terug/herladen).
 * 5 fouten → 30 s wachten; elke volgende reeks van 5 → wachttijd verdubbelt (max 15 min).
 */
const KEY = 'fq-pin-lock';
interface LockState { fails: number; lockedUntil: number; strikes: number }

function read(): LockState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as LockState;
  } catch { /* opslag geblokkeerd: val terug op geheugen */ }
  return memory;
}
let memory: LockState = { fails: 0, lockedUntil: 0, strikes: 0 };
function write(s: LockState) {
  memory = s;
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* negeren */ }
}

export function lockRemainingMs(now = Date.now()) {
  return Math.max(0, read().lockedUntil - now);
}

export function registerFail(now = Date.now()): number {
  const s = read();
  const fails = s.fails + 1;
  if (fails >= 5) {
    const strikes = s.strikes + 1;
    const wait = Math.min(15 * 60_000, 30_000 * 2 ** (strikes - 1));
    write({ fails: 0, lockedUntil: now + wait, strikes });
    return wait;
  }
  write({ ...s, fails });
  return 0;
}

export function registerSuccess() {
  write({ fails: 0, lockedUntil: 0, strikes: 0 });
}
