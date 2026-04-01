import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = process.env.DB_PATH || join(__dirname, '../../../data/runs.db');
const dbDir = dirname(DB_PATH);

mkdirSync(dbDir, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

export function saveRun(run) {
  const stmt = db.prepare(`
    INSERT INTO runs (id, language, power, status, numbers_found, execution_ms, stdout, stderr, exit_code, git_sha, platform)
    VALUES (@id, @language, @power, @status, @numbersFound, @executionMs, @stdout, @stderr, @exitCode, @gitSha, @platform)
  `);
  
  stmt.run({
    id: run.id,
    language: run.language,
    power: run.power,
    status: run.status,
    numbersFound: JSON.stringify(run.numbersFound || []),
    executionMs: run.executionMs,
    stdout: run.stdout,
    stderr: run.stderr,
    exitCode: run.exitCode,
    gitSha: run.gitSha,
    platform: run.platform
  });
  
  return run;
}

export function getRun(id) {
  const stmt = db.prepare('SELECT * FROM runs WHERE id = ?');
  const row = stmt.get(id);
  
  if (!row) return null;
  
  return {
    id: row.id,
    language: row.language,
    power: row.power,
    status: row.status,
    numbersFound: JSON.parse(row.numbers_found || '[]'),
    executionMs: row.execution_ms,
    stdout: row.stdout,
    stderr: row.stderr,
    exitCode: row.exit_code,
    gitSha: row.git_sha,
    platform: row.platform,
    createdAt: row.created_at
  };
}

export function listRuns(filters = {}) {
  let query = 'SELECT * FROM runs WHERE 1=1';
  const params = [];
  
  if (filters.language) {
    query += ' AND language = ?';
    params.push(filters.language);
  }
  
  if (filters.power !== undefined) {
    query += ' AND power = ?';
    params.push(filters.power);
  }
  
  query += ' ORDER BY created_at DESC';
  
  if (filters.limit) {
    query += ' LIMIT ?';
    params.push(filters.limit);
  }
  
  const stmt = db.prepare(query);
  const rows = stmt.all(...params);
  
  return rows.map(row => ({
    id: row.id,
    language: row.language,
    power: row.power,
    status: row.status,
    numbersFound: JSON.parse(row.numbers_found || '[]'),
    executionMs: row.execution_ms,
    exitCode: row.exit_code,
    gitSha: row.git_sha,
    platform: row.platform,
    createdAt: row.created_at
  }));
}

export function saveBatchRun(batch) {
  const stmt = db.prepare(`
    INSERT INTO batch_runs (id, label, power, run_ids)
    VALUES (@id, @label, @power, @runIds)
  `);
  
  stmt.run({
    id: batch.id,
    label: batch.label || null,
    power: batch.power,
    runIds: JSON.stringify(batch.runIds)
  });
  
  return batch;
}

export function listBatchRuns(limit = 50) {
  const stmt = db.prepare('SELECT * FROM batch_runs ORDER BY created_at DESC LIMIT ?');
  const rows = stmt.all(limit);
  
  return rows.map(row => ({
    id: row.id,
    label: row.label,
    power: row.power,
    runIds: JSON.parse(row.run_ids),
    createdAt: row.created_at
  }));
}

export default db;
