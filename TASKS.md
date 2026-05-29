# RoadReady — Task Tracker

> Keep this file up to date. Every Claude session should read it at the start and update it as work is completed.

---

## ✅ Done

### Monorepo & Tooling
- npm workspaces monorepo: `apps/web`, `apps/api`, `packages/shared`
- Root `package.json` with `concurrently` for parallel dev (`npm run dev`)
- `dev:web` and `dev:api` workspace scripts
- `.gitignore` covering `.env`, `dist`, `node_modules`

### Shared Package (`packages/shared`)
- `types.ts`: `Difficulty`, `Objective`, `ScenarioConfig`, `CarState`, `UserProgress` shared types
- `index.ts`: re-exports everything
- `tsconfig.json`: path alias `@roadready/shared` wired in both `apps/web` and `apps/api`

### Frontend — Core Setup (`apps/web`)
- React 18 + TypeScript + Vite
- Tailwind CSS with dark theme (gray-950 base)
- PostCSS config
- `vite.config.ts` with `@roadready/shared` path alias
- React Router v6: routes for `/`, `/simulation/:scenarioId`, `/dashboard`
- `main.tsx` entry, `App.tsx` with `<BrowserRouter>` and `<Routes>`
- `index.css` with Tailwind base/components/utilities

### Frontend — 3D Scene (`apps/web/src/simulation/scene/`)
- `SimulationScene.tsx`: main `<Canvas>` with shadows, fog (`#b8d0e8`, near 60, far 260), sky blue background, 60° fov camera at `[0, 6, 18]`
- `Ground.tsx`: flat plane 500×500, gray-brown material with receiveShadow
- `Road.tsx`: straight road mesh with white lane markings (dashed centre line + edge lines)
- `Lighting.tsx`: ambient light + directional light with `castShadow`, shadow map 2048×2048
- Debug mode: `<OrbitControls>`, `<axesHelper>`, `<gridHelper>` in `DEV` only
- `index.ts`: barrel export

### Frontend — Car Physics (`apps/web/src/simulation/vehicles/`)
- `useCarPhysics.ts`: Rapier 3D world init (`RAPIER.init()` module-level promise), ground collider (250×0.1×250), car rigid body (cuboid 0.9×0.35×1.8, mass 1200 kg), Y-only rotation lock via `setEnabledRotations(false,true,false,true)`, `linearDamping=0.9`, `angularDamping=5.0`
- `useCarControls.ts`: keyboard listener hook tracking `ArrowUp/W`, `ArrowDown/S`, `ArrowLeft/A`, `ArrowRight/D`, `Space`, `r`
- `CarController.tsx`: single `useFrame` loop for physics step + mesh sync + Zustand export; lateral grip impulse (LATERAL_GRIP=0.92) cancels sideways velocity each frame for non-floaty feel; torque-curve taper; speed-based steering reduction (65% at max speed); reverse direction flip; pre-allocated Three.js vectors (no GC)
- `CAR_SPAWN` constant at `(0, 1.5, 40)` (Z+ spawn, facing -Z)
- `index.ts`: barrel export

### Frontend — Scenario System (`apps/web/src/simulation/scenarios/`)
- `types.ts`: `ScenarioChecker` function type, `ScenarioDef` interface (config + check fn + optional stopZone AABB)
- `index.ts`: registry map, `getScenario(id)`, `getAllScenarios()` functions
- `basicControls.ts`: "Basic Controls" scenario — 3 sequential objectives: (1) drive forward past Z=-15, (2) turn left ≥30°, (3) stop in AABB zone at `(cx:-15, cz:-25)` with speed <3 km/h; 5-minute time limit; beginner difficulty
- `ScenarioRunner.tsx`: invisible R3F component using `useFrame` + `useGameStore.getState()` (no re-renders); evaluates checker every frame; handles timeout → failed
- `StopZone.tsx`: visible AABB box (green dashed outline) rendered as Three.js mesh; dims when entered

### Frontend — UI Components
- `ScenarioHUD.tsx`: top-left overlay showing scenario name, live objectives list (pending/active/complete states), countdown timer with red warning below 20s
- `ResultsScreen.tsx`: full-screen modal on pass/fail; shows heading, feedback text, objectives/time stats grid, per-objective breakdown, "Try Again" + "Back to Menu" buttons

### Frontend — Pages
- `Home.tsx`: scenario selector; renders available scenarios from registry as clickable cards with difficulty badges; shows Intersection + Roundabout as locked "Coming soon" placeholders
- `Simulation.tsx`: full simulation page; loads scenario config into Zustand on mount; renders `<SimulationScene>`, `<ScenarioHUD>`, `<ResultsScreen>`; speed display (km/h, bottom centre); pause button; exit link; controls hint overlay
- `Dashboard.tsx`: stub page (user progress — not yet implemented)

### Frontend — State Management
- `gameStore.ts` (Zustand): `ScenarioPhase` union (`idle | running | passed | failed`), `activeScenario`, `objectives[]` with live `completed` flags, `elapsedSeconds`, `carState`, `isPaused`; actions: `startScenario`, `resetScenario`, `completeObjective`, `setScenarioPhase`, `setElapsed`, `setCarState`, `setPaused`
- `userStore.ts` (Zustand): `user` (id + email), `progress: UserProgress[]`, `isLoading`; actions: `setUser`, `setProgress`, `setLoading`

### Frontend — Utilities
- `utils/api.ts`: centralized API client using `fetch`; `VITE_API_URL` base; typed `get`, `post`, `put`, `delete` methods; throws on non-OK responses

### Backend — Express Server (`apps/api`)
- `src/index.ts`: Express app with `cors()`, `express.json()`, `PORT` from env (default 3001), `/health` endpoint
- Route mounts: `/api/scenarios`, `/api/users`, `/api/progress`
- `src/lib/prisma.ts`: singleton `PrismaClient` (Prisma 7 — reads `DATABASE_URL` automatically)
- `tsconfig.json`: `rootDir: "../../"` to support monorepo cross-package imports; `outDir: "./dist"`
- `package.json`: `dev` (tsx watch), `build` (tsc), `db:push`, `db:migrate`, `db:studio`, `db:generate`, `postinstall`

### Backend — API Routes (Stubs)
- `routes/scenarios.ts`: `GET /api/scenarios` (returns `[]`), `GET /api/scenarios/:id` (returns echo) — stub, not backed by DB yet
- `routes/users.ts`: `POST /api/users` (returns 201 stub) — stub, not integrated with Supabase Auth

### Backend — Progress API (Fully Implemented)
- `routes/progress.ts`: `GET /api/progress/:userId` — Prisma query returning all attempts sorted by `completedAt desc`; `POST /api/progress` — validates required fields, creates `UserProgress` row via Prisma

### Database
- PostgreSQL via Prisma **6.0.0** (downgraded from 7.x — Prisma 7 requires a driver adapter which we don't need)
- `prisma/schema.prisma`: full redesigned schema with 12 models — see CLAUDE.md Database Schema section
- `src/lib/prisma.ts` uses globalThis singleton pattern to prevent multiple PrismaClient instances during hot reload
- Migrations: `20260527124701_init_tables` + `20260529155259_redesign_core_schema`
- Seed file at `prisma/seed.ts` — inserts Germany, 3 categories, 10 scenarios, 1 question+4 options each
- `npm run db:seed` script added to `apps/api/package.json`
- Seed confirmed applied: Germany + all 10 scenarios live in DB
- `.env.example`: safe template for `DATABASE_URL`, `JWT_SECRET`, `PORT` only

### Core Data Model Redesign (2026-05-29)
- New simulation workflow: car moves automatically, pauses for MCQ questions
- `Country`, `ScenarioCategory`, `Scenario`, `Question`, `Option` content tables
- `UserCountryAccess`, `UserScenarioProgress` new progress tables
- `TestSession` + `TestSessionAnswer` power test-mode grading
- `ScenarioAttempt` extended with `mode` enum (PRACTICE | TEST)
- `UserProgress` kept as legacy model for existing API routes
- Enums: `ScenarioType`, `AttemptMode`, `ProgressStatus`

### Express API — Complete Route Implementations
- `GET /api/health`, `GET /api/scenarios`, `GET /api/scenarios/:id` — implemented
- `POST /api/auth/register` — bcryptjs hash (cost 12), creates `User`, returns JWT
- `POST /api/auth/login` — verifies password hash, returns JWT
- `GET /api/users/me` — returns authenticated user profile + attempt count
- `GET /api/progress/:userId` — protected, returns all `ScenarioAttempt` rows
- `POST /api/progress` — protected; creates `ScenarioAttempt` + upserts `UserProgress` in a Prisma transaction
- `helmet`, `requireAuth` middleware, `src/lib/jwt.ts` (`signToken` / `verifyToken`, 7-day expiry)

### Custom JWT Auth — verified working end-to-end
- `@supabase/supabase-js` removed from both apps; Supabase files deleted
- `requireAuth` uses `verifyToken()` from `src/lib/jwt.ts` — no Supabase dependency
- `apps/web/src/utils/api.ts` reads JWT from `localStorage` (`rr_token`) for all authenticated requests
- `AuthModal.tsx` calls `api.auth.login` / `api.auth.register`; stores JWT via `setStoredToken`
- `App.tsx` restores `userStore` on mount via `parseJwt()` from localStorage
- Signup and login confirmed working end-to-end

### Port & Proxy Fix
- Vite set to `port: 5173, strictPort: true` — no longer conflicts with API on 3001
- Vite proxy: `/api` → `http://localhost:3001` (frontend can call `/api/...` directly in dev)

---

## 📋 Todo

### API — Scenario & Content Routes ✅ Done
- `GET /api/countries` — active countries with category + scenario counts (`routes/countries.ts`)
- `GET /api/countries/:code/scenarios` — scenarios grouped by category for a country
- `GET /api/scenarios` — DB-backed, replaces hardcoded `src/data/scenarios.ts`
- `GET /api/scenarios/:slug` — single scenario by slug
- `GET /api/scenarios/:slug/questions` — questions with shuffled options, `isCorrect` hidden (`routes/scenarios.ts`)
- `POST /api/test-sessions` — creates `TestSession`, sets `maxScore` from live question count (`routes/testSessions.ts`)
- `POST /api/test-sessions/:id/answers` — records `TestSessionAnswer`, returns `{ isCorrect, explanation }`
- `PATCH /api/test-sessions/:id/complete` — computes `totalScore`, `grade` (A/B/C/F at 90/75/60%), `passed` (≥75%), marks `completedAt`
- `GET /api/test-sessions/:id` — full session with answers, question text, selected option
- `POST /api/progress` — now also upserts `UserScenarioProgress` (status COMPLETED/IN_PROGRESS, bestScore); resolves scenarioId by slug or DB id for FK safety

### Frontend — MCQ Simulation Overlay
- [ ] `MCQOverlay.tsx` component — shown when simulation pauses; renders question text + 4 option buttons
- [ ] Correct answer: show green highlight + explanation panel → resume button
- [ ] Wrong answer: show red highlight + explanation panel → retry or continue button
- [ ] Wire into `gameStore` — add `pausedForQuestion`, `currentQuestion`, `questionResult` state
- [ ] `useScenarioQuestions.ts` hook — fetches questions for current scenario from API

### Frontend — Test Mode
- [ ] `TestSession` flow: create session → iterate all active scenarios → show MCQ → accumulate answers → show final grade
- [ ] `TestResultsScreen.tsx` — shows per-question breakdown, total score, grade (A/B/C/F), pass/fail
- [ ] Wire `POST /api/test-sessions`, `POST /api/test-sessions/:id/answers`, `PATCH /api/test-sessions/:id/complete`

### Roundabout Scenario
- [ ] Design roundabout road mesh in `simulation/scene/` (circular geometry with entry/exit lanes)
- [ ] Create `roundabout.ts` in `simulation/scenarios/` — objectives: enter correctly (yield to traffic in circle), complete one full loop, exit at correct junction
- [ ] Implement entry yield zone detection (AABB or radius-based)
- [ ] Add roundabout traffic rule to `simulation/scenarios/rules/roundabout.ts`
- [ ] Register in `scenarios/index.ts`, remove from UPCOMING list in `Home.tsx`

### Intersection Scenario (Rechts vor Links)
- [ ] Design 4-way intersection road mesh (cross shape)
- [ ] Create `intersectionRechtsVorLinks.ts` in `simulation/scenarios/` — objectives: approach intersection, identify right-of-way vehicle, yield correctly, proceed safely
- [ ] Implement a static NPC vehicle that approaches from the right
- [ ] Collision/proximity detection for right-of-way check
- [ ] Add rule to `simulation/scenarios/rules/rechtsVorLinks.ts`
- [ ] Register in `scenarios/index.ts`, remove from UPCOMING list in `Home.tsx`

### AI Traffic
- [ ] Design `TrafficVehicle` component in `simulation/traffic/` — simple box-car with Rapier body
- [ ] Implement waypoint-based path following (`useTrafficAI.ts`)
- [ ] `TrafficManager.tsx` — spawns and manages N traffic vehicles per scenario config
- [ ] Basic collision avoidance (stop if blocked)
- [ ] Traffic lights component with timed red/amber/green cycle
- [ ] Hook traffic light state into scenario checkers (fail if player runs red)

### Stripe Payments
- [ ] Install `stripe` in `apps/api`, `@stripe/stripe-js` + `@stripe/react-stripe-js` in `apps/web`
- [ ] Design pricing model (free tier vs premium scenarios/features)
- [ ] `POST /api/payments/create-checkout-session` — create Stripe Checkout session
- [ ] `POST /api/payments/webhook` — handle `checkout.session.completed`, `customer.subscription.*` events
- [ ] `UpgradePage.tsx` or modal — show plan options, redirect to Stripe Checkout
- [ ] Gate premium scenarios behind subscription check in `Home.tsx`
- [ ] Store `stripeCustomerId` and `subscriptionStatus` on `Profile` model
