#!/bin/bash

echo "🎮 Starting Project Checkpoint..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   sudo systemctl start mongod"
    echo "   or"
    echo "   brew services start mongodb-community"
    echo ""
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Creating template..."
    cat > backend/.env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project-checkpoint
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
RAWG_API_KEY=your_rawg_api_key_here_get_from_https://rawg.io/apidocs
EOF
    echo "✅ Created backend/.env template"
    echo "📝 Please edit backend/.env and add your RAWG API key"
    echo ""
fi

echo "🚀 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 5

echo "🚀 Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Project Checkpoint is starting up!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait

# Cleanup
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo ""
echo "👋 Project Checkpoint stopped"