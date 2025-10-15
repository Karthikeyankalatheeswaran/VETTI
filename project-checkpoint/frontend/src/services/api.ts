import axios, { AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  User, 
  LoginForm, 
  RegisterForm, 
  GamesResponse, 
  GameDetail, 
  GameLog, 
  GameLogInput, 
  GameLogsResponse, 
  GameLogStats 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: RegisterForm): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: LoginForm): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response: AxiosResponse<{ user: User }> = await api.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.post('/auth/logout');
    return response.data;
  },
};

// Games API
export const gamesAPI = {
  getGames: async (params: {
    page?: number;
    search?: string;
    page_size?: number;
  } = {}): Promise<GamesResponse> => {
    const response: AxiosResponse<GamesResponse> = await api.get('/games', { params });
    return response.data;
  },

  getGameById: async (id: number): Promise<GameDetail> => {
    const response: AxiosResponse<GameDetail> = await api.get(`/games/${id}`);
    return response.data;
  },

  getGameScreenshots: async (id: number): Promise<{
    count: number;
    results: Array<{ id: number; image: string; width: number; height: number }>;
  }> => {
    const response = await api.get(`/games/${id}/screenshots`);
    return response.data;
  },
};

// Game Logs API
export const gameLogsAPI = {
  getGameLogs: async (params: {
    status?: string;
    sort?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<GameLogsResponse> => {
    const response: AxiosResponse<GameLogsResponse> = await api.get('/gamelogs', { params });
    return response.data;
  },

  getGameLog: async (id: string): Promise<GameLog> => {
    const response: AxiosResponse<GameLog> = await api.get(`/gamelogs/${id}`);
    return response.data;
  },

  getGameLogByGameId: async (gameId: number): Promise<GameLog> => {
    const response: AxiosResponse<GameLog> = await api.get(`/gamelogs/game/${gameId}`);
    return response.data;
  },

  createGameLog: async (gameLogData: GameLogInput): Promise<{
    message: string;
    gameLog: GameLog;
  }> => {
    const response = await api.post('/gamelogs', gameLogData);
    return response.data;
  },

  updateGameLog: async (id: string, gameLogData: Partial<GameLogInput>): Promise<{
    message: string;
    gameLog: GameLog;
  }> => {
    const response = await api.put(`/gamelogs/${id}`, gameLogData);
    return response.data;
  },

  deleteGameLog: async (id: string): Promise<{ message: string }> => {
    const response: AxiosResponse<{ message: string }> = await api.delete(`/gamelogs/${id}`);
    return response.data;
  },

  getStats: async (): Promise<GameLogStats> => {
    const response: AxiosResponse<GameLogStats> = await api.get('/gamelogs/stats/summary');
    return response.data;
  },
};

export default api;