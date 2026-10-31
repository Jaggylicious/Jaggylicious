---
name: boom-contentcheck
description: Controleert een post of vacaturetekst vóór publicatie op lengte, hook, call-to-action, hashtags, placeholders en mogelijk discriminerende taal (leeftijd, geslacht, afkomst, uiterlijk). Gebruik deze skill wanneer Erkan vraagt "check deze post", "kan dit zo online", "klopt deze vacaturetekst", of automatisch als laatste stap na het schrijven van een post of vacature.
---

# Boom contentcheck

Laatste controle vóór iets online gaat. Eerst het script (vaste regels), daarna jouw oordeel (toon, helderheid).

## Stap 1 — Script

Zet de tekst in een bestand en draai:
```
python scripts/check.py post.txt --platform linkedin|instagram|facebook [--vacature]
```
Gebruik `--vacature` bij elke vacaturetekst of vacaturepost.

Het script geeft:
- **✗ Fout**: niet publiceren tot het is opgelost (te lang, geen call-to-action, placeholder blijven staan, mogelijk discriminerende taal).
- **! Waarschuwing**: afwegen (hook te lang voor "meer", standaardopening "Wij zoeken", te veel hashtags, geen salaris of uren).
- **✓ OK**.

## Stap 2 — Eigen oordeel (wat een script niet ziet)

Loop kort langs:
1. **Hook**: zou een kandidaat stoppen met scrollen? Begint hij bij de kandidaat (wat levert het op), niet bij Boom?
2. **Helderheid**: is in 5 seconden duidelijk wat de functie is, waar, en voor wie?
3. **Klopt het**: staan er beloftes in die niet in de vacature staan (salaris, leaseauto, thuiswerken)? Niets verzinnen.
4. **Toon**: past het bij Boom (zie `vacature-post/references/boom-toon.md` als die er is)? Je-vorm, direct, geen wervingsclichés ("dynamische omgeving", "hands-on mentaliteit", "jij bent een teamplayer").
5. **Privacy**: geen namen, foto's of gegevens van kandidaten zonder toestemming. Naam van de opdrachtgever alleen als Erkan dat goed vindt.

## Uitkomst

Geef:
- Oordeel in één regel: **Klaar om te posten** / **Eerst aanpassen**.
- De fouten met een voorstel per fout.
- De verbeterde tekst, klaar om te plakken.

Discriminatie-melding is een signaal, geen vonnis: soms is een eis toegestaan (bijv. een wettelijke leeftijdsgrens). Leg het dan uit en laat Erkan beslissen.

Publiceren doet Erkan zelf (of via Meta Business Suite inplannen). Niet automatisch posten.
