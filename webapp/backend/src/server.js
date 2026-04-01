import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import runRouter from './routes/run.js';
import runsRouter from './routes/runs.js';
import languagesRouter from './routes/languages.js';
import { activeProcesses } from './engine/executor.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: CORS_ORIGIN
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/cancel', (req, res) => {
  if (activeProcesses.size === 0) {
    return res.json({ cancelled: false, reason: 'no active run' });
  }

  for (const proc of activeProcesses) {
    try {
      proc.kill('SIGTERM');
      setTimeout(() => {
        if (!proc.killed) proc.kill('SIGKILL');
      }, 1000);
    } catch (_) {
      // process may have already exited
    }
  }
  activeProcesses.clear();

  res.json({ cancelled: true });
});

app.use('/api', runRouter);
app.use('/api', runsRouter);
app.use('/api', languagesRouter);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Challenge webapp backend listening on port ${PORT}`);
  console.log(`CORS enabled for: ${CORS_ORIGIN}`);
  console.log(`Challenge root: ${process.env.CHALLENGE_ROOT || '/Users/markharris/Code/challenge/3-sum-of-digits-to-power'}`);
});
