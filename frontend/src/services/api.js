import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me')
};

// Game Logs API
export const gameLogsAPI = {
  getAll: (params) => api.get('/gamelogs', { params }),
  getById: (id) => api.get(`/gamelogs/${id}`),
  getByGameId: (gameId) => api.get(`/gamelogs/game/${gameId}`),
  create: (logData) => api.post('/gamelogs', logData),
  update: (id, logData) => api.put(`/gamelogs/${id}`, logData),
  delete: (id) => api.delete(`/gamelogs/${id}`)
};

export default api;
