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
    ├── auth.ts               # POST /api/auth/register, POST /api/auth/login
    ├── countries.ts          # GET /api/countries, GET /api/countries/:code/facts, GET /api/countries/:code/scenarios
    ├── scenarios.ts          # GET /api/scenarios, GET /api/scenarios/:slug, GET /api/scenarios/:slug/questions,
    │                         #   GET /api/scenarios/progress/:userId/:countryCode
    ├── userCountryAccess.ts  # POST /api/user-country-access
    ├── testSessions.ts       # POST /api/test-sessions, POST …/:id/answers, PATCH …/:id/complete, GET …/:id
    ├── users.ts              # GET /api/users/me
    └── progress.ts           # GET /api/progress/:userId, POST /api/progress
```

## Simulation Workflow (New Design)

The car moves automatically through a scenario. At key moments the simulation **pauses** and shows an MCQ question:
- **Correct answer** → simulation resumes with a brief explanation shown.
- **Wrong answer** → simulation stays paused; explanation shown; user retries or skips.

**Practice mode** — individual scenario, no final grade.  
**Test mode** — all scenarios in sequence; answers accumulated; grade and pass/fail shown at the end.

## Database Schema (Prisma 6.0.0)

Twelve tables — see `apps/api/prisma/schema.prisma` for full definitions.

```
── Content layer ──────────────────────────────────────────────
Country              → countries
  id, code (unique, e.g. "DE"), name, flagEmoji, isActive, facts?, createdAt

ScenarioCategory     → scenario_categories
  id, countryId (FK Country), name, order

Scenario             → scenarios
  id, countryId (FK Country), categoryId? (FK ScenarioCategory),
  slug (unique), name, description, order, isActive, isPremium,
  type (PRACTICE | TEST), videoUrl?, createdAt

Question             → questions
  id, scenarioId (FK Scenario), questionText, order, explanation, createdAt

Option               → options
  id, questionId (FK Question), optionText, isCorrect, order

── User progress layer ────────────────────────────────────────
User                 → users
  id, email (unique), password (bcrypt), name?, createdAt, updatedAt

UserCountryAccess    → user_country_access
  id, userId (FK User), countryId (FK Country), unlockedAt
  UNIQUE(userId, countryId)

UserScenarioProgress → user_scenario_progress  ← primary progress model
  id, userId (FK User), scenarioId (FK Scenario),
  status (NOT_STARTED | IN_PROGRESS | COMPLETED),
  lastAttemptAt?, bestScore, attemptCount, passCount
  UNIQUE(userId, scenarioId)

UserProgress         → user_progress  ← legacy, kept for existing routes
  id, userId (FK User), scenarioId (plain String), bestScore,
  bestTimeSeconds?, attemptCount, passCount, lastAttemptAt?
  UNIQUE(userId, scenarioId)

ScenarioAttempt      → scenario_attempts
  id, userId (FK User), scenarioId (FK Scenario, nullable on delete),
  mode (PRACTICE | TEST), passed, score, timeSeconds, completedAt

TestSession          → test_sessions
  id, userId (FK User), countryId (FK Country),
  startedAt, completedAt?, totalScore, maxScore, passed?, grade?

TestSessionAnswer    → test_session_answers
  id, testSessionId (FK TestSession), questionId (FK Question),
  selectedOptionId (FK Option), isCorrect, answeredAt
```

**Seeded data** (`apps/api/prisma/seed.ts`):
- Germany (code: `DE`, isActive: true) + France (code: `FR`, isActive: true) — both with `facts` HTML
- Each country has categories: Basic Skills, Traffic Rules, Road Signs
- Germany: 9 PRACTICE + 1 TEST scenario; France: 9 PRACTICE + 1 TEST scenario
- All scenarios `isActive: true`, each with one 4-option MCQ question

**Prisma notes:**
- Schema file: `apps/api/prisma/schema.prisma` — datasource has `url = env("DATABASE_URL")`
- No `prisma.config.ts` — it was removed; Prisma 6 reads `DATABASE_URL` from env automatically
- `src/lib/prisma.ts` uses globalThis singleton to avoid multiple connections during hot reload
- Migrations live in `apps/api/prisma/migrations/` and are committed to git
- New code should use `UserScenarioProgress`; `UserProgress` is legacy

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

## Current MVP Scope

1. A 3D scene with a basic road environment (Aachen-inspired)
2. A drivable car with keyboard controls (WASD or arrow keys)
3. Multi-country support — Germany 🇩🇪 and France 🇫🇷 seeded; each with 9 PRACTICE + 1 TEST scenario
4. Three-state UI flow in `Home.tsx`:
   - **State A** (logged out): marketing landing page with CTA buttons
   - **State B** (logged in, no country): country selector with facts panel
   - **State C** (logged in, country chosen): scenario list grouped by category
5. Car moves automatically; simulation pauses at key moments for MCQ
6. Pass/fail/explanation shown per question; final grade shown after test mode
7. User auth (sign up / login) — ✅ working
8. Progress saved to database — ✅ working
9. Free tier: first 3 scenarios unlocked; rest require Premium (dev toggle available)

## Scenarios Architecture

Scenarios are stored in PostgreSQL and loaded via the API. Each `Scenario` row has a `slug` that maps to a frontend simulation module. Questions and options are loaded from the `questions` / `options` tables.

Frontend simulation modules live in `src/simulation/scenarios/<slug>.ts` and handle the 3D scripted path. MCQ questions are fetched from the API and rendered as overlays on top of the paused simulation.

**Scenario types:**
- `PRACTICE` — single scenario, no final grade, immediate explanation on each question
- `TEST` — all questions across all active scenarios, graded at end via `TestSession`

**Seeded Germany scenarios (slug → name):**
```
basic-controls                  → Basic Controls
rechts-vor-links                → Rechts vor Links — Right before Left
roundabout                      → Roundabout
traffic-lights                  → Traffic Lights
priority-road-signs             → Priority Road Signs
vorfahrt-priority-intersection  → Vorfahrt — Priority at Next Intersection
emergency-vehicle               → Emergency Vehicle
pedestrian-crossing             → Pedestrian Crossing
autobahn-rules                  → Autobahn Rules
full-test-germany               → Full Test — Germany  (type: TEST)
```

**Seeded France scenarios (slug → name):**
```
fr-basic-controls               → Basic Controls
fr-priorite-a-droite            → Priorité à droite
fr-roundabout                   → Roundabout — French Style
fr-speed-limits                 → Speed Limits
fr-radar-cameras                → Radar Cameras
fr-motorway-rules               → Motorway Rules
fr-pedestrian-crossing          → Pedestrian Crossing
fr-traffic-lights               → Traffic Lights
fr-parking-rules                → Parking Rules
full-test-france                → Full Test — France  (type: TEST)
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
npm run db:seed            # seed countries, categories, scenarios, questions, options

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
- When adding a new scenario, add a row to the DB (via seed or migration), create a simulation module in `src/simulation/scenarios/<slug>.ts`, and register it in `src/simulation/scenarios/index.ts`
- Use `UserScenarioProgress` (not `UserProgress`) for all new progress tracking code; `UserProgress` is legacy
- `Home.tsx` has three states: logged-out landing page / logged-in country select / logged-in scenario list — do not collapse these into separate routes
- `userStore` holds `selectedCountry`, `isPremium`, `scenarioProgress`, `authModalMode` — update these when user changes country or completes a scenario
- `isPremium` is a dev-only toggle (default false); free users get first 3 scenarios (order 1–3) unlocked per country
- `setShowAuthModal(show, mode?)` sets both `showAuthModal` and `authModalMode` atomically — always pass `'login'` or `'register'` so AuthModal opens on the right tab
- `TestSession` + `TestSessionAnswer` power the test-mode grading — create a `TestSession` at start, upsert `TestSessionAnswer` per question, mark `completedAt` + `passed` + `grade` when done
- The simulation canvas must be responsive — works on all screen sizes
- All user-facing text should support i18n from the start (use a `t()` function wrapper even if translations aren't wired up yet)

## Git Workflow

- Branch naming: `feature/scenario-roundabout`, `fix/car-physics-drift`, `chore/setup-prisma`
- Commit messages: conventional commits — `feat:`, `fix:`, `chore:`, `docs:`
- Never commit `.env` files — `.env.example` files are safe and should be committed
- Prisma migration files (`prisma/migrations/`) must be committed
- Always run `npm run build` before pushing to main
