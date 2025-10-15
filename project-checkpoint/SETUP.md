# Project Checkpoint - Setup Guide

## Quick Start

### 1. Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- RAWG API key (free at https://rawg.io/apidocs)

### 2. Installation

```bash
# Install all dependencies
npm run install-all

# Or install separately:
# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install
```

### 3. Environment Setup

#### Backend (.env)
Create `backend/.env` with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project-checkpoint
JWT_SECRET=your_jwt_secret_key_here
RAWG_API_KEY=your_rawg_api_key_here
```

#### Get RAWG API Key
1. Visit https://rawg.io/apidocs
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env` file

### 4. Database Setup

#### Option A: Local MongoDB
```bash
# Start MongoDB (Linux/Mac)
sudo systemctl start mongod
# or
brew services start mongodb-community

# Seed with demo data (optional)
cd backend && npm run seed
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://cloud.mongodb.com
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 5. Start the Application

#### Option A: Use the startup script
```bash
./start.sh
```

#### Option B: Start manually
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Demo Accounts (if seeded)
- Email: demo@example.com, Password: password123
- Email: gamer@example.com, Password: password123

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database permissions

### RAWG API Issues
- Verify API key is correct
- Check API key has proper permissions
- Ensure internet connection

### Port Already in Use
- Change PORT in backend/.env
- Kill existing processes on ports 3000/5000

### Dependencies Issues
- Delete node_modules and package-lock.json
- Run npm install again
- Check Node.js version compatibility

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start  # Starts React dev server with hot reload
```

### Testing API
```bash
node test-setup.js
```

## Production Deployment

### Backend
1. Set NODE_ENV=production
2. Use production MongoDB URI
3. Set secure JWT_SECRET
4. Deploy to Heroku, DigitalOcean, etc.

### Frontend
1. Run `npm run build`
2. Deploy build folder to Netlify, Vercel, etc.
3. Update API base URL in frontend

## Features Overview

- ✅ User authentication (register/login)
- ✅ Game discovery via RAWG API
- ✅ Game logging with ratings and reviews
- ✅ Personal game collection dashboard
- ✅ Responsive design
- ✅ Search and filtering
- ✅ CRUD operations for game logs

## API Documentation

See README.md for complete API endpoint documentation.