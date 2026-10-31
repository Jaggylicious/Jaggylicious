---
name: gsc-vragenanalyse
description: Analyseert een Google Search Console-export op vraag-zoekopdrachten met veel vertoningen en weinig klikken, en zet ze om naar FAQ-blokken, betere titels/meta's en blogideeën. Gebruik deze skill wanneer Erkan een GSC-export (zip/CSV) deelt, vraagt "welke vragen moet ik beantwoorden", "meer verkeer uit Google", "FAQ's voor mijn site", of de vragenanalyse voor boomrecruitment.nl of een andere site wil draaien.
---

# GSC-vragenanalyse

Doel: vragen vinden waarop een site al verschijnt in Google maar weinig klikken krijgt, en die vragen beter beantwoorden.

## Stap 1 — Export ophalen (Erkan doet dit)

Leg dit uit als er nog geen export is:
1. Search Console → **Prestaties → Zoekresultaten** → periode **3 maanden**.
2. **+ Filter toevoegen → Zoekopdracht → Aangepast (regex)** en plak:
   ```
   ^(wie|wat|wanneer|waar|waarom|hoe|hoeveel|welke|kan|kun|mag|moet|is|zijn|heb|wordt)\b
   ```
   Tweede ronde (vragen zonder vraagwoord vooraan):
   ```
   (kosten|kost|prijs|tarief|salaris|verschil|betekent|vs)
   ```
   Engelstalige site: `^(who|what|when|where|why|how|can|does|is|should)\b`
3. **Exporteren → CSV downloaden** (zip) en hier delen.

Geen filter gezet? Ook goed: het script filtert zelf op vraagvorm.

## Stap 2 — Script draaien

```
python scripts/analyse.py <export.zip> --uit rapport.md
```
Opties: `--min-vertoningen 20` (drempel), `--top 30`, `--alle` (niet filteren op vraagvorm; gebruik als de export al gefilterd is én er ook vragen zonder vraagwoord in staan).

Het script:
- leest NL- en EN-exports (ook `1.240` en `0,24%`);
- rekent per vraag de **potentie** uit: extra klikken als de vraag op positie 5 (of hoger) staat met een normale CTR;
- gokt de **vermoedelijke pagina** op basis van woorden in de URL;
- geeft per vraag een actie: positie ≤10 → titel/meta + FAQ; 11–20 → FAQ-blok; >20 → nieuwe pagina/blog.

**Eerlijk zijn over de pagina:** de standaardexport koppelt zoekopdrachten niet aan pagina's. Zeg dat erbij. Bij de top 5: laat Erkan in GSC controleren (filter Zoekopdracht = de vraag → tabblad Pagina's), of vraag een export per pagina.

## Stap 3 — Uitwerken

Voor de top 5–10 vragen:
1. **Groepeer** vragen met dezelfde bedoeling ("wat kost een recruitmentbureau" + "werving en selectie kosten" = één antwoord).
2. **FAQ-blok** per pagina: vraag letterlijk als kop, antwoord in de eerste zin (40–60 woorden), daarna eventueel uitleg. Concreet: bedragen, termijnen, stappen. Geen "dat hangt ervan af" zonder daarna de factoren te noemen.
3. **Titel en meta** herschrijven bij positie ≤10: de vraag of het antwoord erin, titel ≤60 tekens, meta ≤155 tekens.
4. **Blogideeën** voor vragen zonder passende pagina: titel + 3 kernpunten.
5. **FAQ-schema** (schema.org `FAQPage`, JSON-LD) meeleveren, alleen voor vragen die zichtbaar op de pagina staan.

## Regels

- Geen bedragen, garanties of resultaten verzinnen. Weet je het tarief niet? Zet `{tarief}` en vraag het Erkan.
- Niet dezelfde FAQ op meerdere pagina's.
- Wat van Boom is blijft bij Boom: geen interne methodiek of marges in openbare FAQ's.
- Weinig data (bijv. <500 vertoningen in 3 maanden)? Zeg dat de analyse dan weinig zegt.
- Output: kort rapport (tabel + aanpak) en daarna de teksten, klaar om te plakken. Nederlands.
