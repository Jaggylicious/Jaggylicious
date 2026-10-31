#!/usr/bin/env python3
"""Analyseer een Google Search Console-export (zip of map) op vraag-zoekopdrachten
met veel vertoningen en weinig klikken.

Gebruik:
    python analyse.py export.zip [--min-vertoningen 20] [--top 30] [--alle] [--uit rapport.md]

Werkt met de standaard GSC-export (Nederlandse en Engelse interface). Alleen standaardbibliotheek.
"""
import argparse
import csv
import io
import re
import sys
import zipfile
from pathlib import Path

# Vraagwoorden aan het begin (NL + EN), plus vraag-signalen ergens in de zoekopdracht.
VRAAG_START = re.compile(
    r"^(wie|wat|wanneer|waar|waarom|hoe|hoeveel|welke|welk|kan|kun|mag|moet|is|zijn|heb|wordt|"
    r"who|what|when|where|why|how|can|does|do|is|are|should)\b",
    re.IGNORECASE,
)
VRAAG_SIGNAAL = re.compile(
    r"\b(kosten|kost|prijs|prijzen|tarief|tarieven|salaris|verschil|betekent|betekenis|vs|of\s+\w+\?|\?)",
    re.IGNORECASE,
)

KOLOMMEN = {
    "query": ["belangrijkste zoekopdrachten", "zoekopdrachten", "zoekopdracht", "top queries", "queries", "query"],
    "pagina": ["belangrijkste pagina's", "pagina's", "pagina", "top pages", "pages", "page"],
    "klikken": ["klikken", "clicks"],
    "vertoningen": ["vertoningen", "impressions"],
    "ctr": ["ctr"],
    "positie": ["positie", "gemiddelde positie", "position", "average position"],
}

# Grove verwachte CTR per positie (organisch, desktop+mobiel gemiddeld). Indicatie, geen wet.
VERWACHTE_CTR = {1: 0.28, 2: 0.15, 3: 0.11, 4: 0.08, 5: 0.07, 6: 0.05, 7: 0.04, 8: 0.03, 9: 0.025, 10: 0.02}

STOPWOORDEN = set(
    "de het een en of in op van voor met bij naar om te is zijn wat hoe waar wie wanneer waarom welke "
    "kan kun mag moet je jij ik we wij u uw mijn the a an of to for in on is are what how why who when where can".split()
)


def getal(waarde):
    waarde = (waarde or "").strip().replace("%", "").replace(" ", "")
    if not waarde:
        return 0.0
    # NL-notatie "1.234,5" of EN "1,234.5"
    if "," in waarde and "." in waarde:
        if waarde.rfind(",") > waarde.rfind("."):
            waarde = waarde.replace(".", "").replace(",", ".")
        else:
            waarde = waarde.replace(",", "")
    elif "," in waarde:
        waarde = waarde.replace(",", "." if not re.fullmatch(r"\d{1,3}(,\d{3})+", waarde) else "")
    elif re.fullmatch(r"\d{1,3}(\.\d{3})+", waarde):
        waarde = waarde.replace(".", "")  # NL duizendtallen: 1.240
    try:
        return float(waarde)
    except ValueError:
        return 0.0


def kolom(header, soort):
    namen = KOLOMMEN[soort]
    for i, h in enumerate(header):
        if h.strip().lower().lstrip("﻿") in namen:
            return i
    return None


def lees_bestanden(pad):
    """Geeft {bestandsnaam: tekst} terug uit een zip of map."""
    pad = Path(pad)
    bestanden = {}
    if pad.is_dir():
        for f in pad.glob("*.csv"):
            bestanden[f.name] = f.read_text(encoding="utf-8-sig", errors="replace")
    elif zipfile.is_zipfile(pad):
        with zipfile.ZipFile(pad) as z:
            for naam in z.namelist():
                if naam.lower().endswith(".csv"):
                    bestanden[Path(naam).name] = z.read(naam).decode("utf-8-sig", errors="replace")
    elif pad.suffix.lower() == ".csv":
        bestanden[pad.name] = pad.read_text(encoding="utf-8-sig", errors="replace")
    else:
        sys.exit(f"Onbekend bestand: {pad}. Geef de GSC-zip, een map of een CSV.")
    return bestanden


def lees_tabel(tekst, sleutel):
    rijen = list(csv.reader(io.StringIO(tekst)))
    if not rijen:
        return None
    header = rijen[0]
    idx = {s: kolom(header, s) for s in (sleutel, "klikken", "vertoningen", "ctr", "positie")}
    if idx[sleutel] is None or idx["vertoningen"] is None:
        return None
    uit = []
    for r in rijen[1:]:
        if len(r) <= idx[sleutel]:
            continue
        klik = getal(r[idx["klikken"]]) if idx["klikken"] is not None else 0
        vert = getal(r[idx["vertoningen"]])
        pos = getal(r[idx["positie"]]) if idx["positie"] is not None else 0
        uit.append({sleutel: r[idx[sleutel]].strip(), "klikken": klik, "vertoningen": vert,
                    "ctr": klik / vert if vert else 0.0, "positie": pos})
    return uit


def verwachte_ctr(pos):
    if pos <= 0:
        return 0.0
    if pos <= 10:
        return VERWACHTE_CTR[max(1, round(pos))]
    if pos <= 20:
        return 0.01
    return 0.005


def is_vraag(q):
    return bool(VRAAG_START.search(q) or VRAAG_SIGNAAL.search(q))


def woorden(tekst):
    return {w for w in re.split(r"[^a-z0-9à-ÿ]+", tekst.lower()) if len(w) > 2 and w not in STOPWOORDEN}


def vermoedelijke_pagina(query, paginas):
    """GSC-export koppelt zoekopdracht niet aan pagina. Gok op woordoverlap met de URL."""
    qw = woorden(query)
    beste, score = None, 0
    for p in paginas:
        pw = woorden(p["pagina"].split("//", 1)[-1].split("/", 1)[-1])
        s = len(qw & pw)
        if s > score or (s == score and s > 0 and p["vertoningen"] > beste["vertoningen"]):
            beste, score = p, s
    return beste["pagina"] if beste and score else None


def actie(r):
    if r["positie"] <= 10:
        return "Titel/meta herschrijven als antwoord op de vraag + FAQ-blok"
    if r["positie"] <= 20:
        return "FAQ-blok met direct antwoord op bestaande pagina"
    return "Nieuwe blog/pagina die deze vraag beantwoordt"


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("export")
    ap.add_argument("--min-vertoningen", type=float, default=20)
    ap.add_argument("--top", type=int, default=30)
    ap.add_argument("--alle", action="store_true", help="niet filteren op vraagvorm (export is al gefilterd)")
    ap.add_argument("--uit", help="schrijf rapport naar dit bestand")
    a = ap.parse_args()

    bestanden = lees_bestanden(a.export)
    queries, paginas = None, []
    for naam, tekst in bestanden.items():
        if queries is None:
            queries = lees_tabel(tekst, "query")
        t = lees_tabel(tekst, "pagina")
        if t:
            paginas = t
    if not queries:
        sys.exit("Geen zoekopdrachten-CSV gevonden (Queries.csv / Zoekopdrachten.csv).")

    kandidaten = [q for q in queries if q["vertoningen"] >= a.min_vertoningen and (a.alle or is_vraag(q["query"]))]
    for q in kandidaten:
        # Potentie: extra klikken als de vraag (minstens) op positie 5 komt met een passende CTR.
        q["gemist"] = max(0.0, q["vertoningen"] * (verwachte_ctr(min(q["positie"], 5)) - q["ctr"]))
        q["pagina"] = vermoedelijke_pagina(q["query"], paginas) if paginas else None
    kandidaten.sort(key=lambda q: (q["gemist"], q["vertoningen"]), reverse=True)
    top = kandidaten[: a.top]

    tot_vert = sum(q["vertoningen"] for q in queries)
    regels = [
        "# GSC-vragenanalyse",
        "",
        f"- Zoekopdrachten in export: {len(queries)} ({tot_vert:,.0f} vertoningen)".replace(",", "."),
        f"- Vragen met ≥ {a.min_vertoningen:.0f} vertoningen: {len(kandidaten)}",
        f"- Pagina's in export: {len(paginas)}",
        "",
        "Potentie = extra klikken per periode als de vraag op positie 5 (of hoger) staat met een normale CTR. Grove indicatie.",
        "",
        "| # | Vraag | Vert. | Klik | CTR | Pos. | Potentie | Vermoedelijke pagina | Actie |",
        "|---|---|---:|---:|---:|---:|---:|---|---|",
    ]
    for i, q in enumerate(top, 1):
        pag = q["pagina"].split("//", 1)[-1] if q["pagina"] else "— (geen match)"
        regels.append(
            f"| {i} | {q['query']} | {q['vertoningen']:.0f} | {q['klikken']:.0f} | {q['ctr']*100:.1f}% | "
            f"{q['positie']:.1f} | {q['gemist']:.0f} | {pag} | {actie(q)} |"
        )
    if not top:
        regels.append("| – | Geen vragen gevonden boven de drempel | | | | | | | |")
    regels += [
        "",
        "Let op: de standaardexport koppelt zoekopdrachten niet aan pagina's. De pagina is een gok op woordoverlap "
        "met de URL. Controleer in GSC: filter Zoekopdracht = de vraag → tabblad Pagina's.",
    ]
    rapport = "\n".join(regels) + "\n"
    if a.uit:
        Path(a.uit).write_text(rapport, encoding="utf-8")
        print(f"Rapport geschreven naar {a.uit}")
    else:
        sys.stdout.write(rapport)


if __name__ == "__main__":
    main()
