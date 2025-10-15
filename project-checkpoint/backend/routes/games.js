const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

const RAWG_BASE_URL = 'https://api.rawg.io/api';

// @route   GET /api/games
// @desc    Get games from RAWG API
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, search = '', page_size = 20 } = req.query;
    
    const params = {
      key: process.env.RAWG_API_KEY,
      page,
      page_size,
      search
    };

    const response = await axios.get(`${RAWG_BASE_URL}/games`, { params });
    
    // Transform the data to include only necessary fields
    const transformedGames = response.data.results.map(game => ({
      id: game.id,
      name: game.name,
      slug: game.slug,
      background_image: game.background_image,
      released: game.released,
      rating: game.rating,
      rating_top: game.rating_top,
      ratings_count: game.ratings_count,
      metacritic: game.metacritic,
      platforms: game.platforms?.map(p => p.platform.name) || [],
      genres: game.genres?.map(g => g.name) || [],
      short_screenshots: game.short_screenshots || []
    }));

    res.json({
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
      results: transformedGames
    });
  } catch (error) {
    console.error('Games fetch error:', error.message);
    if (error.response?.status === 401) {
      return res.status(401).json({ message: 'Invalid RAWG API key' });
    }
    res.status(500).json({ message: 'Error fetching games' });
  }
});

// @route   GET /api/games/:id
// @desc    Get single game details from RAWG API
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const params = {
      key: process.env.RAWG_API_KEY
    };

    const response = await axios.get(`${RAWG_BASE_URL}/games/${id}`, { params });
    const game = response.data;
    
    // Transform the data
    const transformedGame = {
      id: game.id,
      name: game.name,
      slug: game.slug,
      description: game.description,
      description_raw: game.description_raw,
      background_image: game.background_image,
      background_image_additional: game.background_image_additional,
      website: game.website,
      released: game.released,
      tba: game.tba,
      rating: game.rating,
      rating_top: game.rating_top,
      ratings: game.ratings,
      ratings_count: game.ratings_count,
      reviews_text_count: game.reviews_text_count,
      added: game.added,
      added_by_status: game.added_by_status,
      metacritic: game.metacritic,
      metacritic_platforms: game.metacritic_platforms,
      playtime: game.playtime,
      screenshots_count: game.screenshots_count,
      movies_count: game.movies_count,
      creators_count: game.creators_count,
      achievements_count: game.achievements_count,
      parent_achievements_count: game.parent_achievements_count,
      reddit_url: game.reddit_url,
      reddit_name: game.reddit_name,
      reddit_description: game.reddit_description,
      reddit_logo: game.reddit_logo,
      reddit_count: game.reddit_count,
      twitch_count: game.twitch_count,
      youtube_count: game.youtube_count,
      reviews_count: game.reviews_count,
      saturated_color: game.saturated_color,
      dominant_color: game.dominant_color,
      platforms: game.platforms?.map(p => ({
        platform: p.platform.name,
        released_at: p.released_at,
        requirements: p.requirements
      })) || [],
      parent_platforms: game.parent_platforms?.map(p => p.platform.name) || [],
      genres: game.genres?.map(g => ({
        id: g.id,
        name: g.name,
        slug: g.slug
      })) || [],
      stores: game.stores?.map(s => ({
        id: s.id,
        store: s.store.name,
        url: s.url
      })) || [],
      developers: game.developers?.map(d => d.name) || [],
      publishers: game.publishers?.map(p => p.name) || [],
      esrb_rating: game.esrb_rating?.name || null,
      clip: game.clip,
      tags: game.tags?.map(t => t.name) || []
    };

    res.json(transformedGame);
  } catch (error) {
    console.error('Game detail fetch error:', error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'Game not found' });
    }
    if (error.response?.status === 401) {
      return res.status(401).json({ message: 'Invalid RAWG API key' });
    }
    res.status(500).json({ message: 'Error fetching game details' });
  }
});

// @route   GET /api/games/:id/screenshots
// @desc    Get game screenshots from RAWG API
// @access  Public
router.get('/:id/screenshots', async (req, res) => {
  try {
    const { id } = req.params;
    
    const params = {
      key: process.env.RAWG_API_KEY
    };

    const response = await axios.get(`${RAWG_BASE_URL}/games/${id}/screenshots`, { params });
    
    res.json({
      count: response.data.count,
      results: response.data.results.map(screenshot => ({
        id: screenshot.id,
        image: screenshot.image,
        width: screenshot.width,
        height: screenshot.height
      }))
    });
  } catch (error) {
    console.error('Screenshots fetch error:', error.message);
    res.status(500).json({ message: 'Error fetching screenshots' });
  }
});

module.exports = router;