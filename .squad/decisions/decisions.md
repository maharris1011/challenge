# Team Decisions

## Phase 1 Build Completions

### 1. Backend API Contract — Ready for Frontend Integration

**Date:** 2026-04-01  
**From:** Data (Backend Dev)  
**To:** Andy (UI Lead)  
**Status:** ✅ COMPLETE & TESTED

#### Server Details

- **Base URL:** `http://localhost:3001`
- **CORS:** Enabled for `http://localhost:5173` (Vite dev server)
- **Start command:** `cd webapp/backend && npm run dev` (with hot reload)

#### Endpoints

**1. GET /api/health**
- **Purpose:** Server health check
- **Response:** `{ "status": "ok", "timestamp": "ISO8601" }`

**2. GET /api/languages**
- **Purpose:** List all available languages
- **Response:** Array of `{ "key": string, "name": string, "needsBuild": boolean }`
- **Languages:** python, ruby, java, nodejs, go, c, cxx, csharp, fsharp, haskell, elixir, elixirmix, rust, swift (14 total)

**3. POST /api/run**
- **Purpose:** Execute a single language for a given power
- **Request:** `{ "language": string, "power": number }`
- **Validation:** power must be 1-20, language must be valid key
- **Response:** `{ "id": uuid, "language": string, "power": number, "status": "success|error|timeout", "stdout": string, "stderr": string, "exitCode": number, "executionMs": number, "numbersFound": number[], "platform": string, "gitSha": string }`
- **Status values:** "success" (exit 0), "error" (non-zero exit), "timeout" (60s exceeded)
- **Error codes:** 400 invalid input, 500 server error

**4. POST /api/batch**
- **Purpose:** Execute multiple languages for the same power (sequential)
- **Request:** `{ "languages": string[], "power": number, "label": string? }`
- **Validation:** non-empty languages array, power 1-20
- **Response:** `{ "batchId": uuid, "runs": RunResult[] }`
- **Note:** Runs execute sequentially (not parallel) for accurate timing comparison

**5. GET /api/runs**
- **Purpose:** List execution history with optional filters
- **Query params:** `language?`, `power?`, `limit?` (default 100)
- **Response:** Array of RunResult (newest first), omits stdout/stderr
- **Error:** 404 if run ID not found

**6. GET /api/runs/:id**
- **Purpose:** Get full details of a single run (includes stdout/stderr)
- **Response:** RunResult with full details

#### Execution Timing (power=3)

- Python, Ruby, Node.js: 30-50ms
- Go, C, C++, Rust: 50-200ms
- Java, C#, F#: 200-500ms
- Haskell: 300-600ms

#### Canary Values (Ground Truth)

All implementations must return identical sorted arrays:
- p=1: [1,2,3,4,5,6,7,8,9]
- p=3: [153,370,371,407] ← PRIMARY
- p=4: [1634,8208,9474]
- p=2: [] (empty, not error)

#### Database

SQLite at `webapp/data/runs.db`. All runs persisted, immutable (never deleted/modified). WAL mode for concurrent reads.

#### Testing

Verified working:
- ✅ Health check
- ✅ Languages list (14 languages)
- ✅ Single run (Python, Node.js tested)
- ✅ Run persistence and retrieval
- ✅ Output parsing (Python bracketed, Node.js non-bracketed)

---

### 2. Frontend API Contract Expectations

**Date:** 2026-04-01  
**Author:** Andy (Frontend Dev)  
**Status:** SCAFFOLD COMPLETE — AWAITING BACKEND

#### Overview

Frontend scaffold is complete and expects the above API contract. All endpoints proxied via Vite dev server from `localhost:5173` to `localhost:3001`.

#### UI Pages

**Dashboard Page**
1. Fetch `GET /api/languages` on mount
2. User selects languages + power
3. Clicking "Run":
   - Single language → `POST /api/run`
   - Multiple languages → `POST /api/batch`
4. Shows loading state during execution
5. Displays results in bar chart (execution time) and table (status, time, numbers found)

**History Page - Table Tab**
- Fetch `GET /api/runs` with optional filters (language, power)
- Display runs in descending chronological order
- Expandable rows show full stdout/stderr

**History Page - Compare Tab**
- Fetch `GET /api/runs` (no filters or user-selected languages)
- Render Recharts LineChart with execution time over time
- One line per language
- User can filter to specific languages

#### Error Handling

- Network errors: Display error message in red alert box
- Timeout errors: Show status badge as yellow "timeout"
- Execution errors: Show status badge as red "error"

#### Client Configuration

- **Base URL:** `/api` (proxied to `http://localhost:3001`)
- **Timeout:** 90 seconds (accounts for 60s execution timeout + buffer)

---

### 3. Test Scaffold — Chunk

**Date:** 2026-04-01  
**Author:** Chunk (QA/Tester)  
**Status:** Complete — Awaiting Backend Implementation

#### Test Suite Overview

**Test Count:** 138 tests across 4 files

1. **parsers.test.js** (51 tests)
   - Custom parsers (Python, Node.js, Go)
   - Default parser (11 languages)
   - Whitespace/format edge cases
   - Canary values: p=1, p=3, p=4

2. **executor.test.js** (52 tests)
   - Language-specific execution
   - Error handling (invalid power, timeout)
   - Stdout/stderr capture
   - Platform metadata

3. **api.test.js** (35 tests)
   - All 6 endpoints: health, languages, run, batch, runs, runs/:id
   - Request validation (400 errors)
   - Response shape verification
   - Error codes (404, 500)

4. **README.md** — Full documentation of test philosophy and custom parser requirements

#### Custom Parser Requirements

**Python — Custom Parser**
- Input: `"arg = 3\n3 :  [153, 370, 371, 407]\n"`
- Logic: Skip lines not containing brackets, extract from bracketed portion

**Node.js — Custom Parser**
- Input: `"3: 153, 370, 371, 407"`
- Logic: Split on colon, parse comma-separated values

**Go — Custom Parser**
- Input: `"3: start: 1 .. max: 19683: done"`
- Logic: Try bracketed first; empty array for diagnostic-only output

**Default Parser (11 languages)**
- Input: `"3: [153, 370, 371, 407]"`
- Logic: Extract bracketed list, parse integers
- Languages: Ruby, Java, C, C++, Rust, Haskell, Elixir, ElixirMix, F#, C#, Swift

#### Edge Cases Covered

1. **Empty Results (p=2):** Distinguish "empty result" (success) from "parse error" (failure)
2. **Whitespace Variations:** Extra spaces, newlines, Windows vs Unix line endings
3. **Debug Output Mixed:** Python debug lines, timing, diagnostic output
4. **Order Independence:** Results may be returned in any order, tests normalize with sort
5. **Timeout Handling:** Default 60s, should return `status: 'timeout'` not error

#### Backend Requirements (for Data)

1. **parseOutput(language, stdout)** function must:
   - Return array of integers (sorted)
   - Handle empty results gracefully
   - Use language-specific logic for Python, Node.js, Go

2. **execute(language, power, options)** function must:
   - Return `{ status, language, power, numbersFound, executionMs, stdout, stderr }`
   - Support `options.timeout` (default 60000ms)
   - Handle errors: invalid power, missing runtime, timeout

3. **API server** must:
   - Run on port 3001
   - Implement 6 endpoints as specified
   - Return proper error codes: 400, 404, 405, 500
   - Include CORS headers

#### Test Commands

```json
{
  "test": "node --test test/parsers.test.js test/api.test.js",
  "test:integration": "node --test test/executor.test.js",
  "test:all": "node --test test/"
}
```

---

### 4. Electron vs. Node.js/Express: Recommendation

**Date:** 2026-04-01  
**Author:** Mikey (Architecture)  
**Verdict:** Stick with Node.js/Express + React

#### Analysis

**1. Express Localhost Security**
- Not a material risk
- Personal dev tool on `localhost:3001` only
- Frontend and backend on same machine, same network
- Zero internet exposure, zero multi-user risk

**2. What Electron Buys**
- Native window chrome (minimal gain; React can render frame)
- Desktop app feel (nice but not necessary)
- Distribution (irrelevant for personal tool)

**3. What Electron Costs**
- Dependency bloat: 150MB+ app size vs. tiny web bundle
- Packaging complexity: codesigning, installers, electron-builder
- Dev loop: rebuild binaries vs. reload browser
- Maintenance burden: Electron version updates at different cadence

#### Recommendation

Keep Node.js/Express + React. Already aligned with decisions. Express localhost setup is genuinely secure for personal tool. Electron adds complexity with zero security gain. Ship the boring stack and get the pipeline working—wrap in Electron later if distributing to others.

---

## Decision Summary Table

| Decision | Owner | Status | Impact |
|----------|-------|--------|--------|
| Backend API Contract | Data | ✅ Complete | Ready for frontend |
| Frontend Scaffold | Andy | ✅ Complete | Ready to integrate |
| Test Suite | Chunk | ✅ Complete | Validates implementation |
| Stack: Express+React | Mikey | ✅ Approved | No Electron |

---

**Last Updated:** 2026-04-01T14:46:30Z  
**Merged from:** .squad/decisions/inbox/ (4 files)
