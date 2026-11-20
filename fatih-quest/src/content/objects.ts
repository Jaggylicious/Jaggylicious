/** Objecten voor concentratie- en geheugenspellen. Elk met naam (voor instructies) en emoji. */
export interface Thing {
  id: string;
  name: string; // met lidwoord: 'de ster'
  short: string; // 'ster'
  emoji: string;
  group: 'ruimte' | 'dier' | 'natuur';
}

export const THINGS: Thing[] = [
  { id: 'ster', name: 'de ster', short: 'ster', emoji: '⭐', group: 'ruimte' },
  { id: 'maan', name: 'de maan', short: 'maan', emoji: '🌙', group: 'ruimte' },
  { id: 'raket', name: 'de raket', short: 'raket', emoji: '🚀', group: 'ruimte' },
  { id: 'planeet', name: 'de planeet', short: 'planeet', emoji: '🪐', group: 'ruimte' },
  { id: 'komeet', name: 'de komeet', short: 'komeet', emoji: '☄️', group: 'ruimte' },
  { id: 'satelliet', name: 'de satelliet', short: 'satelliet', emoji: '🛰️', group: 'ruimte' },
  { id: 'aarde', name: 'de aarde', short: 'aarde', emoji: '🌍', group: 'ruimte' },
  { id: 'zon', name: 'de zon', short: 'zon', emoji: '☀️', group: 'ruimte' },
  { id: 'uil', name: 'de uil', short: 'uil', emoji: '🦉', group: 'dier' },
  { id: 'vos', name: 'de vos', short: 'vos', emoji: '🦊', group: 'dier' },
  { id: 'egel', name: 'de egel', short: 'egel', emoji: '🦔', group: 'dier' },
  { id: 'kikker', name: 'de kikker', short: 'kikker', emoji: '🐸', group: 'dier' },
  { id: 'schildpad', name: 'de schildpad', short: 'schildpad', emoji: '🐢', group: 'dier' },
  { id: 'vlinder', name: 'de vlinder', short: 'vlinder', emoji: '🦋', group: 'dier' },
  { id: 'walvis', name: 'de walvis', short: 'walvis', emoji: '🐳', group: 'dier' },
  { id: 'olifant', name: 'de olifant', short: 'olifant', emoji: '🐘', group: 'dier' },
  { id: 'pinguin', name: 'de pinguïn', short: 'pinguïn', emoji: '🐧', group: 'dier' },
  { id: 'konijn', name: 'het konijn', short: 'konijn', emoji: '🐰', group: 'dier' },
  { id: 'boom', name: 'de boom', short: 'boom', emoji: '🌳', group: 'natuur' },
  { id: 'bloem', name: 'de bloem', short: 'bloem', emoji: '🌻', group: 'natuur' },
  { id: 'paddenstoel', name: 'de paddenstoel', short: 'paddenstoel', emoji: '🍄', group: 'natuur' },
  { id: 'blad', name: 'het blad', short: 'blad', emoji: '🍁', group: 'natuur' },
  { id: 'schelp', name: 'de schelp', short: 'schelp', emoji: '🐚', group: 'natuur' },
  { id: 'steen', name: 'de steen', short: 'steen', emoji: '🪨', group: 'natuur' },
];

export const ANIMALS = THINGS.filter((t) => t.group === 'dier');

/** Gekleurde vormen voor 'Luister en kies'. */
export const COLORS = [
  { id: 'rood', label: 'rode', fill: '#f87171' },
  { id: 'blauw', label: 'blauwe', fill: '#60a5fa' },
  { id: 'groen', label: 'groene', fill: '#4ade80' },
  { id: 'geel', label: 'gele', fill: '#facc15' },
  { id: 'paars', label: 'paarse', fill: '#c084fc' },
];
export const SHAPES = [
  { id: 'planeet', label: 'planeet', art: 'de' },
  { id: 'ster', label: 'ster', art: 'de' },
  { id: 'raket', label: 'raket', art: 'de' },
];
