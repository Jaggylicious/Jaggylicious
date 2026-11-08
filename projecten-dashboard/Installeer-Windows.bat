@echo off
rem Dubbelklik om Projecten als app te installeren.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0installeer-windows.ps1"
if errorlevel 1 pause
