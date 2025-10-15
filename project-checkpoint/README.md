# Project Checkpoint - Video Game Logging App

A full-stack MERN application that allows users to discover, log, and track their video game collection.

## Features

- **User Authentication**: Register, login, and logout with JWT tokens
- **Game Discovery**: Search and browse games using the RAWG API
- **Game Logging**: Rate, review, and track game status (playing, completed, dropped)
- **Personal Dashboard**: View and manage your game collection
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Axios for external API calls

### Frontend
- React
- React Router for navigation
- Axios for API calls
- Context API for state management
- CSS3 for styling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- RAWG API key (free at https://rawg.io/apidocs)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd project-checkpoint
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project-checkpoint
JWT_SECRET=your_jwt_secret_key_here
RAWG_API_KEY=your_rawg_api_key_here
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Start the application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Games
- `GET /api/games` - Get popular games
- `GET /api/games/search` - Search games
- `GET /api/games/:id` - Get game details

### Game Logs
- `GET /api/gamelogs` - Get user's game logs (protected)
- `POST /api/gamelogs` - Create game log (protected)
- `PUT /api/gamelogs/:id` - Update game log (protected)
- `DELETE /api/gamelogs/:id` - Delete game log (protected)
- `GET /api/gamelogs/game/:gameId` - Get log for specific game (protected)

## Project Structure

```
project-checkpoint/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── GameLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── games.js
│   │   └── gamelogs.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── SearchBar.js
│   │   │   ├── GameCard.js
│   │   │   └── GameLogForm.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── GameDetails.js
│   │   │   ├── GameLog.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── README.md
```

## Usage

1. **Register/Login**: Create an account or login to access game logging features
2. **Discover Games**: Browse popular games or search for specific titles
3. **View Game Details**: Click on any game to see detailed information
4. **Log Games**: Rate, review, and set status for games you've played
5. **Manage Collection**: View and manage your logged games in "My Games"

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `RAWG_API_KEY`: API key for RAWG.io

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.