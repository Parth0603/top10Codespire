# CODESPIRE 3.0 Production Deployment Guide

## 🚀 Production vs Development Server

### Development Server (Flask built-in)
- ❌ Single-threaded (one request at a time)
- ❌ No security hardening
- ❌ Poor performance under load
- ❌ Memory leaks over time
- ✅ Auto-reloading for development
- ✅ Detailed error messages

### Production Server (Gunicorn)
- ✅ Multi-process (handles concurrent requests)
- ✅ Security hardened
- ✅ High performance and stability
- ✅ Memory management
- ✅ Load balancing
- ✅ Production-ready logging

## 🛠️ Quick Start Commands

### For Local Testing (Production Mode)
```bash
# Windows
start-production.bat

# Linux/Mac
./start-production.sh

# Or directly with Gunicorn
gunicorn --config gunicorn.conf.py app:application
```

### For Render Deployment
The `Procfile` is already configured:
```
web: gunicorn --config gunicorn.conf.py app:application
```

## 📊 Production Configuration

### Gunicorn Settings (gunicorn.conf.py)
- **Workers**: `CPU cores × 2 + 1` (optimal for I/O bound apps)
- **Worker Class**: `sync` (good for Flask apps)
- **Timeout**: `30 seconds` (prevents hanging requests)
- **Max Requests**: `1000` (prevents memory leaks)
- **Preload App**: `True` (faster startup)

### Security Headers Added
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

### Logging
- Production logging to stdout/stderr
- Structured log format with timestamps
- Request/response logging for monitoring

## 🔧 Environment Variables

```bash
PORT=10000                    # Server port
FLASK_ENV=production         # Production mode
RENDER=true                  # Render platform detection
RENDER_SERVICE_NAME=your-app # Your Render service name
```

## 📈 Performance Improvements

### Before (Development Server)
- 1 request at a time
- ~100 requests/second max
- Memory usage grows over time
- Single point of failure

### After (Production Server)
- Multiple concurrent requests
- ~1000+ requests/second
- Stable memory usage
- Worker process redundancy
- Automatic worker restarts

## 🚀 Deployment Steps

1. **Update Render Settings**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn --config gunicorn.conf.py app:application`

2. **Environment Variables** (in Render dashboard):
   ```
   FLASK_ENV=production
   PORT=10000
   ```

3. **Deploy**: Push to your connected Git repository

## 🔍 Monitoring

### Health Check Endpoint
```
GET /health
```
Returns server status and timestamp.

### Logs to Monitor
- Worker process starts/restarts
- Request response times
- Memory usage patterns
- Error rates

## 🛡️ Security Features

- CORS properly configured
- Security headers on all responses
- No debug mode in production
- Structured error handling
- Request timeout protection

## 📱 Testing Production Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Start production server
gunicorn --config gunicorn.conf.py app:application

# Test endpoints
curl http://localhost:5000/health
curl http://localhost:5000/api/top10
```

Your CODESPIRE 3.0 Detective Server is now production-ready! 🕵️‍♂️