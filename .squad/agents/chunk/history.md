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
