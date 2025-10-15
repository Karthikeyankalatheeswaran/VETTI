import GameLog from '../models/GameLog.js';

// @desc    Get all game logs for logged-in user
// @route   GET /api/gamelogs
// @access  Private
export const getGameLogs = async (req, res) => {
  try {
    const { status, search } = req.query;
    
    // Build query
    let query = { user: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.gameName = { $regex: search, $options: 'i' };
    }

    const gameLogs = await GameLog.find(query).sort({ updatedAt: -1 });
    res.json(gameLogs);
  } catch (error) {
    console.error('Get game logs error:', error);
    res.status(500).json({ message: 'Server error fetching game logs' });
  }
};

// @desc    Get single game log by ID
// @route   GET /api/gamelogs/:id
// @access  Private
export const getGameLogById = async (req, res) => {
  try {
    const gameLog = await GameLog.findById(req.params.id);

    if (!gameLog) {
      return res.status(404).json({ message: 'Game log not found' });
    }

    // Check if user owns this log
    if (gameLog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this game log' });
    }

    res.json(gameLog);
  } catch (error) {
    console.error('Get game log error:', error);
    res.status(500).json({ message: 'Server error fetching game log' });
  }
};

// @desc    Get game log by gameId (check if user already logged a game)
// @route   GET /api/gamelogs/game/:gameId
// @access  Private
export const getGameLogByGameId = async (req, res) => {
  try {
    const gameLog = await GameLog.findOne({ 
      user: req.user._id, 
      gameId: req.params.gameId 
    });

    if (!gameLog) {
      return res.status(404).json({ message: 'Game log not found' });
    }

    res.json(gameLog);
  } catch (error) {
    console.error('Get game log by gameId error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new game log
// @route   POST /api/gamelogs
// @access  Private
export const createGameLog = async (req, res) => {
  try {
    const { gameId, gameName, gameImage, rating, status, review, hoursPlayed } = req.body;

    // Validate required fields
    if (!gameId || !gameName || !rating || !status) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already logged this game
    const existingLog = await GameLog.findOne({ user: req.user._id, gameId });

    if (existingLog) {
      return res.status(400).json({ 
        message: 'You have already logged this game. Please edit your existing log instead.',
        existingLog 
      });
    }

    const gameLog = await GameLog.create({
      user: req.user._id,
      gameId,
      gameName,
      gameImage,
      rating,
      status,
      review,
      hoursPlayed: hoursPlayed || 0
    });

    res.status(201).json(gameLog);
  } catch (error) {
    console.error('Create game log error:', error);
    res.status(500).json({ message: 'Server error creating game log' });
  }
};

// @desc    Update game log
// @route   PUT /api/gamelogs/:id
// @access  Private
export const updateGameLog = async (req, res) => {
  try {
    const gameLog = await GameLog.findById(req.params.id);

    if (!gameLog) {
      return res.status(404).json({ message: 'Game log not found' });
    }

    // Check if user owns this log
    if (gameLog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this game log' });
    }

    const { rating, status, review, hoursPlayed } = req.body;

    gameLog.rating = rating !== undefined ? rating : gameLog.rating;
    gameLog.status = status || gameLog.status;
    gameLog.review = review !== undefined ? review : gameLog.review;
    gameLog.hoursPlayed = hoursPlayed !== undefined ? hoursPlayed : gameLog.hoursPlayed;

    const updatedGameLog = await gameLog.save();
    res.json(updatedGameLog);
  } catch (error) {
    console.error('Update game log error:', error);
    res.status(500).json({ message: 'Server error updating game log' });
  }
};

// @desc    Delete game log
// @route   DELETE /api/gamelogs/:id
// @access  Private
export const deleteGameLog = async (req, res) => {
  try {
    const gameLog = await GameLog.findById(req.params.id);

    if (!gameLog) {
      return res.status(404).json({ message: 'Game log not found' });
    }

    // Check if user owns this log
    if (gameLog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this game log' });
    }

    await gameLog.deleteOne();
    res.json({ message: 'Game log removed' });
  } catch (error) {
    console.error('Delete game log error:', error);
    res.status(500).json({ message: 'Server error deleting game log' });
  }
};
