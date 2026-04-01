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

**Language Inventory (13 total):**
Python, Java, Ruby, Go, Node.js, Rust, C#, C, C++, Swift, Haskell, F#, Elixir
