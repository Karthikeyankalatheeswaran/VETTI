const express = require('express');
const GameLog = require('../models/GameLog');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all game logs for a user
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = { user: req.user._id };
    if (status) {
      query.status = status;
    }

    const gameLogs = await GameLog.find(query)
      .sort({ dateLogged: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await GameLog.countDocuments(query);

    res.json({
      gameLogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get game logs error:', error);
    res.status(500).json({ message: 'Error fetching game logs' });
  }
});

// Create a new game log
router.post('/', auth, async (req, res) => {
  try {
    const { gameId, gameName, gameImage, rating, status, review } = req.body;

    // Validation
    if (!gameId || !gameName || !rating || !status) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (!['playing', 'completed', 'dropped'].includes(status)) {
      return res.status(400).json({ message: 'Status must be playing, completed, or dropped' });
    }

    // Check if game is already logged by this user
    const existingLog = await GameLog.findOne({ user: req.user._id, gameId });
    if (existingLog) {
      return res.status(400).json({ message: 'Game already logged. Use update instead.' });
    }

    const gameLog = new GameLog({
      user: req.user._id,
      gameId,
      gameName,
      gameImage,
      rating,
      status,
      review
    });

    await gameLog.save();

    res.status(201).json({
      message: 'Game logged successfully',
      gameLog
    });
  } catch (error) {
    console.error('Create game log error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Game already logged by this user' });
    } else {
      res.status(500).json({ message: 'Error creating game log' });
    }
  }
});

// Update a game log
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, status, review } = req.body;

    const gameLog = await GameLog.findOne({ _id: id, user: req.user._id });
    if (!gameLog) {
      return res.status(404).json({ message: 'Game log not found' });
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
      gameLog.rating = rating;
    }

    if (status !== undefined) {
      if (!['playing', 'completed', 'dropped'].includes(status)) {
        return res.status(400).json({ message: 'Status must be playing, completed, or dropped' });
      }
      gameLog.status = status;
    }

    if (review !== undefined) {
      gameLog.review = review;
    }

    await gameLog.save();

    res.json({
      message: 'Game log updated successfully',
      gameLog
    });
  } catch (error) {
    console.error('Update game log error:', error);
    res.status(500).json({ message: 'Error updating game log' });
  }
});

// Delete a game log
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const gameLog = await GameLog.findOneAndDelete({ _id: id, user: req.user._id });
    if (!gameLog) {
      return res.status(404).json({ message: 'Game log not found' });
    }

    res.json({ message: 'Game log deleted successfully' });
  } catch (error) {
    console.error('Delete game log error:', error);
    res.status(500).json({ message: 'Error deleting game log' });
  }
});

// Get game log for a specific game
router.get('/game/:gameId', auth, async (req, res) => {
  try {
    const { gameId } = req.params;

    const gameLog = await GameLog.findOne({ user: req.user._id, gameId });
    
    if (!gameLog) {
      return res.status(404).json({ message: 'Game not logged by this user' });
    }

    res.json(gameLog);
  } catch (error) {
    console.error('Get game log error:', error);
    res.status(500).json({ message: 'Error fetching game log' });
  }
});

module.exports = router;