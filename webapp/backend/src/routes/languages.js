import express from 'express';
import { LANGUAGES } from '../engine/runners/index.js';

const router = express.Router();

router.get('/languages', (req, res) => {
  try {
    const languages = Object.entries(LANGUAGES).map(([key, config]) => ({
      key,
      name: config.name,
      needsBuild: config.needsBuild || false
    }));
    
    res.json(languages);
  } catch (error) {
    console.error('Error in GET /api/languages:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

export default router;
