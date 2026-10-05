@echo off
title IRON FORGE - Local Server
echo Starting IRON FORGE local server at http://localhost:5050 ...
start http://localhost:5050
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
