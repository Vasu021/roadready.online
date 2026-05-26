# RoadReady — Developer Guide

Everything you need to go from zero to a running local environment, contribute features, and add new scenarios.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Cloning the repo](#2-cloning-the-repo)
3. [Installing dependencies](#3-installing-dependencies)
4. [Environment variables](#4-environment-variables)
5. [Setting up Supabase](#5-setting-up-supabase)
6. [Running locally](#6-running-locally)
7. [Project structure](#7-project-structure)
8. [Git workflow](#8-git-workflow)
9. [Adding a new scenario](#9-adding-a-new-scenario)
10. [Common errors and fixes](#10-common-errors-and-fixes)

---

## 1. Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| **Node.js** | 20 or later | Includes npm 10+. Download from [nodejs.org](https://nodejs.org). |
| **npm** | 10 or later | Bundled with Node 20. This project uses **npm workspaces** — do not use pnpm or yarn. |
| **Git** | Any recent | For cloning and branching. |

Verify your setup:

```bash
node -v   # v20.x.x or higher
npm -v    # 10.x.x or higher
git --version
```

---

## 2. Cloning the repo

```bash
git clone https://github.com/<your-org>/roadready.online.git
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

There are two `.env` files to create. Neither is committed to git. Use the `.env.example` template in `apps/api/` as a reference.

### `apps/api/.env`

```env
# PostgreSQL connection string — use the Session Pooler URL from Supabase
# Format: postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?schema=public&sslmode=require
# IMPORTANT: URL-encode any special characters in the password (@ → %40, # → %23, ! → %21, etc.)
DATABASE_URL=

# Direct (non-pooled) connection — required by Prisma for migrations and db push
# Format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres?schema=public&sslmode=require
DIRECT_URL=

# Secret used to sign JWTs for custom auth routes — pick any long random string
JWT_SECRET=

# Port the Express API listens on locally
PORT=3001

# Supabase project URL — found in Supabase → Settings → API
SUPABASE_URL=

# Supabase service-role key — found in Supabase → Settings → API → service_role
# This key has admin access; never expose it on the frontend
SUPABASE_SERVICE_KEY=
```

### `apps/web/.env.local`

```env
# Base URL of the running API (change port if you edited PORT above)
VITE_API_URL=http://localhost:3001

# Supabase project URL — same value as SUPABASE_URL in apps/api/.env
VITE_SUPABASE_URL=

# Supabase anonymous / publishable key — found in Supabase → Settings → API → anon / public
# Safe to expose in client-side code
VITE_SUPABASE_ANON_KEY=
```

> **Password encoding:** If your Supabase database password contains special characters (e.g. `@`, `#`, `!`), they must be percent-encoded in the URL. The most common case is `@` → `%40`. For example, the password `Pass@Word#1` becomes `Pass%40Word%231` in the connection string.

---

## 5. Setting up Supabase

### 5.1 Create a project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project** and fill in a name and database password. Save the password — you will need it for `DATABASE_URL` and `DIRECT_URL`.
3. Choose the region closest to your users.

### 5.2 Collect credentials

In your Supabase dashboard go to **Settings → API**:

| Credential | Where to find it | Which `.env` variable |
|---|---|---|
| Project URL | "Project URL" field | `SUPABASE_URL`, `VITE_SUPABASE_URL` |
| Anon / public key | "Project API keys → anon public" | `VITE_SUPABASE_ANON_KEY` |
| Service-role key | "Project API keys → service_role" | `SUPABASE_SERVICE_KEY` |

For the database connection strings, go to **Settings → Database → Connection string**:

- **Session Pooler** (port 5432) → `DATABASE_URL`
- **Direct connection** (host `db.[project-ref].supabase.co`, port 5432) → `DIRECT_URL`

The direct connection URL is not shown in one place; construct it as:

```
postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres?schema=public&sslmode=require
```

### 5.3 Apply the database schema

All database work runs from the `apps/api` directory:

```bash
cd apps/api
```

**Option A — `db push` (recommended for development)**

Pushes the current schema to the database without creating migration files. Fast for iteration.

```bash
npx prisma db push
```

**Option B — `migrate dev` (recommended once schema is stable)**

Creates a versioned migration file in `prisma/migrations/` and applies it. Use this when you want a tracked history of schema changes.

```bash
npx prisma migrate dev --name init
```

After running either command, the `scenario_attempts` table will exist in your Supabase database.

### 5.4 Enable email auth in Supabase

1. In the Supabase dashboard go to **Authentication → Providers → Email**.
2. Make sure **Enable Email provider** is on.
3. For local development, disable **Confirm email** so users can sign in immediately without checking their inbox.

### 5.5 Generate the Prisma client

Run this any time you change `prisma/schema.prisma`:

```bash
cd apps/api
npx prisma generate
```

> `prisma generate` also runs automatically via the `postinstall` script when you run `npm install`.

---

## 6. Running locally

From the repo root, one command starts both the frontend and the API in parallel:

```bash
npm run dev
```

| Service | URL | Description |
|---------|-----|-------------|
| Frontend (Vite) | http://localhost:5173 | React app with HMR |
| Backend (Express) | http://localhost:3001 | REST API |
| Health check | http://localhost:3001/api/health | Returns `{ "status": "ok" }` |

To run them separately:

```bash
npm run dev:web   # frontend only
npm run dev:api   # backend only
```

To open Prisma Studio (a database GUI):

```bash
cd apps/api
npm run db:studio
```

---

## 7. Project structure

The full structure is documented in [`CLAUDE.md`](./CLAUDE.md). Here is a quick orientation:

```
roadready.online/
├── apps/
│   ├── web/                   # React + Vite frontend
│   │   └── src/
│   │       ├── components/    # UI components (HUD, modals, results)
│   │       ├── pages/         # Route pages: Home, Simulation, Dashboard
│   │       ├── simulation/    # All 3D + physics code
│   │       │   ├── scene/     # Canvas, ground, road, lighting
│   │       │   ├── vehicles/  # Car controller + Rapier physics
│   │       │   └── scenarios/ # Scenario definitions + pass/fail logic
│   │       ├── store/         # Zustand stores (gameStore, userStore)
│   │       ├── lib/           # External client setup (supabase.ts)
│   │       └── utils/         # api.ts — central fetch client
│   │
│   └── api/                   # Node.js + Express backend
│       ├── src/
│       │   ├── data/          # Static data (scenarios.ts)
│       │   ├── lib/           # prisma.ts, supabaseAdmin.ts
│       │   ├── middleware/    # auth.ts — JWT verification
│       │   └── routes/        # scenarios, users, progress, auth
│       └── prisma/
│           └── schema.prisma  # Database schema
│
└── packages/
    └── shared/src/
        └── types.ts           # ScenarioConfig, CarState, etc. (shared by both apps)
```

**Key architectural decisions:**

- `apps/web/src/simulation/scenarios/` holds the **game logic** (physics checkers, stop zones). This code never reaches the server.
- `apps/api/src/data/scenarios.ts` holds the **metadata** served to the frontend scenario list. These two must stay in sync when you add a new scenario.
- `packages/shared/src/types.ts` defines types used in both. Import from `@roadready/shared`.
- Supabase Auth owns user identity — there is no `users` table in Prisma. The `scenario_attempts` table stores the Supabase UUID as a plain string.

---

## 8. Git workflow

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
chore/upgrade-prisma-v8
docs/add-deployment-guide
```

### Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add roundabout scenario with yield detection
fix: URL-encode password in DATABASE_URL
chore: upgrade @supabase/supabase-js to v3
docs: add environment variable descriptions
```

### Before pushing

Always run the TypeScript compiler from each app directory before pushing to `main`:

```bash
cd apps/api  && npx tsc --noEmit
cd apps/web  && npx tsc --noEmit
```

Never commit `.env` files. Check `.gitignore` is correct with `git status` before staging.

---

## 9. Adding a new scenario

A scenario has two parts: **metadata** (served by the API, shown in the menu) and **game logic** (runs in the browser, never sent to the server). Both must be added.

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
import type { ScenarioDef, ScenarioChecker } from './types'

// Optional: define a stop zone the car must enter
const STOP_ZONE = { cx: 0, cz: -30, hw: 6, hd: 6 }

const check: ScenarioChecker = (carState, completed, _elapsed) => {
  const newlyCompleted: string[] = []
  const done = (id: string) => completed[id] || newlyCompleted.includes(id)

  const [x, , z] = carState.position
  const speed = carState.velocity   // km/h
  const yaw = carState.rotation[1]  // radians, positive = left turn

  // Implement your pass conditions here.
  // Push objective IDs into newlyCompleted when their condition is met.
  if (!completed['obj-one'] && /* your condition */ z <= -20) {
    newlyCompleted.push('obj-one')
  }

  const inZone =
    Math.abs(x - STOP_ZONE.cx) <= STOP_ZONE.hw &&
    Math.abs(z - STOP_ZONE.cz) <= STOP_ZONE.hd
  if (done('obj-one') && !completed['obj-two'] && inZone && speed < 3) {
    newlyCompleted.push('obj-two')
  }

  return {
    newlyCompleted,
    passed: done('obj-one') && done('obj-two'),
    failed: false,   // set true if the user violated a traffic rule
  }
}

const yourScenario: ScenarioDef = {
  config: {
    id: 'your-scenario-id',       // must match Step 1
    name: 'Your Scenario Name',
    city: 'Aachen',
    country: 'Germany',
    difficulty: 'easy',
    description: 'One sentence shown in the scenario list.',
    timeLimit: 180,
    objectives: [
      { id: 'obj-one', description: 'First thing the user must do', completed: false },
      { id: 'obj-two', description: 'Second thing', completed: false },
    ],
  },
  check,
  stopZone: STOP_ZONE,  // omit this field if your scenario has no stop zone
}

export default yourScenario
```

> **Key physics facts:** Three.js uses a right-handed coordinate system where **−Z is forward**, **Y is up**. The car spawns at `z = 40` and drives toward `z = 0, -10, -20…`. A positive Euler Y rotation is a **left turn** (counter-clockwise viewed from above). `carState.velocity` is in km/h.

### Step 3 — Register the scenario

Open `apps/web/src/simulation/scenarios/index.ts` and add your import and registry entry:

```typescript
import basicControls from './basicControls'
import yourScenario from './yourScenarioId'   // add this

const registry: Record<string, ScenarioDef> = {
  'basic-controls': basicControls,
  'your-scenario-id': yourScenario,           // add this
}
```

Once registered, the scenario is immediately **playable** — `Home.tsx` filters the API response against the registry to decide what shows as locked vs available.

### Step 4 — Add a road mesh (if needed)

If your scenario takes place in a different environment, add a new scene component in `apps/web/src/simulation/scene/` and conditionally render it in `SimulationScene.tsx` based on `scenarioId`. Reuse the existing `<Ground />` and `<Lighting />` components.

### Step 5 — Add traffic rules (if needed)

Put rule-checking logic in `apps/web/src/simulation/scenarios/rules/yourRule.ts` as a plain function. Call it from your `ScenarioChecker` and set `failed: true` when the rule is violated.

### Checklist

- [ ] `apps/api/src/data/scenarios.ts` — metadata added
- [ ] `apps/web/src/simulation/scenarios/yourScenarioId.ts` — checker + config
- [ ] `apps/web/src/simulation/scenarios/index.ts` — registered in registry
- [ ] TypeScript compiles cleanly: `npx tsc --noEmit` in both `apps/web` and `apps/api`

---

## 10. Common errors and fixes

### "The datasource property 'url' is no longer supported in schema files"

**Cause:** Prisma 7 removed the `url` field from `schema.prisma`. You may see this if you copied a Prisma 6 schema.

**Fix:** Move the URL to `prisma.config.ts`. The file already exists in `apps/api/` — do not add a `url` field back to `schema.prisma`.

---

### "The datasource.url property is required in your Prisma config file"

**Cause:** `DIRECT_URL` is not set in `apps/api/.env`, so `prisma.config.ts` receives `undefined`.

**Fix:** Add `DIRECT_URL=postgresql://...` to `apps/api/.env`. The direct connection URL uses the host `db.[project-ref].supabase.co` (not the pooler host).

---

### "P1001: Can't reach database server" or connection timeout

**Cause:** Either the connection string is wrong, the password contains un-encoded special characters, or SSL is missing.

**Fix:**
1. URL-encode special characters in the password (`@` → `%40`, `#` → `%23`, `!` → `%21`).
2. Append `?schema=public&sslmode=require` to both `DATABASE_URL` and `DIRECT_URL`.
3. Confirm the Supabase project is not paused (free-tier projects pause after 1 week of inactivity).

---

### "Cannot resolve environment variable: DIRECT_URL"

**Cause:** Running `prisma db push` from the repo root instead of `apps/api/`, so `prisma.config.ts`'s dotenv path resolves incorrectly.

**Fix:** Always run Prisma CLI commands from `apps/api/`:

```bash
cd apps/api
npx prisma db push
```

---

### "File '../../packages/shared/src/index.ts' is not under rootDir"

**Cause:** `tsconfig.json` in an app has `rootDir` set to `./src` instead of `../../`, preventing cross-package imports.

**Fix:** In `apps/api/tsconfig.json` and `apps/web/tsconfig.json`, ensure:

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

### Port 3001 already in use

**Cause:** A previous API process is still running.

**Fix:**

```bash
# Find and kill the process on port 3001
lsof -ti:3001 | xargs kill
```

Or change `PORT=3002` in `apps/api/.env` and update `VITE_API_URL=http://localhost:3002` in `apps/web/.env.local`.

---

### Scenario shows as "Coming soon" (locked) after I added it

**Cause:** The scenario config was added to `apps/api/src/data/scenarios.ts` but not registered in the frontend registry.

**Fix:** Add the import and registry entry in `apps/web/src/simulation/scenarios/index.ts`. The `Home` page determines playability by checking whether a local simulation definition exists — if it is not in the registry, it shows as locked.

---

### Supabase auth: "Email not confirmed"

**Cause:** Supabase requires email confirmation by default.

**Fix for local development:** In the Supabase dashboard go to **Authentication → Providers → Email** and disable **Confirm email**. Do not disable this in production.

---

### TypeScript: "Property 'X' does not exist on type 'PrismaClient'"

**Cause:** The Prisma client is out of sync with `schema.prisma` — usually after a schema change without regenerating.

**Fix:**

```bash
cd apps/api
npx prisma generate
```

---

### `npm run dev` starts only one app

**Cause:** `concurrently` is not installed at the root, or the root `package.json` scripts are wrong.

**Fix:** Run `npm install` from the repo root (not from an app directory) to ensure root devDependencies like `concurrently` are installed.
