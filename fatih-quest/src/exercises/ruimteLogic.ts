/** Logica voor B2 'Ruimtemissie': objecten op een bord plaatsen volgens een instructie. */
import { THINGS, type Thing } from '../content/objects';

export type Relation = 'naast' | 'boven' | 'onder' | 'links van' | 'rechts van';

export interface Step {
  thing: Thing; // te plaatsen
  relation: Relation;
  anchor: Thing; // staat al op het bord
}

export interface Mission {
  size: number;
  anchors: { thing: Thing; cell: number }[];
  steps: Step[];
  tray: Thing[]; // inclusief eventuele afleider
}

const xy = (c: number, size: number) => [c % size, Math.floor(c / size)] as const;

export function targetCells(rel: Relation, anchorCell: number, size: number): number[] {
  const [x, y] = xy(anchorCell, size);
  const cand: [number, number][] =
    rel === 'naast' ? [[x - 1, y], [x + 1, y]]
    : rel === 'boven' ? [[x, y - 1]]
    : rel === 'onder' ? [[x, y + 1]]
    : rel === 'links van' ? [[x - 1, y]]
    : [[x + 1, y]];
  return cand.filter(([a, b]) => a >= 0 && b >= 0 && a < size && b < size).map(([a, b]) => b * size + a);
}

export function stepSatisfied(step: Step, placed: Record<string, number>, anchorCell: number, size: number) {
  const c = placed[step.thing.id];
  if (c === undefined) return false;
  return targetCells(step.relation, anchorCell, size).includes(c);
}

export function generateMission(level: number, r: () => number = Math.random): Mission {
  const size = level <= 2 ? 3 : 4;
  const nSteps = level <= 2 ? 1 : level === 3 ? 2 : 3;
  const rels: Relation[] = level === 1 ? ['naast'] : level === 2 ? ['naast', 'boven', 'onder'] : ['naast', 'boven', 'onder', 'links van', 'rechts van'];
  const space = THINGS.filter((t) => t.group === 'ruimte');
  for (let tries = 0; tries < 200; tries++) {
    const pool = [...space].sort(() => r() - 0.5);
    const nAnchors = nSteps === 1 ? 1 : 2;
    const anchors: { thing: Thing; cell: number }[] = [];
    const used = new Set<number>();
    while (anchors.length < nAnchors) {
      const cell = Math.floor(r() * size * size);
      if (used.has(cell)) continue;
      used.add(cell);
      anchors.push({ thing: pool[anchors.length], cell });
    }
    const steps: Step[] = [];
    const reserved = new Set<number>(used);
    let ok = true;
    for (let i = 0; i < nSteps; i++) {
      const a = anchors[i % anchors.length];
      const rel = rels[Math.floor(r() * rels.length)];
      const cells = targetCells(rel, a.cell, size).filter((c) => !reserved.has(c));
      if (!cells.length) { ok = false; break; }
      // Voor 'naast' reserveren we alle mogelijke vakjes zodat stappen elkaar niet blokkeren
      cells.forEach((c) => reserved.add(c));
      steps.push({ thing: pool[nAnchors + i], relation: rel, anchor: a.thing });
    }
    if (!ok) continue;
    const distractor = level >= 2 ? [pool[nAnchors + nSteps]] : [];
    const tray = [...steps.map((s) => s.thing), ...distractor].sort(() => r() - 0.5);
    return { size, anchors, steps, tray };
  }
  throw new Error('Kon geen missie maken');
}

export function stepText(s: Step) {
  return `Zet ${s.thing.name} ${s.relation} ${s.anchor.name}.`;
}

export function missionText(m: Mission) {
  if (m.steps.length === 1) return stepText(m.steps[0]);
  const words = ['Eerst', 'Dan', 'Daarna'];
  return m.steps.map((s, i) => `${words[i]}: zet ${s.thing.name} ${s.relation} ${s.anchor.name}.`).join(' ');
}

export function checkMission(m: Mission, placed: Record<string, number>) {
  const stepOk = m.steps.map((s) => {
    const a = m.anchors.find((x) => x.thing.id === s.anchor.id)!;
    return stepSatisfied(s, placed, a.cell, m.size);
  });
  const extra = Object.keys(placed).filter((id) => !m.steps.some((s) => s.thing.id === id));
  return { stepOk, extra, allOk: stepOk.every(Boolean) && extra.length === 0 };
}
