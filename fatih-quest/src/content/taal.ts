/**
 * Taalwereld: lidwoorden, woordsoorten, onderwerp en persoonsvorm.
 * Originele zinnen rond natuur, dieren, ruimte en wetenschap.
 */
import type { QuizItem } from './quiz';

type DH = [string, 'de' | 'het', string, number]; // woord, lidwoord, emoji, niveau

const DEHET: DH[] = [
  ['maan', 'de', '🌙', 1], ['zon', 'de', '☀️', 1], ['boom', 'de', '🌳', 1], ['vis', 'de', '🐟', 1],
  ['huis', 'het', '🏠', 1], ['boek', 'het', '📖', 1], ['paard', 'het', '🐴', 1], ['ei', 'het', '🥚', 1],
  ['kat', 'de', '🐱', 1], ['bos', 'het', '🌲', 1], ['raket', 'de', '🚀', 1], ['schaap', 'het', '🐑', 1],
  ['blad', 'het', '🍃', 2], ['vogel', 'de', '🐦', 2], ['water', 'het', '💧', 2], ['ster', 'de', '⭐', 2],
  ['konijn', 'het', '🐰', 2], ['berg', 'de', '⛰️', 2], ['strand', 'het', '🏖️', 2], ['bloem', 'de', '🌸', 2],
  ['varken', 'het', '🐷', 2], ['wolk', 'de', '☁️', 2], ['veld', 'het', '🌾', 2], ['slak', 'de', '🐌', 2],
  ['heelal', 'het', '🌌', 3], ['eiland', 'het', '🏝️', 3], ['dier', 'het', '🐾', 3], ['planeet', 'de', '🪐', 3],
  ['weer', 'het', '🌦️', 3], ['vulkaan', 'de', '🌋', 3], ['meisje', 'het', '👧', 3], ['vlinder', 'de', '🦋', 3],
  ['hondje', 'het', '🐶', 3], ['zand', 'het', '🏜️', 3], ['kikker', 'de', '🐸', 3], ['ijs', 'het', '🧊', 3],
];

export const DEHET_ITEMS: QuizItem[] = DEHET.map(([w, a, e, level]) => ({
  id: `dh-${w}`,
  level,
  topic: 'lidwoorden',
  prompt: 'De of het?',
  speak: `Is het de of het ${w}?`,
  body: `… ${w}`,
  visual: e,
  options: ['de', 'het'],
  answer: a,
  hint:
    w.endsWith('je')
      ? 'Een klein woord met -je, zoals hondje, krijgt altijd "het".'
      : 'Zeg het hardop: "de ' + w + '" en "het ' + w + '". Wat klinkt goed?',
  explain: `Het is "${a} ${w}".` + (w.endsWith('je') ? ' Verkleinwoorden krijgen altijd "het".' : ''),
}));

type WS = [string, string, 'zelfstandig naamwoord' | 'bijvoeglijk naamwoord' | 'werkwoord', number];
// zin met [woord] gemarkeerd, woord, soort, niveau
const WOORDSOORT: WS[] = [
  ['De [kat] slaapt.', 'kat', 'zelfstandig naamwoord', 1],
  ['De vogel [vliegt].', 'vliegt', 'werkwoord', 1],
  ['Een [rode] appel.', 'rode', 'bijvoeglijk naamwoord', 1],
  ['De [maan] schijnt.', 'maan', 'zelfstandig naamwoord', 1],
  ['De hond [rent] weg.', 'rent', 'werkwoord', 1],
  ['Een [groot] huis.', 'groot', 'bijvoeglijk naamwoord', 1],
  ['Ik [lees] een boek.', 'lees', 'werkwoord', 1],
  ['Het [konijn] eet gras.', 'konijn', 'zelfstandig naamwoord', 1],
  ['Een [zachte] knuffel.', 'zachte', 'bijvoeglijk naamwoord', 1],
  ['De [raket] gaat omhoog.', 'raket', 'zelfstandig naamwoord', 1],
  ['De slak kruipt over het [natte] blad.', 'natte', 'bijvoeglijk naamwoord', 2],
  ['De astronaut [zweeft] in de ruimte.', 'zweeft', 'werkwoord', 2],
  ['In de [zee] zwemt een walvis.', 'zee', 'zelfstandig naamwoord', 2],
  ['De vulkaan is erg [heet].', 'heet', 'bijvoeglijk naamwoord', 2],
  ['We [bouwen] een hut in het bos.', 'bouwen', 'werkwoord', 2],
  ['De [telescoop] staat op het dak.', 'telescoop', 'zelfstandig naamwoord', 2],
  ['Een [glanzende] ster aan de hemel.', 'glanzende', 'bijvoeglijk naamwoord', 2],
  ['De bij [zoemt] bij de bloem.', 'zoemt', 'werkwoord', 2],
  ['Op de berg ligt [witte] sneeuw.', 'witte', 'bijvoeglijk naamwoord', 2],
  ['Mijn [zus] tekent een planeet.', 'zus', 'zelfstandig naamwoord', 2],
  ['De egel [verstopt] zich onder de bladeren.', 'verstopt', 'werkwoord', 3],
  ['De [wetenschapper] doet een proefje.', 'wetenschapper', 'zelfstandig naamwoord', 3],
  ['De kikker springt in de [modderige] sloot.', 'modderige', 'bijvoeglijk naamwoord', 3],
  ['Morgen [onderzoeken] wij de stenen.', 'onderzoeken', 'werkwoord', 3],
  ['Het [ruimtestation] draait om de aarde.', 'ruimtestation', 'zelfstandig naamwoord', 3],
  ['Een [nieuwsgierige] vos kijkt om de hoek.', 'nieuwsgierige', 'bijvoeglijk naamwoord', 3],
  ['De zon [verwarmt] het water.', 'verwarmt', 'werkwoord', 3],
  ['Na het onweer ruikt het bos [fris].', 'fris', 'bijvoeglijk naamwoord', 3],
  ['De [vlinder] landt op mijn hand.', 'vlinder', 'zelfstandig naamwoord', 3],
  ['De olifanten [drinken] bij de rivier.', 'drinken', 'werkwoord', 3],
];

const WS_HINT: Record<WS[2], string> = {
  'zelfstandig naamwoord': 'Kun je er "de" of "het" voor zetten? Dan is het een zelfstandig naamwoord.',
  werkwoord: 'Kun je het zelf doen? Zet er "ik" voor. Dan is het een werkwoord.',
  'bijvoeglijk naamwoord': 'Zegt het woord iets over hoe iets is? Dan is het een bijvoeglijk naamwoord.',
};
const WS_HINT_GENERIC =
  'Probeer: kun je er "de/het" voor zetten (ding), "ik" voor zetten (doen), of zegt het hoe iets is?';

export const WOORDSOORT_ITEMS: QuizItem[] = WOORDSOORT.map(([zin, w, soort, level], i) => ({
  id: `ws-${i}`,
  level,
  topic: 'woordsoorten-basis',
  prompt: `Wat voor woord is "${w}"?`,
  body: zin,
  options: ['zelfstandig naamwoord', 'werkwoord', 'bijvoeglijk naamwoord'],
  answer: soort,
  hint: level === 1 ? WS_HINT[soort] : WS_HINT_GENERIC,
  explain: `"${w}" is een ${soort}. ${WS_HINT[soort]}`,
}));

type ZD = [string, string, string, 'pv' | 'ow', number, string[]];
// zin, gevraagd antwoord, uitleg, type, niveau, extra opties
const ZINSDEEL: ZD[] = [
  ['De kat slaapt.', 'slaapt', 'Maak de zin vragend: "Slaapt de kat?" Het woord dat vooraan springt is de persoonsvorm.', 'pv', 1, ['De', 'kat']],
  ['Fatih leest een boek.', 'leest', 'Vraagzin: "Leest Fatih een boek?"', 'pv', 1, ['Fatih', 'boek']],
  ['De raket vliegt hoog.', 'vliegt', 'Vraagzin: "Vliegt de raket hoog?"', 'pv', 1, ['raket', 'hoog']],
  ['Wij zwemmen in de zee.', 'zwemmen', 'Vraagzin: "Zwemmen wij in de zee?"', 'pv', 1, ['Wij', 'zee']],
  ['De hond blaft hard.', 'blaft', 'Vraagzin: "Blaft de hond hard?"', 'pv', 1, ['hond', 'hard']],
  ['De maan schijnt fel.', 'schijnt', 'Vraagzin: "Schijnt de maan fel?"', 'pv', 1, ['maan', 'fel']],
  ['Mijn broer bouwt een toren.', 'bouwt', 'Vraagzin: "Bouwt mijn broer een toren?"', 'pv', 1, ['broer', 'toren']],
  ['De vogels zingen vrolijk.', 'zingen', 'Vraagzin: "Zingen de vogels vrolijk?"', 'pv', 1, ['vogels', 'vrolijk']],
  ['De uil vangt een muis.', 'De uil', 'Wie vangt een muis? De uil. Dat is het onderwerp.', 'ow', 2, ['vangt', 'een muis']],
  ['Sara tekent een ster.', 'Sara', 'Wie tekent een ster? Sara.', 'ow', 2, ['tekent', 'een ster']],
  ['De astronaut zweeft.', 'De astronaut', 'Wie zweeft? De astronaut.', 'ow', 2, ['zweeft', 'De']],
  ['Het konijn eet een wortel.', 'Het konijn', 'Wie eet een wortel? Het konijn.', 'ow', 2, ['eet', 'een wortel']],
  ['De juf leest voor.', 'De juf', 'Wie leest voor? De juf.', 'ow', 2, ['leest', 'voor']],
  ['Twee eenden zwemmen in de sloot.', 'Twee eenden', 'Wie zwemmen in de sloot? Twee eenden.', 'ow', 2, ['zwemmen', 'de sloot']],
  ['De vulkaan spuwt lava.', 'De vulkaan', 'Wat spuwt lava? De vulkaan.', 'ow', 2, ['spuwt', 'lava']],
  ['Opa plant een boom.', 'Opa', 'Wie plant een boom? Opa.', 'ow', 2, ['plant', 'een boom']],
  ['Morgen gaan wij naar het museum.', 'gaan', 'Maak er een vraag van: "Gaan wij morgen naar het museum?"', 'pv', 3, ['Morgen', 'wij']],
  ['In de winter slaapt de egel.', 'slaapt', 'Vraagzin: "Slaapt de egel in de winter?"', 'pv', 3, ['winter', 'egel']],
  ['Gisteren keken wij naar de sterren.', 'keken', 'Vraagzin: "Keken wij gisteren naar de sterren?" Ook in de verleden tijd werkt het.', 'pv', 3, ['Gisteren', 'wij']],
  ['Na school speelt Noah buiten.', 'speelt', 'Vraagzin: "Speelt Noah na school buiten?"', 'pv', 3, ['school', 'Noah']],
  ['Elke nacht draait de aarde verder.', 'draait', 'Vraagzin: "Draait de aarde elke nacht verder?"', 'pv', 3, ['nacht', 'aarde']],
  ['Bij de rivier drinkt een hert.', 'een hert', 'Wie drinkt bij de rivier? Een hert. Het onderwerp staat hier achter de persoonsvorm.', 'ow', 3, ['drinkt', 'de rivier']],
  ['In het bos woont een vos.', 'een vos', 'Wie woont in het bos? Een vos.', 'ow', 3, ['woont', 'het bos']],
  ['Vandaag onderzoekt de klas bladeren.', 'de klas', 'Wie onderzoekt bladeren? De klas.', 'ow', 3, ['onderzoekt', 'bladeren']],
  ['Boven de zee vliegen meeuwen.', 'meeuwen', 'Wie vliegen boven de zee? Meeuwen.', 'ow', 3, ['vliegen', 'de zee']],
  ['Straks kijkt papa door de telescoop.', 'papa', 'Wie kijkt door de telescoop? Papa.', 'ow', 3, ['kijkt', 'de telescoop']],
  ['De kinderen maken een vulkaan van klei.', 'maken', 'Vraagzin: "Maken de kinderen een vulkaan van klei?"', 'pv', 2, ['kinderen', 'klei']],
  ['Mijn zusje vindt een schelp.', 'vindt', 'Vraagzin: "Vindt mijn zusje een schelp?"', 'pv', 2, ['zusje', 'schelp']],
  ['De bijen maken honing.', 'De bijen', 'Wie maken honing? De bijen.', 'ow', 2, ['maken', 'honing']],
  ['Op Mars staat een robot.', 'staat', 'Vraagzin: "Staat er een robot op Mars?"', 'pv', 3, ['Mars', 'robot']],
];

export const ZINSDEEL_ITEMS: QuizItem[] = ZINSDEEL.map(([zin, ans, uitleg, t, level, extra], i) => ({
  id: `zd-${i}`,
  level,
  topic: t === 'pv' ? 'persoonsvorm' : 'onderwerp',
  prompt: t === 'pv' ? 'Wat is de persoonsvorm?' : 'Wat is het onderwerp?',
  body: zin,
  options: [ans, ...extra],
  answer: ans,
  hint:
    t === 'pv'
      ? 'Maak van de zin een vraag. Het woord dat dan vooraan komt, is de persoonsvorm.'
      : 'Zoek eerst de persoonsvorm. Vraag dan: wie of wat + persoonsvorm?',
  explain: uitleg,
}));
