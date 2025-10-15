import axios from 'axios';

const RAWG_BASE_URL = 'https://api.rawg.io/api';
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY || '';

const rawgApi = axios.create({
  baseURL: RAWG_BASE_URL,
  params: {
    key: RAWG_API_KEY
  }
});

export const rawgAPI = {
  // Get list of games with optional filters
  getGames: (params = {}) => {
    return rawgApi.get('/games', { params });
  },
  
  // Get game details by ID
  getGameDetails: (id) => {
    return rawgApi.get(`/games/${id}`);
  },
  
  // Search games by name
  searchGames: (query, params = {}) => {
    return rawgApi.get('/games', { 
      params: { ...params, search: query } 
    });
  },
  
  // Get game screenshots
  getGameScreenshots: (id) => {
    return rawgApi.get(`/games/${id}/screenshots`);
  }
};

export default rawgApi;
