/**
 * Emotiewereld – korte, herkenbare situaties.
 * Er zijn geen foute gevoelens: bij stap 1 is elk gevoel goed.
 * Bij stap 2 ontdekt Fatih wat kan helpen. Antwoorden worden NIET opgeslagen of geïnterpreteerd.
 */
export interface Feeling {
  id: string;
  label: string;
  emoji: string;
}

export const FEELINGS: Feeling[] = [
  { id: 'blij', label: 'blij', emoji: '😊' },
  { id: 'boos', label: 'boos', emoji: '😠' },
  { id: 'verdrietig', label: 'verdrietig', emoji: '😢' },
  { id: 'bang', label: 'bang', emoji: '😨' },
  { id: 'teleurgesteld', label: 'teleurgesteld', emoji: '😞' },
  { id: 'onzeker', label: 'onzeker', emoji: '😕' },
  { id: 'trots', label: 'trots', emoji: '😌' },
  { id: 'rustig', label: 'rustig', emoji: '🙂' },
];

export interface Strategy {
  id: string;
  label: string;
  emoji: string;
}

export const STRATEGIES: Record<string, Strategy> = {
  ademen: { id: 'ademen', label: 'Rustig ademhalen', emoji: '🌬️' },
  pauze: { id: 'pauze', label: 'Even pauze nemen', emoji: '⏸️' },
  hulp: { id: 'hulp', label: 'Hulp vragen', emoji: '🙋' },
  zeggen: { id: 'zeggen', label: 'Zeggen wat ik voel', emoji: '💬' },
  anders: { id: 'anders', label: 'Een andere oplossing proberen', emoji: '🔄' },
  opnieuw: { id: 'opnieuw', label: 'Opnieuw proberen', emoji: '🔁' },
  skdd: { id: 'skdd', label: 'Stop – Kijk – Denk – Doe', emoji: '🛑' },
};

export interface Scenario {
  id: string;
  emoji: string;
  text: string;
  helpful: string[]; // strategy ids
  lessHelpful: { label: string; emoji: string; why: string };
  tip: string;
}

export const SCENARIOS: Scenario[] = [
  { id: 'em-toren', emoji: '🧱', text: 'Je bouwt een hoge toren. Hij valt om.', helpful: ['ademen', 'opnieuw', 'anders'], lessHelpful: { label: 'Alle blokken weggooien', emoji: '💥', why: 'Dan is je bouwwerk helemaal weg. Even ademhalen en opnieuw proberen helpt meer.' }, tip: 'Een fout helpt mij leren. Ik kan opnieuw proberen.' },
  { id: 'em-snap', emoji: '❓', text: 'De juf legt iets uit. Je snapt de opdracht niet.', helpful: ['hulp', 'skdd'], lessHelpful: { label: 'Maar iets gokken', emoji: '🎲', why: 'Gokken is lastig. Hulp vragen is slim, dat mag altijd.' }, tip: 'Ik mag hulp vragen.' },
  { id: 'em-vriend', emoji: '🧒', text: 'Een vriend pakt je bal af zonder te vragen.', helpful: ['zeggen', 'ademen', 'hulp'], lessHelpful: { label: 'Hem een duw geven', emoji: '✋', why: 'Dan kan iemand pijn krijgen. Zeggen wat je voelt helpt beter.' }, tip: 'Ik kan zeggen: "Ik vind het niet fijn als je mijn bal pakt."' },
  { id: 'em-afgeleid', emoji: '🔊', text: 'Je maakt je werk. Er is veel lawaai in de klas.', helpful: ['skdd', 'pauze', 'hulp'], lessHelpful: { label: 'Zelf ook lawaai maken', emoji: '📢', why: 'Dan wordt het nog drukker. Stop – Kijk – Denk – Doe helpt je terug bij je opdracht.' }, tip: 'STOP: wat is mijn opdracht? Dan ga ik rustig verder.' },
  { id: 'em-verloren', emoji: '🎲', text: 'Je verliest een spelletje.', helpful: ['ademen', 'zeggen', 'opnieuw'], lessHelpful: { label: 'Het spel van tafel vegen', emoji: '🌪️', why: 'Dan kan er iets kapotgaan. Rustig ademhalen en nog een keer spelen helpt meer.' }, tip: 'Verliezen is balen. Het is maar een spel. Volgende keer weer.' },
  { id: 'em-som', emoji: '🔢', text: 'Een som lukt niet. Je probeert het al drie keer.', helpful: ['pauze', 'hulp', 'anders'], lessHelpful: { label: 'Zeggen: "Ik ben dom"', emoji: '🙈', why: 'Dat is niet waar. Je kunt het nóg niet. Een pauze of hulp vragen helpt.' }, tip: 'Ik kan het nog niet. Nog niet!' },
  { id: 'em-nieuw', emoji: '🏫', text: 'Je gaat voor het eerst naar een nieuwe club.', helpful: ['ademen', 'zeggen', 'hulp'], lessHelpful: { label: 'Niet gaan en thuisblijven', emoji: '🚪', why: 'Nieuw is spannend. Vertellen dat je het spannend vindt helpt vaak.' }, tip: 'Spannend mag. Ik kan vertellen dat ik het spannend vind.' },
  { id: 'em-tekening', emoji: '🎨', text: 'Je tekening is anders geworden dan je wilde.', helpful: ['anders', 'opnieuw', 'ademen'], lessHelpful: { label: 'De tekening verscheuren', emoji: '📄', why: 'Misschien vind je hem later toch mooi. Je kunt er ook iets nieuws van maken.' }, tip: 'Ik kan er iets nieuws van maken.' },
  { id: 'em-buiten', emoji: '⚽', text: 'Niemand vraagt of je mee wilt spelen.', helpful: ['zeggen', 'hulp'], lessHelpful: { label: 'Alleen in een hoekje gaan zitten', emoji: '🪑', why: 'Je kunt zelf vragen: "Mag ik meedoen?" Of hulp vragen aan de juf.' }, tip: 'Ik kan vragen: "Mag ik meedoen?"' },
  { id: 'em-verdrietig', emoji: '🌧️', text: 'Je huisdier is ziek. Je voelt je verdrietig.', helpful: ['zeggen', 'hulp', 'ademen'], lessHelpful: { label: 'Het gevoel heel diep wegstoppen', emoji: '📦', why: 'Verdriet mag er zijn. Erover praten met iemand die je vertrouwt helpt.' }, tip: 'Ik mag verdrietig zijn. Ik kan het vertellen aan iemand die ik vertrouw.' },
  { id: 'em-haast', emoji: '⏩', text: 'Je wilt snel klaar zijn. Je maakt veel slordige foutjes.', helpful: ['skdd', 'pauze'], lessHelpful: { label: 'Nog sneller gaan', emoji: '🏎️', why: 'Dan komen er meer foutjes. Rustig controleren helpt.' }, tip: 'Ik doe het rustig. Ik controleer: klopt mijn antwoord?' },
  { id: 'em-boos', emoji: '🌋', text: 'Je bent heel boos. Je voelt het in je buik en je handen.', helpful: ['ademen', 'pauze', 'zeggen'], lessHelpful: { label: 'Schreeuwen tegen iemand', emoji: '😤', why: 'Boos zijn mag, maar schreeuwen maakt het vaak erger. Eerst rustig ademen.' }, tip: 'Boos mag. Eerst adem ik vijf keer rustig in en uit.' },
];

export const AFFIRMATIONS = [
  'Ik kan het nog niet.',
  'Ik mag hulp vragen.',
  'Een fout helpt mij leren.',
  'Ik kan opnieuw proberen.',
  'Ik doe het rustig, stap voor stap.',
  'Ik ben nieuwsgierig. Dat is mijn kracht.',
];
