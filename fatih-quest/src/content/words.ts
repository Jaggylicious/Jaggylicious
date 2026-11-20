/**
 * Woordenschat – originele uitleg en voorbeeldzinnen, passend bij groep 5.
 * Thema's: ruimte, natuur, dieren, wetenschap en 'schoolwoorden' (instructiebegrip).
 * Elk woord: uitleg, voorbeeldzin (met ___ voor het invulwoord), illustratie (emoji), thema.
 */
export interface Word {
  id: string;
  word: string;
  article?: 'de' | 'het';
  meaning: string;
  sentence: string; // bevat het woord letterlijk
  emoji: string;
  topic: 'ruimte' | 'natuur' | 'dieren' | 'wetenschap' | 'school';
  /** 1 = vaak al bekend, 3 = moeilijker */
  difficulty: 1 | 2 | 3;
}

export const WORDS: Word[] = [
  // School- en instructiewoorden (instructiebegrip)
  { id: 'opdracht', word: 'opdracht', article: 'de', meaning: 'iets wat je moet doen', sentence: 'De juf geeft ons een opdracht: lees bladzijde tien.', emoji: '📝', topic: 'school', difficulty: 1 },
  { id: 'vergelijken', word: 'vergelijken', meaning: 'kijken wat hetzelfde is en wat anders is', sentence: 'We gaan twee bladeren vergelijken.', emoji: '⚖️', topic: 'school', difficulty: 2 },
  { id: 'uitleggen', word: 'uitleggen', meaning: 'iemand laten snappen hoe iets werkt', sentence: 'Kun jij uitleggen hoe je dat hebt gedaan?', emoji: '🧑‍🏫', topic: 'school', difficulty: 1 },
  { id: 'omcirkelen', word: 'omcirkelen', meaning: 'een rondje om iets tekenen', sentence: 'Je moet het goede antwoord omcirkelen.', emoji: '⭕', topic: 'school', difficulty: 2 },
  { id: 'onderstrepen', word: 'onderstrepen', meaning: 'een streep onder een woord zetten', sentence: 'Onderstrepen jullie alle werkwoorden?', emoji: '✏️', topic: 'school', difficulty: 2 },
  { id: 'controleren', word: 'controleren', meaning: 'nog een keer kijken of iets goed is', sentence: 'Voor je inlevert, ga je je werk controleren.', emoji: '🔍', topic: 'school', difficulty: 2 },
  { id: 'ordenen', word: 'ordenen', meaning: 'dingen in een goede volgorde of groep zetten', sentence: 'We gaan de kaartjes ordenen van klein naar groot.', emoji: '🗂️', topic: 'school', difficulty: 3 },
  { id: 'samenvatten', word: 'samenvatten', meaning: 'in een paar zinnen vertellen waar iets over gaat', sentence: 'Kun je het verhaal samenvatten in twee zinnen?', emoji: '📄', topic: 'school', difficulty: 3 },

  // Ruimte
  { id: 'planeet', word: 'planeet', article: 'de', meaning: 'een grote bol die rond een ster draait', sentence: 'De aarde is een planeet die rond de zon draait.', emoji: '🪐', topic: 'ruimte', difficulty: 1 },
  { id: 'baan', word: 'baan', article: 'de', meaning: 'de weg die een planeet of maan in de ruimte aflegt', sentence: 'De maan draait in een baan om de aarde.', emoji: '🔄', topic: 'ruimte', difficulty: 2 },
  { id: 'astronaut', word: 'astronaut', article: 'de', meaning: 'iemand die naar de ruimte reist', sentence: 'De astronaut zweeft in het ruimtestation.', emoji: '🧑‍🚀', topic: 'ruimte', difficulty: 1 },
  { id: 'telescoop', word: 'telescoop', article: 'de', meaning: 'een kijker waarmee je dingen ver weg groot ziet', sentence: 'Met een telescoop kun je de kraters op de maan zien.', emoji: '🔭', topic: 'ruimte', difficulty: 2 },
  { id: 'krater', word: 'krater', article: 'de', meaning: 'een groot gat in de grond, bijvoorbeeld door een inslag', sentence: 'Op de maan zie je een krater naast een berg.', emoji: '🌑', topic: 'ruimte', difficulty: 2 },
  { id: 'zwaartekracht', word: 'zwaartekracht', article: 'de', meaning: 'de kracht die dingen naar beneden trekt', sentence: 'Door de zwaartekracht valt een appel naar de grond.', emoji: '🍎', topic: 'ruimte', difficulty: 3 },
  { id: 'sterrenbeeld', word: 'sterrenbeeld', article: 'het', meaning: 'een groepje sterren dat samen een figuur lijkt te maken', sentence: 'De Grote Beer is een bekend sterrenbeeld.', emoji: '✨', topic: 'ruimte', difficulty: 3 },

  // Natuur
  { id: 'seizoen', word: 'seizoen', article: 'het', meaning: 'een deel van het jaar, zoals lente of winter', sentence: 'De herfst is het seizoen van vallende bladeren.', emoji: '🍂', topic: 'natuur', difficulty: 1 },
  { id: 'vulkaan', word: 'vulkaan', article: 'de', meaning: 'een berg waar hete, vloeibare steen uit kan komen', sentence: 'Uit de vulkaan stroomt gloeiende lava.', emoji: '🌋', topic: 'natuur', difficulty: 1 },
  { id: 'oogst', word: 'oogst', article: 'de', meaning: 'alles wat je van het land of uit de tuin plukt', sentence: 'De boer is blij met de oogst van dit jaar.', emoji: '🌾', topic: 'natuur', difficulty: 2 },
  { id: 'kiemen', word: 'kiemen', meaning: 'als een zaadje begint te groeien', sentence: 'Na een week begint de boon te kiemen.', emoji: '🌱', topic: 'natuur', difficulty: 3 },
  { id: 'eb', word: 'eb', article: 'de', meaning: 'als het water van de zee laag staat', sentence: 'Bij eb kun je ver over het strand lopen.', emoji: '🏖️', topic: 'natuur', difficulty: 2 },
  { id: 'onweer', word: 'onweer', article: 'het', meaning: 'weer met bliksem en donder', sentence: 'Tijdens het onweer blijven we binnen.', emoji: '⛈️', topic: 'natuur', difficulty: 1 },
  { id: 'helling', word: 'helling', article: 'de', meaning: 'een stuk grond dat schuin omhoog of omlaag gaat', sentence: 'Met de fiets rijden we de helling af.', emoji: '⛰️', topic: 'natuur', difficulty: 2 },

  // Dieren
  { id: 'prooi', word: 'prooi', article: 'de', meaning: 'een dier dat door een ander dier wordt gevangen', sentence: 'De uil zoekt in het donker naar een prooi.', emoji: '🐭', topic: 'dieren', difficulty: 2 },
  { id: 'nest', word: 'nest', article: 'het', meaning: 'een huisje dat een dier maakt voor zijn jongen', sentence: 'De merel bouwt een nest in de heg.', emoji: '🪺', topic: 'dieren', difficulty: 1 },
  { id: 'schutkleur', word: 'schutkleur', article: 'de', meaning: 'een kleur waardoor een dier bijna niet opvalt', sentence: 'Door zijn schutkleur zie je de sprinkhaan bijna niet in het gras.', emoji: '🦗', topic: 'dieren', difficulty: 3 },
  { id: 'winterslaap', word: 'winterslaap', article: 'de', meaning: 'een lange, diepe slaap van sommige dieren in de winter', sentence: 'De egel houdt een winterslaap onder de bladeren.', emoji: '🦔', topic: 'dieren', difficulty: 2 },
  { id: 'kudde', word: 'kudde', article: 'de', meaning: 'een grote groep dieren die bij elkaar blijft', sentence: 'Een kudde olifanten loopt naar het water.', emoji: '🐘', topic: 'dieren', difficulty: 2 },
  { id: 'roofdier', word: 'roofdier', article: 'het', meaning: 'een dier dat andere dieren vangt en opeet', sentence: 'De leeuw is een roofdier.', emoji: '🦁', topic: 'dieren', difficulty: 1 },
  { id: 'trekvogel', word: 'trekvogel', article: 'de', meaning: 'een vogel die in de herfst naar een warm land vliegt', sentence: 'De zwaluw is een trekvogel.', emoji: '🐦', topic: 'dieren', difficulty: 3 },
  { id: 'gewei', word: 'gewei', article: 'het', meaning: 'de grote, vertakte hoorns van een hert', sentence: 'Het hert heeft een prachtig gewei.', emoji: '🦌', topic: 'dieren', difficulty: 2 },

  // Wetenschap
  { id: 'proefje', word: 'proefje', article: 'het', meaning: 'iets wat je uitprobeert om te ontdekken hoe het werkt', sentence: 'Met een proefje ontdekken we of een ei drijft.', emoji: '🧪', topic: 'wetenschap', difficulty: 1 },
  { id: 'onderzoeken', word: 'onderzoeken', meaning: 'heel goed kijken en uitzoeken hoe iets zit', sentence: 'De wetenschapper gaat de steen onderzoeken.', emoji: '🔬', topic: 'wetenschap', difficulty: 1 },
  { id: 'voorspellen', word: 'voorspellen', meaning: 'vooraf zeggen wat er gaat gebeuren', sentence: 'Kun je voorspellen of het ijsblokje smelt?', emoji: '🔮', topic: 'wetenschap', difficulty: 2 },
  { id: 'magneet', word: 'magneet', article: 'de', meaning: 'een stuk metaal dat ijzer naar zich toe trekt', sentence: 'De magneet trekt de paperclip aan.', emoji: '🧲', topic: 'wetenschap', difficulty: 1 },
  { id: 'verdampen', word: 'verdampen', meaning: 'als water verandert in damp en de lucht in gaat', sentence: 'In de zon gaat het plasje water verdampen.', emoji: '♨️', topic: 'wetenschap', difficulty: 3 },
  { id: 'meten', word: 'meten', meaning: 'uitzoeken hoe groot, lang of zwaar iets is', sentence: 'Met een liniaal kun je de lengte meten.', emoji: '📏', topic: 'wetenschap', difficulty: 1 },
];

/** Synoniemen (hetzelfde) en tegenstellingen (het omgekeerde) – niveau 4. */
export interface WordPair {
  id: string;
  word: string;
  answer: string;
  kind: 'synoniem' | 'tegenstelling';
  distractors: string[];
}

export const WORD_PAIRS: WordPair[] = [
  { id: 'p-snel', word: 'snel', answer: 'vlug', kind: 'synoniem', distractors: ['traag', 'groot'] },
  { id: 'p-blij', word: 'blij', answer: 'vrolijk', kind: 'synoniem', distractors: ['boos', 'moe'] },
  { id: 'p-groot', word: 'groot', answer: 'klein', kind: 'tegenstelling', distractors: ['dik', 'lang'] },
  { id: 'p-begin', word: 'begin', answer: 'einde', kind: 'tegenstelling', distractors: ['start', 'midden'] },
  { id: 'p-mooi', word: 'mooi', answer: 'prachtig', kind: 'synoniem', distractors: ['lelijk', 'oud'] },
  { id: 'p-licht', word: 'licht', answer: 'donker', kind: 'tegenstelling', distractors: ['helder', 'zacht'] },
  { id: 'p-praten', word: 'praten', answer: 'spreken', kind: 'synoniem', distractors: ['zwijgen', 'lopen'] },
  { id: 'p-warm', word: 'warm', answer: 'koud', kind: 'tegenstelling', distractors: ['heet', 'nat'] },
  { id: 'p-bang', word: 'bang', answer: 'angstig', kind: 'synoniem', distractors: ['dapper', 'stil'] },
  { id: 'p-hoog', word: 'hoog', answer: 'laag', kind: 'tegenstelling', distractors: ['groot', 'breed'] },
  { id: 'p-pakken', word: 'pakken', answer: 'grijpen', kind: 'synoniem', distractors: ['loslaten', 'gooien'] },
  { id: 'p-vol', word: 'vol', answer: 'leeg', kind: 'tegenstelling', distractors: ['zwaar', 'dicht'] },
  { id: 'p-slim', word: 'slim', answer: 'knap', kind: 'synoniem', distractors: ['dom', 'snel'] },
  { id: 'p-winnen', word: 'winnen', answer: 'verliezen', kind: 'tegenstelling', distractors: ['spelen', 'scoren'] },
  { id: 'p-kijken', word: 'kijken', answer: 'zien', kind: 'synoniem', distractors: ['horen', 'slapen'] },
  { id: 'p-oud', word: 'oud', answer: 'nieuw', kind: 'tegenstelling', distractors: ['groot', 'kapot'] },
];
