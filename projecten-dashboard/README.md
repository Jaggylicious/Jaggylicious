# Projecten-dashboard

Al je projecten op één plek: een bord (Idee → Gepland → Bezig → Wacht → Klaar), een lijst, taken met voortgang, deadlines, een vaste "volgende stap", links en notities.

## Drie manieren om het te gebruiken

| Waar | Hoe | Data |
|---|---|---|
| **Telefoon** (en elke browser) | Open https://claude.ai/artifact/9HJsXSQdZMk4gwDEEkAh7w (inloggen bij claude.ai). Op iPhone: Safari → Deel → *Zet op beginscherm*. Op Android: Chrome → ⋮ → *Toevoegen aan startscherm*. | Gesynchroniseerd |
| **Computer als app**, met eigen icoon en venster | Download deze map (zie hieronder) en start de installer. Kies **1 = gesynchroniseerd** of **2 = offline**. | Keuze 1: gesynchroniseerd · keuze 2: alleen op die computer |
| **Los bestand** | Dubbelklik op `index.html`. | Alleen in die browser |

"Gesynchroniseerd" betekent dat je telefoon en computer dezelfde projecten zien. De link is privé: alleen jij kunt hem openen.

### App installeren op je computer
1. Ga op GitHub naar deze repository, kies de juiste branch en klik op **Code → Download ZIP**. Pak de ZIP uit.
2. Open de map `projecten-dashboard`.
3. **Windows:** dubbelklik op `Installeer-Windows.bat`. Verschijnt er een blauwe waarschuwing ("Windows heeft uw pc beschermd")? Klik dan op *Meer informatie → Toch uitvoeren*.
   Daarna staat **Projecten** op je bureaublad en in het Startmenu. Open de app, klik met rechts op het icoon in de taakbalk en kies *Vastmaken aan taakbalk*.
4. **Mac:** open Terminal, typ `bash ` (met een spatie erachter), sleep `Installeer-Mac.command` in het venster en druk op Enter.
   De app komt in de map *Apps* in je thuismap. Sleep hem naar je Dock. Met Google Chrome geïnstalleerd opent hij in een eigen venster.

## Handig
- Sneltoetsen: `N` nieuw project · `/` zoeken · `Esc` sluiten.
- Snelfilters: 🔥 Focus (hoge prioriteit + bezig), ⏰ deadline binnen 7 dagen, 💤 stilgevallen (14+ dagen niet bijgewerkt).
- Linksonder zie je of je data is **gesynchroniseerd** of **opgeslagen op dit apparaat**.
- Op je telefoon zit het menu (categorieën, back-up) achter ☰.

## Back-up
Klik op **Back-up opslaan** voor een `.json`-bestand. Met **Back-up terugzetten** zet je dat terug, ook in een andere versie. Zo verhuis je de offline versie naar de gesynchroniseerde of andersom.
Gebruik je de offline versie? Maak dan regelmatig een back-up: als je je browsergegevens wist, ben je je projecten anders kwijt.
