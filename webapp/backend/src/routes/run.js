import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { execute } from '../engine/executor.js';
import { saveRun, saveBatchRun } from '../db/index.js';
import { execSync } from 'child_process';

const router = express.Router();

let gitSha = 'unknown';
try {
  gitSha = execSync('git rev-parse HEAD', { 
    cwd: process.env.CHALLENGE_ROOT || '/Users/markharris/Code/challenge/3-sum-of-digits-to-power',
    encoding: 'utf8'
  }).trim();
} catch (error) {
  console.warn('Could not determine git SHA:', error.message);
}

router.post('/run', async (req, res) => {
  try {
    const { language, power, timeout } = req.body;
    
    if (!language || typeof language !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid language parameter' });
    }
    
    if (power === undefined || typeof power !== 'number' || power < 1 || power > 20) {
      return res.status(400).json({ error: 'Invalid power parameter (must be number 1-20)' });
    }

    const timeoutMs = (typeof timeout === 'number' && timeout >= 1)
      ? timeout * 1000
      : undefined;
    
    const result = await execute(language, power, timeoutMs);
    const id = uuidv4();
    
    const run = {
      id,
      ...result,
      gitSha
    };
    
    saveRun(run);
    
    res.json(run);
  } catch (error) {
    console.error('Error in /api/run:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

router.post('/batch', async (req, res) => {
  try {
    const { languages, power, label, timeout } = req.body;
    
    if (!Array.isArray(languages) || languages.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid languages array' });
    }
    
    if (power === undefined || typeof power !== 'number' || power < 1 || power > 20) {
      return res.status(400).json({ error: 'Invalid power parameter (must be number 1-20)' });
    }

    const timeoutMs = (typeof timeout === 'number' && timeout >= 1)
      ? timeout * 1000
      : undefined;
    
    const runs = [];
    const runIds = [];
    
    for (const language of languages) {
      const result = await execute(language, power, timeoutMs);
      const id = uuidv4();
      
      const run = {
        id,
        ...result,
        gitSha
      };
      
      saveRun(run);
      runs.push(run);
      runIds.push(id);
    }
    
    const batchId = uuidv4();
    const batch = {
      id: batchId,
      label: label || null,
      power,
      runIds
    };
    
    saveBatchRun(batch);
    
    res.json({
      batchId,
      runs
    });
  } catch (error) {
    console.error('Error in /api/batch:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

export default router;
