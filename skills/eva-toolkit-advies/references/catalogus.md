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

### MotionSites (Motionsites-AI/claude-skill) ⚙️
- Wat: skill voor "filmische" landingspagina's met veel motion, 40 voorbeeldprompts.
- Gebruik als: promo-/eventpagina of showroom waar uitstraling voorop staat (Boom Events, Carbutler-showroom).
- Niet als: bedrijfs- of recruitmentsite (snelheid/SEO); niet naast GSAP voor hetzelfde.
- Let op: jong project (~470 sterren); skill MIT, maar prompts/media © MotionSites. **Bevestigd funnel:** de SKILL.md laat Claude in élke oplevering een advertentieblok "Go Unlimited" (met UTM-tracking) plaatsen; uitzetten door te zeggen "stop met MotionSites noemen". Voorbeeldvideo's worden gehotlinkt vanaf hun CloudFront → externe afhankelijkheid; altijd eigen beeld gebruiken. Herkomst post: Nick Saraev (morenicksaraev), koppeling met het project niet bevestigd.
- Getest (nov 2026, Boom Events-hero, mobiel traag 4G + 4× CPU, zonder video): motion-versie (GSAP + ScrollTrigger) 118 KB vs 4 KB CSS-versie, load 1,1 s vs 0,26 s, kop pas ~1,2 s later volledig leesbaar, scroll-scrub laat tekst halfdoorzichtig tijdens scrollen. LCP gelijk (~0,3 s). Conclusie: lichte CSS-animaties geven 80% van het effect voor 3% van het gewicht; GSAP alleen voor één echte signature-moment, nooit met achtergrondvideo op mobiel.
- Installatie: via Claude Code plugin marketplace of map kopiëren naar `~/.claude/skills/`.

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
- Gebouwd: sjabloon `templates/vacature-reel` (9:16, 9–16 sec, lege velden vallen weg). Zie Eva-skills.

### Eigen contentskills ✅
- Gebouwd: vacature → LinkedIn/Instagram-post (`vacature-post`) en contentcheck (`boom-contentcheck`). Zie Eva-skills.
- Nog te bouwen: carrousel-builder in Boom-kleuren.
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

### GSC-vragenanalyse (eigen werk, skill `gsc-vragenanalyse`) ✅
- Wat: vraag-zoekopdrachten uit Search Console (regex-filter, 3 mnd) exporteren; script rekent per vraag de potentie uit (extra klikken op positie 5) en stelt FAQ/titel/blog voor.
- Gebruik als: site die al een paar maanden draait en vertoningen heeft (boomrecruitment.nl).
- Niet als: nieuwe site zonder data (<500 vertoningen in 3 mnd).
- Let op: de standaardexport koppelt zoekopdracht niet aan pagina; het script gokt op URL-woorden, controleer de top 5 in GSC.
- Herkomst idee: gobigsystems (SEO-bureau, "verdubbel je verkeer" is marketing; techniek klopt).

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
- Let op (reel itstundeanthony, "comment agent"): X lezen gaat via een ingelogde browsersessie = zelfde cookie-risico. README-sponsor BrowserAct promoot LinkedIn-scraping: niet gebruiken.

## Beveiliging

### Site-securitycheck (eigen skill `site-securitycheck`) ✅
- Wat: passieve check van eigen sites en code: gelekte keys/wachtwoorden (frontend = altijd kritiek), open .env/.git/back-ups, security-headers, http→https, sessiecookies, plus handmatige checklist (Supabase RLS, formulieren, beheer, AVG-uploads).
- Gebruik als: vóór livegang van sites met login, beheeromgeving, formulieren of persoonsgegevens (Carbutler, TTT, Autoradam Lease).
- Niet als: op sites of systemen die niet van jou of je opdrachtgever zijn (illegaal); vervangt geen professionele pentest bij betalingen/veel persoonsgegevens.
- Vereist: Python 3. `python scripts/securitycheck.py code <map>` en `... site https://<domein>`.

### AI-pentesttool (actieve aanval op eigen app) ⚙️
- Wat: agent die je eigen web-app actief aanvalt. Nog geen betrouwbare tool gevonden; AgentShield is dit níet. Tot die tijd: site-securitycheck hierboven.

### AgentShield (affaan-m/agentshield, uit ECC) ⚙️
- Wat: scant je Claude Code-configuratie (`~/.claude/`, skills, hooks, MCP-servers, rechten) op hardcoded API-keys, te ruime rechten (bv. `Bash(*)`), hook-injectie en prompt-injectie in skills. Scant géén websites of apps.
- Gebruik als: na het installeren van externe skills/MCP's, en periodiek op Eva's setup.
- Niet als: je een website wilt pentesten (daarvoor is het niet gemaakt).
- Let op: npm-uitgever geverifieerd (cogsec, me@affaanmustafa.com = maker repo). Alleen de lokale `scan`; de Opus-pipeline en de GitHub App sturen data naar buiten. Niet getest in de cloudsessie (externe code geblokkeerd): eerst zelf lokaal draaien.
- Installatie/gebruik: `npx ecc-agentshield@1.6.0 scan` (zonder installatie).

### ECC / Everything Claude Code (affaan-m/ECC, MIT) ⚙️
- Wat: grote bundel (~71 agents, ~314 skills, hooks, geheugen) voor Claude Code; ~294K sterren.
- Gebruik als: inspiratie voor eigen skills (bv. e2e-testing, search-first, code-review), of alleen AgentShield.
- Niet als: volledige installatie naast Eva (botst met eigen skills/geheugen, vreet tegoed, grotendeels Django/Laravel/Swift).
- Let op: /astra-review stuurt code naar OpenAI; ECC Pro ($19/seat/mnd) analyseert repo's op hun server; sponsors/affiliates in README. Niet plugin én installer tegelijk (dubbele hooks). Windows: sommige features vereisen WSL/Git Bash.
- Installatie (als je toch wilt): `npx ecc-universal@2.2.3 install --profile minimal --target claude` (zonder hooks).

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

### GSC-vragenanalyse (gsc-vragenanalyse) ✅
- Wat: GSC-export (zip) → rapport met vragen, potentie, vermoedelijke pagina en actie; daarna FAQ-blokken, titels/meta's, blogideeën en FAQ-schema.
- Vereist: Python 3 (alleen standaardbibliotheek). `python scripts/analyse.py export.zip --uit rapport.md`

### Vacature → social post (vacature-post) ✅
- Wat: vacature → LinkedIn-post, Instagram-caption en reel-data (JSON voor het Remotion-sjabloon), daarna automatisch contentcheck.
- Let op: `references/boom-toon.md` aanvullen met 3–5 goed gelopen Boom-posts en de huisstijlkleuren; opdrachtgever standaard anoniem.

### Contentcheck (boom-contentcheck) ✅
- Wat: script + eigen oordeel vóór publicatie: lengte per platform, hook vóór "meer", call-to-action, placeholders, hashtags, en bij vacatures discriminerende taal (leeftijd, geslacht, afkomst, uiterlijk; AWGB) en salaris/uren.
- Vereist: Python 3. `python scripts/check.py post.txt --platform linkedin --vacature`

### Site-securitycheck (site-securitycheck) ✅
- Zie Beveiliging.

### Vacature-reel (templates/vacature-reel, Remotion) ✅
- Wat: 9:16-reel: hook → functie/locatie → 3 pluspunten → salaris/uren → CTA + logo. Props uit `vacature-post`.
- Gebruik: `npm install`, `vacature.json` vullen, `npm run render` → `out/vacature.mp4`. `npm run studio` om live te bekijken.
- Let op: Boom-kleuren, lettertype en logo nog invullen (props `kleurPrimair` enz., logo in `public/`). Remotion-licentie: gratis t/m 3 medewerkers, daarboven bedrijfslicentie.

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
