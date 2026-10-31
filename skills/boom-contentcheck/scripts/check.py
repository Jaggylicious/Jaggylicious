#!/usr/bin/env python3
"""Contentcheck vóór publicatie: lengte, hook, call-to-action, hashtags, emoji en
mogelijk discriminerende taal in vacatureteksten.

Gebruik:
    python check.py post.txt --platform linkedin|instagram|facebook [--vacature]
    echo "tekst" | python check.py - --platform instagram

Exitcode 0 = geen fouten (waarschuwingen mogen), 1 = minstens één fout.
"""
import argparse
import re
import sys

LIMIETEN = {
    # platform: (max tekens, tekens zichtbaar vóór "meer", aanbevolen max hashtags)
    "linkedin": (3000, 210, 5),
    "instagram": (2200, 125, 10),
    "facebook": (63206, 125, 3),
}

CTA = re.compile(
    r"\b(solliciteer|reageer|stuur|bel|app|mail|klik|link in bio|meer info|bekijk|aanmelden|meld je|"
    r"neem contact|dm|plan|download|lees meer|tag)\w*",
    re.IGNORECASE,
)

# (patroon, uitleg). Bron: AWGB / Wet gelijke behandeling op grond van leeftijd; College voor de Rechten van de Mens.
DISCRIMINATIE = [
    (r"\bjong(e)?\b", "leeftijd: 'jong(e)' sluit oudere kandidaten uit → 'enthousiast/energiek team'"),
    (r"\b(max(imaal)?|tot|niet ouder dan)\s*\d{2}\s*jaar\b", "leeftijdsgrens is verboden zonder objectieve rechtvaardiging"),
    (r"\b(tussen\s+(de\s+)?\d{2}\s+en\s+\d{2}\s+jaar|leeftijd\s*:?\s*\d{2})", "leeftijdseis"),
    (r"\b(starter|net afgestudeerd|recent afgestudeerd)\b", "kan indirect leeftijd uitsluiten → noem het gewenste niveau/ervaring"),
    (r"\b(ervaren\s+)?(man|vrouw|dame|heer|jongen|meid|meisje)\b(?!\w)", "geslacht: noem de functie, niet het geslacht (tenzij wettelijk toegestaan)"),
    (r"\b(hij|hem)\b", "mannelijke vorm: gebruik 'je/jij' of de functietitel"),
    (r"\bmoedertaal\b|\bnative\s+(speaker|dutch|nederlands)", "afkomst: vraag het taalniveau (bijv. 'vloeiend Nederlands, C1')"),
    (r"\b(nederlandse\s+nationaliteit|nederlandse\s+afkomst|zonder\s+accent|accentloos)\b", "afkomst/nationaliteit"),
    (r"\b(representatief\s+uiterlijk|verzorgd\s+uiterlijk|knap)\b", "uiterlijk: beschrijf gedrag, niet uiterlijk"),
    (r"\b(geen\s+hoofddoek|kinderwens|zwanger|alleenstaand|getrouwd)\b", "godsdienst/gezinssituatie"),
    (r"\b(fit|gezond)\s+(zijn|persoon)\b|\bgoede\s+gezondheid\b", "handicap/chronische ziekte → noem concrete fysieke eisen als die nodig zijn"),
]

EMOJI = re.compile("[\U0001F300-\U0001FAFF☀-➿\U0001F000-\U0001F2FF]")


def check(tekst, platform, vacature):
    fouten, waarschuwingen, ok = [], [], []
    maxlen, zichtbaar, maxtags = LIMIETEN[platform]
    lengte = len(tekst)

    if lengte > maxlen:
        fouten.append(f"Te lang: {lengte} tekens, max {maxlen} op {platform}.")
    else:
        ok.append(f"Lengte {lengte}/{maxlen} tekens.")

    regels = [r for r in tekst.strip().splitlines() if r.strip()]
    hook = regels[0].strip() if regels else ""
    if not hook:
        fouten.append("Geen tekst.")
    else:
        if len(hook) > zichtbaar:
            waarschuwingen.append(f"Hook is {len(hook)} tekens; alleen de eerste ~{zichtbaar} zijn zichtbaar vóór 'meer'.")
        elif len(hook) < 15:
            waarschuwingen.append("Hook erg kort; geeft hij genoeg reden om door te lezen?")
        else:
            ok.append(f"Hook past vóór 'meer' ({len(hook)} tekens).")
        if re.match(r"^(wij zoeken|we zoeken|vacature|gezocht)\b", hook, re.IGNORECASE):
            waarschuwingen.append("Hook begint met 'Wij zoeken/Vacature': standaard, wordt overgeslagen. Begin bij de kandidaat (wat levert het hem/haar op?).")

    if not CTA.search(tekst):
        fouten.append("Geen call-to-action gevonden (bijv. 'Solliciteer via de link', 'Stuur een DM', 'Bel').")
    else:
        ok.append("Call-to-action aanwezig.")

    tags = re.findall(r"#\w+", tekst)
    if len(tags) > maxtags:
        waarschuwingen.append(f"{len(tags)} hashtags; aanbevolen max {maxtags} op {platform}.")
    elif tags:
        ok.append(f"{len(tags)} hashtags.")

    emoji = EMOJI.findall(tekst)
    if platform == "linkedin" and len(emoji) > 6:
        waarschuwingen.append(f"{len(emoji)} emoji; op LinkedIn oogt dat al snel onzakelijk.")

    if re.search(r"\{[^}]+\}|\[[A-Z][^\]]*\]|XXX|TODO|lorem", tekst, re.IGNORECASE):
        fouten.append("Er staat nog een placeholder in (bijv. {salaris}, [NAAM], XXX).")

    if re.search(r"(!{2,}|\?{2,})", tekst):
        waarschuwingen.append("Meerdere uitroep-/vraagtekens achter elkaar.")
    hoofdletterwoorden = [w for w in re.findall(r"\b[A-Z]{5,}\b", tekst) if w not in {"BOOM", "HBO", "MBO", "WO"}]
    if len(hoofdletterwoorden) > 2:
        waarschuwingen.append("Veel woorden in HOOFDLETTERS; leest als schreeuwen.")

    if vacature:
        gezien = set()
        for patroon, uitleg in DISCRIMINATIE:
            for m in re.finditer(patroon, tekst, re.IGNORECASE):
                if m.group(0).lower() not in gezien:
                    gezien.add(m.group(0).lower())
                    fouten.append(f"Mogelijk discriminerend: '{m.group(0)}' — {uitleg}.")
        if not re.search(r"€|\beuro\b|salaris|\bbruto\b", tekst, re.IGNORECASE):
            waarschuwingen.append("Geen salaris(indicatie) genoemd; vacatures met salaris krijgen meer reacties. (EU-richtlijn loontransparantie maakt een salarisindicatie in de wervingsfase verplicht; check de Nederlandse invoeringsdatum.)")
        if not re.search(r"\b(uur|uren|fulltime|parttime|\d{2}\s*-\s*\d{2})\b", tekst, re.IGNORECASE):
            waarschuwingen.append("Geen uren/fulltime/parttime genoemd.")

    return fouten, waarschuwingen, ok


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("bestand", help="tekstbestand of - voor stdin")
    ap.add_argument("--platform", choices=LIMIETEN, default="linkedin")
    ap.add_argument("--vacature", action="store_true", help="ook vacature-checks (discriminatie, salaris, uren)")
    a = ap.parse_args()
    tekst = sys.stdin.read() if a.bestand == "-" else open(a.bestand, encoding="utf-8").read()

    fouten, waarschuwingen, ok = check(tekst, a.platform, a.vacature)
    print(f"Contentcheck — {a.platform}{' (vacature)' if a.vacature else ''}")
    for f in fouten:
        print(f"  ✗ {f}")
    for w in waarschuwingen:
        print(f"  ! {w}")
    for o in ok:
        print(f"  ✓ {o}")
    print("Resultaat:", "NIET publiceren, eerst fouten oplossen" if fouten else "OK (kijk naar waarschuwingen)")
    sys.exit(1 if fouten else 0)


if __name__ == "__main__":
    main()
