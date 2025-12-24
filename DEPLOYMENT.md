# 🚀 Deployment Guide - Render Only

## Single Platform Deployment 🎯

Render will handle **both** your frontend and backend in one deployment!

## Step 1: Deploy to Render

1. **Create Render Account**: Sign up at [render.com](https://render.com)
2. **Connect GitHub**: Link your GitHub repository
3. **Create Web Service**:
   - **Name**: `codespire-detective-system`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `cd backend && python app.py`
   - **Auto-Deploy**: `Yes`

4. **That's it!** Render will serve:
   - **Frontend**: `https://your-app.onrender.com/`
   - **Backend API**: `https://your-app.onrender.com/api/top10`

## How It Works

The Flask backend (`app.py`) is configured to:
- ✅ Serve static frontend files from `/frontend` folder
- ✅ Handle API requests at `/api/*` endpoints
- ✅ Route everything else to `index.html`

```python
# Flask serves frontend automatically
app = Flask(__name__, static_folder='../frontend', static_url_path='')

@app.route('/')
def serve_frontend():
    return app.send_static_file('index.html')
```

## Step 2: Test Your Deployment

1. **Visit Your Render URL**: Frontend loads automatically
2. **Timer Starts**: 30-second countdown begins
3. **Case Files Reveal**: Top 10 teams appear
4. **Restart Works**: "START NEW INVESTIGATION" resets everything

## 🔧 Render Configuration

### Build Settings:
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `cd backend && python app.py`
- **Python Version**: `3.11` (from `runtime.txt`)

### Environment Variables (Optional):
- `PORT`: Auto-set by Render
- `FLASK_ENV`: `production`

## 💡 Benefits of Single Platform:

- ✅ **Simpler**: One deployment, one URL
- ✅ **No CORS Issues**: Frontend and backend on same domain
- ✅ **Cost Effective**: Single service instead of two
- ✅ **Easier Management**: One dashboard, one deployment
- ✅ **Auto HTTPS**: Render provides SSL automatically

## 🚀 Git Workflow

```bash
# Push to GitHub
git add .
git commit -m "Deploy CODESPIRE 3.0"
git push origin main

# Render auto-deploys!
# Visit: https://your-app.onrender.com
```

## 🎯 Final Result

**Single URL handles everything:**
- `https://your-app.onrender.com/` → Detective frontend
- `https://your-app.onrender.com/api/top10` → Case files API
- `https://your-app.onrender.com/api/restart` → Restart endpoint

**Perfect for hackathon demos!** 🕵️‍♂️