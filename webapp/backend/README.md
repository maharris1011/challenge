# Challenge Webapp Backend

Backend execution engine and API for the challenge comparison webapp.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start server (hot reload)
npm run dev

# Or start without hot reload
npm start
```

Server starts on **port 3001** by default.

## Environment Variables

Edit `.env` to configure:

- `PORT` — Server port (default: 3001)
- `DB_PATH` — SQLite database path (default: ../data/runs.db)
- `CHALLENGE_ROOT` — Path to challenge implementations (default: /Users/markharris/Code/challenge/3-sum-of-digits-to-power)
- `EXECUTION_TIMEOUT_MS` — Max execution time per run (default: 60000 = 60s)
- `CORS_ORIGIN` — Allowed CORS origin (default: http://localhost:5173)

## API Endpoints

- `GET /api/health` — Health check
- `GET /api/languages` — List all 14 supported languages
- `POST /api/run` — Execute single language for given power
- `POST /api/batch` — Execute multiple languages (sequential)
- `GET /api/runs` — List execution history (with filters)
- `GET /api/runs/:id` — Get single run details

See `.squad/decisions/inbox/data-backend-complete.md` for full API contract.

## Supported Languages

Python, Ruby, Java, Node.js, Go, C, C++, C#, F#, Haskell, Elixir, Elixir Mix, Rust, Swift

## Architecture

- **Express.js** — HTTP server and routing
- **better-sqlite3** — Database persistence (WAL mode)
- **child_process.spawn** — Safe code execution with timeout
- **Per-language runners** — Custom invocation for each language's toolchain
- **Per-language parsers** — Extract narcissistic numbers from varied output formats

## Database Schema

**runs table:**
- Stores every execution with full stdout/stderr
- Indexed on (language, power, created_at)
- Immutable (append-only)

**batch_runs table:**
- Groups multiple runs together
- Stores run IDs as JSON array

## Development

```bash
# Run with auto-restart on file changes
npm run dev

# Test with curl
curl http://localhost:3001/api/health
curl http://localhost:3001/api/languages

# Run a single language
curl -X POST http://localhost:3001/api/run \
  -H "Content-Type: application/json" \
  -d '{"language":"python","power":3}'
```

## Testing Output Parsers

Each language has unique output format:
- Python: `"3 :  [153, 370, 371, 407]"`
- Ruby: `"3: [153, 370, 371, 407]"`
- Node.js: `"3: 153, 370, 371, 407"` (no brackets!)
- Go: `"3: start: 10 .. max: 2916: 153, 370, 371, 407, done"`
- Java: `"Narcissistic Number\n2916: 3: \n153, 370, 371, 407,"`

Parsers handle these variations automatically.

## Error Handling

- **Timeouts:** Kill child process after 60s, return `status: "timeout"`
- **Build failures:** Return `status: "error"` with build stderr
- **Execution errors:** Capture stderr and non-zero exit codes
- **Unknown language:** Return 400 Bad Request

## Git SHA Tracking

Server captures `git rev-parse HEAD` once at startup. All runs include this SHA for reproducibility.

---

Built by **Data** (Backend Dev) — 2026-04-01
