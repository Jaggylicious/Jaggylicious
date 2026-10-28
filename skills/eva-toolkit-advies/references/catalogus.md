# Catalogus — Erkans gereedschapskist

Format per tool: wat het is · gebruik als · niet als · installatie · status.
Status: ✅ standaard · ⚙️ bij voorwaarde · ⛔ afgeraden.

## Basis (Claude Code)

### Context7 ✅
- Wat: actuele officiële documentatie van libraries in Claude Code.
- Gebruik als: er code geschreven wordt met externe libraries/frameworks.
- Niet als: puur tekst- of contentwerk.
- Installatie: `claude mcp add context7 -- npx -y @upstash/context7-mcp`

### Chrome DevTools MCP ✅ (Google, officieel)
- Wat: Claude opent zelf de browser, klikt door de site, leest console-fouten.
- Gebruik als: elke website of web-app die gebouwd of aangepast wordt.
- Niet als: geen webinterface.
- Installatie: `claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest`

### Supabase MCP ⚙️ (officieel)
- Wat: Claude leest tabellen en draait queries op een Supabase-project.
- Gebruik als: het project een Supabase-database gebruikt.
- Niet als: geen Supabase, of productiedata met persoonsgegevens zonder read-only/test-omgeving.
- Voorwaarde: koppelen aan test- of read-only-project.

## Design & front-end

### GSAP skill (greensock/gsap-skills) ⚙️
- Wat: scroll-animaties, tekst-reveals, timelines.
- Gebruik als: premium uitstraling gewenst (bv. autoverkoop, events, portfolio).
- Niet als: snelheid/eenvoud voorop; met mate gebruiken.

### Design DNA (zanwei/design-dna) ⚙️
- Wat: analyseert typografie, kleuren en layout van een voorbeeldsite.
- Gebruik als: inspiratie nodig bij een nieuw ontwerp.
- Niet als: doel is een concurrent 1-op-1 kopiëren.

### Three.js skill (CloudAI-X/threejs-skills) ⚙️
- Wat: interactieve 3D-scènes.
- Gebruik als: echt een 3D-ervaring nodig is (productviewer, game, campagnesite).
- Niet als: bedrijfssite gericht op leads; maakt traag en slechter vindbaar.

### Motion Design / Lottie (lottiefiles/motion-design-skill) ⚙️
- Wat: Lottie- en SVG-animaties.
- Gebruik als: losse geanimeerde iconen/illustraties gewenst.
- Niet als: GSAP al wordt ingezet voor hetzelfde.

### Genjutsu (AThevon/genjutsu) ⚙️
- Wat: creatieve UI-richting en visuele polish.
- Gebruik als: experimenteel/creatief ontwerp.
- Niet als: standaard zakelijke site.

## Content & marketing

### Remotion — reels met code ✅ (content)
- Wat: video's bouwen met code (React) en lokaal renderen; Claude schrijft de reel (hook, scènes, ondertitels), Remotion maakt er beeld voor beeld een video van.
- Gebruik als: vaste formats in eigen huisstijl, bv. vacature-reel (functie, locatie, 3 pluspunten), Boom Events-promo, carrousel-naar-reel.
- Niet als: gefilmde mensen of filmische beelden nodig zijn (dan echt beeld of een generator).
- Voordelen: huisstijl exact, geen kosten per video, herhaalbaar via sjablonen.
- Let op: licentie controleren (gratis voor individuen/kleine bedrijven, kan wijzigen); vereist Node.js.
- Installatie: `npx create-video@latest` in een nieuwe map; daarna Claude Code in die map laten werken.

### Eigen contentskills (nog te bouwen) ✅
- Vacature → LinkedIn/Instagram-post in Boom-toon en huisstijl.
- Carrousel-builder in Boom-kleuren.
- Contentcheck vóór publicatie (hook, helderheid, huisstijl).
- Inplannen via Meta Business Suite (officieel, gratis).

### JEV (TypeSafe) ⚙️
- Wat: goedkoop beslis-/classificatiemodel; scoort en categoriseert, schrijft niets.
- Gebruik als: veel advertentievarianten of posts vooraf scoren.
- Niet als: kandidaten beoordelen zonder menselijke beslissing (EU AI Act hoog-risico, AVG).

### Ootto claude-content-skills ⚙️
- Wat: gratis contentskills voor Instagram (Engelstalig, gericht op virale reels); lead magnet voor Ootto.
- Gebruik als: inspiratie voor eigen skills.
- Niet als: direct installeren voor Nederlandse recruitmentcontent.

## Website-zichtbaarheid

### Vertaling + AI-zichtbaarheid (eigen werk, geen tool) ✅
- Engelse (evt. Turkse) versie met hreflang, schema.org, llms.txt, FAQ- en dienstteksten.
- Weglot-abonnement niet nodig voor 1–2 talen.

## Spraak (Eva)

### Voicebox ⚙️ (jamiepine/voicebox, MIT, lokaal)
- Wat: lokale spraakstudio; Eva praat terug via MCP (voicebox.speak); ook dicteren en stemklonen.
- Gebruik als: spraakuitvoer voor Eva gewenst.
- Niet als: alleen dicteren nodig (OpenWhispr of ingebouwde spraakinvoer van Claude Code volstaat).
- Installatie: app installeren via voicebox.sh, dan `claude mcp add voicebox http://localhost:1420/mcp`
- Let op: Nederlandse stemkwaliteit eerst testen; betaalde cloud-tier en crypto-token negeren; alleen eigen stem klonen of met toestemming.

### Ideeën voor Eva's spraak (overgenomen uit Hermes Agent) ⚙️
- **Wake word "Hé Eva"**: lokale luisteraar (bv. openWakeWord + faster-whisper) die Eva activeert zonder knop. Alleen lokaal draaien: de microfoon luistert continu mee. Gesprekken met kandidaten/klanten in dezelfde ruimte = privacyrisico; pauzeerknop inbouwen.
- **Spraakmemo's vanaf telefoon**: onderweg inspreken, gesproken antwoord terug. Eerst Claude Code via de Claude-app proberen; pas als dat niet volstaat een eigen koppeling (bv. Telegram-bot) bouwen.
- Hermes Agent zelf niet installeren: tweede systeem naast Eva = dubbel beheer.

## Geheugen & internet (Eva)

### claude-mem ⚙️
- Wat: plugin die Claude Code sessies laat onthouden en samenvat voor volgende sessies.
- Gebruik als: Eva over meerdere sessies context moet vasthouden en CLAUDE.md niet volstaat.
- Niet als: CLAUDE.md + projectbestanden al genoeg zijn (eerst dat proberen).
- Let op: controleer waar data wordt opgeslagen (lokaal houden); geen kandidaatgegevens in sessies zonder noodzaak.

### Agent Reach ⚙️ (Panniantong/Agent-Reach)
- Wat: geeft Eva toegang tot web, YouTube, RSS, GitHub, en met cookies ook X, Reddit, LinkedIn, Instagram.
- Gebruik als: research op openbare bronnen (zero-config kanalen: web, YouTube, RSS, GitHub).
- Niet als: inloggen met eigen hoofdaccounts. Scrapen via cookies is tegen de voorwaarden van LinkedIn/Instagram en kan tot blokkade leiden; LinkedIn-account is bedrijfskritisch.
- Installatie: `pip install agent-reach && agent-reach install --env=auto`, daarna `agent-reach doctor`.

## Beveiliging

### AI-pentesttool (security-scan van eigen app) ⚙️
- Wat: agent die je eigen web-app aanvalt en lekken laat fixen (bv. API-keys in frontend, open endpoints).
- Gebruik als: vóór livegang van sites met login, beheeromgeving, formulieren of persoonsgegevens (Carbutler, TTT, Autoradam Lease).
- Niet als: op sites of systemen die niet van jou of je opdrachtgever zijn (illegaal).
- Let op: exacte tool en herkomst eerst verifiëren voordat je installeert.

## Agent-platforms

### Agents Office (ajsahni/agents-office, beta) ⚙️
- Wat: lokaal "kantoor" met 35 agents in 6 afdelingen op je eigen Claude-login; brain-map met notities (Obsidian), skills in hetzelfde format als Claude Code, routines op tijd, leert van "revise:"-correcties.
- Gebruik als: experiment met één afdeling (bv. Emails of Sales), of als inspiratie voor Eva (brain-map, correcties onthouden, routines met goedkeuring).
- Niet als: hoofdplatform naast Eva (twee systemen = dubbel beheer), of als basis voor iets wat je verkoopt (licentie PolyForm Noncommercial: alleen persoonlijk/intern gebruik).
- Let op: beta van één ontwikkelaar; 35 agents verbruiken je Claude-tegoed snel; brain-map zonder kandidaatgegevens beginnen; "needs my OK" aan laten voor alles wat verstuurt of betaalt.
- Installatie: `git clone https://github.com/ajsahni/agents-office.git && cd agents-office && ./setup && npm start` → localhost:4520

## Beeld & video (AI-generatie)

### Banana Pro Director 2.0 + Cinema Worldbuilder Pro 2.0 ⚙️ (losse skills, Dropbox)
- Wat: twee promptskills (alleen tekst, geen scripts). Claude schrijft de prompt; het beeld of de video maak je in een aparte generator.
- Waar de prompts werken: Nano Banana Pro via Google Gemini/AI Studio, GPT-beeld via ChatGPT, Seedance-video via o.a. Dreamina/CapCut. Higgsfield bundelt ze, maar is niet verplicht. Alleen Soul Cinema is Higgsfield-eigen.
- Gebruik als: promo voor Boom Events, sfeerbeelden voor Carbutler/Autoradam.
- Niet als: vacature-content (echt beeld werkt beter voor vertrouwen).
- Let op: de generatoren zelf hebben vaak tegoed/abonnement nodig; `@image`-tags zijn Seedance-syntax en werken elders mogelijk niet. Personages alleen van jezelf of met toestemming; geen bestaande personen nabootsen.
- Installatie: claude.ai → Instellingen → Capabilities → Skills → zip uploaden; of uitpakken in `~/.claude/skills/`.

### LongCat-Video (Meituan, open source, MIT) ⚙️
- Wat: open videomodel (13,6B) voor tekst-naar-video, beeld-naar-video en lange video's, 720p.
- Gebruik als: je een zware NVIDIA-GPU hebt (CUDA, flash-attn) of via een betaalde provider (fal op Hugging Face) wilt experimenteren.
- Niet als: gewone laptop/pc zonder krachtige NVIDIA-kaart; voor vaste huisstijl-reels is Remotion beter.
- Let op: model is van oktober 2025, inmiddels zijn er nieuwere; Chinees bedrijf, maar lokaal draaien = data blijft bij jou.

## Eva-skills (eigen bouw)

### Eva voordoen-skill (eva-voordoen) ⚙️
- Wat: Erkan laat een browsertaak één keer zien of beschrijft hem; Eva voert hem met Chrome DevTools MCP stap voor stap uit en legt hem daarna vast als eigen skill die herhaalbaar is. Idee overgenomen van Hermes' workflow-record, maar binnen Eva.
- Gebruik als: terugkerende handmatige browsertaken (vacature overzetten naar een vacaturesite, gegevens opzoeken in een portaal, formulieren invullen).
- Niet als: de taak kandidaatgegevens beoordeelt of selecteert (EU AI Act), of interactie op social media automatiseert (reageren, DM'en, volgen).
- Let op: Eva stopt altijd vóór versturen, publiceren, betalen of verwijderen en vraagt eerst om OK; wachtwoorden en codes typt Erkan zelf en worden nooit opgeslagen; in het skillbestand staan geen persoonsgegevens, alleen stappen en plekken waar een waarde komt.
- Vereist: Chrome DevTools MCP (zie Basis).

## Afgeraden ⛔

### OmniRoute
- Reden: omzeilt betaalmuur via onbekende gratis providers; prompts en mogelijk kandidaatdata via derden. AVG-risico.

### Graphify, Ponytail
- Reden: voor ontwikkelaars met grote codebases; geen meerwaarde voor Erkans projecten.

### Social automatisering van interactie (auto-DM, auto-reageren, auto-volgen)
- Reden: spam volgens Instagram; risico op shadowban/blokkade.

### Awesome Free LLM APIs (lijst gratis AI-providers)
- Reden: zelfde risico als OmniRoute; gratis providers gebruiken je data vaak voor training. Niet voor bedrijfs- of kandidaatdata. Hooguit voor hobby-experimenten.

### Uncensored AI (uncensored.com)
- Reden: tussenpartij die bekende modellen (Claude, GPT, Gemini, Grok) doorverkoopt met filters eraf; geen eigen modellen. Data via onbekend bedrijf (postbusadres Wyoming), geen restitutie, reviews deels via affiliate-programma (30% commissie). Kan elk moment worden afgesloten door de modelmakers. Niet voor bedrijfs- of kandidaatdata.

### Hermes Agent-plugins (catalogus Nous Research, ~860 stuks)
- Reden: werken alleen binnen Hermes Agent = tweede systeem naast Eva (dubbel beheer). mcp-serve laat een MCP-client je berichten lezen en versturen namens je accounts; mermail kan geld overmaken en handelen; openmail laat mail via een externe dienst lopen (niet voor kandidaatgegevens); bot-forge maakt losse bots naast Eva; 3D-plugins (meshy, hermes-tripo, orcaslicer, make-parts-now) hebben geen meerwaarde voor Boom.
- Wel overgenomen als idee: "één keer voordoen, daarna herhalen" → Eva voordoen-skill (zie Eva-skills). Eigen mailadres voor Eva → apart Microsoft 365-postvak via de bestaande 365-connector, niet via openmail.
- Herkomst post: Julian Goldie ("Comment PLUGINS"), lokkertje voor betaalde community.
