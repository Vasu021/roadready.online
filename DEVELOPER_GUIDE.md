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

All Prisma commands run from `apps/api/`:

```bash
cd apps/api
npx prisma migrate dev --name init_tables
```

This creates the migration file in `prisma/migrations/` and applies it to your local database. The following tables will be created:

| Table                | Description                                       |
| -------------------- | ------------------------------------------------- |
| `users`              | Registered users (email + bcrypt password hash)   |
| `scenario_attempts`  | One row per scenario run (pass/fail, score, time) |
| `user_progress`      | Best score/time per user+scenario, attempt counts |
| `_prisma_migrations` | Prisma migration history                          |

### 5.3 Generate the Prisma client

```bash
cd apps/api
npx prisma generate
```

> This also runs automatically via the `postinstall` script whenever you run `npm install` from the root.

### 5.4 Inspect the database (optional)

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
│       │   ├── data/          # Static data (scenarios.ts)
│       │   ├── lib/           # prisma.ts (singleton), jwt.ts
│       │   ├── middleware/    # auth.ts — JWT verification
│       │   └── routes/        # auth, scenarios, users, progress
│       └── prisma/
│           ├── schema.prisma  # Database schema (Prisma 6.0.0)
│           └── migrations/    # Applied migration files (committed to git)
│
└── packages/
    └── shared/src/
        └── types.ts           # ScenarioConfig, CarState, etc. (shared by both apps)
```

**Key architectural decisions:**

- `apps/web/src/simulation/scenarios/` holds the **game logic** (physics checkers, stop zones). This code runs entirely in the browser — it is never sent to the server.
- `apps/api/src/data/scenarios.ts` holds the **metadata** served to the frontend scenario list. These two must stay in sync when you add a new scenario.
- `packages/shared/src/types.ts` defines types used by both apps. Import them as `@roadready/shared`.
- User identity is managed by our own `users` table (bcrypt + JWT). There is no external auth provider.
- Prisma is pinned to **6.0.0** — do not upgrade to 7.x, which requires a driver adapter we don't use.

---

## 8. Auth architecture

Authentication is fully self-contained — no third-party auth service.

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

| Method | Path                    | Auth | Description                          |
| ------ | ----------------------- | ---- | ------------------------------------ |
| POST   | `/api/auth/register`    | —    | Create account, returns JWT          |
| POST   | `/api/auth/login`       | —    | Sign in, returns JWT                 |
| GET    | `/api/users/me`         | ✓    | Current user profile + attempt count |
| GET    | `/api/scenarios`        | —    | List all scenario configs            |
| GET    | `/api/scenarios/:id`    | —    | Single scenario config               |
| GET    | `/api/progress/:userId` | ✓    | All attempts for a user              |
| POST   | `/api/progress`         | ✓    | Save attempt + upsert best progress  |

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

A scenario has two parts: **metadata** (served by the API, shown in the menu) and **game logic** (runs in the browser). Both must be added.

### Step 1 — Add metadata to the API

Open `apps/api/src/data/scenarios.ts` and add an entry to the `SCENARIOS` array:

```typescript
{
  id: 'your-scenario-id',         // kebab-case, must be unique
  name: 'Your Scenario Name',
  city: 'Aachen',
  country: 'Germany',
  difficulty: 'easy',             // 'beginner' | 'easy' | 'medium' | 'hard'
  description: 'One sentence shown in the scenario list.',
  timeLimit: 180,                 // seconds
  objectives: [
    { id: 'obj-one', description: 'First thing the user must do', completed: false },
    { id: 'obj-two', description: 'Second thing', completed: false },
  ],
},
```

### Step 2 — Create the game logic file

Create `apps/web/src/simulation/scenarios/yourScenarioId.ts`:

```typescript
import type { ScenarioDef, ScenarioChecker } from "./types";

const STOP_ZONE = { cx: 0, cz: -30, hw: 6, hd: 6 };

const check: ScenarioChecker = (carState, completed, _elapsed) => {
  const newlyCompleted: string[] = [];
  const done = (id: string) => completed[id] || newlyCompleted.includes(id);

  const [x, , z] = carState.position;
  const speed = carState.velocity; // km/h
  const yaw = carState.rotation[1]; // radians, positive = left turn

  if (!completed["obj-one"] && z <= -20) {
    newlyCompleted.push("obj-one");
  }

  const inZone =
    Math.abs(x - STOP_ZONE.cx) <= STOP_ZONE.hw &&
    Math.abs(z - STOP_ZONE.cz) <= STOP_ZONE.hd;
  if (done("obj-one") && !completed["obj-two"] && inZone && speed < 3) {
    newlyCompleted.push("obj-two");
  }

  return {
    newlyCompleted,
    passed: done("obj-one") && done("obj-two"),
    failed: false,
  };
};

const yourScenario: ScenarioDef = {
  config: {
    id: "your-scenario-id",
    name: "Your Scenario Name",
    city: "Aachen",
    country: "Germany",
    difficulty: "easy",
    description: "One sentence shown in the scenario list.",
    timeLimit: 180,
    objectives: [
      {
        id: "obj-one",
        description: "First thing the user must do",
        completed: false,
      },
      { id: "obj-two", description: "Second thing", completed: false },
    ],
  },
  check,
  stopZone: STOP_ZONE,
};

export default yourScenario;
```

> **Key physics facts:** Three.js uses a right-handed coordinate system where **−Z is forward** and **Y is up**. The car spawns at `z = 40` and drives toward decreasing Z. A positive Euler Y rotation is a **left turn**. `carState.velocity` is in km/h.

### Step 3 — Register the scenario

Open `apps/web/src/simulation/scenarios/index.ts` and add your import and registry entry:

```typescript
import basicControls from "./basicControls";
import yourScenario from "./yourScenarioId"; // add this

const registry: Record<string, ScenarioDef> = {
  "basic-controls": basicControls,
  "your-scenario-id": yourScenario, // add this
};
```

Once registered the scenario is immediately **playable** — `Home.tsx` filters the API response against the registry to decide what shows as locked vs available.

### Step 4 — Add a road mesh (if needed)

Add a new scene component in `apps/web/src/simulation/scene/` and conditionally render it in `SimulationScene.tsx` based on `scenarioId`. Reuse the existing `<Ground />` and `<Lighting />` components.

### Step 5 — Add traffic rules (if needed)

Put rule-checking logic in `apps/web/src/simulation/scenarios/rules/yourRule.ts` as a plain function. Call it from your `ScenarioChecker` and set `failed: true` when the rule is violated.

### Checklist

- [ ] `apps/api/src/data/scenarios.ts` — metadata added
- [ ] `apps/web/src/simulation/scenarios/yourScenarioId.ts` — checker + config
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

**Cause:** Metadata added to `apps/api/src/data/scenarios.ts` but not registered in the frontend registry.

**Fix:** Add the import and registry entry in `apps/web/src/simulation/scenarios/index.ts`. `Home.tsx` determines playability by checking whether a local simulation definition exists — if it is not in the registry, it shows as locked.

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
