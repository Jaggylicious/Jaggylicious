---
name: site-securitycheck
description: Passieve securitycheck van eigen websites en code vóór livegang: gelekte API-keys/wachtwoorden in code (vooral frontend), open gevoelige bestanden (.env, .git, back-ups), ontbrekende security-headers, http→https en onveilige sessiecookies. Gebruik deze skill wanneer Erkan vraagt "is mijn site veilig", "check vóór livegang", "securityscan", "lekken mijn API-keys", of bij oplevering van Carbutler, TTT, Autoradam Lease of een andere site met login, formulieren of persoonsgegevens.
---

# Site-securitycheck

## Alleen eigen sites
Controleer alleen sites en code van Boom, of van opdrachtgevers die daar toestemming voor gaven. Vraag het als het niet duidelijk is. Het script doet alleen gewone GET-verzoeken, zoals een browser. Geen aanvallen, geen inlogpogingen, geen brute force.

## Stap 1 — Code (als de code beschikbaar is)
```
python scripts/securitycheck.py code <projectmap>
```
Vindt API-keys (Anthropic, OpenAI, Stripe, AWS, GitHub, Slack, Supabase service_role), wachtwoorden en database-URL's in code. Ook een `.env` die niet in `.gitignore` staat. Staat een sleutel in frontend-code, dan wordt hij altijd KRITIEK: iedere bezoeker kan hem zien.

## Stap 2 — Live site
```
python scripts/securitycheck.py site https://<domein>
```
Controleert:
- of http doorstuurt naar https;
- security-headers: HSTS, CSP, nosniff, Referrer-Policy en clickjacking-bescherming;
- of de server zijn softwareversie prijsgeeft;
- sessiecookies: Secure, HttpOnly en SameSite;
- geheimen in het JavaScript van de eigen site;
- open `.env`, `.git/config`, WordPress-back-ups, `backup.sql`, `phpinfo` en de WordPress-gebruikerslijst.

Exitcode 2 betekent dat de site niet bereikbaar was. Dat is geen bevinding: noem het een netwerkprobleem. In de cloudsessie blokkeert de proxy sommige domeinen; draai de check dan lokaal.

## Stap 3 — Handmatig (het script ziet dit niet)
Loop deze punten na en vraag Erkan wat je niet zelf kunt zien:
1. **Supabase**: staat Row Level Security aan op elke tabel? Staat er een anon key in de frontend, dan is RLS verplicht.
2. **Formulieren**: spamfilter of captcha, en server-side validatie (niet alleen in de browser).
3. **Beheeromgeving**: sterk wachtwoord en tweestapsverificatie. Bij WordPress: inlogpogingen beperken en plugins up-to-date.
4. **Persoonsgegevens (AVG)**: waar staan cv's en uploads? Niet in een openbare map of bucket. Verwerkersovereenkomst met de hosting- en formulierdienst.
5. **Back-ups**: bestaan ze, en zijn ze niet openbaar te downloaden?

## Rapport
- Per bevinding: wat er mis is, waarom dat erg is (in gewone taal) en hoe je het oplost, liefst met de concrete regel code of instelling.
- Volgorde: KRITIEK → HOOG → MIDDEL → LAAG.
- Gelekte sleutel gevonden? Dan is verwijderen uit de code niet genoeg: **de sleutel direct intrekken en een nieuwe aanmaken**. Hij staat namelijk nog in de Git-geschiedenis.
- Toon nooit een volledige sleutel in chat of rapport; de eerste 8 tekens zijn genoeg.

Deze check vervangt geen echte pentest. Bij grote risico's (betalingen, veel persoonsgegevens) adviseer je een professionele pentest.
