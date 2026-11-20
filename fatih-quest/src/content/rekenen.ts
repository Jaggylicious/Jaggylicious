/**
 * Rekenwereld – opgaven worden gegenereerd (dus eindeloos variatie),
 * met nette afleiders dicht bij het goede antwoord.
 */
import type { QuizItem } from './quiz';

export type Rand = () => number;
const ri = (r: Rand, min: number, max: number) => Math.floor(r() * (max - min + 1)) + min;

export function shuffle<T>(arr: T[], r: Rand = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Drie afleiders dichtbij het antwoord, uniek, niet negatief. */
export function numberOptions(answer: number, r: Rand = Math.random, count = 4): string[] {
  const deltas = shuffle([1, -1, 2, -2, 10, -10, 3, -3], r);
  const set = new Set<number>([answer]);
  for (const d of deltas) {
    if (set.size >= count) break;
    const v = answer + d;
    if (v >= 0) set.add(v);
  }
  let extra = 4;
  while (set.size < count) set.add(answer + extra++);
  return shuffle([...set].map(String), r);
}

export const REKEN_TOPICS: Record<number, string[]> = {
  1: ['optellen'],
  2: ['optellen', 'aftrekken'],
  3: ['optellen', 'aftrekken', 'getalbegrip'],
  4: ['tafels-basis'],
  5: ['tafels-alle', 'delen'],
  6: ['tot-1000', 'getalbegrip'],
};

export const TOPIC_LABEL: Record<string, string> = {
  optellen: 'Optellen',
  aftrekken: 'Aftrekken',
  getalbegrip: 'Tientallen en honderdtallen',
  'tafels-basis': 'Tafels van 1, 2, 5 en 10',
  'tafels-alle': 'Alle tafels tot 10',
  delen: 'Delen',
  'tot-1000': 'Rekenen tot 1000',
  'klok-hele-halve': 'Klok: hele en halve uren',
  'klok-kwartier': 'Klok: kwart over en kwart voor',
  geld: 'Geld rekenen',
  verhaalsommen: 'Verhaalsommen',
  lidwoorden: 'De of het',
  'woordsoorten-basis': 'Woordsoorten',
  persoonsvorm: 'Persoonsvorm en onderwerp',
  synoniemen: 'Synoniemen en tegenstellingen',
};

/** Onderwerpen die de ouder kan vrijgeven. */
export const RELEASABLE_TOPICS = [
  'optellen',
  'aftrekken',
  'getalbegrip',
  'tafels-basis',
  'tafels-alle',
  'delen',
  'tot-1000',
  'klok-hele-halve',
  'klok-kwartier',
  'geld',
  'verhaalsommen',
  'lidwoorden',
  'woordsoorten-basis',
  'persoonsvorm',
  'synoniemen',
];

function sumItem(r: Rand, level: number, topic: string): QuizItem {
  let a: number, b: number, op: '+' | '−' | '×' | ':', ans: number;
  let hint = '';
  let render: QuizItem['render'];
  switch (topic) {
    case 'optellen':
      if (level <= 1) {
        a = ri(r, 2, 10); b = ri(r, 1, 20 - a);
      } else if (level === 2) {
        a = ri(r, 1, 8) * 10;
        b = r() < 0.5 ? ri(r, 1, 9) : ri(r, 1, 9 - a / 10) * 10;
      } else {
        a = ri(r, 11, 69); b = ri(r, 5, 99 - a);
      }
      op = '+'; ans = a + b;
      hint = level <= 1 ? `Begin bij ${Math.max(a, b)} en tel ${Math.min(a, b)} verder.` : 'Eerst de tientallen, dan de eenheden.';
      render = { kind: 'blokjes', tens: Math.floor(a / 10), ones: a % 10 };
      break;
    case 'aftrekken':
      if (level <= 2) {
        a = ri(r, 6, 20); b = ri(r, 1, a - 1);
      } else {
        a = ri(r, 30, 99); b = ri(r, 5, a - 10);
      }
      op = '−'; ans = a - b;
      hint = level <= 2 ? `Begin bij ${a} en tel ${b} terug.` : 'Haal eerst de tientallen eraf, dan de eenheden.';
      render = { kind: 'blokjes', tens: Math.floor(a / 10), ones: a % 10 };
      break;
    case 'getalbegrip': {
      const big = level >= 6;
      const n = big ? ri(r, 101, 999) : ri(r, 11, 99);
      const kinds = big ? ['honderd', 'tien', 'buur'] : ['tien', 'buur', 'tien'];
      const k = kinds[ri(r, 0, kinds.length - 1)];
      if (k === 'tien') {
        ans = Math.floor((n % 100) / 10);
        return {
          id: `gb-t-${n}`, level, topic, prompt: 'Hoeveel tientallen?', body: `${n}`,
          options: shuffle([...new Set([ans, n % 10, (ans + 1) % 10, (ans + 2) % 10])].map(String), r).slice(0, 4),
          answer: String(ans),
          hint: 'De tientallen staan op de tweede plek van rechts.',
          explain: `In ${n} zitten ${ans} tientallen (en ${n % 10} eenheden).`,
          render: n < 100 ? { kind: 'blokjes', tens: Math.floor(n / 10), ones: n % 10 } : undefined,
        };
      }
      if (k === 'honderd') {
        ans = Math.floor(n / 100);
        return {
          id: `gb-h-${n}`, level, topic, prompt: 'Hoeveel honderdtallen?', body: `${n}`,
          options: shuffle([...new Set([ans, Math.floor((n % 100) / 10), n % 10, ans + 1])].map(String), r),
          answer: String(ans),
          hint: 'De honderdtallen staan helemaal links.',
          explain: `${n} = ${ans} honderdtallen, ${Math.floor((n % 100) / 10)} tientallen en ${n % 10} eenheden.`,
        };
      }
      const after = r() < 0.5;
      ans = after ? n + 1 : n - 1;
      return {
        id: `gb-b-${n}-${after}`, level, topic,
        prompt: after ? 'Welk getal komt erna?' : 'Welk getal komt ervoor?', body: `${n}`,
        options: numberOptions(ans, r), answer: String(ans),
        hint: after ? 'Tel één verder.' : 'Tel één terug.',
        explain: `${after ? 'Na' : 'Voor'} ${n} komt ${ans}.`,
      };
    }
    case 'tafels-basis': {
      const t = [1, 2, 5, 10][ri(r, 0, 3)];
      a = ri(r, 1, 10); b = t; op = '×'; ans = a * b;
      hint = t === 10 ? 'Bij de tafel van 10 zet je een 0 achter het getal.' : t === 5 ? 'De tafel van 5 eindigt altijd op 5 of 0.' : `Tel steeds ${t} erbij: ${t}, ${2 * t}, ${3 * t}, …`;
      break;
    }
    case 'tafels-alle':
      a = ri(r, 2, 10); b = ri(r, 3, 9); op = '×'; ans = a * b;
      hint = `Weet je ${a - 1} × ${b}? Tel daar nog ${b} bij.`;
      break;
    case 'delen':
      b = ri(r, 2, 10); ans = ri(r, 1, 10); a = ans * b; op = ':';
      hint = `Hoe vaak past ${b} in ${a}? Denk aan de tafel van ${b}.`;
      break;
    case 'tot-1000':
    default:
      if (r() < 0.5) {
        a = ri(r, 1, 8) * 100 + ri(r, 0, 9) * 10; b = ri(r, 1, 9) * 10; op = '+';
        if (a + b > 1000) b = 10;
        ans = a + b;
      } else {
        a = ri(r, 2, 9) * 100 + ri(r, 0, 9) * 10; b = ri(r, 1, 9) * 10; op = '−'; ans = a - b;
      }
      hint = 'Kijk alleen naar de tientallen. De honderdtallen helpen je daarna.';
      break;
  }
  const body = `${a} ${op} ${b} = ?`;
  return {
    id: `som-${a}${op}${b}`,
    level,
    topic,
    prompt: 'Reken uit',
    speak: `${a} ${op === '+' ? 'plus' : op === '−' ? 'min' : op === '×' ? 'keer' : 'gedeeld door'} ${b}`,
    body,
    options: numberOptions(ans, r),
    answer: String(ans),
    hint,
    explain: `${a} ${op} ${b} = ${ans}`,
    render: level <= 3 ? render : undefined,
  };
}

export function generateSum(level: number, unlocked: string[], r: Rand = Math.random): QuizItem {
  for (let l = level; l >= 1; l--) {
    const topics = (REKEN_TOPICS[l] ?? []).filter((t) => unlocked.includes(t));
    if (topics.length) return sumItem(r, l, topics[ri(r, 0, topics.length - 1)]);
  }
  return sumItem(r, 1, 'optellen');
}

// ---------- Klok en geld ----------
const UREN = ['twaalf', 'één', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf', 'twaalf'];

export function timeToDutch(h: number, m: number): string {
  const hh = ((h % 12) + 12) % 12;
  const next = (hh + 1) % 12;
  const name = (x: number) => UREN[x === 0 ? 12 : x];
  if (m === 0) return `${name(hh)} uur`;
  if (m === 15) return `kwart over ${name(hh)}`;
  if (m === 30) return `half ${name(next)}`;
  if (m === 45) return `kwart voor ${name(next)}`;
  throw new Error('Alleen hele, halve en kwartieren');
}

export function formatEuro(cents: number): string {
  const e = Math.floor(cents / 100);
  const c = cents % 100;
  return `€ ${e},${String(c).padStart(2, '0')}`;
}

export const COINS = [5, 10, 20, 50, 100, 200];

export function generateKlokGeld(level: number, unlocked: string[], r: Rand = Math.random): QuizItem {
  const canKwart = unlocked.includes('klok-kwartier');
  const canGeld = unlocked.includes('geld');
  let effective = level;
  if (effective >= 4 && !canGeld) effective = 3;
  if (effective === 3 && !canKwart) effective = 2;

  if (effective <= 3) {
    const h = ri(r, 1, 12);
    const mins = effective === 1 ? [0] : effective === 2 ? [0, 30] : [15, 30, 45, 0];
    const m = mins[ri(r, 0, mins.length - 1)];
    const answer = timeToDutch(h, m);
    const opts = new Set([answer]);
    const alt: [number, number][] = [
      [h + 1, m], [h - 1, m], [h, m === 30 ? 0 : 30], [h + 1, m === 0 ? 30 : 0],
      ...(effective === 3 ? ([[h, m === 15 ? 45 : 15], [h + 1, m === 45 ? 15 : 45]] as [number, number][]) : []),
    ];
    for (const [ah, am] of shuffle(alt, r)) {
      if (opts.size >= 3) break;
      opts.add(timeToDutch(ah, am));
    }
    return {
      id: `klok-${h}-${m}`,
      level,
      topic: effective === 3 ? 'klok-kwartier' : 'klok-hele-halve',
      prompt: 'Hoe laat is het?',
      options: shuffle([...opts], r),
      answer,
      hint:
        m === 30
          ? 'De grote wijzer staat op de 6. Dan is het half … het volgende uur!'
          : m === 0
            ? 'De grote wijzer staat op de 12. Kijk waar de kleine wijzer staat.'
            : 'Grote wijzer op de 3 = kwart over. Op de 9 = kwart voor.',
      explain: `Het is ${answer}.`,
      render: { kind: 'klok', h, m },
    };
  }
  // geld
  const n = ri(r, 2, 4);
  const coins = Array.from({ length: n }, () => COINS[ri(r, 0, COINS.length - 1)]).sort((a, b) => b - a);
  const total = coins.reduce((s, c) => s + c, 0);
  const opts = new Set([total]);
  for (const d of shuffle([10, -10, 5, -5, 50, 20, -20], r)) {
    if (opts.size >= 3) break;
    if (total + d > 0) opts.add(total + d);
  }
  return {
    id: `geld-${coins.join('-')}`,
    level,
    topic: 'geld',
    prompt: 'Hoeveel geld is dit samen?',
    options: shuffle([...opts].map(formatEuro), r),
    answer: formatEuro(total),
    hint: 'Begin bij de grootste munt en tel de rest erbij.',
    explain: `${coins.map(formatEuro).join(' + ')} = ${formatEuro(total)}`,
    render: { kind: 'geld', coins },
  };
}
