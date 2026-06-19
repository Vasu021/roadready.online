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
- **Seeded data:** Germany 🇩🇪 — 6 categories, 28 PRACTICE + 1 TEST scenario, multi-MCQ banks (see "Germany Content Expansion" below). France 🇫🇷 — facts HTML, 3 categories, 9 PRACTICE + 1 TEST scenario, one 4-option MCQ per scenario
- `npm run db:seed` in `apps/api/package.json`; seed uses upsert — safe to re-run
- `.env.example` committed (no real secrets)

### Germany Content Expansion (PROMPT.md — Step 1) ✅

- **Seed now supports MANY MCQs per scenario:** `ScenarioSeed.question` → `questions: [...]`; ids `q-${id}-${qIdx}` / `opt-${id}-${qIdx}-${i}`. Loop deletes a scenario's questions then recreates them so the seed is authoritative; `upsert.update` re-points category/order/name on re-run. Idempotent (verified by double run).
- **6 Germany categories:** Basic Skills, Right of Way & Priority, Traffic Lights & Signals, Road Signs, Vulnerable Road Users, Special Situations & Highway. Old `cat-de-traffic` removed; existing scenarios re-pointed/re-ordered.
- **28 PRACTICE + 1 TEST Germany scenarios seeded** (19 new + 10 existing re-categorized), 3–4 StVO-accurate MCQs each (~107 active DE questions total = future full-test maxScore). `full-test-germany` intentionally has 0 own questions (aggregates). New slugs: mirror-signal-maneuver, speed-stopping-distance, parking-rules-de, give-way-sign, stop-sign, turning-left-oncoming, green-arrow, signals-override, prohibition-signs, mandatory-signs, speed-limit-tempo30, warning-signs, cyclist-blind-spot, tram-priority, school-zone, bus-stop, zipper-merge, railway-crossing, adverse-conditions.
- **France untouched** (each scenario's single question wrapped in a `questions: []` array; still works).
- Verified: `GET /api/scenarios/:slug/questions` returns 3–4 questions × 4 shuffled options with `isCorrect` hidden; `apps/api` `tsc --noEmit` clean.
- **Not yet done (later steps):** frontend simulation modules for the new slugs (Steps 6–7), per-scenario Practice/Test UI (Steps 2–3). Until registered in `apps/web/src/simulation/scenarios/index.ts`, new slugs will show as not-yet-playable in the UI.

### Practice/Test Plumbing (PROMPT.md — Step 2) ✅

State, routing, scenario-list buttons and the questions data hook for the two attempt modes. No overlays yet (Step 3) — this is the machinery the overlays plug into.

- **gameStore — attempt mode + MCQ sequence state.** Added `attemptMode: 'practice' | 'test'` (default `practice`) + `setAttemptMode`. New types `McqQuestion` (`{ id, questionText, order, options: {id,text}[], correctOptionId?, explanation? }`), `McqOption`, `McqResult`. New state: `mcqQueue`, `activeMcq`, `mcqResult`, `mcqSelectedOptionId`, `mcqAsked`, `mcqCorrect`. New actions: `startMcqSequence`, `selectMcqOption` (only while `pending`), `submitMcq` (scores against `correctOptionId`, bumps asked/correct), `advanceMcq` (pops the queue or finishes), `resetMcq`. `startScenario` + `resetScenario` now reset the MCQ run — deliberately **not** `attemptMode`, so the route-driven `setAttemptMode` call is order-independent. `mcqActive` is derived in components as `activeMcq !== null`.
- **New auth-guarded endpoint `GET /api/scenarios/:slug/questions/answers`** (`apps/api/src/routes/scenarios.ts`) returns each question with `correctOptionId` + `explanation` for client-side per-scenario scoring. Declared before `/:slug/questions` and `/:slug`. The existing isCorrect-hidden `/:slug/questions` is untouched (reserved for the graded Full Test). Verified live: 3 questions for `rechts-vor-links` with a valid `correctOptionId`; **401** without a token; plain endpoint still hides the key.
- **api.ts:** added `api.scenarios.getQuestions(slug)` (hidden) and `getQuestionsWithAnswers(slug)` (with key), plus `QuestionOption` / `ScenarioQuestion` / `ScenarioQuestionWithAnswer` types.
- **`useScenarioQuestions(slug)` hook** (`apps/web/src/hooks/useScenarioQuestions.ts`, new) — fetches the answer-keyed bank once per slug, caches per session in a ref, maps to `McqQuestion[]`, exposes `{ questions, loading, error }`.
- **Routing:** `Simulation.tsx` reads `?mode=practice|test` via `useSearchParams` (defaults to `practice`) and calls `setAttemptMode` alongside `startScenario` + `setDriveMode`.
- **Home.tsx:** each PRACTICE scenario now shows BOTH a **Practice** (`?mode=practice`) and a **Test** (`?mode=test`) button; the TEST card links to `?mode=test`. Lock/premium gating (order ≤ 3 unless `isPremium`) unchanged. Added a local `t()` i18n placeholder for the new labels (Step 8 swaps in `utils/i18n.ts`).
- `tsc --noEmit` clean in both apps; Prettier applied.
- **Not yet done (Step 3):** `MCQOverlay` + `TeachingOverlay` components, `CarController` brake-while-overlay + practice-vs-test trigger, per-scenario results screen, migrating `basicControls`/`trafficLights` decision points.

### Overlays + Autopilot Integration (PROMPT.md — Step 3) ✅

The two on-screen experiences and the autopilot wiring. Practice and Test are now visibly different and a scenario plays end-to-end with MCQs.

- **`MCQOverlay.tsx`** (new) — transparent/frosted (`bg-slate-950/75 backdrop-blur-md`), **draggable** via a header bar (pointer events + capture, clamped to the viewport) so the user can move it aside to see the road. Renders the question + lettered A/B/C/D options, highlights the selection, **Confirm** submits, then shows ✅/❌ + explanation and a **Next Question →** / **Continue →** button. Per-scenario test is SCORED, never instant-fail — a wrong answer shows the correct option + explanation and continues.
- **`TeachingOverlay.tsx`** (new) — PRACTICE panel: situation (`prompt`) + rule (`teaching`) + one **Continue →** that completes the objective and lets the car perform the correct action automatically. No keyboard needed.
- **`ScenarioTestResults.tsx`** (new) — shown instead of `ResultsScreen` when `attemptMode === 'test'`. Scores the MCQs answered across all the scenario's decision points (`mcqCorrect/mcqAsked`, pass ≥ 60%), shows a per-question recap (your answer / correct answer / explanation), Retry + Back, and saves once via `POST /api/progress`.
- **Decision-point model.** `ChallengePoint` (`types.ts`) now carries `teaching: string` + `questionOrders?: number[]`; the legacy key-press fields (`instruction`/`correctKey`/`correctKeyLabel`) are optional and unused by the new flow.
- **`TriggerWatcher.tsx`** (new, in `scenarios/`) — invisible R3F watcher that, on first crossing of a decision's `triggerZ`/`triggerX`, opens the right overlay: practice → `triggerTeaching`, test → `startMcqSequence` with the questions filtered by `questionOrders` (waits for the bank to load; falls back to teaching if a decision has no questions). One decision at a time.
- **`CarController`** — trigger detection removed (now in `TriggerWatcher`); braking generalised to a single `pausedForInput` condition (legacy challenge **or** `activeTeaching` **or** `activeMcq`); `challenges` prop dropped.
- **gameStore additions for Step 3:** `activeTeaching` + `triggerTeaching`/`resolveTeaching`; `mcqDecisionId`, `mcqAnswers` (recap), `finishMcq` (completes the decision's objective, keeps the score); `submitMcq` now records each answer; `startMcqSequence(decisionId, questions)` no longer resets the counters so the score accumulates across a scenario's decisions; a `runId` bumped on (re)start so the car snaps back to spawn and decisions re-arm on **Retry**.
- **Objective completion** runs through `resolvedChallengeIds[id] = true` (via `resolveTeaching`/`finishMcq`), so the existing `TrafficLightSet` (red→green) and `ScenarioRunner` pass logic keep working unchanged.
- **Migrated** `basicControls` (two decisions → MCQ orders `[1,2]` and `[3]`, plus teaching) and `trafficLights` (one decision → all questions, plus teaching) to the new model; both play in BOTH modes.
- **`Simulation.tsx`** fetches the bank via `useScenarioQuestions`, passes it to `SimulationScene` → `TriggerWatcher`, mounts `MCQOverlay` + `TeachingOverlay` (+ dormant `ChallengeOverlay`), and picks `ScenarioTestResults` vs `ResultsScreen` by mode.
- `tsc --noEmit` clean in both apps; `vite build` succeeds; Prettier applied.

### German Environment (PROMPT.md — Step 4) ✅

Made the world look German with **static props only** (moving NPCs are Step 5). Junction clearance + all `CityEnvironment` safety margins left intact (only the `Building` `style` prop and a furniture group were added — no placement loop or margin was changed).

- **`Building.tsx` — style variants** via a new `style` prop (`'altbau' | 'fachwerk' | 'shop' | 'modern'`, default `modern` = the original flat box, so nothing changes unless opted in). Split into `ModernBuilding` + `GermanBuilding` so hooks stay unconditional.
  - **altbau:** plastered pastel body, instanced **window grid** (computed per storey on all four faces), cornice trim, gabled tile roof (memoised `ExtrudeGeometry`, disposed on unmount).
  - **fachwerk:** cream body + instanced dark **timber beams** (corner posts, per-storey rails, studs, X-braces) + steeper gable.
  - **shop:** altbau body with a glazed ground-floor shopfront + awning (ground-floor windows skipped).
  - Windows/beams use `InstancedMesh` (unit box + per-instance matrices built in `useMemo`) — no per-frame allocation.
- **`CityEnvironment.tsx`** — assigns a style to every building deterministically (`pickStyle(seededRand(x,z))`: ~45% altbau / 25% shop / 20% fachwerk / 10% modern). Added a `StreetFurniture` group: street lamps along both streets, a bench, bollards, a bus stop, and a demonstrative **sign gallery** — all in documented safe zones.
- **`GermanCityRoad.tsx`** (additive; existing coords / stop-line / zebra untouched): red **bike lane** (Radweg) on the right-of-travel kerb of Road 1 with a centre-side boundary line; give-way **shark teeth** (Haifischzähne) on the Road 2 approach; **parking-bay** divider ticks on the Road 2 south kerb.
- **New procedural props (no assets):** `RoadSign.tsx` (canvas-textured faces — give-way, stop, priority-road, crossing/rechts-vor-links, pedestrian-crossing, speed-limit `number`, roundabout, no-entry, no-overtaking, autobahn, tram, children), `BusStop.tsx` (canvas "H" plate + glass shelter + bench), `StreetLamp.tsx`, `Bench.tsx`, `Bollard.tsx`.
- Not wired per-scenario yet — Step 6 introduces the declarative per-scenario placement (`def.signs` / `def.npcs`). For now a small demonstrative set renders in the shared scene.
- `tsc --noEmit` clean in both apps; `vite build` succeeds; Prettier applied.

### NPC Traffic System (PROMPT.md — Step 5) ✅

Reusable, **procedural** moving NPCs that scenarios will place declaratively in Step 6. This step builds the SYSTEM (vehicles, pedestrian, manager, light cycle, types) and proves it with a temporary dev mount — it does not yet choreograph specific scenarios.

- **`useTrafficPath.ts`** (new, `simulation/traffic/`) — the shared kinematic path follower. Drives a group ref along a `Waypoint[]` at constant speed per segment with yaw lerped toward the direction of travel (`atan2(-dx, -dz)`, local **-Z** is the NPC's front, matching the player autopilot). **No Rapier** — NPCs can't fight the player car's physics. All-scalar maths (no per-frame `Vector3` allocation); delta clamped to 1/30 s. Options: `path`, `speed`, `loop`, `startDelay`, `paused`, `turnRate`, `onArrive`. `useFrame` auto-unregisters and R3F disposes the JSX geometry on unmount, so NPCs clean up automatically.
- **`NPCVehicle.tsx`** (new) — one component, four procedural meshes via a `variant` prop: **car** (chassis + cabin + glass + 4 wheels, `color` prop), **bus** (long body + window band + windshield + 3 axles/side), **ambulance** (white RTW van + red stripes + roof bar with **two alternating BLUE strobes** — German emergency colour, animated emissive ~6 Hz), **cyclist** (two in-line wheels + frame + handlebars + capsule rider + head). Front authored at local -Z. Props: `variant`, `path`, `speed`, `loop`, `startDelay`, `paused`, `color`, `onArrive`.
- **`Pedestrian.tsx`** (new) — capsule torso + sphere head + two hip-pivoted legs that swing while walking (clock-driven; frozen when `paused`). Default ~1.3 m/s. Same path/`paused` props.
- **`TrafficManager.tsx`** (new) — renders a declarative `NpcSpawn[]` (dispatching pedestrian → `Pedestrian`, else `NPCVehicle`) and resolves each spawn's hold flag per its `behavior`: `stop-at-red` (held unless `lightPhase==='green'`, or until `goWhenResolvedId` resolves — it subscribes to `resolvedChallengeIds`), `yield` (held while its id is in the `heldIds` prop), `emergency`/`free` (never held). Collision handling is intentionally minimal (path spacing + stop flags), not an AI solver. Exports a `TrafficPhase` type.
- **`TrafficLight.tsx`** — added an **optional self-cycling mode** (`autoCycle`, `cycle={red,green,yellow}` durations, `startPhase`, `onPhaseChange`) that runs red→green→yellow→red on its own clock; the existing **controlled `phase`** path is unchanged (still default 'red'), so the traffic-lights scenario's challenge-driven flip keeps working. Emissive update + listener notification moved to a single `useEffect` on the effective phase.
- **`NpcSpawn` types** added to `scenarios/types.ts`: `NpcVehicleVariant`, `NpcVariant` (+ pedestrian), `NpcBehavior`, and `NpcSpawn` (`id`, `variant`, `path`, `speed?`, `loop?`, `startDelay?`, `behavior?`, `goWhenResolvedId?`). The `ScenarioDef.npcs` field itself is deferred to Step 6 as specified.
- **Temporary dev mount** — `TrafficDemo.tsx` (new) renders an auto-cycling light + a `TrafficManager` of six spawns: a car **held at the red light then released on green** (then parks clear of the junction), a free cruising car, a bus, an **ambulance approaching from behind with flashing blue lights**, a **cyclist on the red bike lane**, and a **pedestrian crossing the zebra**. `SimulationScene` mounts it **only when the URL has `?trafficDemo=1`** (e.g. `/simulation/basic-controls?trafficDemo=1`), so it never appears in normal play and is trivially removable in Step 6.
- Junction clearance / `CityEnvironment` margins untouched (no static props added). `tsc --noEmit` clean in both apps; `vite build` succeeds; Prettier applied.
- **Not yet done (Step 6):** add `npcs?: NpcSpawn[]` to `ScenarioDef`, replace the `isTrafficLights` boolean in `SimulationScene` with a generic declarative renderer, remove the dev mount, and choreograph the flagship scenarios with these NPCs.

### Declarative Scene Props + Core Scenarios (PROMPT.md — Step 6) ✅

Scenarios now declare the signs / lights / NPCs they need; `SimulationScene` renders them generically — no per-scenario special-casing. Five flagship German scenarios are choreographed end-to-end with NPCs, playable in both Practice and Test.

- **`ScenarioDef` declarative scene data** (`types.ts`): added `signs?: SceneSign[]` (`kind`, `position`, `rotationY?`, `number?`, `label?`), `npcs?: NpcSpawn[]`, and `lights?: SceneLight[]` (`position` + either `goWhenResolvedId` for a challenge-driven light or `autoCycle`/`cycle`/`startPhase` for a self-cycling one).
- **`SimulationScene` is now generic** — removed the `isTrafficLights` boolean and the `TrafficLightSet` special case (and the Step-5 `?trafficDemo=1` dev mount + `TrafficDemo.tsx`). It maps `def.lights` → `<TrafficLight/>` (challenge-driven via a small `ChallengeLight` that reads `resolvedChallengeIds`, or self-cycling), `def.signs` → `<RoadSign/>`, `def.npcs` → `<TrafficManager/>`. `def.stopZone` / `def.challenges` rendering unchanged.
- **Five flagship scenarios** (new modules, registered in `index.ts`; each: waypoints + ONE decision whose id == objective id, teaching text, and `questionOrders` omitted so test mode asks all the scenario's seeded MCQs):
  - **give-way-sign** (`give-way`) — give-way sign on the approach; a priority-road car loops across the junction from the west; teaches Vorfahrt gewähren.
  - **rechts-vor-links** (`yield-right`) — unmarked junction (no signs); a car comes from the right; teaches §8 StVO right-before-left.
  - **pedestrian-crossing** (`stop-for-pedestrian`) — drives to the zebra at x≈-46.5; a pedestrian paces across (`[N,S,N]` loop); pedestrian-crossing sign + stop zone; teaches Zebrastreifen priority.
  - **emergency-vehicle** (`make-way`) — an ambulance (flashing blue) closes from behind; the car pulls to the right kerb; teaches §38 StVO / Rettungsgasse.
  - **cyclist-blind-spot** (`shoulder-check`) — a cyclist rides the red bike lane straight on as the car turns left; teaches Schulterblick / toter Winkel.
- **Migrated** `traffic-lights` (now declares its two junction lights via `lights` with `goWhenResolvedId: "red-light-stop"` — same red→green-on-resolve behaviour, no special-casing) and `basic-controls` (added a declarative `stop` sign at the stop line).
- **`useTrafficPath` hardened for scenarios:** NPCs now move only while `scenarioPhase === "running"` and **re-arm to their path start on a new run (`runId`)** so Retry stays in sync; `loop` now teleports back to the path start (clean one-way recurrence for vehicles; ping-pong achieved with an `[A,B,A]` path, used by the pedestrian).
- Junction clearance respected (signs sit outside the turn arc; NPCs are kinematic, not static obstacles). `tsc --noEmit` clean in both apps; `vite build` succeeds; Prettier applied.
- **Deferred to Step 7:** the remaining Germany scenarios (roundabout, autobahn, priority-road-signs, vorfahrt-priority-intersection, etc.) via a `makeScenario` helper; roundabout/autobahn/railway use simplified representations.

### Remaining Germany Scenarios (PROMPT.md — Step 7) ✅

Every Germany **practice** scenario is now playable in BOTH practice and test — no "Coming soon", no crash. A shared `makeScenario` builder keeps each module short and guarantees the challenge wiring is correct. Slugs verified against the seed: **28/28 Germany practice slugs registered, exact match, no typos/extras** (`full-test-germany` is Step 8).

- **`makeScenario.ts`** (new) — builds a standard auto-drive `ScenarioDef` from `{ slug, name, description, decisions, signs?, npcs?, lights?, stopZone? }`. It wires each decision into BOTH `config.objectives` AND `challenges` using the decision id as the shared key (the "challenge id === objective id" invariant `TriggerWatcher` + `ScenarioRunner` depend on), and derives `check` (passes once every decision id is completed). Defaults: shared `L_ROUTE`, `driveMode:"auto"`, `timeLimit:300` (generous so test-mode MCQs aren't rushed). Exports helpers: `approachSign` (Road-1 −X kerb, faces southbound car), `road2Sign` (Road-2 north kerb z=−9, faces westbound car), `crossingCar` (looping cross traffic to yield to), `leadCar` (slower car ahead), `yieldingVehicle` (waits at its start until a `goWhenResolvedId` resolves, then drives off — for traffic that yields to the player).
- **21 new scenario modules** (all registered in `index.ts`):
  - **Basic Skills:** `mirror-signal-maneuver` (Spiegel–Blinker–Schulterblick; cyclist on the bike lane), `speed-stopping-distance` (lead car + 50 sign), `parking-rules-de` (Halten vs Parken, decision on Road 2).
  - **Right of Way & Priority:** `stop-sign` (full stop + stop zone), `priority-road-signs` (Vorfahrtstraße diamond; side car waits then pulls away), `vorfahrt-priority-intersection` (Zeichen 301), `turning-left-oncoming` (oncoming car has priority), `roundabout` (_simplified_).
  - **Traffic Lights & Signals:** `green-arrow` (Grünpfeil — junction light goes green on resolve), `signals-override` (officer > lights > signs > markings; self-cycling light).
  - **Road Signs:** `prohibition-signs` (no-entry + no-overtaking), `mandatory-signs`, `speed-limit-tempo30` (30 sign), `warning-signs` (children + crossing triangles).
  - **Vulnerable Road Users:** `tram-priority` (tram sign), `school-zone` (children sign + child pacing the crossing + stop zone).
  - **Special & Highway:** `bus-stop` (bus pulls out once you yield), `autobahn-rules` (_simplified_ fast straight + lead car + autobahn sign), `zipper-merge` (converging merge car), `railway-crossing` (_simplified_), `adverse-conditions` (_simplified_).
- **Fixed a Step-6 regression:** the five flagship modules (`give-way-sign`, `rechts-vor-links`, `pedestrian-crossing`, `emergency-vehicle`, `cyclist-blind-spot`) exported a `CHALLENGES` const but never set `challenges:` on their `ScenarioDef`, so `<TriggerWatcher/>` never mounted and their decision could never fire (the car drove the path but the scenario could never complete in either mode). Added `challenges: CHALLENGES` to all five — they now complete correctly.
- **Full vs simplified-for-now:** _full_ = a real sign/NPC choreography on the shared L-road (the majority). _Simplified_ (playable now on the shared road with a stand-in, flagged below for deepening): `roundabout` (no true ring mesh — L-junction + roundabout/give-way signs + circulating car), `autobahn-rules` (short fast section, not a long multi-lane Autobahn), `railway-crossing` (stop zone + teaching only — no Andreaskreuz/barrier/track prop), `adverse-conditions` (no weather/visibility scene effects yet). `mandatory-signs` and `vorfahrt-priority-intersection` reuse the closest existing sign face (a dedicated blue-arrow / Zeichen-301 face is later polish).
- `tsc --noEmit` clean in both apps; `vite build` succeeds; Prettier applied.
- **Deferred to Step 8:** the aggregate graded `full-test-germany` flow, i18n scaffolding (`utils/i18n.ts`), responsive/QA polish, and docs.

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

> **Status:** Steps 2 ✅ and 3 ✅ delivered this whole block (see Done above). Practice (teaching panel) and Test (scored MCQ popup) both play end-to-end on the registered scenarios. Wiring the remaining Germany scenarios into this system is Steps 6–7.

- [x] Design the `MCQOverlay.tsx` component — Step 3 ✅
  - [x] Transparent/frosted panel — user can still see the 3D scene behind it
  - [x] Draggable: pointer down + move repositions the popup (viewport-clamped)
  - [x] 4 option buttons (A/B/C/D); highlight selected before confirming
  - [x] "Confirm" button to submit
  - [x] Show ✅ / ❌ state + explanation text after answer
  - [x] "Next/Continue" button advances the queue / resumes autopilot
- [x] Wire `gameStore` for MCQ state — Step 2 ✅ (`attemptMode`, `mcqQueue`, `activeMcq`, `mcqResult`, `mcqSelectedOptionId`, `mcqAsked`, `mcqCorrect`) + Step 3 (`activeTeaching`, `mcqDecisionId`, `mcqAnswers`, `finishMcq`, `runId`)
- [x] `useScenarioQuestions.ts` hook — Step 2 ✅ (fetches the auth-guarded `…/questions/answers` bank once per slug, caches in a ref, returns `McqQuestion[]`)
- [x] **Practice mode** — Step 3 ✅: teaching panel explains the rule, Continue completes the objective and the car drives on
- [x] **Test mode** — Step 3 ✅: SCORED (not instant-fail) — a wrong answer shows the correct option + explanation and continues; final X/N on `ScenarioTestResults`
- [x] Migrate `basicControls` (and `trafficLights`) decision points to the teaching/MCQ model — Step 3 ✅
- [x] `CarController`: brake while any decision overlay is open (`pausedForInput`) — Step 3 ✅
- [x] Explanation shown after each answer (in the MCQ popup and the results recap) — Step 3 ✅

### More Germany Scenario Simulation Modules

> **Note:** All Germany scenarios + their MCQ banks are now seeded in the DB (PROMPT.md Step 1 ✅). What remains here is the **frontend 3D simulation module** (waypoints + decision points + scene props) per slug — PROMPT.md Steps 6–7. A scenario only becomes playable once registered in `apps/web/src/simulation/scenarios/index.ts`.

Each new scenario needs: waypoints (autopilot path), MCQ challenge point(s), and any new road/scene components.

- [x] `give-way-sign.ts` — give-way sign + priority-road car crossing; teaches Vorfahrt gewähren — Step 6 ✅
- [x] `rechts-vor-links.ts` — unmarked junction, NPC car from the right; teaches right-before-left — Step 6 ✅
- [x] `pedestrian-crossing.ts` — zebra crossing, pedestrian paces across; teaches Zebrastreifen priority — Step 6 ✅
- [x] `emergency-vehicle.ts` — ambulance from behind, pull right; teaches §38 / Rettungsgasse — Step 6 ✅
- [x] `cyclist-blind-spot.ts` — cyclist on the bike lane while turning; teaches Schulterblick / toter Winkel — Step 6 ✅
- [x] `roundabout.ts` — yield to traffic in the roundabout (simplified ring) — Step 7 ✅
- [x] `autobahn-rules.ts` — keep right / overtake left (simplified fast straight) — Step 7 ✅
- [x] `priority-road-signs.ts` — Vorfahrtstraße diamond, side car yields — Step 7 ✅
- [x] `vorfahrt-priority-intersection.ts` — Zeichen 301 priority at next junction — Step 7 ✅
- [x] All remaining Appendix-A slugs via a `makeScenario` helper — Step 7 ✅ (28/28 Germany practice scenarios registered + slug-matched)

### Deepen-later (deferred from Step 7's simplified scenarios)

- [ ] `roundabout` — a true circular road mesh + proper entry/exit waypoints (currently the shared L-junction stands in)
- [ ] `autobahn-rules` — a dedicated long multi-lane Autobahn section (currently a short fast straight on Road 1)
- [ ] `railway-crossing` — a level-crossing prop: Andreaskreuz sign, barriers, tracks (currently a stop zone + teaching only)
- [ ] `adverse-conditions` — reduced-visibility / day-night scene effects (currently teaching/MCQ only)
- [ ] Dedicated sign faces for `mandatory-signs` (blue direction arrows) and `vorfahrt-priority-intersection` (Zeichen 301) instead of the closest existing face

### Test Mode Flow (full test session)

- [ ] Create `TestSession` at start of `full-test-germany` scenario via `POST /api/test-sessions`
- [ ] Submit each MCQ answer to `POST /api/test-sessions/:id/answers`
- [ ] Complete session via `PATCH /api/test-sessions/:id/complete`
- [ ] `TestResultsScreen.tsx` — per-question breakdown, total score, grade (A/B/C/F), pass/fail

### AI Traffic (PROMPT.md — Step 5 ✅ — system built; choreography is Steps 6–7)

- [x] `NPCVehicle` component — procedural car/bus/ambulance/cyclist (kinematic, no Rapier) — Step 5 ✅
- [x] `useTrafficPath.ts` — waypoint path following (yaw lerp) + `paused` hold — Step 5 ✅ (replaces the planned `useTrafficAI`)
- [x] `TrafficManager.tsx` — renders an `NpcSpawn[]`, coordinates stop-at-red / yield / emergency holds — Step 5 ✅
- [x] Traffic light timed cycle (red→green→yellow→red, configurable durations) — Step 5 ✅ (`TrafficLight` `autoCycle`)
- [x] NPC `Pedestrian` (walks a path, `paused` to wait) — Step 5 ✅
- [x] Wire NPCs into scenarios declaratively (`ScenarioDef.npcs`) + remove the `?trafficDemo=1` dev mount — Step 6 ✅
- [x] Per-scenario choreography: give-way car, rechts-vor-links car, pedestrian on the zebra, ambulance from behind, cyclist in the blind spot — Step 6 ✅

### Stripe Payments

- [ ] `POST /api/payments/create-checkout-session` + webhook handler
- [ ] `UpgradePage.tsx` or upgrade modal — plan options → Stripe Checkout
- [ ] Replace dev `isPremium` toggle with real subscription check
- [ ] Store `stripeCustomerId` + `subscriptionStatus` on User model

### Dashboard Page

- [ ] `Dashboard.tsx` — currently a stub; show scenario completion, best scores, attempt history
- [ ] Progress chart per country (% scenarios completed)
- [ ] Best time + best score per scenario
