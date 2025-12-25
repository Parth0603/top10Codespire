# Gunicorn Production Configuration for CODESPIRE 3.0

import os
import multiprocessing

# Server socket
bind = f"0.0.0.0:{os.environ.get('PORT', 5000)}"
backlog = 2048

# Worker processes - Limit for Render's free tier
workers = min(4, multiprocessing.cpu_count() * 2 + 1)  # Cap at 4 workers for free tier
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2

# Restart workers after this many requests, to prevent memory leaks
max_requests = 1000
max_requests_jitter = 50

# Logging
accesslog = "-"  # Log to stdout
errorlog = "-"   # Log to stderr
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "codespire-detective-server"

# Server mechanics
daemon = False
pidfile = None
user = None
group = None
tmp_upload_dir = None

# SSL (if needed in future)
keyfile = None
certfile = None

# Performance tuning
preload_app = True  # Load application code before forking workers
enable_stdio_inheritance = True

# Security
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190

# Python path for backend directory
pythonpath = "backend"

print("🚀 Gunicorn Production Configuration Loaded")
print(f"👥 Workers: {workers}")
print(f"🌐 Binding to: {bind}")
print(f"📁 Python path: {pythonpath}")