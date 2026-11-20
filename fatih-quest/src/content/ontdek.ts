/**
 * Ontdekkingswereld – originele, feitelijk gecontroleerde verhalen voor 8–11 jaar.
 * Elk onderwerp: kort verhaal, moeilijke woorden, drie begripsvragen en een ontdektaak.
 */
export interface Topic {
  id: string;
  title: string;
  emoji: string;
  world: 'ruimte' | 'natuur';
  story: string[]; // alinea's, korte zinnen
  words: { word: string; meaning: string }[];
  questions: { q: string; options: string[]; answer: string; hint: string }[];
  task: string;
}

export const TOPICS: Topic[] = [
  {
    id: 'planeten', title: 'De planeten', emoji: '🪐', world: 'ruimte',
    story: [
      'Onze aarde is een planeet. Ze draait in een grote baan om de zon.',
      'Er zijn acht planeten. Mercurius staat het dichtst bij de zon. Daar is het overdag gloeiend heet.',
      'Jupiter is de grootste planeet. Er passen meer dan duizend aardes in!',
      'Saturnus heeft prachtige ringen. Die zijn gemaakt van stukjes ijs en steen.',
      'De aarde is de derde planeet vanaf de zon. Voor zover we weten, is het de enige planeet met leven.',
    ],
    words: [
      { word: 'planeet', meaning: 'een grote bol die rond een ster draait' },
      { word: 'baan', meaning: 'de weg die een planeet aflegt rond de zon' },
    ],
    questions: [
      { q: 'Hoeveel planeten zijn er?', options: ['acht', 'drie', 'twintig'], answer: 'acht', hint: 'Kijk in de tweede zin van het tweede stukje.' },
      { q: 'Welke planeet is het grootst?', options: ['Jupiter', 'Mercurius', 'de aarde'], answer: 'Jupiter', hint: 'Er passen meer dan duizend aardes in.' },
      { q: 'Waar zijn de ringen van Saturnus van gemaakt?', options: ['ijs en steen', 'zand en water', 'goud'], answer: 'ijs en steen', hint: 'Lees het stukje over Saturnus nog eens.' },
    ],
    task: 'Kijk vanavond (met een volwassene) naar de lucht. Een heel helder "sterretje" dat niet twinkelt, kan een planeet zijn!',
  },
  {
    id: 'sterren', title: 'Sterren', emoji: '⭐', world: 'ruimte',
    story: [
      'Wist je dat de zon een ster is? Ze is de ster die het dichtst bij ons staat.',
      'Een ster is een enorme bol heet gas. Daardoor geeft hij licht.',
      'Overdag zijn de sterren er ook. Maar de zon is zo fel, dat je ze dan niet ziet.',
      'Sterren hebben verschillende kleuren. Blauwe sterren zijn heter dan rode sterren.',
      'Een groepje sterren dat samen een figuur lijkt te maken, heet een sterrenbeeld.',
    ],
    words: [
      { word: 'gas', meaning: 'een stof zoals lucht: je kunt er doorheen, maar het is er wel' },
      { word: 'sterrenbeeld', meaning: 'een groepje sterren dat samen een figuur lijkt te maken' },
    ],
    questions: [
      { q: 'Welke ster staat het dichtst bij ons?', options: ['de zon', 'de maan', 'de Poolster'], answer: 'de zon', hint: 'Lees de eerste zin.' },
      { q: 'Waarom zie je overdag geen sterren?', options: ['De zon is te fel.', 'Ze gaan slapen.', 'Ze zijn dan weg.'], answer: 'De zon is te fel.', hint: 'Kijk in het derde stukje.' },
      { q: 'Welke sterren zijn het heetst?', options: ['blauwe sterren', 'rode sterren', 'gele sterren'], answer: 'blauwe sterren', hint: 'Het staat in het stukje over kleuren.' },
    ],
    task: 'Teken je eigen sterrenbeeld met vijf puntjes. Welke figuur maak jij? Bedenk er een naam bij.',
  },
  {
    id: 'dino', title: 'Dinosaurussen', emoji: '🦕', world: 'natuur',
    story: [
      'Heel lang geleden leefden er dinosaurussen op aarde. Dat was miljoenen jaren voordat er mensen waren.',
      'Sommige dinosaurussen aten planten. De Diplodocus had een heel lange nek om bij hoge bladeren te komen.',
      'Andere dinosaurussen aten vlees. De Tyrannosaurus rex had sterke tanden, zo groot als bananen.',
      'Ongeveer 66 miljoen jaar geleden stierven de grote dinosaurussen uit.',
      'Hoe weten we dat ze bestonden? Door fossielen: botten en sporen die in steen zijn veranderd. En weet je wat? Vogels stammen af van dinosaurussen!',
    ],
    words: [
      { word: 'fossiel', meaning: 'resten van een dier of plant van heel lang geleden, bewaard in steen' },
      { word: 'uitsterven', meaning: 'als een diersoort helemaal verdwijnt' },
    ],
    questions: [
      { q: 'Wat at de Diplodocus?', options: ['planten', 'vlees', 'vis'], answer: 'planten', hint: 'Hij had een lange nek voor hoge bladeren.' },
      { q: 'Hoe weten we dat dinosaurussen bestonden?', options: ['door fossielen', 'door foto\'s', 'uit tekenfilms'], answer: 'door fossielen', hint: 'Kijk in het laatste stukje.' },
      { q: 'Welke dieren stammen af van dinosaurussen?', options: ['vogels', 'katten', 'vissen'], answer: 'vogels', hint: 'Het staat in de laatste zin.' },
    ],
    task: 'Druk je hand of een blaadje in een stukje klei of deeg. Zo ontstaat een afdruk, net als bij een fossiel.',
  },
  {
    id: 'uil', title: 'De uil', emoji: '🦉', world: 'natuur',
    story: [
      'De uil is een vogel die vooral \'s nachts op jacht gaat.',
      'Hij heeft grote ogen, zodat hij in het donker goed kan zien. Maar zijn ogen kunnen niet rondkijken.',
      'Daarom kan een uil zijn hoofd heel ver draaien. Bijna helemaal rond!',
      'De veren van een uil zijn zacht. Daardoor vliegt hij bijna zonder geluid. Een muis hoort hem niet aankomen.',
      'Een uil slikt zijn prooi vaak in één keer door. De botjes en haren spuugt hij later uit als een balletje: een braakbal.',
    ],
    words: [
      { word: 'prooi', meaning: 'een dier dat door een ander dier wordt gevangen' },
      { word: 'braakbal', meaning: 'een balletje met botjes en haren dat een uil uitspuugt' },
    ],
    questions: [
      { q: 'Wanneer gaat de uil vooral op jacht?', options: ['\'s nachts', '\'s ochtends', 'tussen de middag'], answer: '\'s nachts', hint: 'Lees de eerste zin.' },
      { q: 'Waarom vliegt een uil bijna zonder geluid?', options: ['door zijn zachte veren', 'door zijn grote ogen', 'omdat hij klein is'], answer: 'door zijn zachte veren', hint: 'Kijk in het vierde stukje.' },
      { q: 'Wat zit er in een braakbal?', options: ['botjes en haren', 'zaadjes', 'steentjes'], answer: 'botjes en haren', hint: 'Lees de laatste zin.' },
    ],
    task: 'Draai je hoofd zo ver als je kunt naar links en naar rechts. Hoe ver kom jij? Een uil kan veel verder!',
  },
  {
    id: 'oceaan', title: 'De oceaan', emoji: '🌊', world: 'natuur',
    story: [
      'Als je de aarde vanuit de ruimte bekijkt, zie je vooral blauw. Ongeveer zeventig procent van de aarde is bedekt met water.',
      'Het meeste water zit in de oceanen. Oceaanwater is zout.',
      'De oceaan is op sommige plekken heel diep. De diepste plek is bijna elf kilometer diep!',
      'In de oceaan leeft het grootste dier dat ooit heeft bestaan: de blauwe vinvis. Hij is groter dan de grootste dinosaurus.',
      'Diep in de oceaan is het donker en koud. Toch leven daar dieren, zoals vissen die zelf licht geven.',
    ],
    words: [
      { word: 'oceaan', meaning: 'een heel grote, diepe zee' },
      { word: 'bedekt', meaning: 'als er iets overheen ligt' },
    ],
    questions: [
      { q: 'Hoe smaakt oceaanwater?', options: ['zout', 'zoet', 'zuur'], answer: 'zout', hint: 'Kijk in het tweede stukje.' },
      { q: 'Wat is het grootste dier dat ooit heeft bestaan?', options: ['de blauwe vinvis', 'de olifant', 'de T. rex'], answer: 'de blauwe vinvis', hint: 'Het staat in het vierde stukje.' },
      { q: 'Hoe is het diep in de oceaan?', options: ['donker en koud', 'licht en warm', 'droog'], answer: 'donker en koud', hint: 'Lees het laatste stukje.' },
    ],
    task: 'Zoek op een wereldbol of kaart (samen met een volwassene) de vijf oceanen. Welke is het grootst?',
  },
  {
    id: 'vulkaan', title: 'Vulkanen', emoji: '🌋', world: 'natuur',
    story: [
      'Diep onder de grond is het zo heet, dat steen smelt. Die vloeibare steen heet magma.',
      'Soms komt het magma naar boven door een opening: een vulkaan.',
      'Als het magma buiten de vulkaan stroomt, noemen we het lava. Lava is gloeiend heet en kan wel duizend graden zijn.',
      'Er zijn ook vulkanen onder de zee. Sommige eilanden zijn zo ontstaan.',
      'Na lange tijd wordt de grond rond een vulkaan heel vruchtbaar. Daar groeien planten goed.',
    ],
    words: [
      { word: 'magma', meaning: 'gesmolten steen onder de grond' },
      { word: 'vruchtbaar', meaning: 'grond waar planten goed op groeien' },
    ],
    questions: [
      { q: 'Hoe heet gesmolten steen ónder de grond?', options: ['magma', 'lava', 'zand'], answer: 'magma', hint: 'Kijk in de eerste twee zinnen.' },
      { q: 'Hoe heet het als het buiten de vulkaan stroomt?', options: ['lava', 'magma', 'modder'], answer: 'lava', hint: 'Lees het derde stukje.' },
      { q: 'Hoe zijn sommige eilanden ontstaan?', options: ['door vulkanen onder zee', 'door regen', 'door de wind'], answer: 'door vulkanen onder zee', hint: 'Het staat in het vierde stukje.' },
    ],
    task: 'Proefje met een volwassene: doe wat bakpoeder in een bekertje en giet er azijn bij. Wat zie je gebeuren?',
  },
  {
    id: 'lichaam', title: 'Je hart', emoji: '❤️', world: 'natuur',
    story: [
      'In je borst zit je hart. Het is een sterke spier, ongeveer zo groot als je vuist.',
      'Je hart pompt bloed door je hele lichaam. Het bloed brengt zuurstof naar alle delen van je lichaam.',
      'Als je rustig zit, klopt het hart van een kind ongeveer 70 tot 110 keer per minuut.',
      'Als je rent of springt, gaat je hart sneller kloppen. Je spieren hebben dan meer zuurstof nodig.',
      'Je hart werkt dag en nacht. Ook als je slaapt!',
    ],
    words: [
      { word: 'spier', meaning: 'een deel van je lichaam dat kan aanspannen en bewegen' },
      { word: 'zuurstof', meaning: 'een stof in de lucht die je lichaam nodig heeft' },
    ],
    questions: [
      { q: 'Hoe groot is je hart ongeveer?', options: ['zo groot als je vuist', 'zo groot als een voetbal', 'zo klein als een erwt'], answer: 'zo groot als je vuist', hint: 'Lees de eerste alinea.' },
      { q: 'Wat brengt het bloed naar je lichaam?', options: ['zuurstof', 'zand', 'geluid'], answer: 'zuurstof', hint: 'Kijk in het tweede stukje.' },
      { q: 'Wat gebeurt er als je rent?', options: ['Je hart klopt sneller.', 'Je hart stopt.', 'Je hart klopt langzamer.'], answer: 'Je hart klopt sneller.', hint: 'Lees het vierde stukje.' },
    ],
    task: 'Leg je hand op je borst en voel je hart. Spring daarna tien keer. Voel je verschil?',
  },
  {
    id: 'regenboog', title: 'De regenboog', emoji: '🌈', world: 'natuur',
    story: [
      'Een regenboog zie je als de zon schijnt terwijl het regent.',
      'Zonlicht lijkt wit. Maar eigenlijk zitten er allemaal kleuren in.',
      'Als zonlicht door regendruppels gaat, worden de kleuren uit elkaar gehaald. Zo ontstaat een regenboog.',
      'De kleuren staan altijd in dezelfde volgorde: rood, oranje, geel, groen, blauw, indigo en violet.',
      'Wil je een regenboog zien? Zet dan de zon in je rug en kijk naar de regen.',
    ],
    words: [
      { word: 'regendruppel', meaning: 'een klein druppeltje regen' },
      { word: 'volgorde', meaning: 'welke eerst komt, welke daarna, enzovoort' },
    ],
    questions: [
      { q: 'Wanneer zie je een regenboog?', options: ['als de zon schijnt en het regent', 'als het sneeuwt', '\'s nachts'], answer: 'als de zon schijnt en het regent', hint: 'Lees de eerste zin.' },
      { q: 'Welke kleur staat bovenaan in de rij?', options: ['rood', 'groen', 'violet'], answer: 'rood', hint: 'Kijk naar de volgorde in het vierde stukje.' },
      { q: 'Waar moet de zon zijn als je een regenboog wilt zien?', options: ['in je rug', 'voor je', 'onder je'], answer: 'in je rug', hint: 'Lees de laatste zin.' },
    ],
    task: 'Zet met een volwassene op een zonnige dag de tuinslang op een sproeistand, met de zon in je rug. Zie je een regenboog?',
  },
  {
    id: 'ei-proef', title: 'Het drijvende ei', emoji: '🥚', world: 'natuur',
    story: [
      'Wetenschappers doen proefjes om dingen te ontdekken. Jij kunt dat ook!',
      'Leg een rauw ei in een glas met gewoon kraanwater. Het ei zakt naar de bodem.',
      'Doe nu een ander glas water en roer er heel veel zout door. Leg het ei erin.',
      'Wat gebeurt er? Het ei gaat drijven!',
      'Zout water is zwaarder dan gewoon water. Daardoor duwt het zoute water het ei omhoog. Daarom blijf je in de zee ook makkelijker drijven.',
    ],
    words: [
      { word: 'drijven', meaning: 'bovenop het water blijven liggen' },
      { word: 'voorspellen', meaning: 'vooraf zeggen wat er gaat gebeuren' },
    ],
    questions: [
      { q: 'Wat doet het ei in gewoon kraanwater?', options: ['Het zakt naar de bodem.', 'Het drijft.', 'Het breekt.'], answer: 'Het zakt naar de bodem.', hint: 'Kijk in het tweede stukje.' },
      { q: 'Wat moet je door het water roeren?', options: ['zout', 'suiker', 'zand'], answer: 'zout', hint: 'Lees het derde stukje.' },
      { q: 'Waarom gaat het ei drijven?', options: ['Zout water is zwaarder.', 'Het ei wordt lichter.', 'Het water wordt warm.'], answer: 'Zout water is zwaarder.', hint: 'Het staat in het laatste stukje.' },
    ],
    task: 'Doe het proefje met een volwassene. Voorspel eerst: gaat het ei drijven of zinken? Klopte jouw voorspelling?',
  },
];
