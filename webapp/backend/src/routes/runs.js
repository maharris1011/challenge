import express from 'express';
import { getRun, listRuns } from '../db/index.js';

const router = express.Router();

router.get('/runs', (req, res) => {
  try {
    const filters = {};
    
    if (req.query.language) {
      filters.language = req.query.language;
    }
    
    if (req.query.power) {
      const power = parseInt(req.query.power, 10);
      if (!isNaN(power)) {
        filters.power = power;
      }
    }
    
    if (req.query.limit) {
      const limit = parseInt(req.query.limit, 10);
      if (!isNaN(limit) && limit > 0) {
        filters.limit = limit;
      }
    } else {
      filters.limit = 100;
    }
    
    const runs = listRuns(filters);
    res.json(runs);
  } catch (error) {
    console.error('Error in GET /api/runs:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

router.get('/runs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const run = getRun(id);
    
    if (!run) {
      return res.status(404).json({ error: 'Run not found' });
    }
    
    res.json(run);
  } catch (error) {
    console.error('Error in GET /api/runs/:id:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

export default router;
