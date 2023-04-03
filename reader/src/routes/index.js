import { Router } from 'express';
import {
  getGameById,
  getTeamById,
  getPlayerById,
  getPlayerStats
} from '../controllers/index.controller.js';
const router = Router();
router.get('/players/:id', getPlayerById);
router.get('/games/:id', getGameById);
router.get('/teams/:id', getTeamById);
router.get('/stats/:playerId', getPlayerStats);

export default router;
