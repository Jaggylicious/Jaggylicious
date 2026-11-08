# Installeert "Projecten" als app op Windows: eigen venster, eigen icoon,
# snelkoppeling op het bureaublad en in het Startmenu.
# Starten: dubbelklik op Installeer-Windows.bat (in dezelfde map).

$ErrorActionPreference = 'Stop'
$OnlineUrl = 'https://claude.ai/artifact/9HJsXSQdZMk4gwDEEkAh7w'
$Bron      = Split-Path -Parent $MyInvocation.MyCommand.Path
$Doel      = Join-Path $env:LOCALAPPDATA 'Projecten'

Write-Host ''
Write-Host '=== Projecten-dashboard installeren ===' -ForegroundColor Green
Write-Host ''
Write-Host '  1) Gesynchroniseerd (aanbevolen): dezelfde projecten op je telefoon en computer.'
Write-Host '     Werkt met internet. Eerste keer inloggen bij claude.ai.'
Write-Host '  2) Offline: alleen op deze computer, werkt ook zonder internet.'
Write-Host ''
$keuze = Read-Host 'Kies 1 of 2 (Enter = 1)'
if ($keuze -ne '2') { $keuze = '1' }

# Bestanden kopieren
New-Item -ItemType Directory -Force -Path $Doel | Out-Null
foreach ($f in 'index.html', 'icon.ico') {
    $pad = Join-Path $Bron $f
    if (-not (Test-Path $pad)) { throw "Bestand '$f' niet gevonden naast dit script. Pak eerst de hele ZIP uit." }
    Copy-Item $pad $Doel -Force
}

if ($keuze -eq '1') {
    $url = $OnlineUrl
} else {
    $url = ([System.Uri](Join-Path $Doel 'index.html')).AbsoluteUri
}

# Browser zoeken (Edge staat standaard op Windows; anders Chrome)
$kandidaten = @(
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)
$browser = $kandidaten | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
if (-not $browser) { throw 'Microsoft Edge of Google Chrome niet gevonden.' }

# Snelkoppelingen maken
$shell = New-Object -ComObject WScript.Shell
$plekken = @(
    [Environment]::GetFolderPath('Desktop'),
    (Join-Path ([Environment]::GetFolderPath('StartMenu')) 'Programs')
)
foreach ($map in $plekken) {
    $lnk = $shell.CreateShortcut((Join-Path $map 'Projecten.lnk'))
    $lnk.TargetPath       = $browser
    $lnk.Arguments        = "--app=`"$url`""
    $lnk.IconLocation     = (Join-Path $Doel 'icon.ico')
    $lnk.Description      = 'Projecten-dashboard'
    $lnk.WorkingDirectory = $Doel
    $lnk.Save()
}

Write-Host ''
Write-Host 'Klaar! "Projecten" staat op je bureaublad en in het Startmenu.' -ForegroundColor Green
Write-Host 'Tip: open de app, klik met rechts op het icoon in de taakbalk en kies "Vastmaken aan taakbalk".'
if ($keuze -eq '1') { Write-Host 'Eerste keer: log in bij claude.ai in het venster dat opent.' }
Write-Host ''
Start-Process $browser "--app=`"$url`""
Read-Host 'Druk op Enter om dit venster te sluiten'
