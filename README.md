# 🔍 CODESPIRE 3.0 - Detective Case Files Reveal

A detective-themed hackathon Top 10 reveal system with secure timed data disclosure.

![Detective Theme](https://img.shields.io/badge/Theme-Detective-gold)
![Python](https://img.shields.io/badge/Python-3.11-blue)
![Flask](https://img.shields.io/badge/Flask-2.3.3-green)
![License](https://img.shields.io/badge/License-MIT-red)

## 🚀 Quick Start

### Local Development
```bash
# Clone the repository
git clone <your-repo-url>
cd codespire-top10

# Install dependencies
pip install -r requirements.txt

# Run the server
cd backend
python app.py
```

**Access:** `http://localhost:5000`

## 🌐 Deployment

### Render (Full-Stack)
**One platform handles everything!**

1. **Connect Repository**: Link your GitHub repo to Render
2. **Create Web Service**: 
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`
   - Environment: Python 3.11
3. **Deploy**: Render serves both frontend and backend at one URL

**Result**: `https://your-app.onrender.com` handles everything!
- Frontend at root URL
- API at `/api/*` endpoints
- No CORS issues, single deployment

## 🎯 Features

- **🕵️ Detective Theme**: Dark investigation aesthetic with gold highlights
- **⏱️ Auto Timer**: 30-second countdown starts automatically
- **🔒 Secure Reveal**: Backend controls data access based on server time
- **🔄 Restart Function**: Reset investigation for multiple demos
- **📱 Responsive**: Works on desktop and mobile
- **🚀 Deploy Ready**: Multiple deployment options included

## 🔒 Security Features

- ✅ No frontend data exposure
- ✅ Server-side time validation  
- ✅ Cache-Control headers
- ✅ API-only data access
- ✅ Environment variable support

## 🎮 Usage Flow

1. **Page Loads** → Timer automatically starts (30 seconds)
2. **Countdown** → Shows sealed case files with timer
3. **Timer Ends** → Reveals Top 10 teams in detective cards
4. **Restart** → Click "START NEW INVESTIGATION" to reset

## 📁 Project Structure

```
codespire-top10/
├── backend/
│   ├── app.py              # Flask server (serves frontend + API)
│   └── requirements.txt    # Backend dependencies
├── frontend/               # Static files served by Flask
│   ├── index.html         # Detective-themed HTML
│   ├── style.css          # Dark theme with gold accents
│   └── script.js          # Auto-timer and reveal logic
├── .gitignore             # Git ignore rules
├── requirements.txt      # Dependencies for Render
├── runtime.txt           # Python version for Render
├── DEPLOYMENT.md         # Detailed deployment guide
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 5000)
- `FLASK_ENV`: Flask environment (production/development)

### Customization
- **Timer Duration**: Modify timer in `frontend/script.js` (line 4)
- **Top 10 Data**: Edit `TOP10_DATA` array in `backend/app.py`
- **Theme Colors**: Update CSS variables in `frontend/style.css`
- **Reveal Time**: Change `REVEAL_TIME` in `backend/app.py`

## 🎨 Theme Elements

- **Colors**: Black/charcoal background with gold/amber highlights
- **Typography**: Courier New monospace font for detective feel
- **Animations**: Typing effects, glowing badges, smooth transitions
- **UI Components**: Case file cards, evidence board, sealed stamps

## 🚀 Git Workflow

```bash
# Initialize repository
git init
git add .
git commit -m "Initial commit: CODESPIRE 3.0 Detective System"

# Push to GitHub
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main

# Deploy to Render
# 1. Connect GitHub repo to Render
# 2. Create Web Service with Python 3
# 3. Auto-deploys on every push!
# 4. Visit: https://your-app.onrender.com
```

## 📊 API Endpoints

- `GET /` - Serve frontend application
- `GET /api/top10` - Get Top 10 data (time-controlled)
- `GET /api/status` - Get current timer status
- `POST /api/restart` - Restart investigation (testing)
- `POST /api/force-reveal` - Force reveal (testing)

## 🛠️ Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run in development mode
cd backend
python app.py

# The server will start on localhost:5000
# Timer automatically starts at 30 seconds
```

## 📝 License

MIT License - feel free to use for your hackathons!

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**Built for hackathon-grade architecture with proper frontend/backend separation and secure timed data revelation.**