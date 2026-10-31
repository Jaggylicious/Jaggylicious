---
name: vacature-post
description: Zet een vacature om in social posts voor LinkedIn en Instagram in de toon van Boom Recruitment, plus een reel-script dat direct in het Remotion-sjabloon past. Gebruik deze skill wanneer Erkan een vacature(tekst of link) deelt en vraagt om "een post", "LinkedIn-post", "Instagram-post", "reel", "zet deze vacature online", of "maak hier content van".
---

# Vacature → social post

## Input

Vraag alleen wat ontbreekt en wezenlijk is:
- Functie, locatie (stad/regio), uren, salaris(range), 3 sterkste pluspunten, eisen.
- Mag de naam van de opdrachtgever genoemd worden? Standaard: **nee** ("een groeiend installatiebedrijf in Utrecht").
- Waar solliciteren: link, DM of bellen.

Lees `references/boom-toon.md` voor toon en voorbeelden.

## Output (altijd deze drie)

### 1. LinkedIn-post
- **Hook** (regel 1, ≤150 tekens): begint bij de kandidaat. Een vraag, een concreet voordeel of een herkenbare frustratie. Niet "Wij zoeken…" of "Vacature:".
- 2–3 korte alinea's of een lijstje met ✅ (max 3–5 punten): wat je krijgt, wat je doet, wat je meeneemt.
- Salaris en uren noemen als die bekend zijn.
- Call-to-action: één duidelijke actie.
- 3–5 hashtags onderaan (#vacature #functie #stad).
- 600–1.300 tekens.

### 2. Instagram-caption
- Hook ≤125 tekens (zichtbaar vóór "meer").
- Korter dan LinkedIn, meer witruimte, emoji mag functioneel (✅ 📍 💶).
- CTA: "link in bio" of "stuur een DM met '{functie}'". Let op: DM-trefwoorden beantwoordt Erkan zelf, niet automatisch.
- 5–10 hashtags.

### 3. Reel-data (voor `templates/vacature-reel`)
Geef een JSON-blok dat direct als props in het Remotion-sjabloon kan:
```json
{
  "hook": "Max 45 tekens, groot in beeld",
  "functie": "Binnendienst Sales",
  "locatie": "Utrecht",
  "uren": "32–40 uur",
  "salaris": "€3.200 – €3.900",
  "pluspunten": ["Max 32 tekens", "Max 32 tekens", "Max 32 tekens"],
  "cta": "Solliciteer via de link in bio"
}
```
Laat een veld leeg (`""`) als het onbekend is. Niet invullen met een gok.

## Daarna

Draai altijd **boom-contentcheck** op beide teksten (met `--vacature`) en los fouten op voordat je ze laat zien. Vermeld kort: "Contentcheck: OK" of wat er is aangepast.

## Regels

- Niets verzinnen: geen salaris, voordelen of bedrijfsnaam die niet in de input staan.
- Geen wervingsclichés (dynamische omgeving, hands-on, teamplayer, pro-actief, uitdagende functie).
- Geen leeftijd, geslacht, afkomst of uiterlijk (AWGB). Taal: niveau noemen, niet "moedertaal".
- Je-vorm, actief, korte zinnen. Nederlands, tenzij de vacature Engelstalig is.
- Publiceren doet Erkan zelf.
