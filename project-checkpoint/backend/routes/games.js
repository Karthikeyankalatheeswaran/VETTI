const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

// Get games from RAWG API
router.get('/search', async (req, res) => {
  try {
    const { search, page = 1, pageSize = 20 } = req.query;
    
    if (!search) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const response = await axios.get('https://api.rawg.io/api/games', {
      params: {
        key: process.env.RAWG_API_KEY,
        search,
        page,
        page_size: pageSize
      }
    });

    const games = response.data.results.map(game => ({
      id: game.id,
      name: game.name,
      released: game.released,
      rating: game.rating,
      background_image: game.background_image,
      short_description: game.short_description || 'No description available'
    }));

    res.json({
      games,
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous
    });
  } catch (error) {
    console.error('Games search error:', error);
    res.status(500).json({ message: 'Error fetching games from RAWG API' });
  }
});

// Get game details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`https://api.rawg.io/api/games/${id}`, {
      params: {
        key: process.env.RAWG_API_KEY
      }
    });

    const game = {
      id: response.data.id,
      name: response.data.name,
      description: response.data.description_raw || response.data.description,
      released: response.data.released,
      rating: response.data.rating,
      background_image: response.data.background_image,
      website: response.data.website,
      metacritic: response.data.metacritic,
      platforms: response.data.platforms?.map(p => p.platform.name) || [],
      genres: response.data.genres?.map(g => g.name) || [],
      developers: response.data.developers?.map(d => d.name) || [],
      publishers: response.data.publishers?.map(p => p.name) || []
    };

    res.json(game);
  } catch (error) {
    console.error('Game details error:', error);
    res.status(500).json({ message: 'Error fetching game details from RAWG API' });
  }
});

// Get popular games
router.get('/', async (req, res) => {
  try {
    const { page = 1, pageSize = 20 } = req.query;

    const response = await axios.get('https://api.rawg.io/api/games', {
      params: {
        key: process.env.RAWG_API_KEY,
        ordering: '-rating',
        page,
        page_size: pageSize
      }
    });

    const games = response.data.results.map(game => ({
      id: game.id,
      name: game.name,
      released: game.released,
      rating: game.rating,
      background_image: game.background_image,
      short_description: game.short_description || 'No description available'
    }));

    res.json({
      games,
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous
    });
  } catch (error) {
    console.error('Popular games error:', error);
    res.status(500).json({ message: 'Error fetching popular games from RAWG API' });
  }
});

module.exports = router;