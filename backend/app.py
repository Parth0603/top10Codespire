from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime, timedelta
import os
import threading
import time
import requests
from urllib.parse import urljoin
import logging

# Configure logging for production
if os.environ.get('FLASK_ENV') == 'production':
    logging.basicConfig(level=logging.INFO)
else:
    logging.basicConfig(level=logging.DEBUG)

logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

# Production security headers
@app.after_request
def after_request(response):
    # Security headers for production
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response

# Get port from environment variable (for deployment) or default to 5000
PORT = int(os.environ.get('PORT', 5000))

# Keep-alive configuration
KEEP_ALIVE_URL = None  # Will be set when server starts
PING_INTERVAL = 840  # 14 minutes (Render spins down after 15 minutes of inactivity)

# Set reveal time to 30 seconds from server start (for testing)
REVEAL_TIME = datetime.now() + timedelta(seconds=30)

# Force reveal flag for testing
FORCE_REVEAL = False

# Top 10 teams data - stored securely in backend only
TOP10_DATA = [
    {
        "team": "Debug Detectives",
        "problem": "Campus waste management system",
        "tech": ["Gemini AI", "Firebase", "React"]
    },
    {
        "team": "Code Sleuths", 
        "problem": "Smart attendance tracking",
        "tech": ["GCP", "AI Studio", "Flutter"]
    },
    {
        "team": "Cyber Investigators",
        "problem": "Student mental health platform",
        "tech": ["OpenAI", "MongoDB", "Node.js"]
    },
    {
        "team": "Digital Forensics",
        "problem": "Campus security enhancement",
        "tech": ["TensorFlow", "AWS", "Python"]
    },
    {
        "team": "Mystery Solvers",
        "problem": "Library resource optimization",
        "tech": ["Azure", "PostgreSQL", "Vue.js"]
    },
    {
        "team": "Evidence Analysts",
        "problem": "Food delivery optimization",
        "tech": ["Google Maps API", "Redis", "Django"]
    },
    {
        "team": "Case Crackers",
        "problem": "Study group matching",
        "tech": ["Machine Learning", "SQLite", "Express"]
    },
    {
        "team": "Truth Seekers",
        "problem": "Campus event management",
        "tech": ["Blockchain", "IPFS", "Angular"]
    },
    {
        "team": "Clue Hunters",
        "problem": "Sustainable transport system",
        "tech": ["IoT", "InfluxDB", "Svelte"]
    },
    {
        "team": "Investigation Unit",
        "problem": "Academic collaboration tool",
        "tech": ["GraphQL", "Neo4j", "TypeScript"]
    }
]

@app.route('/health')
def health_check():
    """
    Health check endpoint for keep-alive monitoring
    """
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "message": "CODESPIRE 3.0 Detective Server is running"
    })

def keep_alive_ping():
    """
    Background function to ping the health endpoint periodically
    """
    while True:
        try:
            time.sleep(PING_INTERVAL)  # Wait 14 minutes
            if KEEP_ALIVE_URL:
                response = requests.get(f"{KEEP_ALIVE_URL}/health", timeout=30)
                print(f"🏓 Keep-alive ping: {response.status_code} at {datetime.now().strftime('%H:%M:%S')}")
        except Exception as e:
            print(f"❌ Keep-alive ping failed: {e}")

def start_keep_alive():
    """
    Start the keep-alive background thread
    """
    global KEEP_ALIVE_URL
    
    # Detect if we're on Render (has RENDER environment variable)
    if os.environ.get('RENDER'):
        # On Render, use the service URL
        service_name = os.environ.get('RENDER_SERVICE_NAME', 'your-app')
        KEEP_ALIVE_URL = f"https://{service_name}.onrender.com"
    else:
        # Local development
        KEEP_ALIVE_URL = f"http://localhost:{PORT}"
    
    print(f"🏓 Keep-alive URL: {KEEP_ALIVE_URL}")
    
    # Start background thread
    ping_thread = threading.Thread(target=keep_alive_ping, daemon=True)
    ping_thread.start()
    print("🚀 Keep-alive service started")

@app.route('/api/top10')
def get_top10():
    """
    Secure API endpoint that checks server time before revealing data
    """
    global FORCE_REVEAL
    current_time = datetime.now()
    
    print(f"🔍 API Call - Current: {current_time.strftime('%H:%M:%S')}, Reveal: {REVEAL_TIME.strftime('%H:%M:%S')}, Force: {FORCE_REVEAL}")
    logger.info(f"API request - Force reveal: {FORCE_REVEAL}, Time check: {should_reveal}")
    
    # Create response with no-cache headers for security
    response_headers = {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
    }
    
    # Check if we should reveal (either time passed OR force reveal is active)
    should_reveal = current_time >= REVEAL_TIME or FORCE_REVEAL
    
    if not should_reveal:
        # Case files are still sealed
        print("🔒 Files still sealed")
        logger.info("Access denied - files still sealed")
        response = jsonify({
            "status": "LOCKED",
            "message": "Case files are sealed. Investigation in progress..."
        })
    else:
        # Time to reveal the top 10
        print("🎉 Revealing case files!")
        logger.info("Access granted - revealing case files")
        response = jsonify({
            "status": "OPEN", 
            "data": TOP10_DATA,
            "message": "TOP 10 CASE FILES REVEALED"
        })
    
    # Apply security headers
    for header, value in response_headers.items():
        response.headers[header] = value
    
    return response

@app.route('/api/force-reveal', methods=['POST'])
def force_reveal():
    """
    Force reveal for testing purposes
    """
    global FORCE_REVEAL
    FORCE_REVEAL = True
    print("🚀 Force reveal activated!")
    
    response = jsonify({
        "status": "SUCCESS",
        "message": "Force reveal activated"
    })
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    return response

@app.route('/api/restart', methods=['POST'])
def restart_investigation():
    """
    Restart the investigation for testing purposes
    """
    global FORCE_REVEAL, REVEAL_TIME
    FORCE_REVEAL = False
    REVEAL_TIME = datetime.now() + timedelta(seconds=30)
    print("🔄 Investigation restarted!")
    
    response = jsonify({
        "status": "SUCCESS",
        "message": "Investigation restarted",
        "new_reveal_time": REVEAL_TIME.isoformat()
    })
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    return response

@app.route('/api/status')
def get_status():
    """
    Get current reveal status and time remaining
    """
    current_time = datetime.now()
    time_remaining = max(0, int((REVEAL_TIME - current_time).total_seconds()))
    
    response = jsonify({
        "time_remaining": time_remaining,
        "is_revealed": current_time >= REVEAL_TIME
    })
    
    # Apply no-cache headers
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    return response

@app.route('/')
def serve_frontend():
    """
    Serve the frontend HTML file
    """
    return app.send_static_file('index.html')

if __name__ == '__main__':
    print(f"🔍 CODESPIRE 3.0 Detective Server Starting...")
    print(f"📅 Reveal Time Set: {REVEAL_TIME.strftime('%H:%M:%S')}")
    print(f"🌐 Frontend: http://localhost:{PORT}")
    print(f"🔒 API: http://localhost:{PORT}/api/top10")
    
    # Start keep-alive service
    start_keep_alive()
    
    # Use different host for local vs production
    host = '127.0.0.1' if PORT == 5000 else '0.0.0.0'
    app.run(debug=False, host=host, port=PORT)