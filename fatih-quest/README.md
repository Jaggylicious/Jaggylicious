# Fatih Quest – Ontdek. Leer. Groei.

Een Nederlandstalige, adaptieve leer- en ontwikkel-PWA voor een kind van 9 jaar in groep 5.
Korte, rustige sessies (6–15 min) met concentratie, werkgeheugen/instructies, taal, rekenen,
emoties en ontdekverhalen. Alles draait lokaal op het apparaat: geen account, geen server, geen tracking.

> Fatih Quest is **geen medisch hulpmiddel**. De app stelt geen diagnoses en meet of behandelt geen
> ADHD, IQ of andere cognitieve eigenschappen. De spellen oefenen concrete vaardigheden en strategieën.

## Starten

```bash
cd fatih-quest
npm install
npm run dev        # ontwikkelserver
npm test           # 56 geautomatiseerde tests
npm run build      # productiebuild in dist/ (PWA, offline)
npm run preview    # build lokaal bekijken
```

**Op de telefoon installeren:** zet `dist/` op een HTTPS-host (bijv. Netlify, Cloudflare Pages of GitHub Pages),
open de site in Chrome op Android → menu → *Toevoegen aan startscherm*. Daarna werkt de app offline.

## 1. Functionele architectuur

```
src/
  core/        types, adaptief systeem, herhaalsysteem, opslag (IndexedDB), pincode,
               dagmissie-planner, sessieregistratie, analyse voor ouders, spraak, router
  content/     alle oefeninhoud (origineel): woorden, taal, rekengenerator, verhaalsommen,
               emoties, ontdekverhalen, ontdekkingskaarten
  exercises/   één component per oefening + ExerciseRunner (rondes, niveau, pauze, tijd, sterren)
  screens/     Home, Mission, World, FreePlay, Progress, Onboarding, ParentGate,
               ParentDashboard, Report
  components/  UI-bouwstenen, klok/munten/blokjes, ademhaling, Stop-Kijk-Denk-Doe, grafieken
  tests/       vitest-tests voor logica, inhoud en opslag
```

Techniek: React 18, TypeScript, Vite, Tailwind CSS v4, IndexedDB (`idb`), `vite-plugin-pwa` (service worker,
offline), Web Speech API voor voorlezen (ingebouwd in het apparaat, gratis, offline). Geen betaalde API's.

## 2. Schermen

| Scherm | Route | Inhoud |
|---|---|---|
| Inrichten (ouder) | eerste start | uitleg/disclaimer, naam, duur, pincode, expliciete toestemming |
| Welkomstscherm | `#/home` | begroeting, missie van vandaag, zes werelden, mijn ontdekkingen |
| Dagelijkse missie | `#/missie` | rustig starten (ademhalen + Stop-Kijk-Denk-Doe) → aandacht → geheugen → taal/rekenen → afsluiting |
| Concentratie | `#/wereld/concentratie` | A1 Zoek de ontdekking, A2 Luister en kies, A3 Eerst luisteren dan doen, A4 Blijf bij je missie, A5 Stop-Kijk-Denk-Doe |
| Geheugen | `#/wereld/geheugen` | B1 Onthoud de dieren, B2 Ruimtemissie (+B5 instructie in stukjes), B3 Wat kwam eerst?, B4 Herhaal de route |
| Taalwereld | `#/wereld/taal` | woordenschat met herhaalsysteem, de/het, woordsoorten, persoonsvorm/onderwerp, synoniemen/tegenstellingen |
| Rekenwereld | `#/wereld/rekenen` | rekenraket (+, −, tafels, delen, getalbegrip, tot 1000), verhaalsommen (eerst de vraag zoeken), klok en geld |
| Emotiewereld | `#/wereld/emotie` | situaties → gevoel kiezen (geen fout antwoord) → wat helpt; ademhalen; helpende zinnen |
| Ontdekkingswereld | `#/wereld/ontdek` | 9 verhalen (planeten, sterren, dino's, uil, oceaan, vulkanen, hart, regenboog, drijvend ei) |
| Voortgang (kind) | `#/voortgang` | sterren, minuten, ontdekkingskaarten – alleen positief, geen vergelijkingen |
| Ouderomgeving | `#/ouder` | pincode; overzicht, aanbevelingen, grafieken, per oefening, instellingen, gegevens & privacy |
| Ouderrapport | `#/ouder/rapport` | printbaar rapport → *Opslaan als PDF* (offline) |

## 3. Gegevensmodel (IndexedDB `fatih-quest`)

- `profile` – sterren, kaarten, instellingen (duur, voorlezen, animaties, afleiding, vrijgegeven onderwerpen), pincode als gezouten SHA-256-hash, toestemming + datum.
- `attempts` – per opdracht: oefening, niveau, uitkomst (`zelfstandig` / `metHulp` / `nogNiet`), pogingen, tips, herhalingen, gecontroleerd, tijdstip, sessie-id.
- `states` – per oefening: niveau, recente uitkomsten, extra ondersteuning aan/uit.
- `sessions` – start, actieve oefentijd (pauzes niet meegeteld), oefeningen, pauzes, afgerond/eerder gestopt. Wordt na elke opdracht opgeslagen.
- `words` – herhaalsysteem per woord (bakje 1–5, volgende herhaling).

Bewust **niet** opgeslagen: gekozen gevoelens/antwoorden in de emotiewereld, gezondheidsgegevens, locatie, contactgegevens.

## 4. Adaptieve oefenlogica (uitlegbaar)

Zie `src/core/adaptive.ts`.

1. Elke opdracht krijgt een uitkomst: **zelfstandig** (in één keer, zonder hulp), **met hulp** (tip, herhaling of 2e poging) of **nog niet**.
2. **Omhoog:** minimaal 5 opdrachten op dit niveau én 4 van de laatste 5 zelfstandig.
3. **Omlaag:** pas als 3 van de laatste 4 opdrachten "nog niet" zijn. Eén fout verlaagt dus nooit; "met hulp" verlaagt nooit.
4. **Ondersteuning:** bij 2+ keer niet zelfstandig in de laatste 4 gaat extra ondersteuning aan (voorbeelden/tips komen eerder). Uit na 3 keer zelfstandig op rij.
5. Na een niveauwijziging begint de telling opnieuw.
6. **Variatie:** recent gebruikte items worden vermeden; rekensommen worden gegenereerd; ongeveer 25% herhaling van lagere niveaus.
7. **Woorden:** Leitner-herhaalsysteem (bakjes met 0/1/2/4/7/14 dagen), maximaal 3 nieuwe woorden per sessie.
8. Het ouderdashboard toont **beheersing** (gelukt, met of zonder hulp) en **zelfstandigheid** (zonder hulp) apart.
9. Ouders bepalen met *Lesonderwerpen vrijgeven* welke stof beschikbaar is. Het niveau wordt daar automatisch op afgestemd.

Sterren belonen inzet en strategie: opdracht gelukt, opnieuw geprobeerd, rustig gecontroleerd, slim een tip gebruikt,
blijven proberen, missie afgerond (+3). Sterren spelen in een vaste volgorde ontdekkingskaarten vrij.
Er zijn geen lootboxes, streaks, ranglijsten of eindeloze sessies.

## 5. Fasering

- **Fase 1 (gedaan):** basisarchitectuur, opslag, adaptief systeem, dagmissie, alle 17 oefeningen, ouderdashboard, rapport, PWA/offline, tests.
- **Fase 2 (voorgesteld):** eigen illustraties in plaats van emoji, opgenomen menselijke stem als alternatief voor computerstem, uitgebreidere woordenlijst afgestemd op de schoolthema's, optionele typ-invoer bij rekenen.
- **Fase 3 (optioneel):** versleutelde synchronisatie tussen apparaten van de ouder (alleen met aparte toestemming).

## 6. Uitgevoerde controles

**Geautomatiseerd (`npm test`, 56 tests):**
- adaptieve regels (omhoog/omlaag/ondersteuning, één fout verlaagt nooit, grenzen per oefening)
- herhaalsysteem woorden
- inhoud: ≥30 opgaven per module (woorden 36 + 16 paren, de/het 36, woordsoorten 30, zinsdelen 30, verhaalsommen 30, rekenen/klok/geld gegenereerd), elk antwoord staat tussen de opties, geen dubbele opties, verhaalsommen rekenkundig correct, geen claims over IQ/ADHD
- rekengenerator: 500 sommen gecontroleerd op juistheid, geen negatieve uitkomsten, bereik per niveau, vrijgegeven onderwerpen gerespecteerd; Nederlandse kloknotatie ("half vier"); geldsommen
- ruimtemissies altijd oplosbaar, routes aaneengesloten
- dagmissie telt exact op tot 6–15 minuten en rouleert per dag
- pincode (hash, verificatie), export bevat geen pincode, wissen met of zonder behoud van instellingen
- emotie-oefening wordt niet gescoord en slaat geen gevoelens op
- analyse: beheersing en zelfstandigheid apart, geen conclusie bij te weinig data, aanbevelingen zonder diagnoses

**Handmatig in een echte browser (Chromium, Pixel 7-formaat):** inrichten, dagmissie starten, alle 16 rondetypes
één ronde doorlopen, ontdekverhaal, voortgang, verkeerde en juiste pincode, alle dashboardtabbladen, rapport,
offline herladen. Geen JavaScript-fouten.

## 7. Bekende beperkingen

- Illustraties zijn emoji en eenvoudige SVG-vormen; ze zien er per apparaat iets anders uit.
- Voorlezen gebruikt de computerstem van het apparaat. Op sommige Android-toestellen moet *Nederlands* als spraakdata geïnstalleerd zijn. Zonder stem toont *Luister en kies* de opdracht als tekst.
- De pincode houdt een kind tegen, maar is geen echte beveiliging tegen iemand met technische kennis van het apparaat (gegevens staan onversleuteld in de browseropslag).
- Gegevens staan per browser/apparaat. Browseropslag wissen = gegevens kwijt (exporteer eerst via *Gegevens & privacy*).
- Echte tests op fysieke Android-telefoons en tablets en een toegankelijkheidsaudit met schermlezer zijn nog niet gedaan. Er is alleen getest met emulatie in Chromium.
- De inhoud is zorgvuldig gecontroleerd, maar niet beoordeeld door een orthopedagoog of leerkracht. Laat dit bij voorkeur nog gebeuren.
- Rekenen werkt met meerkeuze: raden blijft mogelijk (afgezwakt door de "Klopt mijn antwoord?"-stap en de adaptieve drempels).
