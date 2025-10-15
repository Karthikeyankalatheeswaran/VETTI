# 🚀 Quick Start Guide - Project Checkpoint

Get up and running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js v16+ installed
- [ ] MongoDB installed and running (or MongoDB Atlas account)
- [ ] RAWG API key obtained from https://rawg.io/apidocs

## Step-by-Step Setup

### 1️⃣ Backend Setup (2 minutes)

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/project-checkpoint
JWT_SECRET=my_super_secret_key_12345
RAWG_API_KEY=your_actual_rawg_api_key
```

Start backend:
```bash
npm run dev
```

✅ Backend running at http://localhost:5000

### 2️⃣ Frontend Setup (2 minutes)

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAWG_API_KEY=your_actual_rawg_api_key
```

Start frontend:
```bash
npm run dev
```

✅ Frontend running at http://localhost:3000

### 3️⃣ Test the App (1 minute)

1. Open http://localhost:3000
2. Click "Register" and create an account
3. Browse games on the home page
4. Click any game to view details
5. Click "Log This Game" to save it to your collection
6. Visit "My Logs" to see your logged games

## Troubleshooting

**MongoDB not running?**
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Get connection string from atlas.mongodb.com
```

**Port already in use?**
```bash
# Backend (change PORT in backend/.env)
PORT=5001

# Frontend (change in vite.config.js)
server: { port: 3001 }
```

**API key issues?**
- Get free key from https://rawg.io/apidocs
- Paste same key in BOTH .env files
- Check for typos or extra spaces

## Default Ports

- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **MongoDB**: mongodb://localhost:27017

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the API endpoints
- Customize the UI styles in `frontend/src/App.css`
- Add more features!

---

Need help? Check the main README.md for full documentation.
