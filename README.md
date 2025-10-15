# 🎮 Project Checkpoint - Video Game Logging Web Application

A full-stack MERN (MongoDB, Express, React, Node.js) application that allows users to browse, discover, and log their video game experiences. Track games you're playing, completed, or planning to play with ratings, reviews, and status updates.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Express](https://img.shields.io/badge/Backend-Express-blue)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Runtime-Node.js-green)

## ✨ Features

### 🔐 Authentication
- **User Registration & Login**: Secure authentication using JWT tokens
- **Password Security**: Passwords hashed with bcrypt
- **Protected Routes**: Middleware ensures only authenticated users can log games
- **Session Persistence**: JWT stored in localStorage for seamless user experience

### 🎯 Game Discovery
- **Browse Games**: Fetch and display games from RAWG API
- **Search Functionality**: Search for games by name
- **Game Details**: View comprehensive information including:
  - Name, description, release date
  - Rating, playtime, platforms
  - Developers, publishers, genres
  - High-quality background images

### 📝 Game Logging
- **Log Games**: Save games to your personal collection with:
  - Rating (1-5 stars with interactive slider)
  - Status (Playing, Completed, Dropped, Plan to Play)
  - Hours played
  - Optional review (up to 1000 characters)
- **View Logs**: Dedicated page to view all your logged games
- **Edit & Delete**: Update or remove game logs
- **No Duplicates**: System prevents logging the same game twice
- **Smart Updates**: Edit existing logs directly from game detail pages

### 🎨 UI/UX Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern Interface**: Beautiful gradient backgrounds and card-based layouts
- **Interactive Elements**: Star ratings, status badges, hover effects
- **Filter & Search**: Filter logs by status and search by game name
- **Statistics Dashboard**: View your gaming stats at a glance
- **Loading States**: Spinners and feedback for async operations
- **Error Handling**: Clear error and success messages

## 📁 Project Structure

```
project-checkpoint/
├── backend/                    # Node.js + Express backend
│   ├── config/
│   │   └── db.js              # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic (register, login)
│   │   └── gameLogController.js # Game logging CRUD operations
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT verification middleware
│   ├── models/
│   │   ├── User.js            # User schema (username, email, password)
│   │   └── GameLog.js         # Game log schema
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── gameLogs.js        # Game log routes
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   └── server.js              # Express server entry point
│
├── frontend/                   # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Navigation bar
│   │   │   ├── GameCard.jsx   # Game display card
│   │   │   ├── GameLogForm.jsx # Form for logging games
│   │   │   └── PrivateRoute.jsx # Route protection
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Browse games page
│   │   │   ├── GameDetails.jsx # Individual game details
│   │   │   ├── MyLogs.jsx     # User's logged games
│   │   │   ├── Login.jsx      # Login page
│   │   │   └── Register.jsx   # Registration page
│   │   ├── services/
│   │   │   ├── api.js         # Backend API service
│   │   │   └── rawgApi.js     # RAWG API service
│   │   ├── App.jsx            # Main app component with routing
│   │   ├── App.css            # Application styles
│   │   ├── index.css          # Global styles
│   │   └── main.jsx           # React entry point
│   ├── .env.example           # Frontend environment variables
│   ├── index.html
│   ├── package.json
│   └── vite.config.js         # Vite configuration
│
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Install MongoDB](https://www.mongodb.com/docs/manual/installation/) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **RAWG API Key** - [Get free API key](https://rawg.io/apidocs)

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd project-checkpoint
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
```

Edit `backend/.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/project-checkpoint
# For MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/project-checkpoint
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
RAWG_API_KEY=your_rawg_api_key_here
```

**Get your RAWG API Key:**
1. Go to [https://rawg.io/apidocs](https://rawg.io/apidocs)
2. Click "Get API Key"
3. Sign up for a free account
4. Copy your API key

```bash
# Start backend server
npm run dev
# Server will run on http://localhost:5000
```

#### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
```

Edit `frontend/.env` with your configuration:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAWG_API_KEY=your_rawg_api_key_here
```

```bash
# Start frontend development server
npm run dev
# Application will run on http://localhost:3000
```

#### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## 🔧 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "gamer123",
  "email": "gamer@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "username": "gamer123",
  "email": "gamer@example.com",
  "token": "jwt_token"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "gamer@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Game Log Endpoints

All game log endpoints require authentication (`Authorization: Bearer {token}`).

#### Get All User's Logs
```http
GET /api/gamelogs
GET /api/gamelogs?status=completed
GET /api/gamelogs?search=zelda
```

#### Get Single Log
```http
GET /api/gamelogs/:id
```

#### Get Log by Game ID
```http
GET /api/gamelogs/game/:gameId
```

#### Create Game Log
```http
POST /api/gamelogs
Content-Type: application/json
Authorization: Bearer {token}

{
  "gameId": 3498,
  "gameName": "The Legend of Zelda: Breath of the Wild",
  "gameImage": "https://...",
  "rating": 5,
  "status": "completed",
  "review": "Amazing open-world adventure!",
  "hoursPlayed": 120
}
```

#### Update Game Log
```http
PUT /api/gamelogs/:id
Content-Type: application/json
Authorization: Bearer {token}

{
  "rating": 5,
  "status": "completed",
  "review": "Updated review",
  "hoursPlayed": 150
}
```

#### Delete Game Log
```http
DELETE /api/gamelogs/:id
Authorization: Bearer {token}
```

## 📊 Database Schema

### User Model
```javascript
{
  username: String (required, unique, 3-30 chars),
  email: String (required, unique, validated),
  password: String (required, hashed, min 6 chars),
  createdAt: Date,
  updatedAt: Date
}
```

### GameLog Model
```javascript
{
  user: ObjectId (ref: User),
  gameId: Number (required, from RAWG API),
  gameName: String (required),
  gameImage: String,
  rating: Number (required, 1-5),
  status: String (enum: playing, completed, dropped, plan-to-play),
  review: String (max 1000 chars),
  hoursPlayed: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
// Unique index on (user, gameId) prevents duplicates
```

## 🎨 Key Technologies & Libraries

### Backend
- **Express.js**: Web framework for Node.js
- **MongoDB & Mongoose**: Database and ODM
- **JWT (jsonwebtoken)**: Authentication tokens
- **bcryptjs**: Password hashing
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **axios**: HTTP client for RAWG API calls

### Frontend
- **React 18**: UI library
- **React Router v6**: Client-side routing
- **Axios**: HTTP client
- **Vite**: Build tool and dev server
- **CSS3**: Custom styling with CSS variables

## 🔒 Security Features

1. **Password Hashing**: All passwords hashed with bcrypt (10 salt rounds)
2. **JWT Authentication**: Secure token-based authentication
3. **Protected Routes**: Backend middleware verifies JWT for protected endpoints
4. **Input Validation**: Form validation on both client and server
5. **MongoDB Injection Prevention**: Mongoose sanitizes inputs
6. **CORS Configuration**: Controlled cross-origin requests

## 🌟 Advanced Features

### Frontend
- **Pagination/Load More**: Browse games with pagination
- **Search & Filter**: Find games and filter your logs
- **Responsive Design**: Mobile-first approach
- **Error Boundaries**: Graceful error handling
- **Loading States**: User feedback during async operations
- **Star Rating System**: Interactive visual rating input

### Backend
- **RESTful API**: Standard REST conventions
- **Error Handling**: Centralized error handling middleware
- **Data Validation**: Mongoose schemas with validation
- **Unique Constraints**: Prevent duplicate game logs
- **Population**: Efficient data relationships

## 📝 Usage Guide

### For Users

1. **Register an Account**
   - Navigate to Register page
   - Fill in username, email, and password (min 6 characters)
   - Click Register

2. **Browse Games**
   - Home page displays popular games from RAWG API
   - Use search bar to find specific games
   - Click "View Details" to see more information

3. **Log a Game**
   - On game details page, click "Log This Game"
   - Set your rating (1-5 stars)
   - Choose status (Playing, Completed, Dropped, Plan to Play)
   - Add hours played (optional)
   - Write a review (optional, max 1000 characters)
   - Click "Save Log"

4. **Manage Your Logs**
   - Go to "My Logs" page
   - Filter by status or search by name
   - View statistics about your gaming
   - Edit or delete logs as needed

5. **Update a Log**
   - Visit the game's detail page
   - Your existing log will be displayed
   - Modify any fields
   - Click "Update Log"

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection
- Verify `.env` file has correct `MONGO_URI`
- Check if port 5000 is available

**Frontend can't connect to backend:**
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Ensure CORS is enabled in backend

**Games not loading:**
- Verify RAWG API key is correct in both `.env` files
- Check API key hasn't exceeded rate limit (free tier: 20,000 requests/month)
- Check browser console for API errors

**Authentication issues:**
- Clear localStorage: `localStorage.clear()` in browser console
- Check JWT_SECRET is set in backend `.env`
- Verify token is being sent in Authorization header

## 🚀 Deployment

### Backend Deployment (Heroku, Railway, Render)

1. Set environment variables
2. Ensure MongoDB connection string is production-ready
3. Build command: `npm install`
4. Start command: `npm start`

### Frontend Deployment (Vercel, Netlify)

1. Build command: `npm run build`
2. Output directory: `dist`
3. Set environment variables (`VITE_API_URL`, `VITE_RAWG_API_KEY`)

## 📚 Learning Outcomes

This project demonstrates:
- Full-stack application architecture
- RESTful API design and implementation
- JWT authentication flow
- React hooks and state management
- React Router for SPA navigation
- MongoDB schema design and relationships
- External API integration (RAWG)
- Responsive CSS design
- Form validation and error handling
- CRUD operations
- Modern JavaScript (ES6+)

## 🤝 Contributing

This is a learning project. Feel free to:
- Fork the repository
- Create feature branches
- Submit pull requests
- Report bugs
- Suggest enhancements

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [RAWG API](https://rawg.io/apidocs) for game data
- MongoDB for database
- React team for amazing frontend library
- Express.js for backend framework

## 📧 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review API documentation
3. Check browser console and server logs
4. Verify environment variables are set correctly

---

**Happy Gaming! 🎮**

Built with ❤️ using the MERN stack
