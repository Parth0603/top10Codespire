#!/bin/bash

# CODESPIRE 3.0 Production Server Startup Script

echo "🔍 Starting CODESPIRE 3.0 Detective Server in PRODUCTION mode..."
echo "🚀 Using Gunicorn WSGI Server"

# Set production environment
export FLASK_ENV=production
export PYTHONPATH="${PYTHONPATH}:$(pwd)/backend"

# Get port from environment or default
PORT=${PORT:-5000}

echo "🌐 Port: $PORT"
echo "👥 Workers: $(($(nproc) * 2 + 1))"

# Start Gunicorn with production configuration
exec gunicorn \
    --config gunicorn.conf.py \
    --bind 0.0.0.0:$PORT \
    --workers $(($(nproc) * 2 + 1)) \
    --worker-class sync \
    --timeout 30 \
    --keepalive 2 \
    --max-requests 1000 \
    --max-requests-jitter 50 \
    --preload \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    wsgi:application