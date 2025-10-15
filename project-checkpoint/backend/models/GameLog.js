const mongoose = require('mongoose');

const gameLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: Number,
    required: [true, 'Game ID is required']
  },
  gameName: {
    type: String,
    required: [true, 'Game name is required'],
    trim: true
  },
  gameImage: {
    type: String,
    default: ''
  },
  gameReleaseDate: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['playing', 'completed', 'dropped', 'plan-to-play'],
      message: 'Status must be one of: playing, completed, dropped, plan-to-play'
    }
  },
  review: {
    type: String,
    maxlength: [1000, 'Review cannot exceed 1000 characters'],
    default: ''
  },
  hoursPlayed: {
    type: Number,
    min: [0, 'Hours played cannot be negative'],
    default: 0
  },
  dateStarted: {
    type: Date,
    default: null
  },
  dateCompleted: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
gameLogSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure one log per game per user
gameLogSchema.index({ user: 1, gameId: 1 }, { unique: true });

module.exports = mongoose.model('GameLog', gameLogSchema);