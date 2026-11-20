/** Voorlezen via de ingebouwde spraak van het apparaat (offline, gratis, geen gegevens naar buiten). */
let enabled = true;
let voice: SpeechSynthesisVoice | null = null;

function pickVoice() {
  if (typeof speechSynthesis === 'undefined') return;
  const voices = speechSynthesis.getVoices();
  voice = voices.find((v) => v.lang === 'nl-NL') ?? voices.find((v) => v.lang.startsWith('nl')) ?? null;
}
if (typeof speechSynthesis !== 'undefined') {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

export function setSpeechEnabled(v: boolean) {
  enabled = v;
  if (!v) stopSpeaking();
}

export function speechAvailable() {
  return typeof speechSynthesis !== 'undefined';
}

/** force = ook voorlezen als automatisch voorlezen uit staat (bijv. op 🔊 getikt). */
export function speak(text: string, force = false) {
  if (!speechAvailable() || (!enabled && !force)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[[\]_]/g, ''));
  u.lang = 'nl-NL';
  u.rate = 0.9;
  if (voice) u.voice = voice;
  speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (speechAvailable()) speechSynthesis.cancel();
}
