/**
 * Verhaalsommen in twee stappen:
 * 1. "Wat is de vraag?" – Fatih wijst eerst de vraag aan (instructiebegrip).
 * 2. Uitrekenen, met de som als hulp.
 */
export interface StoryProblem {
  id: string;
  level: number;
  emoji: string;
  sentences: [string, string];
  question: string;
  sum: string;
  answer: number;
  unit: string;
}

type T = [number, string, string, string, string, string, number, string];

const RAW: T[] = [
  [1, '🐞', 'Op een blad zitten 4 lieveheersbeestjes.', 'Er komen er 3 bij.', 'Hoeveel lieveheersbeestjes zitten er nu?', '4 + 3', 7, 'lieveheersbeestjes'],
  [1, '🐟', 'In de vijver zwemmen 9 vissen.', 'Er zwemmen er 4 weg onder een steen.', 'Hoeveel vissen zie je nog?', '9 − 4', 5, 'vissen'],
  [1, '⭐', 'Fatih ziet 6 sterren.', 'Daarna ziet hij er nog 5.', 'Hoeveel sterren heeft hij gezien?', '6 + 5', 11, 'sterren'],
  [1, '🍎', 'In de mand liggen 12 appels.', 'Mama pakt er 2 uit.', 'Hoeveel appels liggen er nog in de mand?', '12 − 2', 10, 'appels'],
  [1, '🐦', 'Op het dak zitten 8 mussen.', 'Er landen er nog 7 bij.', 'Hoeveel mussen zitten er op het dak?', '8 + 7', 15, 'mussen'],
  [1, '🐚', 'Sara vindt 7 schelpen.', 'Haar broer vindt er 6.', 'Hoeveel schelpen vinden ze samen?', '7 + 6', 13, 'schelpen'],
  [1, '🦆', 'Er zwemmen 15 eenden in de sloot.', 'Er vliegen er 5 weg.', 'Hoeveel eenden zwemmen er nog?', '15 − 5', 10, 'eenden'],
  [1, '🌸', 'In de tuin staan 10 bloemen.', 'Opa plant er 8 bij.', 'Hoeveel bloemen staan er nu?', '10 + 8', 18, 'bloemen'],
  [1, '🪨', 'In de klas liggen 14 stenen.', 'De kinderen nemen er 6 mee naar buiten.', 'Hoeveel stenen liggen er nog in de klas?', '14 − 6', 8, 'stenen'],
  [1, '🐜', 'Er lopen 11 mieren over het pad.', 'Er komen er 9 bij.', 'Hoeveel mieren lopen er nu over het pad?', '11 + 9', 20, 'mieren'],
  [2, '🚀', 'Een raket heeft 30 liter brandstof.', 'Er komt 25 liter bij.', 'Hoeveel liter brandstof heeft de raket nu?', '30 + 25', 55, 'liter'],
  [2, '📚', 'In de bibliotheek staan 48 boeken over dieren.', 'Er worden 20 boeken uitgeleend.', 'Hoeveel boeken over dieren staan er nog?', '48 − 20', 28, 'boeken'],
  [2, '🦋', 'In de vlindertuin vliegen 36 vlinders.', 'Er komen 12 nieuwe vlinders uit hun pop.', 'Hoeveel vlinders vliegen er nu?', '36 + 12', 48, 'vlinders'],
  [2, '🔭', 'De sterrenwacht krijgt 65 bezoekers.', 'Er gaan 23 bezoekers al naar huis.', 'Hoeveel bezoekers zijn er nog?', '65 − 23', 42, 'bezoekers'],
  [2, '🐑', 'Een boer heeft 57 schapen.', 'Er worden 8 lammetjes geboren.', 'Hoeveel schapen heeft de boer nu?', '57 + 8', 65, 'schapen'],
  [2, '🌰', 'Een eekhoorn verstopt 40 nootjes.', 'Hij eet er 15 op.', 'Hoeveel nootjes heeft hij nog?', '40 − 15', 25, 'nootjes'],
  [2, '🧪', 'Voor een proefje heb je 50 ml water.', 'Je giet er 35 ml uit.', 'Hoeveel ml water heb je nog?', '50 − 35', 15, 'ml'],
  [2, '🐢', 'Een schildpad loopt 24 meter.', 'Daarna loopt hij nog 19 meter.', 'Hoeveel meter loopt de schildpad in totaal?', '24 + 19', 43, 'meter'],
  [2, '💶', 'Fatih heeft 70 cent.', 'Hij koopt een sticker van 45 cent.', 'Hoeveel cent houdt hij over?', '70 − 45', 25, 'cent'],
  [2, '🌻', 'Een zonnebloem is 68 cm hoog.', 'In een week groeit hij 14 cm.', 'Hoe hoog is de zonnebloem nu?', '68 + 14', 82, 'cm'],
  [3, '🕷️', 'Een spin heeft 8 poten.', 'Er zitten 4 spinnen in het web.', 'Hoeveel poten zijn dat samen?', '4 × 8', 32, 'poten'],
  [3, '🥚', 'In een doos zitten 6 eieren.', 'De kok heeft 5 dozen.', 'Hoeveel eieren heeft de kok?', '5 × 6', 30, 'eieren'],
  [3, '🐾', 'Er lopen 7 honden in het park.', 'Elke hond heeft 4 poten.', 'Hoeveel poten lopen er in het park?', '7 × 4', 28, 'poten'],
  [3, '🍪', 'Er zijn 24 koekjes.', 'Ze worden eerlijk verdeeld over 4 kinderen.', 'Hoeveel koekjes krijgt elk kind?', '24 : 4', 6, 'koekjes'],
  [3, '🪐', 'Er zijn 18 planeetstickers.', 'Ze moeten in groepjes van 3 op een kaart.', 'Hoeveel kaarten heb je nodig?', '18 : 3', 6, 'kaarten'],
  [3, '🚲', 'Een fiets heeft 2 wielen.', 'In de stalling staan 9 fietsen.', 'Hoeveel wielen zijn dat?', '9 × 2', 18, 'wielen'],
  [3, '🌱', 'De klas plant 5 rijen zaadjes.', 'In elke rij komen 10 zaadjes.', 'Hoeveel zaadjes plant de klas?', '5 × 10', 50, 'zaadjes'],
  [3, '🐝', 'Er zijn 35 bijen.', 'Ze vliegen in 5 gelijke groepjes.', 'Hoeveel bijen zitten er in elk groepje?', '35 : 5', 7, 'bijen'],
  [3, '🧦', 'Een paar sokken zijn 2 sokken.', 'In de la liggen 8 paar sokken.', 'Hoeveel sokken liggen er in de la?', '8 × 2', 16, 'sokken'],
  [3, '🍓', 'Mama heeft 40 aardbeien.', 'Ze verdeelt ze over 8 bakjes.', 'Hoeveel aardbeien komen er in elk bakje?', '40 : 8', 5, 'aardbeien'],
];

export const STORY_PROBLEMS: StoryProblem[] = RAW.map(([level, emoji, s1, s2, question, sum, answer, unit], i) => ({
  id: `vs-${i + 1}`,
  level,
  emoji,
  sentences: [s1, s2],
  question,
  sum,
  answer,
  unit,
}));
