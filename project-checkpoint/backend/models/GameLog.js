const mongoose = require('mongoose');

const gameLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: Number,
    required: true
  },
  gameName: {
    type: String,
    required: true
  },
  gameImage: {
    type: String
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  status: {
    type: String,
    required: true,
    enum: ['playing', 'completed', 'dropped']
  },
  review: {
    type: String,
    maxlength: 1000
  },
  dateLogged: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure one log per user per game
gameLogSchema.index({ user: 1, gameId: 1 }, { unique: true });

module.exports = mongoose.model('GameLog', gameLogSchema);