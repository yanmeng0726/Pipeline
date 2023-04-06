import { Router } from 'express';
import {
  getGameById,
  getTeamById,
  getPlayerById,
  getPlayerStats,
  getTeams,
  getLiveGames
} from '../controllers/index.controller.js';
const router = Router();
router.get('/teams', getTeams);
router.get('/teams/:id', getTeamById);
router.get('/players/:id', getPlayerById);
router.get('/games/:id', getGameById);
router.get('/liveGames', getLiveGames);
router.get('/stats/:playerId', getPlayerStats);

export default router;
