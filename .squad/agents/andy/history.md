# Project Context

- **Owner:** mark harris
- **Project:** Challenge — coding katas compared across multiple languages. Web app to visualize and compare algorithm behavior across implementations.
- **Stack:** Multi-language source (C#, Java, Ruby, others). New web frontend TBD.
- **Created:** 2026-04-01

## Learnings

### UI Plan Complete (2026-04-xx)
- **Project scope:** 13 language implementations, comparison/benchmarking focus
- **Key insight:** Comparison is the core use case; single-execution only is incomplete
- **Decided on React + Recharts:** Balances simplicity with charting power
- **Three critical charts:** Result count vs. power, Execution time benchmarking, Time-series stability
- **Navigation model:** Three main views (Dashboard, Charts, History) connected by intent flows
- **Component strategy:** Lean, reusable parts; avoid monolithic containers
- **Data flow:** Execution → Results → Cache for history → Multi-chart overlay
- **UX priorities:** Minimize clicks to comparison, mobile-responsive, smooth interactions
- **Dependency:** Waiting on backend API spec from Data team; needs database decision (persistence layer)

### Frontend Scaffold Complete (2026-04-01)
- **Location:** `/webapp/frontend/` — Vite + React 18 + TypeScript + Tailwind CSS
- **Pages:** Dashboard (run configuration + results visualization), History (table view + time-series comparison chart)
- **API Client:** Axios-based with 90s timeout, 6 typed endpoints (languages, run, batch, runs, batch-runs, run by ID)
- **State Management:** TanStack Query for server state, local useState for transient run results
- **Charts:** Recharts BarChart (execution time per language), LineChart (time-series performance comparison)
- **Components:** RunResultCard (collapsible run detail with stdout/stderr), language selector with "Select All" toggle
- **Dark Theme:** bg-gray-950 base, cards at bg-gray-900, blue-600 primary actions
- **Status Colors:** Green (success), yellow (timeout), red (error) — applied to badges and chart bars
- **UX Decisions:** 
  - Batch runs execute serially server-side, client shows single loading state
  - History filters by language/power, expandable rows show full execution logs
  - Compare tab allows multi-language selection for cleaner line chart overlay
- **Next:** Needs backend API implementation and npm install to test build

## Phase 1 Build Complete (2026-04-01)

**Status:** ✅ READY FOR INTEGRATION

**Team Updates:**
- Data (Backend): Full implementation complete with 6 endpoints, 14 language runners, canary values verified
- Chunk (Tests): 138 test suite ready, validates all API endpoints and parser behavior
- Mikey (Architecture): Confirmed Node.js/Express + React stack

**Integration Next Steps:**
1. `cd webapp/backend && npm run dev` (start backend on :3001)
2. `cd webapp/frontend && npm run dev` (start Vite on :5173, auto-proxies /api to backend)
3. Verify Dashboard loads language list
4. Test single-language run execution
5. Test batch multi-language execution
6. Verify History page displays past runs
7. Test Compare tab with line chart

**Backend API Documentation:**
- Full contract at `.squad/decisions/decisions.md`
- All 6 endpoints specified with request/response shapes
- CORS enabled, Vite proxy configured
- Error codes documented (400, 404, 500, timeout)

**Orchestration Log:**
- `.squad/orchestration-log/2026-04-01T14:46:30Z-andy.md`

**Session Summary:**
- `.squad/log/2026-04-01T14:46:30Z-phase1-build.md`

### UI Fixes — Power Dropdown + Configurable Timeout (2026-04-01)
- **Power input replaced with `<select>`**: Options 2–9 only; eliminates invalid empty-state from free-text number input
- **Timeout field added**: `useState(90)` default, number input min=1, placed inline with Power using `flex gap-6` row layout
- **Axios client timeout bumped to 5 min**: Was 90s hardcoded; now relies on backend execution timeout. Per-request timeout passed as `timeout` (seconds) in the request body
- **Backend changes**:
  - `executor.js`: `execute(language, power, timeoutMs)` — optional third arg, falls back to `TIMEOUT_MS` env default
  - `run.js`: Both `/run` and `/batch` extract `timeout` (seconds) from body, convert to ms, pass to `execute()`
- **Key file paths**:
  - `webapp/frontend/src/pages/Dashboard.tsx` — UI for power/timeout inputs
  - `webapp/frontend/src/api/client.ts` — `runBatch` and `runLanguage` accept optional `timeout` param
  - `webapp/backend/src/routes/run.js` — request handling for both `/run` and `/batch`
  - `webapp/backend/src/engine/executor.js` — execution engine, timeout plumbing

### Bar Chart Labels — Execution Time on Bars (2026-04-01)
- **Feature:** Added execution time labels directly on/above bars in Dashboard's BarChart
- **Label logic:** `success` → formatted time (e.g. "123ms" or "1.2s"); `timeout`/`error` → status word
- **Positioning:** `height < 24px` = short bar → label rendered above in gray (`#9ca3af`); tall bar → label inside near top, near-white (`rgba(255,255,255,0.9)`)
- **Custom renderer:** Used `LabelList` with `content={renderBarLabel}` (custom SVG `<text>`) rather than built-in position props — gives full control over y-position and color based on bar height
- **`formatTime` helper:** `>= 1000ms` → `1.2s`, otherwise `123ms` — rounded to keep labels compact
- **`chartData.label` field:** Pre-computed in the data map so `LabelList` just uses `dataKey="label"`
- **TypeScript:** Clean compile, no errors

### Bar Chart Labels Added (2026-04-xx)
- **Approach:** Added a computed `label` field to `chartData`; `<LabelList dataKey="label" position="top">` renders it above each bar
- **Format:** `formatTime()` helper — `<1000ms` shows `"123ms"`, `>=1000ms` shows `"1.2s"`; error/timeout bars show their status string instead
- **Positioning:** `position="top"` ensures labels are always visible, even for near-zero bars (error cases with effectively no height)
- **Styling:** `fill="#e5e7eb"` (gray-200) + `fontSize={12}` — readable on dark background without clutter

### Cancel Button Added to Dashboard (2026-04-01)
- **Feature:** Cancel button appears next to Run button while `isRunning` is true
- **API:** `cancelRun()` added to `client.ts` — `POST /api/cancel` → `{ cancelled: boolean }` via axios (consistent with existing run calls)
- **State:** `cancelStatus` state holds `"Run cancelled"` or `"Could not cancel"`, auto-clears after 4s via `globalThis.setTimeout`
- **UI:** Cancel button is `bg-red-700 hover:bg-red-600` — destructive/red, consistent with dark theme; uses `flex items-center gap-3` row with Run button
- **Success flow:** `setIsRunning(false)` + yellow "Run cancelled" banner
- **Failure flow:** Red "Could not cancel" banner (does not change `isRunning`, lets run complete naturally)
- **Key files:** `webapp/frontend/src/pages/Dashboard.tsx`, `webapp/frontend/src/api/client.ts`
- **Build:** TypeScript + Vite build passes clean ✅
