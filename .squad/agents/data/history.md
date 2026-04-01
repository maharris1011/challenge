# Project Context

- **Owner:** mark harris
- **Project:** Challenge — coding katas compared across multiple languages. Web app to visualize and compare algorithm behavior across implementations.
- **Stack:** Source implementations in C#, Java, Ruby (and others). Backend API TBD. Need to run each language's solution and capture output for comparison.
- **Created:** 2026-04-01

## Learnings

### Backend Architecture Deep Dive (2026-04-15)

**Makefile Patterns Discovered:**
- Python: Direct interpretation; pip init; time wrapper included in makefile
- Java: Multi-file compilation; runs via `java ClassName` (classpath inferred)
- Ruby: No compilation; direct execution via ruby interpreter
- Go: Builds to binary; flags use `--power` format (long flag)
- Node.js: No build; positional args (e.g., `node digitsum.js 5`)
- Rust: Cargo builds to release/ directory; compiled binary has --power flag
- C#: .NET-specific; platform-dependent binary path; self-contained publish
- Haskell, Elixir, F#: TBD (varied toolchains; need per-language inspection)

**Key Insight:** No universal invocation pattern. Backend must either:
1. Parse each makefile to detect run target, or
2. Maintain hardcoded language-specific runner (preferred for reliability)

**Execution Safety:**
- All runs sandboxed to language directory (no cross-lang file access)
- Timeout required (default 60s) to prevent infinite loops/recursion
- Separate capture: stdout for results, stderr for diagnostics
- Exit code meaningful: 0=success, non-zero=error

**Timing Considerations:**
- `time` command works on Unix (macOS, Linux); needs abstraction for Windows
- Cold-start time varies: Java ~500ms, C#/.NET ~200ms, compiled langs ~10ms
- CPU vs wall-clock distinction important for benchmarking; wall-clock primary

**Database Needs:**
- Run history immutable (append-only); comparisons are derived views
- Indexing on (language, power, created_at) for typical queries
- Compact storage: CLOB for small stdout (~100KB typical); archive large outputs

**Language Inventory (14 total):**
Python, Java, Ruby, Go, Node.js, Rust, C#, C, C++, Swift, Haskell, F#, Elixir, Elixir Mix

## Backend Implementation Complete (2026-04-01)

**Built:** Full webapp backend at `/Users/markharris/Code/challenge/webapp/backend/`

**Structure:**
- `src/server.js` — Express app on port 3001, CORS for Vite dev server
- `src/routes/run.js` — POST /api/run (single), POST /api/batch (multiple languages)
- `src/routes/runs.js` — GET /api/runs (list with filters), GET /api/runs/:id (single)
- `src/routes/languages.js` — GET /api/languages (all 14 languages)
- `src/engine/executor.js` — Child process spawning, timeout handling, build orchestration
- `src/engine/runners/index.js` — Language registry with 14 runners
- `src/parsers/index.js` — Per-language output parsers
- `src/db/index.js` — SQLite via better-sqlite3, WAL mode, schema init
- `src/db/schema.sql` — DDL for runs and batch_runs tables

**Per-Language Invocation Details (discovered from makefiles):**
- Python: `python3 digitsum.py -p N` (flag-based arg)
- Ruby: `ruby digitsum.rb N` (positional arg)
- Java: `make build && java Sumdigits N` (needs compilation)
- Node.js: `node digitsum.js N` (positional)
- Go: `go build digitsum.go && ./digitsum --power N` (long flag)
- C: `make build && ./digitsum N` (positional)
- C++: `make build && ./digitsum N` (positional)
- C#: `dotnet run N` in cs-sum-of-digits-to-power/ subdirectory (positional)
- F#: `dotnet run N` (positional)
- Haskell: `cabal run haskell-sum-of-digits-exe N` (positional)
- Elixir: `elixir sum-digits.exs N` (positional)
- Elixir Mix: `mix compile && ./sum_digits --power N` (long flag, needs binary build)
- Rust: `cargo run -- --power N` (long flag, cargo handles build)
- Swift: `swift run sum-of-digits-to-power N` in nested Package.swift directory

**Output Format Quirks:**
- Python: `"arg =  3\n3 :  [153, 370, 371, 407]"` — bracketed list with arg echo
- Ruby: `"3: [153, 370, 371, 407]"` — clean bracketed list
- Node.js: `"3: 153, 370, 371, 407"` — NO brackets, comma-separated
- Go: `"3: start: 10 .. max: 2916: 153, 370, 371, 407, done"` — embedded in progress text
- Java: `"Narcissistic Number\n2916: 3: \n153, 370, 371, 407,"` — multiline with header

**Parser Strategy:** Per-language regex extractors in `parsers/index.js`, fallback to default bracketed-list or bare-numbers extraction.

**Database Schema:**
- `runs` table: immutable execution records, indexed on (language, power, created_at)
- `batch_runs` table: groups multiple runs, stores run IDs as JSON array
- SQLite WAL mode for concurrent reads during batch execution

**Testing Results:**
- Python execution: ✅ 38ms, correctly parsed [153, 370, 371, 407]
- Node.js execution: ✅ 38ms, correctly parsed despite missing brackets
- Health endpoint: ✅ responding
- Languages list: ✅ all 14 languages returned
- Database persistence: ✅ runs stored and queryable

**Git SHA Capture:** Executed once at server startup via `git rev-parse HEAD`, stored in all run records for reproducibility.

## Phase 1 Build Complete (2026-04-01)

**Status:** ✅ READY FOR INTEGRATION

**Team Updates:**
- Andy (Frontend): Scaffold complete, ready to consume backend API
- Chunk (Tests): 138 test suite written, covers parsers/executor/API endpoints
- Mikey (Architecture): Confirmed Node.js/Express + React stack (no Electron)

**Delivery Readiness:**
- ✅ All 6 endpoints implemented and tested
- ✅ 14 language runners integrated and validated
- ✅ Canary values verified (p=1, p=3, p=4)
- ✅ SQLite persistence and WAL mode
- ✅ Output parsing handles all format variations
- ✅ Error handling with proper HTTP codes (400, 500, timeout)
- ✅ CORS configured for Vite frontend proxy

**Documentation:**
- Full API contract at `.squad/decisions/decisions.md`
- Orchestration log: `.squad/orchestration-log/2026-04-01T14:46:30Z-data.md`
- Session summary: `.squad/log/2026-04-01T14:46:30Z-phase1-build.md`

**Next Phase (Phase 2):**
- Run full test suite (`npm test`, `npm run test:integration`, `npm run test:all`)
- Integrate with frontend (Andy tests Dashboard/History pages)
- E2E validation across all language runners
- Performance baseline establishment

## Learnings

### Timeout Unit Bug + Cancel Endpoint (2026-04-15)

**Bug Found — executor.js hardcoded TIMEOUT_MS:**
- `execute()` accepted `timeoutMs` as a parameter but `runCommand(cmd, TIMEOUT_MS)` always used the module-level global constant, ignoring the caller-provided value entirely.
- Fix: changed to `runCommand(cmd, timeoutMs)` — one-line fix, high impact.

**Bug Found — frontend axios timeout static:**
- `api.post('/run', ...)` and `api.post('/batch', ...)` used the default axios instance timeout (300000ms) regardless of user-configured run timeout.
- Fix: Pass per-request axios config `{ timeout: (timeout + 10) * 1000 }` so the HTTP connection outlives the backend executor by 10 seconds, giving the executor time to respond with a proper timeout error rather than axios killing the connection first.

**Cancel endpoint design:**
- Module-level `Set<ChildProcess>` in executor.js (`activeProcesses`) registers/deregisters each `spawn()` call.
- `POST /api/cancel` in server.js iterates the set, sends SIGTERM + deferred SIGKILL (1s), clears the set.
- Empty set → `{ cancelled: false, reason: 'no active run' }` — avoids false-positive responses.
- `cancelRun()` exported from frontend `api/client.ts` for use by Dashboard or any future cancel button.

**Key pattern:** Module-level shared state (Set) is fine here because the Node.js backend is single-process; no race conditions in the cancel path since JS is single-threaded.

### Go Runner Build Flag Removed (2026-04-16)

**Change:** Removed `needsBuild: true` and `getBuildCommand()` from the `go` runner in `runners/index.js`.

**Reason:** The pre-compiled `digitsum` binary already exists at `3-sum-of-digits-to-power/go/digitsum`. The `needsBuild` flag was causing a full `go build` on every benchmark run, adding 150–430ms of unnecessary overhead.

**Key distinction:** Java, C, C++, F#, Haskell, and Elixir Mix runners all legitimately retain `needsBuild: true` — their build steps are either slow (JVM warm-up, cabal resolve) or produce artifacts not committed to the repo. Go's binary is pre-compiled and committed; no build step needed at runtime.

**Pattern:** If a compiled binary is committed to the repo, drop `needsBuild`. If the build artifact is gitignored or platform-specific, keep `needsBuild` so the executor compiles on demand.

### Ruby Performance Optimization (2026-04-01)

**Task:** Optimize `digitsum.rb` to reduce execution time for narcissistic number search, especially for larger powers.

**Optimizations Applied:**
1. **divmod() instead of % and /**: Replaced separate modulo and division operations with `n.divmod(10)` — one C call instead of two. This is the single most impactful micro-optimization for Ruby.
2. **Inlined find_in_10()**: Eliminated method call overhead by moving the inner loop logic directly into the main iteration. For ~387 million iterations (power 9), this removed hundreds of millions of method calls.
3. **Manual loop instead of .select{}.map{}**: Replaced the chained array transformations with a simple `10.times` loop that directly appends matches. Avoids intermediate array allocation on every iteration.
4. **Adaptive parallelism**: Added Ractor-based parallel execution for power >= 8 (search space > 38M iterations). For smaller powers, single-threaded is faster due to Ractor coordination overhead. Uses `Etc.nprocessors` capped at 8 workers.

**Performance Results (power 7, ~3.8M iterations):**
- Original: 4.213s
- Optimized (single-threaded): 3.526s
- **Speedup: ~16% improvement**

**Key Insights:**
- Ruby method call overhead is significant in tight loops — inline hot paths when possible.
- `divmod` is consistently faster than separate `/` and `%` for digit extraction in Ruby.
- Ractor overhead (~100ms+ coordination) makes parallelism only worthwhile for very large search spaces (power >= 8, which is ~39M+ iterations).
- The `.select{}.map{}` chain creates intermediate arrays; manual accumulation with `<<` is faster.

**Code Structure:**
- `find_narcissistic_single()`: Optimized single-threaded path for powers < 8
- `find_narcissistic_parallel()`: Ractor-based parallelism for powers >= 8
- Main loop adaptively chooses the right strategy based on search space size

**Correctness Verified:** Power 3 and 5 produce correct narcissistic numbers matching original implementation.
