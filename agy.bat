
@echo off
title Add Antigravity to Context Menu

echo ==========================================
echo   Adding Antigravity to Context Menu
echo ==========================================
echo.

:: Locate Antigravity
set "ANTIGRAVITY="

if exist "%LOCALAPPDATA%\Programs\Antigravity\Antigravity.exe" (
    set "ANTIGRAVITY=%LOCALAPPDATA%\Programs\Antigravity\Antigravity.exe"
)

if exist "%LOCALAPPDATA%\Programs\Google Antigravity\Antigravity.exe" (
    set "ANTIGRAVITY=%LOCALAPPDATA%\Programs\Google Antigravity\Antigravity.exe"
)

if not defined ANTIGRAVITY (
    echo Antigravity executable not found!
    echo.
    echo Please edit the BAT file and enter your actual Antigravity.exe path.
    pause
    exit /b 1
)

:: Folder background context menu
reg add "HKCU\Software\Classes\Directory\Background\shell\Antigravity" /ve /d "Open with Antigravity" /f
reg add "HKCU\Software\Classes\Directory\Background\shell\Antigravity" /v Icon /d "\"%ANTIGRAVITY%\"" /f
reg add "HKCU\Software\Classes\Directory\Background\shell\Antigravity\command" /ve /d "\"%ANTIGRAVITY%\" \"%%V\"" /f

:: Folder context menu
reg add "HKCU\Software\Classes\Directory\shell\Antigravity" /ve /d "Open with Antigravity" /f
reg add "HKCU\Software\Classes\Directory\shell\Antigravity" /v Icon /d "\"%ANTIGRAVITY%\"" /f
reg add "HKCU\Software\Classes\Directory\shell\Antigravity\command" /ve /d "\"%ANTIGRAVITY%\" \"%%1\"" /f

:: File context menu
reg add "HKCU\Software\Classes\*\shell\Antigravity" /ve /d "Open with Antigravity" /f
reg add "HKCU\Software\Classes\*\shell\Antigravity" /v Icon /d "\"%ANTIGRAVITY%\"" /f
reg add "HKCU\Software\Classes\*\shell\Antigravity\command" /ve /d "\"%ANTIGRAVITY%\" \"%%1\"" /f

echo.
echo SUCCESS! Antigravity added to context menu.
echo.
pause
