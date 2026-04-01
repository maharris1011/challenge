# Project Context

- **Owner:** mark harris
- **Project:** Challenge — coding katas compared across multiple languages. Web app to visualize and compare algorithm behavior across implementations.
- **Stack:** Multi-language (C#, Java, Ruby, and others). New web app TBD (stack to be decided).
- **Created:** 2026-04-01

## Learnings

<!-- Append new learnings below. -->

### 2026-04-01 — Architecture Plan for Narcissistic Number Comparison Web App

- **16 language implementations** found (not 13 — includes both elixir variants, C and C++ separately).
- **CLI interfaces are inconsistent:** some use positional args, some use `--power` or `-p` flags. Output formats also vary. This means we need per-language output parsers on the backend.
- **Stack decision:** Node.js/Express backend + React/Vite frontend + SQLite storage. Rationale: zero infrastructure, JS end-to-end, SQLite is sufficient for personal project benchmarking.
- **Execution model:** `child_process.spawn` with `make run POWER=N`, serial execution only (parallel would skew timing). 2-minute timeout hard limit.
- **Output parsing:** Regex-based parser per language for MVP. Normalized JSON output (`make run-json`) deferred to later phase.
- **Data model:** `runs` table stores every execution with numbers found (JSON), execution time, stdout/stderr, git SHA, platform. `batch_runs` table groups serial runs.
- **Key architectural principle:** Boring stack, serial execution, no normalization of existing implementations. Get the pipeline working end-to-end first.
