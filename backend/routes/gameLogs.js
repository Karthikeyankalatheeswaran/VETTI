import express from 'express';
import {
  getGameLogs,
  getGameLogById,
  getGameLogByGameId,
  createGameLog,
  updateGameLog,
  deleteGameLog
} from '../controllers/gameLogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getGameLogs)
  .post(createGameLog);

router.route('/:id')
  .get(getGameLogById)
  .put(updateGameLog)
  .delete(deleteGameLog);

router.get('/game/:gameId', getGameLogByGameId);

export default router;
