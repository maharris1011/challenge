# Squad Decisions

## Active Decisions

### 2026-04-01T12:59:00Z: User Directive – Challenge 3 Only
**By:** Mark Harris (via Copilot)  
**What:** Only work on challenge 3 (3-sum-of-digits-to-power). Leave challenges 1 and 2 out of scope entirely.  
**Why:** User request — captured for team memory  
**Status:** ACTIVE

### 2026-04-01T10:11:00Z: Tech Stack Selection
**By:** Mikey (Lead Architect)  
**What:**
- Frontend: React + Vite + Recharts
- Backend: Node.js + Express
- Database: SQLite via better-sqlite3
- Monorepo: `webapp/` directory with `webapp/frontend/` and `webapp/backend/`

**Why:** 
- Vite is fast, Recharts handles overlaid line charts natively
- Node.js enables simple process spawning via child_process
- SQLite eliminates infrastructure overhead; stores run history indefinitely

**Status:** ACTIVE

### 2026-04-01T10:11:00Z: Frontend Architecture – 3-Screen MVP
**By:** Andy (UI Lead)  
**What:**
- Screen 1: Dashboard (run panel with language/power selection)
- Screen 2: Chart (Recharts visualization across languages)
- Screen 3: History (table of past executions with filtering)
- State: React Context API
- Components: Reusable, TypeScript-typed

**Why:** MVP scope reduces initial complexity while covering core use cases.

**Status:** ACTIVE

### 2026-04-01T10:17:00Z: Execution Engine Architecture
**By:** Data (Backend)  
**What:**
- Per-language makefile invocation with build/run targets
- Hardcoded runner module (not generic makefile parsing)
- 60s default timeout, configurable per language
- Capture: stdout, stderr, exit code, wall-clock timing
- REST API: 5 endpoints (/run, /results, /languages, /history, /health)
- Database: SQLite for persistence

**Why:** 
- Hardcoded runners are more reliable and explicit than generic parsing
- Per-language configuration allows for language-specific optimizations
- 60s timeout prevents hung processes
- SQLite stores unlimited execution history

**Status:** ACTIVE

### 2026-04-01T10:23:00Z: Test Strategy – Output Format Chaos & Canary Test
**By:** Chunk (QA)  
**What:**
- Critical Discovery: Different languages produce inconsistent output formats
- Canary Test: power p=3 with expected narcissistic numbers [153, 370, 371, 407]
- 6-Phase Coverage: unit tests → integration → format → performance → edge cases → e2e
- Per-language regex parsers required for result extraction
- Cross-language comparison: results must be identical for same power

**Why:** 
- Output format inconsistency identified as primary risk
- Canary test catches format issues early with minimal test cases
- Regex parsing ensures consistent result interpretation across languages

**Status:** ACTIVE

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction

---

*Last Updated: 2026-04-01T14:24:58Z by Scribe*
