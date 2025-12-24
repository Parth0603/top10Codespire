# WSGI entry point for Render deployment
import sys
import os

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Import the Flask app from backend
from app import app, PORT

if __name__ == '__main__':
    # Get port from environment variable (for deployment) or default
    port = int(os.environ.get('PORT', PORT))
    
    print(f"🔍 CODESPIRE 3.0 Detective Server Starting on Render...")
    print(f"🌐 Port: {port}")
    
    # Use 0.0.0.0 for Render deployment
    app.run(debug=False, host='0.0.0.0', port=port)