# RoadReady — Claude Agent Instructions

## Project Overview

RoadReady (roadready.online) is a browser-based 3D driving simulation platform.
Users practice driving in realistic city environments with country-specific traffic rules.
MVP: Aachen, Germany. Expanding to more cities and countries over time.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite (port 5173)
- **3D Engine:** Three.js via React Three Fiber (R3F) + @react-three/drei
- **Physics:** Rapier.js (@dimforge/rapier3d-compat)
- **State:** Zustand
- **Styling:** Tailwind CSS
- **Backend:** Node.js + Express + TypeScript (port 3001)
- **ORM:** Prisma **6.0.0** — do NOT upgrade to 7.x (requires driver adapter we don't use)
- **Database:** PostgreSQL — local during dev, swap `DATABASE_URL` for production (AWS RDS, Google Cloud SQL, etc.)
- **Auth:** Custom JWT (bcryptjs + jsonwebtoken) — token stored in `localStorage` as `rr_token`
- **Payments:** Stripe (later)
- **Hosting:** Vercel (frontend), Railway (backend)

## Monorepo Structure

```
roadready.online/
├── apps/
│   ├── web/          # React frontend (Vite, port 5173)
│   └── api/          # Express backend (port 3001)
├── packages/
│   └── shared/       # Shared TypeScript types
├── CLAUDE.md
├── TASKS.md
├── README.md
├── .gitignore
└── package.json      # Root workspace package.json
```

## Frontend Structure (apps/web/src/)

```
src/
├── components/       # Reusable UI components (AuthModal, HUD, ResultsScreen)
├── pages/            # Route-level pages (Home, Simulation, Dashboard)
├── simulation/       # All 3D simulation code
│   ├── scene/        # Main Canvas scene setup
│   ├── vehicles/     # Car model + physics controller
│   ├── roads/        # Road mesh generation
│   ├── traffic/      # AI traffic, traffic lights
│   └── scenarios/    # Individual scenario logic + pass/fail
│       └── rules/    # German traffic rule implementations
├── store/            # Zustand stores (gameStore, userStore)
├── hooks/            # Custom React hooks
├── types/            # TypeScript types (import from packages/shared too)
└── utils/            # Helper functions (api.ts is the central API client)
```

## Backend Structure (apps/api/src/)

```
src/
├── index.ts          # Express entry — imports dotenv/config FIRST
├── lib/
│   ├── prisma.ts     # PrismaClient singleton (globalThis pattern)
│   └── jwt.ts        # signToken / verifyToken (7-day expiry)
├── middleware/
│   └── auth.ts       # requireAuth — verifies Bearer JWT, sets req.userId + req.userEmail
└── routes/
    ├── auth.ts       # POST /api/auth/register, POST /api/auth/login
    ├── scenarios.ts  # GET /api/scenarios, GET /api/scenarios/:id
    ├── users.ts      # GET /api/users/me
    └── progress.ts   # GET /api/progress/:userId, POST /api/progress
```

## Database Schema (Prisma 6.0.0)

Three tables in PostgreSQL — `users`, `scenario_attempts`, `user_progress`.

```
User            → users
  id, email (unique), password (bcrypt), name?, createdAt, updatedAt

ScenarioAttempt → scenario_attempts
  id, userId (FK→users cascade), scenarioId, passed, score, timeSeconds, completedAt

UserProgress    → user_progress
  id, userId (FK→users cascade), scenarioId, bestScore, bestTimeSeconds?,
  attemptCount, passCount, lastAttemptAt?
  UNIQUE(userId, scenarioId)
```

`POST /api/progress` runs in a transaction: creates `ScenarioAttempt` + upserts `UserProgress`.

**Prisma notes:**

- Schema file: `apps/api/prisma/schema.prisma` — datasource has `url = env("DATABASE_URL")`
- No `prisma.config.ts` — it was removed; Prisma 6 reads `DATABASE_URL` from env automatically
- `src/lib/prisma.ts` uses globalThis singleton to avoid multiple connections during hot reload
- Migrations live in `apps/api/prisma/migrations/` and are committed to git

## Auth Architecture

- **Register:** `POST /api/auth/register` → bcrypt hash (cost 12) → create `User` → return `{ token, user }`
- **Login:** `POST /api/auth/login` → find user → bcrypt compare → return `{ token, user }`
- **Token storage:** JWT stored in `localStorage` as `rr_token`; cleared on logout
- **Session restore:** `App.tsx` decodes the token from localStorage on mount via `parseJwt()` and restores `userStore`
- **API requests:** `apps/web/src/utils/api.ts` reads `rr_token` from localStorage and sets `Authorization: Bearer <token>` on all requests
- **Backend guard:** `requireAuth` middleware calls `verifyToken()` from `src/lib/jwt.ts` — sets `req.userId` and `req.userEmail`

## Key Conventions

- All code in **TypeScript** — no plain JS files
- Use **functional components** with hooks only — no class components
- Use **Zustand** for global state — no Redux, no Context API for state
- Use **React Three Fiber** for all 3D — never raw Three.js imperative code in components
- CSS via **Tailwind** utility classes — no CSS modules, no styled-components
- All API calls go through `src/utils/api.ts` — never call `fetch` directly in components
- All environment variables prefixed with `VITE_` on frontend
- Backend routes follow REST conventions: `GET /api/scenarios`, `POST /api/auth/login`, etc.

## Naming Conventions

- Components: PascalCase (`CarController.tsx`, `AuthModal.tsx`)
- Hooks: camelCase with `use` prefix (`useCarPhysics.ts`, `useScenario.ts`)
- Stores: camelCase with `Store` suffix (`gameStore.ts`, `userStore.ts`)
- Utils: camelCase (`formatScore.ts`, `osmParser.ts`)
- Types/Interfaces: PascalCase with descriptive names (`ScenarioConfig`, `CarState`)

## Current MVP Scope (Aachen, Germany)

1. A 3D scene with a basic road environment (Aachen-inspired)
2. A drivable car with keyboard controls (WASD or arrow keys)
3. A scenario selection screen
4. At least 3 scenarios: Basic Controls, Intersection (Rechts vor Links), Roundabout
5. Pass/fail detection with feedback
6. User auth (sign up / login) — ✅ working
7. Progress saved to database — ✅ working

## Scenarios Architecture

Each scenario is a self-contained module:

```typescript
interface ScenarioConfig {
  id: string;
  name: string;
  city: string;
  country: string;
  difficulty: "beginner" | "easy" | "medium" | "hard";
  description: string;
  objectives: Objective[];
  timeLimit: number; // seconds
}

interface Objective {
  id: string;
  description: string;
  completed: boolean;
}
```

## Car Controls

- **W / Arrow Up** — Accelerate
- **S / Arrow Down** — Brake / Reverse
- **A / Arrow Left** — Steer left
- **D / Arrow Right** — Steer right
- **Space** — Handbrake
- **R** — Reset car position

## German Traffic Rules to Enforce (MVP)

- Rechts vor Links (right before left at unmarked intersections)
- Speed limits: 50 km/h in city, 100 km/h on country roads, unlimited/130 km/h recommended on Autobahn
- Stop at red lights
- Yield at yield signs (Vorfahrt gewähren)
- Correct roundabout entry/exit behavior

## Environment Variables

### Frontend (apps/web/.env.local)

```
VITE_API_URL=http://localhost:3001
```

### Backend (apps/api/.env)

```
DATABASE_URL=postgresql://roadready_user:roadready_pass@localhost:5432/roadready
JWT_SECRET=your_jwt_secret_here
PORT=3001
```

## Development Commands

```bash
# Root — run API + frontend together
npm run dev

# Frontend only (http://localhost:5173)
npm run dev:web

# Backend only (http://localhost:3001)
npm run dev:api

# Prisma
cd apps/api
npx prisma studio          # GUI at localhost:5555
npx prisma migrate dev     # create + apply a new migration
npx prisma generate        # regenerate client after schema changes

# Build all
npm run build
```

## Important Notes for Claude Agent

- **Always read `TASKS.md` at the start of every session** to understand what has been built and what is pending
- **Always update `TASKS.md`** when work is completed — move items from 📋 Todo to ✅ Done with implementation details
- Always check existing files before creating new ones
- **Prisma is pinned to 6.0.0** — do not upgrade; Prisma 7 requires a driver adapter that breaks our setup
- **No `prisma.config.ts`** — it was removed; do not recreate it
- **Vite runs on port 5173** with `strictPort: true`; the API is always on 3001
- Keep Three.js/R3F code performant — use `useMemo` and `useRef` for 3D objects
- Physics bodies must be cleaned up on component unmount
- Never hardcode German traffic rule logic inline — put it in `src/simulation/scenarios/rules/`
- When adding a new scenario, create a new file in `src/simulation/scenarios/` and register it in `src/simulation/scenarios/index.ts`
- The simulation canvas must be responsive — works on all screen sizes
- All user-facing text should support i18n from the start (use a `t()` function wrapper even if translations aren't wired up yet)

## Git Workflow

- Branch naming: `feature/scenario-roundabout`, `fix/car-physics-drift`, `chore/setup-prisma`
- Commit messages: conventional commits — `feat:`, `fix:`, `chore:`, `docs:`
- Never commit `.env` files — `.env.example` files are safe and should be committed
- Prisma migration files (`prisma/migrations/`) must be committed
- Always run `npm run build` before pushing to main
