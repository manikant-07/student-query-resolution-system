@echo off
title Student Query Resolution System - Sync & Auto-Deploy
color 0B
echo ==============================================================================
echo       STUDENT QUERY RESOLUTION SYSTEM - GITHUB SYNC & AUTO-DEPLOY
echo ==============================================================================
echo.
echo  This script will automatically:
echo    1. Stage all your new changes, edits, and code
echo    2. Commit them to Git
echo    3. Push them to your GitHub repository (manikant-07)
echo    4. Trigger GitHub Actions to automatically build & update the live website!
echo.
echo ==============================================================================
echo.

cd /d "%~dp0"

echo [1/4] Checking Git repository status...
git status --short
echo.

echo [2/4] Staging all modified and new files...
git add -A

echo.
set /p commit_msg="Enter commit message (Press ENTER for auto-generated message): "
if "%commit_msg%"=="" (
    for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
    set commit_msg=Update project changes [%date% %time%]
)

echo.
echo [3/4] Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo.
echo [4/4] Pushing changes to GitHub (origin/main)...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==============================================================================
    echo [SUCCESS] Changes pushed to GitHub successfully!
    echo.
    echo Live Website Auto-Deployment:
    echo   - GitHub Actions is now building and deploying your website.
    echo   - Check Actions tab: https://github.com/manikant-07/student-query-resolution-system/actions
    echo   - Live Website URL:  https://manikant-07.github.io/student-query-resolution-system/
    echo ==============================================================================
) else (
    echo.
    echo ==============================================================================
    echo [ERROR] Git push failed. Please check your internet connection or git login.
    echo ==============================================================================
)

echo.
pause

