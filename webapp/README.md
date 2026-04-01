# Challenge Comparison Webapp

Web application to execute and compare algorithm implementations across 14 programming languages.

## Project Structure

```
webapp/
  backend/          ✅ Complete — Express API + execution engine
  frontend/         🚧 In progress — React + Vite UI (Andy)
  data/             📊 SQLite database (auto-created)
```

## Quick Start

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on **http://localhost:3001**

### Frontend

```bash
cd frontend
# To be scaffolded by Andy
```

Frontend will run on **http://localhost:5173** (Vite default)

## Challenge

**Challenge 3: Sum of Digits to Power**

Find narcissistic numbers where each digit raised to the power of the number's length equals the number itself.

Example (power=3): 153 = 1³ + 5³ + 3³

## Supported Languages

14 languages total:
- **Interpreted:** Python, Ruby, Node.js, Elixir
- **Compiled:** Go, C, C++, Rust, Swift
- **VM/Runtime:** Java, C#, F#, Haskell
- **Mix Project:** Elixir Mix

## Features

- ✅ Execute any language for any power (1-20)
- ✅ Batch execution across multiple languages
- ✅ Persistent run history with SQLite
- ✅ Output parsing handles 14 different formats
- ✅ 60-second timeout protection
- ✅ Git SHA tracking for reproducibility
- 🚧 Recharts visualization (coming soon)
- 🚧 React UI (coming soon)

## API Endpoints

- `POST /api/run` — Execute single language
- `POST /api/batch` — Execute multiple languages
- `GET /api/runs` — List execution history
- `GET /api/languages` — List available languages

See `backend/README.md` for full API documentation.

## Architecture

**Backend (Data):**
- Express.js HTTP server
- SQLite (better-sqlite3) for persistence
- child_process.spawn for safe execution
- Per-language runners and parsers

**Frontend (Andy):**
- React + Vite for UI
- Recharts for comparison charts
- Context API for state
- TypeScript for type safety

## Team

- **Data** (Backend Dev) — Execution engine, API, database ✅
- **Andy** (UI Lead) — React frontend 🚧
- **Chunk** (QA) — Test harness, validation 📋
- **Mikey** (Lead Architect) — Tech stack, architecture 🎯

---

Built for challenge comparison and language benchmarking.
