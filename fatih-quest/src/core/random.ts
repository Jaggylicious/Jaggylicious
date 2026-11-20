export const rand = Math.random;
export const randInt = (min: number, max: number, r = rand) => Math.floor(r() * (max - min + 1)) + min;
export function pickN<T>(arr: T[], n: number, r = rand): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}
export { shuffle } from '../content/rekenen';
