@echo off
setlocal enabledelayedexpansion
title BankGuard AI - Launching Full Stack System

:: Ensure script executes from project root directory
cd /d "%~dp0"

echo ================================================================
echo           BankGuard AI - Enterprise Security Platform          
echo               Full-Stack Automated Setup & Runner               
echo ================================================================
echo.

:: 1. Check Node.js installation
echo [*] Checking Node.js runtime...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not found in system PATH.
    echo Please install Node.js (v20+ recommended) from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo     - Node.js detected: !NODE_VER!

:: 2. Check npm installation
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm package manager was not found in system PATH.
    echo Please reinstall Node.js with npm included.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VER=%%i
echo     - npm detected: v!NPM_VER!
echo.

:: 3. Environment configuration setup (.env)
if not exist ".env" (
    if exist ".env.example" (
        echo [*] Initializing configuration: Copying .env.example to .env...
        copy ".env.example" ".env" >nul
        echo     - Created .env file successfully.
    ) else (
        echo [*] Creating default .env file...
        (
            echo GEMINI_API_KEY=""
            echo PORT=3000
        ) > ".env"
    )
) else (
    echo [*] Configuration file .env found.
)
echo.

:: 4. Download and install all Node.js dependencies
echo [*] Step 1/3: Checking and downloading Node.js dependencies...
if not exist "node_modules" (
    echo     - Downloading and installing npm packages (clean install)...
    call npm install
) else (
    echo     - Existing node_modules found. Verifying and synchronizing dependencies...
    call npm install
)

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] npm install encountered an error.
    echo Please check network connection and permissions, then re-run.
    echo.
    pause
    exit /b %errorlevel%
)
echo     - Node.js dependencies are up to date.
echo.

:: 5. Optional: Check Python & install ML dependencies if Python is present
echo [*] Step 2/3: Checking Python ML environment (optional for Random Forest)...
where python >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%p in ('python --version 2^>^&1') do set PY_VER=%%p
    echo     - Python detected: !PY_VER!
    if exist "requirements.txt" (
        echo     - Checking Python packages from requirements.txt...
        call pip install -r requirements.txt --quiet
        echo     - Python ML dependencies verified.
    )
) else (
    echo     - Python not detected in PATH. (Optional: Built-in in-memory simulation will be used).
)
echo.

:: 6. Launch browser in background once server is ready
echo [*] Step 3/3: Starting BankGuard AI full-stack service...
echo     - Backend API Server: Express (port 3000)
echo     - Frontend Application: Vite React 19 (port 3000)
echo.
echo Launching browser at http://localhost:3000 in 4 seconds...

:: Launch browser in parallel after brief delay
start "" cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:3000"

echo.
echo ================================================================
echo   BankGuard AI is running! Press Ctrl+C in this window to stop.
echo   Local Web Access: http://localhost:3000
echo ================================================================
echo.

:: Start unified full-stack server (Express backend + Vite frontend)
call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo [WARNING] Server stopped with exit code %errorlevel%.
    pause
)
