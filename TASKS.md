# RoadReady — Task Tracker

> Keep this file up to date. Every Claude session should read it at the start and update it as work is completed.

---

## ✅ Done

### Infrastructure & Tooling
- npm workspaces monorepo: `apps/web`, `apps/api`, `packages/shared`
- Root `package.json` with `concurrently` (`npm run dev` starts both apps in parallel)
- `dev:web` (port 5173) and `dev:api` (port 3001) workspace scripts
- `.gitignore` covering `.env`, `dist`, `node_modules`
- Shared package `@roadready/shared` — `ScenarioConfig`, `CarState`, `UserProgress` types; path alias wired in both apps

### Database — PostgreSQL + Prisma 6.0.0
- **3 migrations applied:** `init_tables`, `redesign_core_schema`, `add_country_facts`
- **12-table schema:** Country (+ facts), ScenarioCategory, Scenario, Question, Option, User, UserCountryAccess, UserScenarioProgress, UserProgress (legacy), ScenarioAttempt, TestSession, TestSessionAnswer
- **Seeded data:** Germany 🇩🇪 + France 🇫🇷 — each with facts HTML, 3 categories (Basic Skills / Traffic Rules / Road Signs), 9 PRACTICE + 1 TEST scenario, 4-option MCQ per scenario
- `npm run db:seed` in `apps/api/package.json`; seed uses upsert — safe to re-run
- `.env.example` committed (no real secrets)

### Backend — Express API (all routes live)
| Method | Route | Auth | Notes |
|--------|-------|------|-------|
| GET | `/api/health` | — | `{ status: "ok" }` |
| POST | `/api/auth/register` | — | bcrypt cost 12, returns JWT |
| POST | `/api/auth/login` | — | bcrypt compare, returns JWT |
| GET | `/api/users/me` | ✓ | profile + attempt count |
| GET | `/api/countries` | — | active countries with category + scenario counts |
| GET | `/api/countries/:code/facts` | — | `{ facts: string \| null }` |
| GET | `/api/countries/:code/scenarios` | — | scenarios grouped by category |
| GET | `/api/scenarios` | — | flat list of active scenarios |
| GET | `/api/scenarios/:slug` | — | single scenario |
| GET | `/api/scenarios/:slug/questions` | — | questions + shuffled options (`isCorrect` hidden) |
| GET | `/api/scenarios/progress/:userId/:countryCode` | ✓ | returns/creates `UserScenarioProgress[]` |
| POST | `/api/user-country-access` | ✓ | upserts `UserCountryAccess`; returns `{ alreadyExisted }` |
| POST | `/api/test-sessions` | ✓ | creates `TestSession`, sets `maxScore` |
| POST | `/api/test-sessions/:id/answers` | ✓ | records answer, returns `{ isCorrect, explanation }` |
| PATCH | `/api/test-sessions/:id/complete` | ✓ | computes grade (A/B/C/F), marks `completedAt` |
| GET | `/api/test-sessions/:id` | ✓ | full session with answer breakdown |
| GET | `/api/progress/:userId` | ✓ | all `ScenarioAttempt` rows |
| POST | `/api/progress` | ✓ | save attempt + upsert `UserProgress` + `UserScenarioProgress` |

- `helmet` + `requireAuth` middleware in place
- JWT: 7-day expiry, `{ sub: userId, email }` payload, signed with `JWT_SECRET`

### Frontend — Auth
- `AuthModal.tsx` — login / register tabs; reads `authModalMode` from store on mount so "Get Started" opens register, "Sign In" opens login
- `App.tsx` — restores session from `rr_token` in localStorage via `parseJwt()` on mount
- `api.ts` — all requests include `Authorization: Bearer <token>` when token present
- `userStore` — `logout()` clears token + resets all state

### Frontend — 3D Scene & Car Physics
- `SimulationScene.tsx` — `<Canvas>` with shadows, sky-blue fog, 60° fov camera
- `Ground.tsx`, `Road.tsx`, `Lighting.tsx` — basic road environment
- `useCarPhysics.ts` — Rapier rigid body (1200 kg), Y-rotation lock, damping tuned for non-floaty feel
- `useCarControls.ts` — WASD / arrow keys + Space (handbrake) + R (reset)
- `CarController.tsx` — single `useFrame` loop; lateral grip impulse; torque taper; speed-based steering reduction

### Frontend — Scenario System
- `ScenarioRunner.tsx` — R3F component, evaluates `ScenarioChecker` every frame
- `StopZone.tsx` — visible AABB stop zone that dims on entry
- `ScenarioHUD.tsx` — top-left overlay: name, objectives, countdown (red below 20 s)
- `ResultsScreen.tsx` — pass/fail modal with stats, "Try Again" + "Back to Menu"
- `basicControls.ts` — only scenario with a 3D simulation module (slugs for DB scenarios are seeded but simulation modules are placeholders)

### Frontend — Home.tsx (three conditional states)
- **State A** (logged out) — marketing landing page: hero + CTA buttons, 3-card features grid, how-it-works steps, footer. "Get Started" opens register modal; "Sign In" opens login modal.
- **State B** (logged in, no country selected) — country dropdown from `GET /api/countries`, live facts panel via `dangerouslySetInnerHTML`, "Continue →" calls `POST /api/user-country-access` then `GET /api/scenarios/progress` before switching state
- **State C** (logged in, country selected) — scenarios grouped by category; order ≤ 3 unlocked (free), rest show 🔒 Premium; ✅ badge for COMPLETED; gold border + "Take Test →" for TEST scenarios; "Change Country" link; dev-only ⭐ Premium toggle

### Frontend — State (Zustand)
- `userStore` — `user`, `showAuthModal`, `authModalMode`, `selectedCountry`, `isPremium`, `scenarioProgress`
- `gameStore` — `ScenarioPhase`, `activeScenario`, `objectives[]`, `elapsedSeconds`, `carState`, `isPaused`

---

## 📋 Todo

### MCQ Simulation Overlay (next priority)
- [ ] `MCQOverlay.tsx` — shown when simulation pauses; renders question text + 4 option buttons
- [ ] Correct answer: green highlight + explanation → resume button
- [ ] Wrong answer: red highlight + explanation → retry or continue button
- [ ] Wire into `gameStore` — add `pausedForQuestion`, `currentQuestion`, `questionResult` state
- [ ] `useScenarioQuestions.ts` hook — fetches questions from `GET /api/scenarios/:slug/questions`

### Test Mode
- [ ] `TestSession` flow: create session → iterate scenarios → accumulate MCQ answers → final grade
- [ ] `TestResultsScreen.tsx` — per-question breakdown, total score, grade (A/B/C/F), pass/fail
- [ ] Wire `POST /api/test-sessions`, answers endpoint, complete endpoint

### More Scenario Simulation Modules
- [ ] `roundabout.ts` — circular road mesh, yield-zone detection, full-loop objective
- [ ] `rechts-vor-links.ts` — 4-way intersection, static NPC from right, right-of-way check
- [ ] Add remaining DE + FR scenario simulation modules (currently DB-seeded but no 3D module)

### AI Traffic
- [ ] `TrafficVehicle` component — box-car Rapier body
- [ ] `useTrafficAI.ts` — waypoint-based path following
- [ ] `TrafficManager.tsx` — spawns N vehicles, basic collision avoidance
- [ ] Traffic lights component with timed red/amber/green cycle

### Stripe Payments
- [ ] `POST /api/payments/create-checkout-session` + webhook handler
- [ ] `UpgradePage.tsx` or modal — plan options → Stripe Checkout
- [ ] Replace dev `isPremium` toggle with real subscription check
- [ ] Store `stripeCustomerId` + `subscriptionStatus` on User model

### Dashboard Page
- [ ] `Dashboard.tsx` — currently a stub; show scenario completion, best scores, attempt history
