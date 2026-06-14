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
- Prettier configured, pre-commit formatting enforced

### Database — PostgreSQL + Prisma 6.0.0

- **3 migrations applied:** `init_tables`, `redesign_core_schema`, `add_country_facts`
- **12-table schema:** Country (+ facts), ScenarioCategory, Scenario, Question, Option, User, UserCountryAccess, UserScenarioProgress, UserProgress (legacy), ScenarioAttempt, TestSession, TestSessionAnswer
- **Seeded data:** Germany 🇩🇪 + France 🇫🇷 — each with facts HTML, 3 categories (Basic Skills / Traffic Rules / Road Signs), 9 PRACTICE + 1 TEST scenario, 4-option MCQ per scenario
- `npm run db:seed` in `apps/api/package.json`; seed uses upsert — safe to re-run
- `.env.example` committed (no real secrets)

### Backend — Express API (all routes live)

| Method | Route                                          | Auth | Notes                                                         |
| ------ | ---------------------------------------------- | ---- | ------------------------------------------------------------- |
| GET    | `/api/health`                                  | —    | `{ status: "ok" }`                                            |
| POST   | `/api/auth/register`                           | —    | bcrypt cost 12, returns JWT                                   |
| POST   | `/api/auth/login`                              | —    | bcrypt compare, returns JWT                                   |
| GET    | `/api/users/me`                                | ✓    | profile + attempt count                                       |
| GET    | `/api/countries`                               | —    | active countries with category + scenario counts              |
| GET    | `/api/countries/:code/facts`                   | —    | `{ facts: string \| null }`                                   |
| GET    | `/api/countries/:code/scenarios`               | —    | scenarios grouped by category                                 |
| GET    | `/api/scenarios`                               | —    | flat list of active scenarios                                 |
| GET    | `/api/scenarios/:slug`                         | —    | single scenario                                               |
| GET    | `/api/scenarios/:slug/questions`               | —    | questions + shuffled options (`isCorrect` hidden)             |
| GET    | `/api/scenarios/progress/:userId/:countryCode` | ✓    | returns/creates `UserScenarioProgress[]`                      |
| POST   | `/api/user-country-access`                     | ✓    | upserts `UserCountryAccess`; returns `{ alreadyExisted }`     |
| POST   | `/api/test-sessions`                           | ✓    | creates `TestSession`, sets `maxScore`                        |
| POST   | `/api/test-sessions/:id/answers`               | ✓    | records answer, returns `{ isCorrect, explanation }`          |
| PATCH  | `/api/test-sessions/:id/complete`              | ✓    | computes grade (A/B/C/F), marks `completedAt`                 |
| GET    | `/api/test-sessions/:id`                       | ✓    | full session with answer breakdown                            |
| GET    | `/api/progress/:userId`                        | ✓    | all `ScenarioAttempt` rows                                    |
| POST   | `/api/progress`                                | ✓    | save attempt + upsert `UserProgress` + `UserScenarioProgress` |

- `helmet` + `requireAuth` middleware in place
- JWT: 7-day expiry, `{ sub: userId, email }` payload, signed with `JWT_SECRET`

### Frontend — Auth

- `AuthModal.tsx` — login / register tabs; reads `authModalMode` from store on mount so "Get Started" opens register, "Sign In" opens login
- `App.tsx` — restores session from `rr_token` in localStorage via `parseJwt()` on mount
- `api.ts` — all requests include `Authorization: Bearer <token>` when token present
- `userStore` — `logout()` clears token + resets all state

### Frontend — Home.tsx (three conditional states)

- **State A** (logged out) — marketing landing page: hero + CTA buttons, 3-card features grid, how-it-works steps, footer
- **State B** (logged in, no country selected) — country dropdown from `GET /api/countries`, live facts panel, "Continue →" calls `POST /api/user-country-access` then `GET /api/scenarios/progress`
- **State C** (logged in, country selected) — scenarios grouped by category; order ≤ 3 unlocked (free), rest show 🔒 Premium; ✅ badge for COMPLETED; gold border + "Take Test →" for TEST scenarios; dev-only ⭐ Premium toggle

### Frontend — 3D Simulation Engine (completed this phase)

**Car:**

- `CarController.tsx` — procedural car mesh (blue chassis, cabin, glass windows, 4 wheels with hubcaps, red taillights, white headlights, front/rear bumpers). Physics via Rapier rigid body (1200 kg). Supports both manual and autopilot drive modes.
- `useCarPhysics.ts` — Rapier rigid body, Y-rotation lock, tuned damping
- `useCarControls.ts` — WASD / arrow keys + Space (handbrake) + R (reset); disabled when a challenge is pending

**Autopilot system:**

- Waypoint-following with proportional yaw controller: `desiredYaw = atan2(-dx, -dz)`, angular velocity proportional to angle error
- Waypoints advance when car is within 3 m of target
- Speed applied as forward impulse; car actively brakes when a challenge is pending

**Challenge system (key-press):**

- `ChallengeOverlay.tsx` — shown when `activeChallenge` is set; listens for keydown; correct key → `resolveChallenge('correct')`, wrong key → `resolveChallenge('wrong', keyLabel)`; auto-clears after 1600 ms; wrong answer in current impl → `setScenarioPhase('failed')` (will be practice/test-aware in next phase)
- `gameStore.ts` extended with: `DriveMode`, `ActiveChallenge` interface, `driveMode`, `activeChallenge`, `resolvedChallengeIds`; `resolveChallenge('correct')` atomically marks the matching objective completed

**Camera:**

- `FollowCamera.tsx` — yaw-aware follow camera; offset computed from `carState.rotation[1]`; camera stays behind car regardless of heading; lerp 0.10 position / 0.15 look for cinematic lag

**Roads & environment:**

- `GermanCityRoad.tsx` — L-shaped road: Road 1 (N-S, z 45→-9, width 7 m), Road 2 (E-W, z=-5, x 0→-62, width 7 m), intersection corner fill, edge lines, centre dashes, stop line at x=-44.8, 5-stripe pedestrian crosswalk at x=-46.5, grey curb boxes
- `CityEnvironment.tsx` — deterministic seeded trees and buildings along both road segments with hard junction clearance zone (turn arc x∈[0,-14], z∈[-2,-6] kept clear), sidewalk planes
- `TrafficLight.tsx` — procedural pole + housing + 3 sphere lights; phase prop (`red|yellow|green`) updates emissive intensity
- `Tree.tsx` — 3 foliage variants, trunk cylinder + 3 cone layers
- `Building.tsx` — box body + roof lip; props: position, width, depth, height, color, roofColor

**Scenarios completed:**

- `basicControls.ts` — full autopilot; 6 waypoints; 2 key-press challenges (left-turn at z=5, stop-at-line at x=-37); pass when both resolved; stop zone visual at x=-45
- `trafficLights.ts` — autopilot approach; red-light-stop challenge; `SimulationScene` reads `resolvedChallengeIds['red-light-stop']` to flip traffic light phase

**Scenario infrastructure:**

- `ScenarioRunner.tsx` — merges `resolvedChallengeIds` into objective `completed` map
- `StopZone.tsx` — visible AABB that dims on car entry
- `ScenarioHUD.tsx` — top-left: scenario name, objectives, countdown
- `ResultsScreen.tsx` — pass/fail modal; saves attempt via `POST /api/progress` on mount (deduped with `hasSaved` ref)
- `types.ts` extended with `Waypoint`, `ChallengePoint`, `driveMode?`, `waypoints?`, `challenges?` on `ScenarioDef`

### Frontend — State (Zustand)

- `userStore` — `user`, `showAuthModal`, `authModalMode`, `selectedCountry`, `isPremium`, `scenarioProgress`
- `gameStore` — `ScenarioPhase`, `activeScenario`, `objectives[]`, `elapsedSeconds`, `carState`, `isPaused`, `driveMode`, `activeChallenge`, `resolvedChallengeIds`

---

## 📋 Todo

### MCQ Pop-up Overlay (next priority — highest impact)

The product vision: car drives itself, pauses at a key moment, a **transparent draggable popup** appears with an MCQ question (A/B/C/D). User can drag the popup aside to see the full road scene before answering. Correct → resume with brief explanation shown. Wrong → fail (Test mode) OR show correct answer + continue (Practice mode).

- [ ] Design the `MCQOverlay.tsx` component
  - [ ] Transparent/frosted panel — user can still see the 3D scene behind it
  - [ ] Draggable: mouse down + move repositions the popup
  - [ ] 4 option buttons (A/B/C/D); highlight selected before confirming
  - [ ] "Confirm" button to submit (or auto-submit on click with no confirm)
  - [ ] Show ✅ / ❌ state + explanation text after answer
  - [ ] "Continue" button re-starts autopilot (resume simulation)
- [ ] Wire `gameStore` for MCQ state: `pausedForMCQ`, `activeMCQQuestion`, `mcqResult: 'pending'|'correct'|'wrong'`
- [ ] `useScenarioQuestions.ts` hook — fetches `GET /api/scenarios/:slug/questions` on scenario start; caches result
- [ ] **Practice mode**: wrong answer → show correct option + explanation → Continue (car resumes)
- [ ] **Test mode**: wrong answer → fail (current behavior stays)
- [ ] Migrate `basicControls` challenges from key-press to MCQ format as proof of concept
- [ ] `CarController`: when `pausedForMCQ`, apply braking impulse (same as current challenge pending logic)
- [ ] Explanation panel shown above road scene for 2–3 s after correct MCQ answer, then simulation resumes

### More Germany Scenario Simulation Modules

Each new scenario needs: waypoints (autopilot path), MCQ challenge point(s), and any new road/scene components.

- [ ] `rechts-vor-links.ts` — 4-way intersection, NPC car from right, yield detection; challenge: who has right of way?
- [ ] `roundabout.ts` — circular road mesh, entry/exit MCQ; challenge: yield to traffic already in roundabout
- [ ] `pedestrian-crossing.ts` — zebra crossing, pedestrian presence, challenge: must stop or can continue?
- [ ] `autobahn-rules.ts` — straight highway with lane markings, speed challenge, Reißverschluss (zipper merge) MCQ
- [ ] `emergency-vehicle.ts` — approach from behind, challenge: move to right + form emergency lane
- [ ] `priority-road-signs.ts` — yellow diamond vs triangle signs, challenge: who yields?
- [ ] `vorfahrt-priority-intersection.ts` — advance warning sign scenario

### Test Mode Flow (full test session)

- [ ] Create `TestSession` at start of `full-test-germany` scenario via `POST /api/test-sessions`
- [ ] Submit each MCQ answer to `POST /api/test-sessions/:id/answers`
- [ ] Complete session via `PATCH /api/test-sessions/:id/complete`
- [ ] `TestResultsScreen.tsx` — per-question breakdown, total score, grade (A/B/C/F), pass/fail

### AI Traffic

- [ ] `TrafficVehicle` component — procedural box car, Rapier body
- [ ] `useTrafficAI.ts` — waypoint path following + stop at red lights
- [ ] `TrafficManager.tsx` — spawns N vehicles, basic collision avoidance
- [ ] Traffic light timed cycle (red→yellow→green→yellow→red, configurable durations)
- [ ] NPC pedestrian for pedestrian-crossing scenario

### Stripe Payments

- [ ] `POST /api/payments/create-checkout-session` + webhook handler
- [ ] `UpgradePage.tsx` or upgrade modal — plan options → Stripe Checkout
- [ ] Replace dev `isPremium` toggle with real subscription check
- [ ] Store `stripeCustomerId` + `subscriptionStatus` on User model

### Dashboard Page

- [ ] `Dashboard.tsx` — currently a stub; show scenario completion, best scores, attempt history
- [ ] Progress chart per country (% scenarios completed)
- [ ] Best time + best score per scenario
