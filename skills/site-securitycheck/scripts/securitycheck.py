#!/usr/bin/env python3
"""Passieve securitycheck voor EIGEN websites en code (Boom, opdrachtgevers met toestemming).

    python securitycheck.py code <map>      # zoekt gelekte sleutels/wachtwoorden in de code
    python securitycheck.py site <url>      # controleert headers, HTTPS, cookies en open gevoelige bestanden

Alleen gewone GET-verzoeken (zoals een browser), geen aanvallen of brute force.
Exitcode 0 = geen kritieke bevindingen, 1 = minstens één kritieke bevinding, anders = check niet uitgevoerd.
"""
import argparse
import os
import re
import ssl
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urljoin, urlparse

# ---------- code ----------

GEHEIMEN = [
    ("KRITIEK", "Anthropic API-key", r"sk-ant-[A-Za-z0-9_-]{20,}"),
    ("KRITIEK", "OpenAI API-key", r"sk-(proj-)?[A-Za-z0-9]{20,}"),
    ("KRITIEK", "Stripe live secret key", r"sk_live_[A-Za-z0-9]{16,}"),
    ("KRITIEK", "Stripe restricted key", r"rk_live_[A-Za-z0-9]{16,}"),
    ("KRITIEK", "AWS access key", r"AKIA[0-9A-Z]{16}"),
    ("KRITIEK", "Private key", r"-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    ("KRITIEK", "GitHub token", r"gh[pousr]_[A-Za-z0-9]{36,}"),
    ("KRITIEK", "Slack token", r"xox[baprs]-[A-Za-z0-9-]{10,}"),
    ("KRITIEK", "Supabase service_role key (JWT)", r"eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]*c2VydmljZV9yb2xl[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+"),
    ("MIDDEL", "Google API-key (Maps-keys mogen openbaar, mits in Google Cloud beperkt tot je domein)", r"AIza[0-9A-Za-z_-]{35}"),
    ("HOOG", "SendGrid/Mailgun key", r"SG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}|key-[0-9a-f]{32}"),
    ("HOOG", "Wachtwoord in code", r"(?i)(password|passwd|wachtwoord|db_pass(word)?)\s*[:=]\s*['\"][^'\"\s]{6,}['\"]"),
    ("HOOG", "Database-URL met wachtwoord", r"(postgres(ql)?|mysql|mongodb(\+srv)?)://[^:\s/]+:[^@\s]+@"),
    ("MIDDEL", "Supabase anon key (openbaar mag, maar dan MOET Row Level Security aan staan)", r"eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]*YW5vbi[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+"),
]
OVERSLAAN_MAPPEN = {"node_modules", ".git", ".next", "dist", "build", ".venv", "venv", "__pycache__", ".cache", "vendor", "coverage"}
FRONTEND_HINTS = ("public", "static", "assets", "src/app", "src/pages", "src/components", "pages", "components", "www", "wp-content/themes")
TEKST_EXT = {".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".vue", ".svelte", ".html", ".htm", ".php", ".py", ".rb", ".go",
             ".java", ".json", ".yml", ".yaml", ".toml", ".ini", ".cfg", ".conf", ".env", ".sh", ".md", ".txt", ".xml", ".sql"}


def is_frontend(pad):
    p = pad.as_posix().lower()
    return any(f"/{h}/" in f"/{p}" for h in FRONTEND_HINTS) or p.endswith((".html", ".jsx", ".tsx", ".vue", ".svelte"))


def scan_code(map_):
    root = Path(map_)
    bevindingen = []
    gitignore = (root / ".gitignore").read_text(errors="ignore") if (root / ".gitignore").exists() else ""
    for dirpath, dirnames, files in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in OVERSLAAN_MAPPEN]
        for f in files:
            pad = Path(dirpath) / f
            rel = pad.relative_to(root)
            if f.startswith(".env") and not f.endswith((".example", ".sample", ".template")):
                if ".env" not in gitignore:
                    bevindingen.append(("KRITIEK", str(rel), "Bestand .env staat niet in .gitignore: geheimen komen in Git."))
                else:
                    bevindingen.append(("INFO", str(rel), ".env aanwezig en genegeerd door Git (goed). Inhoud niet gescand."))
                continue
            if pad.suffix.lower() not in TEKST_EXT or pad.stat().st_size > 2_000_000:
                continue
            try:
                tekst = pad.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            for niveau, naam, patroon in GEHEIMEN:
                for m in re.finditer(patroon, tekst):
                    regel = tekst.count("\n", 0, m.start()) + 1
                    waarde = m.group(0)
                    if re.search(r"(?i)(example|voorbeeld|xxxx|your[_-]?key|dummy|placeholder|test123)", waarde):
                        continue
                    n = niveau
                    extra = ""
                    if is_frontend(rel) and niveau == "HOOG":
                        n, extra = "KRITIEK", " In frontend-code: iedere bezoeker kan dit zien."
                    elif is_frontend(rel) and niveau == "KRITIEK":
                        extra = " In frontend-code: iedere bezoeker kan dit zien."
                    bevindingen.append((n, f"{rel}:{regel}", f"{naam}: {waarde[:8]}…{extra}"))
    return bevindingen


# ---------- site ----------

HEADERS = [
    ("strict-transport-security", "MIDDEL", "HSTS ontbreekt: browser mag terugvallen op onveilig http."),
    ("content-security-policy", "MIDDEL", "Content-Security-Policy ontbreekt: minder bescherming tegen XSS/ingeladen scripts."),
    ("x-content-type-options", "LAAG", "X-Content-Type-Options: nosniff ontbreekt."),
    ("referrer-policy", "LAAG", "Referrer-Policy ontbreekt: volledige URL's (met parameters) lekken naar andere sites."),
]
GEVOELIG = [
    ("/.env", "KRITIEK", r"(?m)^[A-Z_]{3,}\s*=", "Omgevingsbestand met geheimen is openbaar."),
    ("/.git/config", "KRITIEK", r"\[core\]", "Git-map is openbaar: hele broncode (en geheimen) te downloaden."),
    ("/wp-config.php.bak", "KRITIEK", r"DB_PASSWORD", "Back-up van WordPress-config met databasewachtwoord."),
    ("/wp-config.php~", "KRITIEK", r"DB_PASSWORD", "Back-up van WordPress-config met databasewachtwoord."),
    ("/backup.zip", "HOOG", None, "Back-upbestand openbaar downloadbaar."),
    ("/backup.sql", "HOOG", r"(?i)(insert into|create table)", "Database-dump openbaar."),
    ("/phpinfo.php", "HOOG", r"(?i)phpinfo\(\)|PHP Version", "phpinfo toont serverconfiguratie."),
    ("/wp-json/wp/v2/users", "MIDDEL", r'"slug"\s*:', "WordPress toont gebruikersnamen (handig voor inlogpogingen)."),
    ("/server-status", "MIDDEL", r"Apache Server Status", "Apache server-status openbaar."),
]


def haal(url, timeout=10):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Boom securitycheck; eigen site)"})
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
            return r.status, {k.lower(): v for k, v in r.headers.items()}, r.headers.get_all("Set-Cookie") or [], r.read(200_000).decode("utf-8", "ignore"), r.geturl()
    except urllib.error.HTTPError as e:
        return e.code, {k.lower(): v for k, v in e.headers.items()}, [], "", url
    except ssl.SSLError as e:
        return "SSL", {}, [], str(e), url
    except (urllib.error.URLError, TimeoutError, OSError) as e:
        return None, {}, [], str(e), url


def scan_site(url):
    if not url.startswith("http"):
        url = "https://" + url
    host = urlparse(url).netloc
    b = []
    status, headers, cookies, body, eind = haal(url)
    if status is None:
        print(f"Kon {url} niet bereiken ({body}). Netwerk, proxy of firewall? Geen check uitgevoerd.", file=sys.stderr)
        sys.exit(2)
    if status == "SSL":
        return [("KRITIEK", url, f"HTTPS-certificaat ongeldig: {body}")]
    b.append(("INFO", url, f"Status {status}, eindigt op {eind}"))

    s2, _, _, _, eind_http = haal("http://" + host + "/")
    if s2 and not str(eind_http).startswith("https://"):
        b.append(("HOOG", "http://" + host, "http stuurt niet door naar https."))

    for naam, niveau, uitleg in HEADERS:
        if naam not in headers:
            b.append((niveau, "header", uitleg))
    if "x-frame-options" not in headers and "frame-ancestors" not in headers.get("content-security-policy", ""):
        b.append(("LAAG", "header", "Clickjacking-bescherming ontbreekt (X-Frame-Options of CSP frame-ancestors)."))
    for h in ("server", "x-powered-by"):
        if re.search(r"\d", headers.get(h, "")):
            b.append(("LAAG", "header", f"{h}: '{headers[h]}' verraadt softwareversie."))

    for c in cookies:
        naam = c.split("=", 1)[0]
        lc = c.lower()
        mist = [x for x in ("secure", "httponly") if x not in lc]
        if "samesite" not in lc:
            mist.append("samesite")
        if mist and re.search(r"(?i)(sess|auth|token|login|wordpress_logged)", naam):
            b.append(("MIDDEL", f"cookie {naam}", f"Sessiecookie mist: {', '.join(mist)}."))

    for m in re.finditer(r"""(?:src|href)=["']([^"']+\.js)(?:\?[^"']*)?["']""", body):
        js = urljoin(eind, m.group(1))
        if urlparse(js).netloc != host:
            continue
        _, _, _, jsbody, _ = haal(js)
        for niveau, naam, patroon in GEHEIMEN:
            for g in re.finditer(patroon, jsbody):
                n = "KRITIEK" if niveau in ("KRITIEK", "HOOG") else niveau
                b.append((n, js, f"{naam} in openbaar JavaScript: {g.group(0)[:8]}…"))

    for pad, niveau, bewijs, uitleg in GEVOELIG:
        st, hd, _, inhoud, eind2 = haal(urljoin(f"{urlparse(url).scheme}://{host}", pad))
        if st != 200 or urlparse(eind2).path.rstrip("/") != pad.rstrip("/"):
            continue
        if bewijs and not re.search(bewijs, inhoud):
            continue  # 200 maar geen echt bestand (bijv. nette 404-pagina)
        if not bewijs and "text/html" in hd.get("content-type", ""):
            continue
        b.append((niveau, pad, uitleg))
    return b


VOLGORDE = {"KRITIEK": 0, "HOOG": 1, "MIDDEL": 2, "LAAG": 3, "INFO": 4}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("soort", choices=["code", "site"])
    ap.add_argument("doel")
    a = ap.parse_args()
    bev = scan_code(a.doel) if a.soort == "code" else scan_site(a.doel)
    bev.sort(key=lambda x: VOLGORDE[x[0]])
    print(f"Securitycheck {a.soort}: {a.doel}")
    if not [x for x in bev if x[0] != "INFO"]:
        print("  ✓ Geen bevindingen.")
    for niveau, waar, wat in bev:
        print(f"  [{niveau}] {waar} — {wat}")
    telling = {n: sum(1 for x in bev if x[0] == n) for n in VOLGORDE if n != "INFO"}
    print("Samenvatting:", ", ".join(f"{n.lower()} {c}" for n, c in telling.items()))
    sys.exit(1 if telling["KRITIEK"] else 0)


if __name__ == "__main__":
    main()
