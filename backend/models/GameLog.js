import mongoose from 'mongoose';

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
    required: [true, 'Game name is required']
  },
  gameImage: {
    type: String
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
    enum: ['playing', 'completed', 'dropped', 'plan-to-play'],
    default: 'playing'
  },
  review: {
    type: String,
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  hoursPlayed: {
    type: Number,
    min: [0, 'Hours played cannot be negative'],
    default: 0
  }
}, {
  timestamps: true
});

// Create compound index to prevent duplicate logs for same game by same user
gameLogSchema.index({ user: 1, gameId: 1 }, { unique: true });

const GameLog = mongoose.model('GameLog', gameLogSchema);

export default GameLog;
