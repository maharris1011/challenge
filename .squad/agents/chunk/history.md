# Project Context

- **Owner:** mark harris
- **Project:** Challenge — coding katas compared across multiple languages. Web app to visualize and compare algorithm behavior across implementations.
- **Stack:** Multi-language source code. New web app for comparison. Need test coverage for both the execution engine and the comparison logic.
- **Created:** 2026-04-01

## Learnings

### Test Strategy Development — Session 1 (2025-01-XX)

**Critical Discoveries:**

1. **Output Format Divergence is REAL**
   - Python: `"3 :  [153, 370, 371, 407]\n"` (spaces around colon, has "arg = " debug line)
   - Ruby: `"3: [153, 370, 371, 407]\n"` (compact)
   - Node.js: `"3: 153, 370, 371, 407\n"` (NO BRACKETS — parse complexity++)
   - Go: `"2: start: 10 .. max: 243: done\n"` (includes diagnostic output)
   
   → **Parser cannot be a simple regex.** Need format-specific handlers.

2. **p=2 Edge Case**
   - Returns empty list (no 2-digit narcissistic numbers)
   - Must distinguish: "empty result" (success) vs "parse error" (failure)
   - Go format shows diagnostic output on empty result (confusing)

3. **Comparison Logic Must Handle:**
   - Order independence (sort before compare)
   - Whitespace normalization (` [ 1 , 2 ] ` should match `[1, 2]`)
   - Bracket variations (Python has them, Node.js doesn't)
   - Trailing newlines (Windows \r\n vs Unix \n)

4. **Timing Measurement Risks:**
   - Machine-dependent variance (±20% normal)
   - First run slower (interpretation overhead)
   - Cannot assert exact timing; must use percentiles

5. **Correct Test Vectors (Verified):**
   - p=1: [1, 2, 3, 4, 5, 6, 7, 8, 9]
   - p=2: [] (empty)
   - p=3: [153, 370, 371, 407] ← PRIMARY validation test
   - p=4: [1634, 8208, 9474]

6. **Cross-Language Risks Identified:**
   - 13 implementations, 10+ languages
   - Some may not be available on test machine (Java missing? C compiler?)
   - Pre-compile strategy needed for compiled languages
   - Interpreter version differences (Go 1.18 vs 1.20?)

7. **Test Strategy Scope:**
   - Phase 1 (CRITICAL): Execution engine, output parsing, p=3 validation
   - Phase 2 (HIGH): API endpoints, comparison logic
   - Phase 3 (MEDIUM): Frontend, history persistence
   - Phase 4 (LOW): Edge cases, concurrency, platform-specific

**Testing Decisions Made:**
- Use test vectors (p=2, 3, 4) for validation
- Format-specific parsers (Python, Ruby, Node.js, Go each get a handler)
- Comparison: sort, normalize whitespace, strip newlines
- Timing: percentile-based, ±20% tolerance
- API tests: endpoint behavior, error handling, history
- Frontend tests: chart rendering, table display, navigation
- Risk tracking: documented 10 failure modes + mitigations

**Open Questions:**
- Pre-compile strategy for Java/C/C++?
- Max p value (recommend p ≤ 20)?
- Should Node.js format be fixed, or parse as-is?
- End-to-end tests on real servers (Phase 2)?

**Test Plan Deliverable:**
- Created `.squad/decisions/inbox/chunk-test-plan.md` (22KB)
- Covers 6 major areas: execution engine, output validation, comparison, API, frontend, risks
- Includes 40+ specific test cases
- Roadmap for 6 implementation phases
- Success criteria documented

### Test Suite Implementation — Session 2 (2026-04-01)

**Deliverables Created:**

1. **test/parsers.test.js** (51 tests)
   - Unit tests for output parsing across all 14 languages
   - Language-specific parsers: Python (debug line), Node.js (no brackets), Go (diagnostic)
   - Default parser: Ruby-style bracketed format for remaining 11 languages
   - Canary tests: p=1, p=3, p=4 for each language
   - Edge cases: empty output, extra whitespace, multiple debug lines
   - Cross-language validation suite

2. **test/executor.test.js** (52 tests)
   - Integration tests for execution engine (SLOW — runs actual implementations)
   - Canary tests for all 14 languages:
     - p=3 → [153, 370, 371, 407]
     - p=1 → [1, 2, 3, 4, 5, 6, 7, 8, 9]
     - p=4 → [1634, 8208, 9474]
   - Error handling: invalid power, timeouts
   - Timing validation: executionMs > 0 and < 60000
   - Result structure validation

3. **test/api.test.js** (35 tests)
   - HTTP API endpoint tests
   - GET /api/languages (14 languages)
   - POST /api/run (single execution)
   - POST /api/batch (serial execution)
   - GET /api/runs (history with pagination/filtering)
   - GET /api/runs/:id (single run details)
   - GET /api/health (health check)
   - Error handling: 400, 404, 405, malformed JSON
   - CORS headers validation

4. **test/README.md**
   - Test documentation and usage guide
   - Canary value reference table
   - Output format reference for all languages
   - Troubleshooting guide
   - Test commands (unit vs integration)

**Total: 138 test cases across 4 files**

**Format Discoveries Codified:**

- **Custom parsers required:** Python (debug lines), Node.js (no brackets), Go (diagnostic)
- **Default parser works for:** Ruby, Java, C, C++, Rust, Haskell, Elixir, ElixirMix, F#, C#, Swift
- **Edge case handling:** p=2 returns empty array (valid, not error)
- **Whitespace normalization:** Required for all parsers
- **Order independence:** Results must be sorted before comparison

**Canary Values Established:**

| Power | Expected Numbers              | Status    |
|-------|-------------------------------|-----------|
| p=1   | [1,2,3,4,5,6,7,8,9]          | ✅ Tested |
| p=2   | [] (empty)                   | ⚠️ Edge   |
| p=3   | [153, 370, 371, 407]         | ✅ Primary|
| p=4   | [1634, 8208, 9474]           | ✅ Tested |

**Test Strategy Decisions:**

1. **Two-tier approach:**
   - Unit tests (parsers + API) — fast, no dependencies
   - Integration tests (executor) — slow, requires runtimes

2. **Mock-first development:**
   - Tests written before backend implementation
   - Allows parallel development (Data building backend simultaneously)
   - Tests may need minor adjustments once real implementation lands

3. **Node.js built-in test runner:**
   - No external dependencies (jest, mocha, etc.)
   - Uses `node:test` and `node:assert`
   - Simple, fast, standard

4. **Language count: 14 implementations**
   - Python, Ruby, Node.js, Go, Java, C, C++, Rust
   - Haskell, Elixir, ElixirMix, F#, C#, Swift

**Open Questions Resolved:**

- ✅ Node.js format: Parse as-is (no brackets) — custom parser handles it
- ✅ Pre-compile strategy: Deferred to executor implementation
- ✅ Max p value: Recommended p ≤ 20 (documented in tests)

**Next Steps for Data (Backend Developer):**

- Implement actual `parseOutput()` function matching test signatures
- Implement `execute()` function with child_process spawning
- API server implementation with Express (tests expect port 3001)
- SQLite integration for run history
- May need to adjust test mocks after implementation

## Phase 1 Build Complete (2026-04-01)

**Status:** ✅ TEST SUITE READY FOR VALIDATION

**Team Updates:**
- Data (Backend): Full implementation complete, ready for test validation
- Andy (Frontend): Scaffold complete, waiting to connect to backend
- Mikey (Architecture): Stack confirmed (Node.js/Express + React)

**Test Suite Summary:**
- **Total:** 138 tests across 4 files
- **parsers.test.js:** 51 unit tests (fast, no dependencies)
- **executor.test.js:** 52 integration tests (slow, requires runtimes)
- **api.test.js:** 35 endpoint tests (fast, mocked server)
- **README.md:** Complete test documentation

**Validation Workflow (Phase 2):**
1. `cd webapp/backend && npm install` (ensure dependencies)
2. `npm test` (run parsers + API tests, should be fast)
3. `npm run test:integration` (run executor tests against real languages)
4. `npm run test:all` (full suite validation)

**Critical Canary Values:**
- p=1: [1,2,3,4,5,6,7,8,9]
- p=3: [153,370,371,407] ← PRIMARY
- p=4: [1634,8208,9474]

**Parser Coverage:**
- ✅ Python (custom: debug lines + brackets)
- ✅ Node.js (custom: no brackets, comma-separated)
- ✅ Go (custom: diagnostic output)
- ✅ Default (11 languages: simple bracketed format)

**Orchestration Log:**
- `.squad/orchestration-log/2026-04-01T14:46:30Z-chunk.md`

**Session Summary:**
- `.squad/log/2026-04-01T14:46:30Z-phase1-build.md`

**Next Phase (Phase 2):**
- Execute full test suite against working backend
- Document any test failures and adjust as needed
- Achieve 100% test pass rate
- Prepare for E2E frontend integration tests
