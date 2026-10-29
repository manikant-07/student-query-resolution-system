@echo off
title Student Query Resolution System - AI Powered
echo ====================================================================
echo Starting Student Query Resolution System - AI Powered...
echo Project: AI PBL (Problem Based Learning)
echo ====================================================================
echo.

cd /d "%~dp0"

echo Opening browser at http://localhost:5173/ ...
start http://localhost:5173/

echo Starting Vite development server...
echo (Press Ctrl + C in this window to stop the server)
echo.

npm run dev

pause
