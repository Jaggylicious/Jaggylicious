# Vacature-reel (Remotion)

Reel van 9 tot 16 seconden in 9:16-formaat. Opbouw: hook → functie en locatie → 3 pluspunten → salaris en uren → call-to-action met logo.
Lege velden vallen weg, en de video wordt dan korter.

## Eenmalig
1. Installeer Node.js 18 of nieuwer.
2. Draai in deze map: `npm install`
3. Huisstijl: zet de Boom-kleuren in `vacature.json`. De beschikbare velden staan hieronder. Zet het logo als `public/logo.png` en voeg `"logo": "logo.png"` toe.

## Per vacature
1. Laat Eva met de skill `vacature-post` de reel-data maken en plak die in `vacature.json`.
2. `npm run studio` → bekijk de reel live in de browser.
3. `npm run render` → de video staat in `out/vacature.mp4`.

## Velden (`vacature.json`)
| Veld | Voorbeeld | Max |
|---|---|---|
| hook | "Elke dag beloond voor je belwerk?" | ~45 tekens |
| functie | "Binnendienst Sales" | ~30 |
| locatie | "Utrecht" | |
| uren | "32–40 uur" | |
| salaris | "€3.200 – €3.900" | |
| pluspunten | ["…", "…", "…"] | 3 × ~32 |
| cta | "Solliciteer via de link in bio" | ~35 |
| kleurPrimair / kleurAccent / kleurAchtergrond / kleurTekst | "#14213D" | hex |
| lettertype | "Inter, Arial, sans-serif" | |
| logo | "logo.png" (in `public/`) | |
| merknaam | "BOOM RECRUITMENT" (als er geen logo is) | |

Licentie: Remotion is gratis voor bedrijven tot en met 3 medewerkers. Daarboven heb je een bedrijfslicentie nodig (zie remotion.dev/license).
