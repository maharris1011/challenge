CREATE TABLE IF NOT EXISTS runs (
  id TEXT PRIMARY KEY,
  language TEXT NOT NULL,
  power INTEGER NOT NULL,
  status TEXT NOT NULL,
  numbers_found TEXT,
  execution_ms INTEGER,
  stdout TEXT,
  stderr TEXT,
  exit_code INTEGER,
  git_sha TEXT,
  platform TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_runs_language ON runs(language);
CREATE INDEX IF NOT EXISTS idx_runs_power ON runs(power);
CREATE INDEX IF NOT EXISTS idx_runs_created_at ON runs(created_at DESC);

CREATE TABLE IF NOT EXISTS batch_runs (
  id TEXT PRIMARY KEY,
  label TEXT,
  power INTEGER NOT NULL,
  run_ids TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_batch_runs_created_at ON batch_runs(created_at DESC);
