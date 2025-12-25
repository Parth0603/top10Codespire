@echo off
REM CODESPIRE 3.0 Production Server Startup Script for Windows

echo 🔍 Starting CODESPIRE 3.0 Detective Server in PRODUCTION mode...
echo 🚀 Using Gunicorn WSGI Server

REM Set production environment
set FLASK_ENV=production
set PYTHONPATH=%PYTHONPATH%;%CD%\backend

REM Get port from environment or default
if "%PORT%"=="" set PORT=5000

echo 🌐 Port: %PORT%

REM Start Gunicorn with production configuration
gunicorn --config gunicorn.conf.py --pythonpath backend app:app