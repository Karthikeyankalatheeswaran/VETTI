const express = require('express');
const GameLog = require('../models/GameLog');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/gamelogs
// @desc    Get all game logs for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, sort = '-updatedAt', page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = { user: req.user._id };
    if (status && status !== 'all') {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get game logs with pagination
    const gameLogs = await GameLog.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username');

    // Get total count for pagination
    const total = await GameLog.countDocuments(query);

    res.json({
      gameLogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get game logs error:', error);
    res.status(500).json({ message: 'Error fetching game logs' });
  }
});

// @route   GET /api/gamelogs/:id
// @desc    Get a specific game log
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const gameLog = await GameLog.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('user', 'username');

    if (!gameLog) {
      return res.status(404).json({ message: 'Game log not found' });
    }

    res.json(gameLog);
  } catch (error) {
    console.error('Get game log error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid game log ID' });
    }
    res.status(500).json({ message: 'Error fetching game log' });
  }
});

// @route   GET /api/gamelogs/game/:gameId
// @desc    Get game log for a specific game by the authenticated user
// @access  Private
router.get('/game/:gameId', auth, async (req, res) => {
  try {
    const gameLog = await GameLog.findOne({
      gameId: req.params.gameId,
      user: req.user._id
    }).populate('user', 'username');

    if (!gameLog) {
      return res.status(404).json({ message: 'Game log not found' });
    }

    res.json(gameLog);
  } catch (error) {
    console.error('Get game log by game ID error:', error);
    res.status(500).json({ message: 'Error fetching game log' });
  }
});

// @route   POST /api/gamelogs
// @desc    Create a new game log
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      gameId,
      gameName,
      gameImage,
      gameReleaseDate,
      rating,
      status,
      review,
      hoursPlayed,
      dateStarted,
      dateCompleted
    } = req.body;

    // Validation
    if (!gameId || !gameName || !rating || !status) {
      return res.status(400).json({ 
        message: 'Game ID, name, rating, and status are required' 
      });
    }

    // Check if user already has a log for this game
    const existingLog = await GameLog.findOne({
      user: req.user._id,
      gameId
    });

    if (existingLog) {
      return res.status(400).json({ 
        message: 'You have already logged this game. Use PUT to update it.' 
      });
    }

    // Create new game log
    const gameLog = new GameLog({
      user: req.user._id,
      gameId,
      gameName,
      gameImage: gameImage || '',
      gameReleaseDate: gameReleaseDate || '',
      rating,
      status,
      review: review || '',
      hoursPlayed: hoursPlayed || 0,
      dateStarted: dateStarted || null,
      dateCompleted: dateCompleted || null
    });

    await gameLog.save();
    await gameLog.populate('user', 'username');

    res.status(201).json({
      message: 'Game logged successfully',
      gameLog
    });
  } catch (error) {
    console.error('Create game log error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error creating game log' });
  }
});

// @route   PUT /api/gamelogs/:id
// @desc    Update a game log
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      rating,
      status,
      review,
      hoursPlayed,
      dateStarted,
      dateCompleted
    } = req.body;

    // Find the game log
    const gameLog = await GameLog.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!gameLog) {
      return res.status(404).json({ message: 'Game log not found' });
    }

    // Update fields
    if (rating !== undefined) gameLog.rating = rating;
    if (status !== undefined) gameLog.status = status;
    if (review !== undefined) gameLog.review = review;
    if (hoursPlayed !== undefined) gameLog.hoursPlayed = hoursPlayed;
    if (dateStarted !== undefined) gameLog.dateStarted = dateStarted;
    if (dateCompleted !== undefined) gameLog.dateCompleted = dateCompleted;

    await gameLog.save();
    await gameLog.populate('user', 'username');

    res.json({
      message: 'Game log updated successfully',
      gameLog
    });
  } catch (error) {
    console.error('Update game log error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid game log ID' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error updating game log' });
  }
});

// @route   DELETE /api/gamelogs/:id
// @desc    Delete a game log
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const gameLog = await GameLog.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!gameLog) {
      return res.status(404).json({ message: 'Game log not found' });
    }

    res.json({ message: 'Game log deleted successfully' });
  } catch (error) {
    console.error('Delete game log error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid game log ID' });
    }
    res.status(500).json({ message: 'Error deleting game log' });
  }
});

// @route   GET /api/gamelogs/stats/summary
// @desc    Get user's game log statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get statistics using aggregation
    const stats = await GameLog.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 },
          totalHours: { $sum: '$hoursPlayed' },
          averageRating: { $avg: '$rating' },
          statusCounts: {
            $push: '$status'
          }
        }
      }
    ]);

    // Count games by status
    const statusStats = await GameLog.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = {
      playing: 0,
      completed: 0,
      dropped: 0,
      'plan-to-play': 0
    };

    statusStats.forEach(stat => {
      statusCounts[stat._id] = stat.count;
    });

    const result = {
      totalGames: stats[0]?.totalGames || 0,
      totalHours: stats[0]?.totalHours || 0,
      averageRating: stats[0]?.averageRating ? Math.round(stats[0].averageRating * 10) / 10 : 0,
      statusCounts
    };

    res.json(result);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

module.exports = router;