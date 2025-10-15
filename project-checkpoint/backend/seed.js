// Demo data seeding script
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const GameLog = require('./models/GameLog');
require('dotenv').config();

const demoUsers = [
  {
    username: 'demo_user',
    email: 'demo@example.com',
    password: 'password123'
  },
  {
    username: 'gamer_pro',
    email: 'gamer@example.com',
    password: 'password123'
  }
];

const demoGameLogs = [
  {
    gameId: 3498,
    gameName: 'Grand Theft Auto V',
    gameImage: 'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg',
    rating: 5,
    status: 'completed',
    review: 'Amazing open-world game with incredible detail and endless possibilities.'
  },
  {
    gameId: 4200,
    gameName: 'Portal 2',
    gameImage: 'https://media.rawg.io/media/games/120/1201a40e4364557b124392ee04a9ac4.jpg',
    rating: 5,
    status: 'completed',
    review: 'Brilliant puzzle game with fantastic writing and innovative mechanics.'
  },
  {
    gameId: 5286,
    gameName: 'Tomb Raider',
    gameImage: 'https://media.rawg.io/media/games/021/021c4e21a1654d252580f0c5c83b8f66.jpg',
    rating: 4,
    status: 'playing',
    review: 'Great reboot with solid gameplay and engaging story.'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/project-checkpoint');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await GameLog.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users
    const users = [];
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
      console.log(`Created user: ${user.username}`);
    }

    // Create demo game logs for first user
    for (const logData of demoGameLogs) {
      const gameLog = new GameLog({
        ...logData,
        user: users[0]._id
      });
      await gameLog.save();
      console.log(`Created game log: ${gameLog.gameName}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDemo accounts:');
    console.log('Email: demo@example.com, Password: password123');
    console.log('Email: gamer@example.com, Password: password123');
    console.log('\nThe first account has some sample game logs.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;