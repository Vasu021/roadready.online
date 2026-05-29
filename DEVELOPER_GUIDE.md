# RoadReady — Developer Guide

Everything you need to go from zero to a running local environment, contribute features, and add new scenarios.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Cloning the repo](#2-cloning-the-repo)
3. [Installing dependencies](#3-installing-dependencies)
4. [Environment variables](#4-environment-variables)
5. [Setting up the local database](#5-setting-up-the-local-database)
6. [Running locally](#6-running-locally)
7. [Project structure](#7-project-structure)
8. [Auth architecture](#8-auth-architecture)
9. [Git workflow](#9-git-workflow)
10. [Adding a new scenario](#10-adding-a-new-scenario)
11. [Common errors and fixes](#11-common-errors-and-fixes)

---

## 1. Prerequisites

| Tool           | Version     | Notes                                                                                 |
| -------------- | ----------- | ------------------------------------------------------------------------------------- |
| **Node.js**    | 20 or later | Includes npm 10+. Download from [nodejs.org](https://nodejs.org).                     |
| **npm**        | 10 or later | Bundled with Node 20. This project uses **npm workspaces** — do not use pnpm or yarn. |
| **PostgreSQL** | 14 or later | Local install or Docker. The API connects via `DATABASE_URL`.                         |
| **Git**        | Any recent  | For cloning and branching.                                                            |

Verify your setup:

```bash
node -v     # v20.x.x or higher
npm -v      # 10.x.x or higher
psql --version
git --version
```

---

## 2. Cloning the repo

```bash
git clone https://github.com/Vasu021/roadready.online.git
cd roadready.online
```

---

## 3. Installing dependencies

Run this **once from the repo root**. npm workspaces installs dependencies for all three packages (`apps/web`, `apps/api`, `packages/shared`) in a single command.

```bash
npm install
```

> Do not run `npm install` inside individual app directories — always install from the root so the workspace symlinks are set up correctly.

---

## 4. Environment variables

Neither file is committed to git. The `.env.example` in `apps/api/` is the reference template.

### `apps/api/.env`

```env
# PostgreSQL connection string
DATABASE_URL=postgresql://roadready_user:roadready_pass@localhost:5432/roadready

# Secret used to sign JWTs — use a long random string in production
JWT_SECRET=your_jwt_secret_here

# Port the Express API listens on
PORT=3001
```

### `apps/web/.env.local`

```env
# Base URL of the running API
VITE_API_URL=http://localhost:3001
```

> The frontend does **not** talk to the database directly. All data flows through the Express API at `VITE_API_URL`.

---

## 5. Setting up the local database

### 5.1 Create the database and user

Connect to PostgreSQL as a superuser and run:

```sql
CREATE USER roadready_user WITH PASSWORD 'roadready_pass';
CREATE DATABASE roadready OWNER roadready_user;
GRANT ALL ON SCHEMA public TO roadready_user;
ALTER USER roadready_user CREATEDB;
```

> `CREATEDB` is required so Prisma can create the shadow database used during `migrate dev`.

### 5.2 Apply the schema

All Prisma commands run from `apps/api/`. Migrations are already committed — apply them with:

```bash
cd apps/api
npx prisma migrate deploy
```

> During active development you can also use `npx prisma migrate dev` to create and apply new migrations interactively.

This applies all committed migrations and creates the following tables:

| Table                       | Description                                                |
| --------------------------- | ---------------------------------------------------------- |
| `users`                     | Registered users (email + bcrypt password hash)            |
| `countries`                 | Country records (DE, FR, etc.) with active flag and HTML facts |
| `scenario_categories`       | Named groups within a country (Basic Skills, Traffic Rules…)|
| `scenarios`                 | Individual scenarios — slug, type (PRACTICE/TEST), order   |
| `questions`                 | MCQ questions linked to a scenario                         |
| `options`                   | Answer options for a question (one marked `is_correct`)    |
| `scenario_attempts`         | One row per scenario run (mode, pass/fail, score, time)    |
| `user_progress`             | Legacy best score/time per user+scenario (kept for compat) |
| `user_scenario_progress`    | Current progress status per user+scenario                  |
| `user_country_access`       | Which countries a user has unlocked                        |
| `test_sessions`             | Full test session (score, grade, pass/fail)                |
| `test_session_answers`      | Per-question answer within a test session                  |
| `_prisma_migrations`        | Prisma migration history                                   |

### 5.3 Seed reference data

After applying migrations, seed Germany and all its scenarios:

```bash
cd apps/api
npm run db:seed
```

This inserts: Germany and France country records (each with HTML `facts`), 3 categories per country, 10 scenarios per country (9 PRACTICE + 1 TEST), and one MCQ question with 4 options per scenario.

### 5.4 Generate the Prisma client

```bash
cd apps/api
npx prisma generate
```

> This also runs automatically via the `postinstall` script whenever you run `npm install` from the root.

### 5.5 Inspect the database (optional)

```bash
cd apps/api
npm run db:studio    # opens Prisma Studio at http://localhost:5555
```

---

## 6. Running locally

From the repo root, one command starts both the frontend and the API in parallel:

```bash
npm run dev
```

| Service           | URL                              | Description                  |
| ----------------- | -------------------------------- | ---------------------------- |
| Frontend (Vite)   | http://localhost:5173            | React app with HMR           |
| Backend (Express) | http://localhost:3001            | REST API                     |
| Health check      | http://localhost:3001/api/health | Returns `{ "status": "ok" }` |

To run them separately:

```bash
npm run dev:web   # frontend only  → http://localhost:5173
npm run dev:api   # backend only   → http://localhost:3001
```

> Vite is pinned to port **5173** with `strictPort: true`. If 5173 is busy the process will error rather than silently stealing the API's port. The API is always on **3001**.

---

## 7. Project structure

```
roadready.online/
├── apps/
│   ├── web/                   # React + Vite frontend (port 5173)
│   │   └── src/
│   │       ├── components/    # UI components (AuthModal, HUD, ResultsScreen)
│   │       ├── pages/         # Route pages: Home, Simulation, Dashboard
│   │       ├── simulation/    # All 3D + physics code
│   │       │   ├── scene/     # Canvas, ground, road, lighting
│   │       │   ├── vehicles/  # Car controller + Rapier physics
│   │       │   └── scenarios/ # Scenario definitions + pass/fail logic
│   │       │       └── rules/ # German traffic rule implementations
│   │       ├── store/         # Zustand stores (gameStore, userStore)
│   │       └── utils/         # api.ts — central fetch client
│   │
│   └── api/                   # Node.js + Express backend (port 3001)
│       ├── src/
│       │   ├── index.ts       # App entry — dotenv/config imported first
│       │   ├── lib/           # prisma.ts (singleton), jwt.ts
│       │   ├── middleware/    # auth.ts — JWT verification
│       │   └── routes/        # auth, countries, scenarios, testSessions, users, progress
│       └── prisma/
│           ├── schema.prisma  # Database schema (Prisma 6.0.0) — 12 models
│           ├── seed.ts        # Reference data (countries, categories, scenarios, questions)
│           └── migrations/    # Applied migration files (committed to git)
│
└── packages/
    └── shared/src/
        └── types.ts           # ScenarioConfig, CarState, etc. (shared by both apps)
```

**Key architectural decisions:**

- `apps/web/src/simulation/scenarios/` holds the **3D game logic** (physics path, stop zones). This runs entirely in the browser. Each file maps to a scenario `slug`.
- **Scenario metadata** (name, description, questions, options) is stored in the database and served by the API — not hardcoded in frontend files.
- The simulation **pauses at key moments** and shows an MCQ question. The frontend submits the selected option to `POST /api/test-sessions/:id/answers`, which returns `{ isCorrect, explanation }`.
- `packages/shared/src/types.ts` defines types used by both apps. Import them as `@roadready/shared`.
- User identity is managed by our own `users` table (bcrypt + JWT). There is no external auth provider.
- Prisma is pinned to **6.0.0** — do not upgrade to 7.x, which requires a driver adapter we don't use.

---

## 8. Auth architecture

Authentication is fully self-contained — no third-party auth service.

### Opening the modal

Call `setShowAuthModal(true, 'login')` to open on the Sign In tab, or `setShowAuthModal(true, 'register')` to open on the Create Account tab. `AuthModal` reads `authModalMode` from the store as its initial `useState` value on mount. The user can always switch tabs manually inside the modal.

### Flow

```
Register/Login
  → POST /api/auth/register  or  POST /api/auth/login
  → API bcrypt-hashes password, creates/verifies User row in DB
  → API returns { token: "<JWT>", user: { id, email } }
  → Frontend stores token in localStorage as "rr_token"

Subsequent requests
  → api.ts reads "rr_token" from localStorage
  → Sets  Authorization: Bearer <token>  on every API request
  → requireAuth middleware calls verifyToken(), sets req.userId + req.userEmail

Session restore
  → App.tsx reads "rr_token" from localStorage on mount
  → Decodes payload with parseJwt() to get { sub, email }
  → Restores userStore without an API call

Logout
  → userStore.logout() removes "rr_token" from localStorage
  → userStore.user set to null
```

### Token details

- Signed with `JWT_SECRET` from `apps/api/.env`
- 7-day expiry
- Payload: `{ sub: userId, email }`

### API endpoints

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| POST   | `/api/auth/register` | — | Create account, returns JWT |
| POST   | `/api/auth/login` | — | Sign in, returns JWT |
| GET    | `/api/users/me` | ✓ | Current user profile + attempt count |
| GET    | `/api/countries` | — | Active countries with categories + scenario counts |
| GET    | `/api/countries/:code/facts` | — | HTML facts string for a country |
| GET    | `/api/countries/:code/scenarios` | — | Scenarios grouped by category for a country |
| POST   | `/api/user-country-access` | ✓ | Record that user accessed a country — body: `{ countryCode }` |
| GET    | `/api/scenarios` | — | All active scenarios (flat list) |
| GET    | `/api/scenarios/:slug` | — | Single scenario by slug |
| GET    | `/api/scenarios/:slug/questions` | — | Questions + shuffled options (`isCorrect` hidden) |
| GET    | `/api/scenarios/progress/:userId/:countryCode` | ✓ | `UserScenarioProgress[]` for all scenarios in a country; creates `NOT_STARTED` rows on first call |
| POST   | `/api/test-sessions` | ✓ | Create a test session for a country |
| POST   | `/api/test-sessions/:id/answers` | ✓ | Submit an answer — returns `{ isCorrect, explanation }` |
| PATCH  | `/api/test-sessions/:id/complete` | ✓ | Finish session — computes score, grade (A/B/C/F), pass/fail |
| GET    | `/api/test-sessions/:id` | ✓ | Full session with per-question answer breakdown |
| GET    | `/api/progress/:userId` | ✓ | All `ScenarioAttempt` rows for a user |
| POST   | `/api/progress` | ✓ | Save attempt + upsert `UserProgress` + `UserScenarioProgress` |

---

## 9. Git workflow

### Branch naming

```
feature/<description>   # New functionality
fix/<description>       # Bug fix
chore/<description>     # Tooling, deps, config
docs/<description>      # Documentation only
```

Examples:

```
feature/roundabout-scenario
fix/car-physics-lateral-drift
chore/downgrade-prisma-6
docs/add-deployment-guide
```

### Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add roundabout scenario with yield detection
fix: correct lateral grip impulse calculation
chore: pin prisma to 6.0.0
docs: update developer guide for custom auth
```

### Before pushing

Run the TypeScript compiler from each app to catch errors before CI does:

```bash
cd apps/api && npx tsc --noEmit
cd apps/web && npx tsc --noEmit
```

**Never commit `.env` files.** The `.env.example` files are safe and should stay committed.

**Always commit migration files.** `apps/api/prisma/migrations/` tracks schema history — do not add it to `.gitignore`.

---

## 10. Adding a new scenario

A scenario has two parts: **database content** (metadata + MCQ questions, served by the API) and a **3D simulation module** (the scripted car path that runs in the browser). Both must be added.

### Step 1 — Seed the scenario into the database

Add an entry to the scenarios array in `apps/api/prisma/seed.ts`, then run the seed:

```typescript
{
  id: "scen-de-your-slug",           // unique stable ID
  slug: "your-slug",                  // kebab-case, unique across all countries
  name: "Your Scenario Name",
  description: "One sentence shown in the scenario list.",
  order: 11,                          // position within this country's scenario list
  type: ScenarioType.PRACTICE,        // or ScenarioType.TEST
  countryId: germany.id,              // or france.id — must match the country object
  categoryId: trafficRulesDe.id,      // e.g. basicSkillsDe | trafficRulesDe | roadSignsDe
  question: {
    text: "Your question text?",
    explanation: "Why the correct answer is correct.",
    options: [
      { text: "Correct answer", correct: true },
      { text: "Wrong answer A", correct: false },
      { text: "Wrong answer B", correct: false },
      { text: "Wrong answer C", correct: false },
    ],
  },
},
```

Then apply:

```bash
cd apps/api
npm run db:seed
```

The seed uses `upsert` — re-running it is safe and won't create duplicates.

### Step 2 — Create the 3D simulation module

Create `apps/web/src/simulation/scenarios/your-slug.ts`. The simulation drives the car along a scripted path; the MCQ is fetched from the API and shown as an overlay when the simulation pauses.

```typescript
import type { ScenarioDef, ScenarioChecker } from "./types";

const PAUSE_ZONE = { cx: 0, cz: -20, hw: 5, hd: 5 }; // where the car pauses for the MCQ

const check: ScenarioChecker = (carState, completed, _elapsed) => {
  const newlyCompleted: string[] = [];
  const [x, , z] = carState.position;

  // Trigger question when car enters the pause zone
  const inZone =
    Math.abs(x - PAUSE_ZONE.cx) <= PAUSE_ZONE.hw &&
    Math.abs(z - PAUSE_ZONE.cz) <= PAUSE_ZONE.hd;

  if (!completed["question-1"] && inZone) {
    newlyCompleted.push("question-1"); // gameStore handles the MCQ pause
  }

  return {
    newlyCompleted,
    passed: completed["question-1"] === true,
    failed: false,
  };
};

const yourScenario: ScenarioDef = {
  config: {
    id: "your-slug",
    name: "Your Scenario Name",
    city: "Aachen",
    country: "Germany",
    difficulty: "easy",
    description: "One sentence shown in the scenario list.",
    timeLimit: 180,
    objectives: [
      { id: "question-1", description: "Answer the MCQ correctly", completed: false },
    ],
  },
  check,
};

export default yourScenario;
```

> **Key physics facts:** Three.js uses a right-handed coordinate system where **−Z is forward** and **Y is up**. The car spawns at `z = 40` and drives toward decreasing Z. A positive Euler Y rotation is a **left turn**. `carState.velocity` is in km/h.

### Step 3 — Register the simulation module

Open `apps/web/src/simulation/scenarios/index.ts` and add your import and registry entry:

```typescript
import yourScenario from "./your-slug"; // add this

const registry: Record<string, ScenarioDef> = {
  "basic-controls": basicControls,
  "your-slug": yourScenario, // add this
};
```

### Step 4 — Add a road mesh (if needed)

Add a scene component in `apps/web/src/simulation/scene/` and conditionally render it in `SimulationScene.tsx` based on `scenarioId`. Reuse the existing `<Ground />` and `<Lighting />` components.

### Step 5 — Add traffic rules (if needed)

Put rule-checking logic in `apps/web/src/simulation/scenarios/rules/yourRule.ts` as a plain function. Call it from your `ScenarioChecker` and set `failed: true` when the rule is violated.

### Checklist

- [ ] `apps/api/prisma/seed.ts` — scenario + question + options added and seed re-run
- [ ] `apps/web/src/simulation/scenarios/your-slug.ts` — 3D checker + config created
- [ ] `apps/web/src/simulation/scenarios/index.ts` — registered in registry
- [ ] `npx tsc --noEmit` passes in both `apps/web` and `apps/api`

---

## 11. Common errors and fixes

### "PrismaClientInitializationError: PrismaClient needs to be constructed with valid options"

**Cause:** Prisma 7 is installed. It requires a driver adapter that this project does not use.

**Fix:** Prisma must be pinned to `6.0.0`. In `apps/api/package.json`:

```json
"@prisma/client": "6.0.0",
"prisma": "6.0.0"
```

Then reinstall and regenerate:

```bash
rm -rf node_modules/.prisma node_modules/@prisma
npm install
cd apps/api && npx prisma generate
```

---

### "permission denied to create database" during `prisma migrate dev`

**Cause:** The database user lacks `CREATEDB` privilege (needed for Prisma's shadow database).

**Fix:** Grant the privilege as a superuser:

```bash
psql -U postgres -c "ALTER USER roadready_user CREATEDB;"
# or if postgres role doesn't exist, use your OS username:
psql -c "ALTER USER roadready_user CREATEDB;"
```

---

### "permission denied for schema public" during `prisma db push` or migrate

**Cause:** PostgreSQL 15+ removed default `CREATE` privilege on the `public` schema.

**Fix:**

```bash
psql -d roadready -c "GRANT ALL ON SCHEMA public TO roadready_user;"
```

---

### "P1001: Can't reach database server"

**Cause:** PostgreSQL isn't running, or `DATABASE_URL` is wrong.

**Fix:**

1. Confirm PostgreSQL is running: `pg_isready`
2. Verify `DATABASE_URL` in `apps/api/.env` matches your local user/password/db name.
3. Test the connection directly: `psql -U roadready_user -d roadready`

---

### Port 5173 already in use

**Cause:** Another Vite process is running (Vite is set to `strictPort: true` — it won't silently move to another port).

**Fix:**

```bash
lsof -ti:5173 | xargs kill
```

---

### Port 3001 already in use

**Cause:** A previous API process is still running.

**Fix:**

```bash
lsof -ti:3001 | xargs kill
```

---

### Routes return 404 after adding new routes to a route file

**Cause:** The tsx process loaded the route file at startup and cached the old module. `tsx watch` sometimes misses file-change events on macOS, so the running server never reloaded.

**Fix:** Kill the stale process and restart the API server:

```bash
lsof -ti:3001 | xargs kill
npm run dev:api
```

---

### "File '../../packages/shared/src/index.ts' is not under rootDir"

**Cause:** `tsconfig.json` in an app has `rootDir` set to `./src` instead of `../../`.

**Fix:** In both `apps/api/tsconfig.json` and `apps/web/tsconfig.json`:

```json
{
  "compilerOptions": {
    "rootDir": "../../",
    "outDir": "./dist"
  },
  "include": ["src", "../../packages/shared/src"]
}
```

---

### Scenario shows as "Coming soon" after I added it

**Cause:** The scenario was added to the database (via seed) but has no matching simulation module in the frontend registry.

**Fix:** Add the import and registry entry in `apps/web/src/simulation/scenarios/index.ts`. The scenario selector determines playability by checking whether a local simulation module exists for the slug — if it is not in the registry, it shows as locked.

---

### TypeScript: "Property 'X' does not exist on type 'PrismaClient'"

**Cause:** The Prisma client is out of sync with `schema.prisma` after a schema change.

**Fix:**

```bash
cd apps/api
npx prisma generate
```

---

### `npm run dev` starts only one app

**Cause:** `concurrently` is not installed at the root.

**Fix:** Run `npm install` from the repo root (not from an app directory) to ensure root devDependencies are installed.
