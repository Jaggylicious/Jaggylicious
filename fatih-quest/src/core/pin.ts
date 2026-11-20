/** Pincode voor de ouderomgeving: opgeslagen als gezouten SHA-256-hash, nooit als platte tekst. */

function toHex(buf: ArrayBuffer) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function makeSalt(): string {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return toHex(a.buffer);
}

export async function hashPin(pin: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${pin}`);
  return toHex(await crypto.subtle.digest('SHA-256', data));
}

export async function verifyPin(pin: string, salt: string, hash: string) {
  return (await hashPin(pin, salt)) === hash;
}

export function isValidPin(pin: string) {
  return /^\d{4,6}$/.test(pin);
}
