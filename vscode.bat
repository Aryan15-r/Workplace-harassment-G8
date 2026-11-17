
@echo off
title Add VS Code to Context Menu
echo ==========================================
echo   Adding VS Code to Windows Context Menu
echo ==========================================
echo.

:: Find VS Code installation
set "VSCODE="

if exist "%LOCALAPPDATA%\Programs\Microsoft VS Code\Code.exe" (
    set "VSCODE=%LOCALAPPDATA%\Programs\Microsoft VS Code\Code.exe"
)

if exist "%ProgramFiles%\Microsoft VS Code\Code.exe" (
    set "VSCODE=%ProgramFiles%\Microsoft VS Code\Code.exe"
)

if exist "%ProgramFiles(x86)%\Microsoft VS Code\Code.exe" (
    set "VSCODE=%ProgramFiles(x86)%\Microsoft VS Code\Code.exe"
)

if not defined VSCODE (
    echo VS Code installation not found!
    echo Please edit this BAT file and set the correct Code.exe path.
    pause
    exit /b 1
)

:: Add to folder background right-click
reg add "HKCU\Software\Classes\Directory\Background\shell\VSCode" /ve /d "Open with Code" /f
reg add "HKCU\Software\Classes\Directory\Background\shell\VSCode" /v Icon /d "\"%VSCODE%\"" /f
reg add "HKCU\Software\Classes\Directory\Background\shell\VSCode\command" /ve /d "\"%VSCODE%\" \"%%V\"" /f

:: Add to folder right-click
reg add "HKCU\Software\Classes\Directory\shell\VSCode" /ve /d "Open with Code" /f
reg add "HKCU\Software\Classes\Directory\shell\VSCode" /v Icon /d "\"%VSCODE%\"" /f
reg add "HKCU\Software\Classes\Directory\shell\VSCode\command" /ve /d "\"%VSCODE%\" \"%%1\"" /f

:: Add to file right-click
reg add "HKCU\Software\Classes\*\shell\VSCode" /ve /d "Open with Code" /f
reg add "HKCU\Software\Classes\*\shell\VSCode" /v Icon /d "\"%VSCODE%\"" /f
reg add "HKCU\Software\Classes\*\shell\VSCode\command" /ve /d "\"%VSCODE%\" \"%%1\"" /f

echo.
echo SUCCESS! VS Code has been added to the context menu.
echo.
echo Restart Windows Explorer or sign out and back in if needed.
pause
