@echo off
echo Starting Multiplayer Tic-Tac-Toe...
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Netlify CLI is installed
where netlify >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Netlify CLI is not installed.
    echo Installing Netlify CLI globally...
    npm install -g netlify-cli
    if %errorlevel% neq 0 (
        echo Failed to install Netlify CLI. Please install it manually with 'npm install -g netlify-cli'
        pause
        exit /b 1
    )
)

REM Install project dependencies if not already installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Failed to install dependencies. Check your network or package.json.
        pause
        exit /b 1
    )
)

REM Start the Netlify development server
echo Starting the game server...
netlify dev

pause