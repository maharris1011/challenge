# Backend Test Suite

This directory contains comprehensive tests for the backend execution engine and REST API.

## Test Files

### `parsers.test.js` — Output Parser Unit Tests
Tests the output parsing logic for all 14 language implementations.

**What it tests:**
- Language-specific output format parsing (Python, Node.js, Go, Ruby, etc.)
- Canary values for p=1, p=3, and p=4
- Edge cases: empty results, extra whitespace, debug lines
- Cross-language validation

**Total tests:** 100+ test cases covering all 14 languages

**Run with:**
```bash
node --test test/parsers.test.js
```

### `executor.test.js` — Execution Engine Integration Tests
Tests actual execution of language implementations. **WARNING: SLOW** — these tests actually run the language implementations.

**What it tests:**
- Canary test: p=3 → [153, 370, 371, 407] for all 14 languages
- Canary test: p=1 → [1, 2, 3, 4, 5, 6, 7, 8, 9] for all 14 languages
- Canary test: p=4 → [1634, 8208, 9474] for all 14 languages
- Error handling: invalid power values, timeouts
- Execution timing: executionMs validation
- Result structure validation

**Total tests:** 50+ integration tests

**Run with:**
```bash
node --test test/executor.test.js
```

**Note:** These tests require language runtimes to be installed (Python, Ruby, Node.js, Go, Java, etc.)

### `api.test.js` — HTTP API Tests
Tests the REST API endpoints.

**What it tests:**
- `GET /api/languages` — Returns 14 languages
- `POST /api/run` — Executes single language
- `POST /api/batch` — Executes multiple languages in serial
- `GET /api/runs` — Returns run history (with pagination/filtering)
- `GET /api/runs/:id` — Returns single run details
- `GET /api/health` — Health check endpoint
- Error handling: 400 for bad requests, 404 for not found
- CORS headers

**Total tests:** 40+ API tests

**Run with:**
```bash
node --test test/api.test.js
```

**Note:** Requires the API server to be running on `http://localhost:3001`

## Running Tests

### Run all unit tests (fast):
```bash
npm test
```

This runs parsers.test.js and api.test.js (skips slow integration tests).

### Run integration tests only (slow):
```bash
npm run test:integration
```

This runs executor.test.js which actually executes all language implementations.

### Run ALL tests (unit + integration):
```bash
npm run test:all
```

This runs the complete test suite. **WARNING:** Can take several minutes.

### Run a specific test file:
```bash
node --test test/parsers.test.js
node --test test/executor.test.js
node --test test/api.test.js
```

### Run with test filtering:
```bash
node --test test/parsers.test.js --test-name-pattern="Python"
```

## Canary Values (Reference)

These are the **correct** narcissistic numbers for validation:

| Power | Expected Numbers |
|-------|-----------------|
| p=1   | [1, 2, 3, 4, 5, 6, 7, 8, 9] |
| p=2   | [] (empty — no 2-digit narcissistic numbers) |
| p=3   | [153, 370, 371, 407] |
| p=4   | [1634, 8208, 9474] |

**Primary validation:** p=3 must return exactly [153, 370, 371, 407] from all 13 implementations.

## Output Format Reference

Different languages produce different output formats:

### Python
```
arg = 3
3 :  [153, 370, 371, 407]
```
- Includes debug line "arg = N"
- Spaces around colon
- Bracketed list

### Ruby
```
3: [153, 370, 371, 407]
```
- Compact format
- Bracketed list

### Node.js
```
3: 153, 370, 371, 407
```
- **NO BRACKETS** — parse complexity increased
- Comma-separated

### Go
```
3: start: 1 .. max: 19683: done
```
- Diagnostic format
- May not output numbers directly
- Special handling required

### Java / C / C++ / Rust / Haskell / Elixir / F# / C# / Swift
```
3: [153, 370, 371, 407]
```
- Default format (Ruby-style)
- Bracketed list

## Languages Requiring Custom Parsers

1. **Python** — Has debug line, spaces around colon
2. **Node.js** — No brackets, comma-separated
3. **Go** — Diagnostic format with "start:", "max:", "done"

All others use the default Ruby-style parser.

## Test Coverage

### Phase 1 (CRITICAL) — ✅ Complete
- [x] Execution engine unit tests
- [x] Output parsing for all 14 languages
- [x] p=3 canary validation

### Phase 2 (HIGH) — ✅ Complete
- [x] API endpoints tests
- [x] Comparison logic tests
- [x] Error handling tests

### Phase 3 (MEDIUM) — TODO
- [ ] Frontend component tests
- [ ] History persistence tests
- [ ] Chart rendering tests

### Phase 4 (LOW) — TODO
- [ ] Edge cases (p=2 empty result)
- [ ] Concurrency tests
- [ ] Platform-specific tests

## Adding New Tests

When adding a new test:

1. Use Node.js built-in test runner (`node:test`)
2. Use `node:assert` for assertions
3. Group related tests with `describe()`
4. Use descriptive test names
5. Include canary values where applicable

Example:
```javascript
const { test, describe } = require('node:test');
const assert = require('node:assert');

describe('My feature', () => {
  test('does something correctly', () => {
    const result = myFunction(input);
    assert.strictEqual(result, expected);
  });
});
```

## Troubleshooting

### "Cannot find module" errors
Make sure you're running from the backend directory:
```bash
cd webapp/backend
npm test
```

### Integration tests fail
Check that language runtimes are installed:
```bash
python3 --version
ruby --version
node --version
go version
java -version
# etc.
```

### API tests fail
Make sure the server is running:
```bash
npm start  # in separate terminal
npm test
```

### Timeout errors
Integration tests can be slow. Increase timeout in test:
```javascript
test('slow test', { timeout: 120000 }, async () => {
  // test code
});
```

## Contributing

When adding new language support:

1. Add parser test in `parsers.test.js`
2. Add canary tests in `executor.test.js` (p=1, p=3, p=4)
3. Update language count in `api.test.js`
4. Update this README with output format

## Questions?

- **Which tests should I run before committing?** Run `npm test` (unit tests)
- **How do I test just one language?** Use `--test-name-pattern` flag
- **Why is p=2 special?** It returns empty (no 2-digit narcissistic numbers)
- **What's the difference between unit and integration tests?** Unit tests mock execution; integration tests actually run languages
