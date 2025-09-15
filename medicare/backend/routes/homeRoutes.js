import express from 'express';
import { getHomeStats } from '../controllers/homeController.js';

const router = express.Router();

// Public routes
router.get('/stats', getHomeStats);

export default router;
