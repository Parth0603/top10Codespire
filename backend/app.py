from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime, timedelta
import os

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

# Get port from environment variable (for deployment) or default to 5000
PORT = int(os.environ.get('PORT', 5000))

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

@app.route('/api/top10')
def get_top10():
    """
    Secure API endpoint that checks server time before revealing data
    """
    global FORCE_REVEAL
    current_time = datetime.now()
    
    print(f"🔍 API Call - Current: {current_time.strftime('%H:%M:%S')}, Reveal: {REVEAL_TIME.strftime('%H:%M:%S')}, Force: {FORCE_REVEAL}")
    
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
        response = jsonify({
            "status": "LOCKED",
            "message": "Case files are sealed. Investigation in progress..."
        })
    else:
        # Time to reveal the top 10
        print("🎉 Revealing case files!")
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
    
    # Use different host for local vs production
    host = '127.0.0.1' if PORT == 5000 else '0.0.0.0'
    app.run(debug=False, host=host, port=PORT)