#!/bin/bash
# Installeert "Projecten" als app op de Mac (map Apps in je thuismap), met eigen icoon.
# Starten: in Terminal  ->  bash ~/Downloads/<map>/Installeer-Mac.command
set -e
ONLINE_URL="https://claude.ai/artifact/9HJsXSQdZMk4gwDEEkAh7w"
BRON="$(cd "$(dirname "$0")" && pwd)"
DOEL_DATA="$HOME/Library/Application Support/Projecten"
APP="$HOME/Applications/Projecten.app"

echo ""
echo "=== Projecten-dashboard installeren ==="
echo "  1) Gesynchroniseerd (aanbevolen): zelfde projecten op telefoon en computer (internet nodig)"
echo "  2) Offline: alleen op deze Mac"
read -r -p "Kies 1 of 2 (Enter = 1): " KEUZE
[ "$KEUZE" = "2" ] || KEUZE=1

for f in index.html icon.png; do
  [ -f "$BRON/$f" ] || { echo "Bestand $f niet gevonden naast dit script. Pak eerst de hele ZIP uit."; exit 1; }
done
mkdir -p "$DOEL_DATA"
cp "$BRON/index.html" "$DOEL_DATA/index.html"

if [ "$KEUZE" = "1" ]; then URL="$ONLINE_URL"; else URL="file://${DOEL_DATA// /%20}/index.html"; fi

rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"

cat > "$APP/Contents/MacOS/Projecten" <<EOF
#!/bin/bash
URL="$URL"
for B in "Google Chrome" "Microsoft Edge" "Brave Browser"; do
  if [ -d "/Applications/\$B.app" ] || [ -d "\$HOME/Applications/\$B.app" ]; then
    exec open -na "\$B" --args --app="\$URL"
  fi
done
exec open "\$URL"
EOF
chmod +x "$APP/Contents/MacOS/Projecten"

cat > "$APP/Contents/Info.plist" <<'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>CFBundleName</key><string>Projecten</string>
  <key>CFBundleDisplayName</key><string>Projecten</string>
  <key>CFBundleIdentifier</key><string>nl.boomrecruitment.projecten</string>
  <key>CFBundleExecutable</key><string>Projecten</string>
  <key>CFBundleIconFile</key><string>icon</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleVersion</key><string>1.0</string>
</dict></plist>
EOF

# Icoon (.icns) maken uit icon.png
SET="$(mktemp -d)/icon.iconset"; mkdir -p "$SET"
for s in 16 32 128 256 512; do
  sips -z $s $s "$BRON/icon.png" --out "$SET/icon_${s}x${s}.png" >/dev/null
  d=$((s*2)); sips -z $d $d "$BRON/icon.png" --out "$SET/icon_${s}x${s}@2x.png" >/dev/null
done
iconutil -c icns "$SET" -o "$APP/Contents/Resources/icon.icns"
touch "$APP"

echo ""
echo "Klaar! 'Projecten' staat in je thuismap > Apps (~/Applications)."
echo "Tip: sleep hem naar je Dock. Werkt het best met Google Chrome geinstalleerd (eigen venster)."
[ "$KEUZE" = "1" ] && echo "Eerste keer: log in bij claude.ai in het venster dat opent."
open "$APP"
