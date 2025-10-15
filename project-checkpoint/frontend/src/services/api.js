import axios from 'axios';

// Set base URL for API calls
axios.defaults.baseURL = 'http://localhost:5000';

// Games API
export const gamesAPI = {
  // Search games
  searchGames: (query, page = 1, pageSize = 20) => 
    axios.get(`/api/games/search?search=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`),
  
  // Get popular games
  getPopularGames: (page = 1, pageSize = 20) => 
    axios.get(`/api/games?page=${page}&pageSize=${pageSize}`),
  
  // Get game details
  getGameDetails: (gameId) => 
    axios.get(`/api/games/${gameId}`)
};

// Game Logs API
export const gameLogsAPI = {
  // Get user's game logs
  getGameLogs: (status = null, page = 1, limit = 10) => {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append('status', status);
    return axios.get(`/api/gamelogs?${params}`);
  },
  
  // Create game log
  createGameLog: (gameLogData) => 
    axios.post('/api/gamelogs', gameLogData),
  
  // Update game log
  updateGameLog: (logId, gameLogData) => 
    axios.put(`/api/gamelogs/${logId}`, gameLogData),
  
  // Delete game log
  deleteGameLog: (logId) => 
    axios.delete(`/api/gamelogs/${logId}`),
  
  // Get game log for specific game
  getGameLog: (gameId) => 
    axios.get(`/api/gamelogs/game/${gameId}`)
};

// Auth API
export const authAPI = {
  // Login
  login: (email, password) => 
    axios.post('/api/auth/login', { email, password }),
  
  // Register
  register: (username, email, password) => 
    axios.post('/api/auth/register', { username, email, password }),
  
  // Get current user
  getCurrentUser: () => 
    axios.get('/api/auth/me')
};