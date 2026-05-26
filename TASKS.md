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
- Supabase PostgreSQL connected
- `prisma/schema.prisma`: `Profile` model (id, email, createdAt → `profiles` table) + `UserProgress` model (userId, scenarioId, passed, score, timeSeconds, completedAt → `user_progress` table) with cascade delete
- `prisma.config.ts`: explicit dotenv load + `defineConfig({ datasource: { url: process.env.DIRECT_URL } })` for Prisma 7 compatibility
- `prisma db push` succeeded — both tables live in Supabase
- `.env.example`: safe template for `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`

---

## 📋 Todo

### Express API — Complete Route Implementations
- [ ] `GET /api/scenarios` — seed or query scenario configs from DB (not just `[]`)
- [ ] `GET /api/scenarios/:id` — return real scenario config by ID
- [ ] `POST /api/users` — create or upsert `Profile` record linked to Supabase auth UID
- [ ] `GET /api/users/:id` — fetch profile + aggregate progress stats
- [ ] Add request validation middleware (e.g., zod) for all POST routes
- [ ] Add auth middleware to protect private routes (verify Supabase JWT)

### Supabase Auth
- [ ] Install `@supabase/supabase-js` in `apps/web`
- [ ] Create `src/lib/supabase.ts` client using `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- [ ] Build `LoginPage.tsx` — email/password sign-in and sign-up form
- [ ] Wire `useUserStore` to Supabase `onAuthStateChange` — set/clear user on session change
- [ ] Protect `/dashboard` and `/simulation/:id` routes — redirect to `/login` if not authenticated
- [ ] After scenario completion, call `POST /api/progress` with the user's JWT in Authorization header
- [ ] Install `@supabase/supabase-js` in `apps/api` (service role client for server-side auth verification)
- [ ] Implement `verifyToken` middleware in `apps/api/src/middleware/auth.ts`

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
