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
