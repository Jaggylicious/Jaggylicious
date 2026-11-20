/** Ontdekkingskaarten die Fatih vrijspeelt met sterren. Geen loot boxes: de volgorde ligt vast. */
export interface Card {
  id: string;
  emoji: string;
  title: string;
  fact: string;
  cost: number; // totaal aantal verzamelde sterren nodig
}

export const CARDS: Card[] = [
  { id: 'k-maan', emoji: '🌙', title: 'De maan', fact: 'De maan geeft zelf geen licht. Ze weerkaatst het licht van de zon.', cost: 5 },
  { id: 'k-octopus', emoji: '🐙', title: 'De octopus', fact: 'Een octopus heeft drie harten en acht armen.', cost: 12 },
  { id: 'k-mars', emoji: '🔴', title: 'Mars', fact: 'Mars ziet er rood uit door roestig stof op de grond.', cost: 20 },
  { id: 'k-bij', emoji: '🐝', title: 'De honingbij', fact: 'Bijen vertellen elkaar met een dansje waar de bloemen zijn.', cost: 30 },
  { id: 'k-bliksem', emoji: '⚡', title: 'Bliksem', fact: 'Je ziet bliksem eerder dan je de donder hoort, omdat licht sneller is dan geluid.', cost: 40 },
  { id: 'k-giraf', emoji: '🦒', title: 'De giraf', fact: 'Een giraf heeft net zoveel nekwervels als jij: zeven! Ze zijn alleen veel langer.', cost: 52 },
  { id: 'k-iss', emoji: '🛰️', title: 'Het ruimtestation', fact: 'Het ruimtestation ISS vliegt in ongeveer anderhalf uur één keer rond de aarde.', cost: 65 },
  { id: 'k-schildpad', emoji: '🐢', title: 'De zeeschildpad', fact: 'Zeeschildpadden komen vaak terug naar het strand waar ze zelf zijn geboren om eieren te leggen.', cost: 80 },
  { id: 'k-zon', emoji: '☀️', title: 'De zon', fact: 'Het licht van de zon doet ongeveer acht minuten over de reis naar de aarde.', cost: 95 },
  { id: 'k-boom', emoji: '🌳', title: 'Bomen', fact: 'Aan de jaarringen in een boomstam kun je zien hoe oud een boom is.', cost: 110 },
  { id: 'k-pinguin', emoji: '🐧', title: 'De pinguïn', fact: 'Pinguïns kunnen niet vliegen, maar wel heel goed zwemmen.', cost: 130 },
  { id: 'k-saturnus', emoji: '🪐', title: 'Saturnus', fact: 'Saturnus is zo licht voor zijn grootte, dat hij zou drijven in een gigantische badkuip.', cost: 150 },
];

export function cardsUnlockedBy(totalStars: number): Card[] {
  return CARDS.filter((c) => totalStars >= c.cost);
}
