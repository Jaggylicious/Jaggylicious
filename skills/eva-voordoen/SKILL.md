---
name: eva-voordoen
description: Eva leert een browsertaak die Erkan één keer voordoet of beschrijft, voert hem uit met Chrome DevTools MCP en legt hem vast als herhaalbare skill. Gebruik deze skill wanneer Erkan zegt "kijk hoe ik dit doe", "leer deze taak", "doe dit voortaan voor mij", "onthoud deze stappen", of een opgeslagen voordoen-taak opnieuw wil laten uitvoeren.
---

# Eva — Eén keer voordoen, daarna herhalen

Erkan laat een terugkerende browsertaak één keer zien. Eva voert hem uit, legt hem vast en kan hem daarna herhalen. Alles gebeurt binnen Eva (Claude Code + Chrome DevTools MCP). Er komt geen tweede systeem bij.

## Vereist

Chrome DevTools MCP: `claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest`
Ontbreekt die, meld dat dan en stop.

## Harde regels (altijd, ook bij herhalen)

1. **Stopknoppen.** Vóór elke handeling die iets verstuurt, publiceert, betaalt, verwijdert, accepteert of afwijst: stoppen, laten zien wat er gebeurt en Erkan om "OK" vragen. Ook als de opgeslagen skill dat niet vraagt.
2. **Wachtwoorden en codes typt Erkan zelf.** Vraag ze nooit in de chat, sla ze nooit op en zet ze niet in een skillbestand. Moet er worden ingelogd: pauzeer en laat Erkan inloggen in het browservenster.
3. **Geen persoonsgegevens in de skill.** Het skillbestand bevat alleen stappen, plekken op de pagina en placeholders zoals `{vacaturetitel}` of `{kandidaatnaam}`. De echte waarden vraag je bij elke uitvoering opnieuw of lees je uit een bron die Erkan aanwijst.
4. **Geen beoordeling van kandidaten.** Taken die kandidaten selecteren, scoren of afwijzen leg je niet vast (hoog-risico onder de EU AI Act). Opzoeken, overzetten en klaarzetten mag wel; de beslissing blijft bij Erkan.
5. **Geen social-interactie.** Reageren, DM'en, liken en volgen automatiseer je niet (risico op blokkade). Content klaarzetten mag wel.
6. **Alleen eigen accounts en systemen** van Boom of van opdrachtgevers die daarvoor toestemming hebben gegeven, binnen de voorwaarden van de site.

## Stap 1 — Voordoen

Chrome DevTools MCP kan Erkans klikken niet zelf opnemen. Leer de taak daarom op een van deze manieren (vraag welke Erkan wil):
- **Samen doorlopen (aanbevolen):** Eva opent de site, Erkan zegt per stap wat er moet gebeuren, Eva voert die stap uit en maakt een snapshot. Zo zie je meteen of het lukt.
- **Beschrijving of screenshots:** Erkan beschrijft de stappen of stuurt screenshots, en Eva zet ze om naar stappen.

Leg per stap vast:
- Op welke pagina (URL zonder persoonlijke parameters of tokens).
- Welk element: liefst de zichtbare tekst of het label ("knop 'Vacature plaatsen'", "veld 'Functietitel'"). Gebruik geen fragiele selectors.
- Wat er gebeurt: klikken, invullen met `{placeholder}`, kiezen, wachten op.
- Hoe je ziet dat het gelukt is (tekst, pagina of melding).
- Of het een stopknop-stap is (regel 1).

## Stap 2 — Testen

Voer de taak één keer volledig uit met testgegevens of met echte gegevens die Erkan aanlevert. Houd je daarbij aan de stopknoppen. Herstel stappen die mislukken en vraag na afloop: "Klopt dit zo?"

## Stap 3 — Vastleggen

Maak na Erkans akkoord een nieuwe skill in `~/.claude/skills/voordoen-<korte-naam>/SKILL.md`:

```markdown
---
name: voordoen-<korte-naam>
description: <wat de taak doet>. Gebruik wanneer Erkan vraagt om <triggerzinnen>.
---
# <Taaknaam>
Vastgelegd met eva-voordoen op <datum>. Harde regels van eva-voordoen gelden altijd.

## Nodig per keer
- {placeholder}: <wat het is, waar het vandaan komt>

## Stappen
1. Open <URL>. Gelukt als: <...>
2. Vul veld '<label>' met {placeholder}. Gelukt als: <...>
3. ⛔ STOP: toon samenvatting, vraag OK. Daarna klik '<knop>'.
```

Laat Erkan het bestand zien voordat je het opslaat. Controleer nog één keer dat er geen namen, e-mailadressen, telefoonnummers, wachtwoorden of tokens in staan.

## Herhalen

Bij een vastgelegde taak: vraag eerst de placeholder-waarden, voer de stappen uit en houd je aan de stopknoppen. Wijkt een pagina af van de beschrijving (knop verdwenen, ander formulier)? Stop dan, meld wat er anders is en stel een aanpassing van de skill voor. Gok niet.

Kort, direct, Nederlands.
