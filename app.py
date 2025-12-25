# Production WSGI entry point for Render deployment
import sys
import os

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Import the Flask app from backend
from app import app

# WSGI application callable for production servers
application = app

if __name__ == '__main__':
    # This block only runs in development mode
    # In production, Gunicorn will use the 'application' object above
    
    # Get port from environment variable (for deployment) or default
    port = int(os.environ.get('PORT', 5000))
    
    print(f"🔍 CODESPIRE 3.0 Detective Server Starting in DEVELOPMENT mode...")
    print(f"🌐 Port: {port}")
    print("⚠️  For production, use: gunicorn -w 4 -b 0.0.0.0:$PORT app:application")
    
    # Use 0.0.0.0 for deployment compatibility
    app.run(debug=False, host='0.0.0.0', port=port)