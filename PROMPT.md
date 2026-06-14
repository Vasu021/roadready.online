# RoadReady — Germany Build Prompts

> A session-by-session build guide. Paste **one Step** at a time into a fresh Claude Code (Opus, max effort) session. Each step is self-contained: it tells the session what to read, the constraints to respect, the files to touch, and how to know it's done. Run them **in order** — later steps depend on earlier ones.

## How to use this file

1. Start a new session. Paste the **"Every-session preamble"** below, then the **Step N** block.
2. Let the session finish, including its `tsc --noEmit` check and its `TASKS.md` update.
3. Commit (the step tells you the branch + conventional-commit message).
4. Next session: next Step.

## Decisions baked into these prompts (change a step's text if you disagree)

- **~28 Germany scenarios** + 1 aggregate test, in 6 categories (see Appendix A).
- **Per-scenario Test mode is scored, not instant-fail**: the user answers every MCQ for that scenario, sees the correct answer + explanation, and gets a score at the end. The **Full Test — Germany** keeps the existing graded `TestSession` (A/B/C/F, 75% pass).
- **Practice mode teaches**: the car pauses, a panel explains the situation + rule, the car performs the correct action automatically, the user clicks **Continue**.
- **Reusable, procedural NPC traffic** (car/bus/ambulance/cyclist/pedestrian) — no external 3D assets; everything is Three.js geometry, consistent with the existing procedural car.
- **i18n-ready**: wrap user-facing strings in a `t()` helper now (English values), even before translations exist.

## Every-session preamble (paste at the top of EVERY step)

```
You are working on RoadReady (roadready.online), a browser-based 3D driving sim.
Before doing anything, read these files in full:
- CLAUDE.md
- SIMULATION_DESIGN.md
- TASKS.md
- PROMPT.md  (this build guide — read the "Global rules & constraints" section below and the step I paste)

Hard rules you must respect:
- TypeScript only; functional components + hooks; Zustand for global state; React Three Fiber for all 3D; Tailwind for styling.
- All API calls go through apps/web/src/utils/api.ts — never call fetch() directly in a component.
- Prisma is pinned to 6.0.0. Do NOT upgrade. Do NOT create prisma.config.ts. The seed uses upsert and is safe to re-run.
- Coordinate system: -Z is forward, +Y rotation is a left turn. Car spawns at (0, 1.5, 40) facing -Z.
- Road facts: Road 1 (N-S) centred x=0 width 7 (edges x=±3.5); Road 2 (E-W) centred z=-5; stop line x=-44.8; crosswalk x=-46.5.
- JUNCTION CLEARANCE (never place obstacles here): the left-turn arc sweeps x∈[0,-14], z∈[-2,-6]. Preserve the existing safety margins in CityEnvironment.tsx.
- Challenge/decision id MUST equal the matching objective id, or pass/fail breaks silently.
- Vite is port 5173 (strictPort); API is port 3001.
- When done: run `cd apps/web && npx prettier --write "**/*.{ts,tsx,json,md}"` then `npx tsc --noEmit` in BOTH apps/web and apps/api (zero errors), update TASKS.md (move items Todo→Done with details), and stop. Do not push unless I tell you to.

Then implement ONLY the step I paste next.
```

## Global rules & constraints (reference — the preamble points here)

- **Monorepo**: `apps/web` (Vite frontend, 5173), `apps/api` (Express, 3001), `packages/shared` (types). Run everything from repo root (`npm run dev`).
- **Seed**: `apps/api/prisma/seed.ts`, runs via `cd apps/api && npm run db:seed`. Deterministic IDs, `upsert`. Country DE id is created via upsert on code `DE`.
- **Scenario API** (already built, do not break): `GET /api/scenarios`, `/api/scenarios/:slug`, `/api/scenarios/:slug/questions` (returns ALL questions for the slug, options shuffled, `isCorrect` hidden), `/api/countries/:code/scenarios` (grouped by category). Test session: `POST /api/test-sessions`, `POST .../:id/answers`, `PATCH .../:id/complete`, `GET .../:id`.
- **Frontend scenario registry**: `apps/web/src/simulation/scenarios/index.ts` maps `slug → ScenarioDef`. A scenario is playable only if registered here.
- **Reference scenario modules** to copy from: `basicControls.ts`, `trafficLights.ts`.
- **Scene root**: `apps/web/src/simulation/scene/SimulationScene.tsx`. Shared elements: `Lighting`, `Ground`, `GermanCityRoad`, `CityEnvironment`, `CarController`, `FollowCamera`. Scenario-specific elements are currently gated by an `isTrafficLights` boolean — Step 6 replaces this with a declarative per-scenario scene-prop list.
- **gameStore** (`apps/web/src/store/gameStore.ts`): has `scenarioPhase`, `objectives`, `carState`, `driveMode`, `activeChallenge` (key-press), `resolvedChallengeIds`. It does NOT yet have mode or MCQ state — Step 2 adds it.
- **Git**: branch per step (`feature/...`), conventional commits, end commit body with the Co-Authored-By line the harness requires. Run `npm run build` before any push.

---

## STEP 1 — Database & seed foundation (multi-MCQ + all Germany scenarios)

```
GOAL
Make the seed support MULTIPLE MCQ questions per scenario, then seed the full comprehensive Germany scenario set with rich question banks. This is pure content/data — no 3D yet. Everything else depends on this.

READ FIRST
- apps/api/prisma/schema.prisma (Scenario, Question, Option, ScenarioCategory, Country, ScenarioType)
- apps/api/prisma/seed.ts (the current ScenarioSeed type + the question/option upsert loop)
- apps/api/src/routes/scenarios.ts (the /:slug/questions endpoint — confirm it already returns ALL questions)

WHAT TO DO

1) Convert the seed's single-question shape to a multi-question array.
   - Current ScenarioSeed has `question: { text, explanation, options: {text, correct}[] }`.
   - Change it to `questions: { text, explanation, options: {text, correct}[] }[]`.
   - Update the seeding loop: for each scenario, loop over `questions` with index qIdx and upsert:
       question id  = `q-${s.id}-${qIdx}`, order = qIdx + 1
       option id    = `opt-${s.id}-${qIdx}-${i}`, order = i + 1
   - Convert BOTH the existing Germany AND France scenario definitions to the new `questions: [...]` array shape (wrap each existing single question in an array) so France keeps working. Keep all existing slugs, ids, orders, categories unchanged.
   - Keep using upsert everywhere; seed must remain safe to re-run.

2) Expand Germany categories to 6 (upsert; keep existing ids where present). Use ids like cat-de-basic, cat-de-priority, cat-de-signals, cat-de-signs, cat-de-vru, cat-de-special:
   - Basic Skills (order 1)
   - Right of Way & Priority (order 2)
   - Traffic Lights & Signals (order 3)
   - Road Signs (order 4)
   - Vulnerable Road Users (order 5)
   - Special Situations & Highway (order 6)
   Re-point existing Germany scenarios to the right new category (e.g. rechts-vor-links → Right of Way & Priority).

3) Seed the full Germany scenario set (see "Appendix A — Germany scenarios" in PROMPT.md for the exact slug/name/category/order list). Keep the 4 existing slugs (basic-controls, rechts-vor-links, roundabout, traffic-lights, priority-road-signs, vorfahrt-priority-intersection, emergency-vehicle, pedestrian-crossing, autobahn-rules, full-test-germany) and ADD the new ones. Every PRACTICE scenario must have **3–5 high-quality MCQ questions**; the TEST scenario (full-test-germany) needs no questions of its own (it aggregates).
   - Use deterministic ids: `scen-de-<slug>`.
   - For each MCQ: 4 options, exactly one correct, plus a one-sentence `explanation` that teaches the rule.
   - Write real German-rule-accurate content (see "Appendix B — MCQ authoring rules"). No placeholder text.

4) Run `cd apps/api && npm run db:seed` and confirm it succeeds. Then sanity-check with `npx prisma studio` notes in your summary (counts of scenarios + questions for DE).

FILES
- apps/api/prisma/seed.ts (main change)
- (no schema migration needed — the relations already support many questions)

ACCEPTANCE
- `npm run db:seed` runs clean and is idempotent (run it twice).
- `GET /api/scenarios/full-test-germany/questions` is irrelevant (test has none); pick any practice slug, e.g. `GET /api/scenarios/rechts-vor-links/questions` returns 3–5 questions, each with 4 shuffled options and NO isCorrect field.
- `npx tsc --noEmit` passes in apps/api.
- TASKS.md updated.

COMMIT
branch: feature/seed-germany-scenarios ; message: "feat: seed comprehensive Germany scenarios with multi-MCQ banks"
```

---

## STEP 2 — Practice/Test plumbing (state, routing, two buttons, questions hook)

```
GOAL
Add the mode + MCQ machinery so the app can launch a scenario in Practice or Test mode, and can fetch a scenario's MCQs. No overlays yet (Step 3) — just state, routing, the scenario-list buttons, and the data hook.

READ FIRST
- apps/web/src/store/gameStore.ts  (current store)
- apps/web/src/pages/Simulation.tsx (how a scenario launches today: route /simulation/:scenarioId, calls startScenario(def.config) + setDriveMode)
- apps/web/src/pages/Home.tsx (ScenarioCard "Practice" + TestCard "Take Test" — both currently link to /simulation/:slug with NO mode)
- apps/web/src/utils/api.ts (central fetch client) and apps/web/src/store/userStore.ts

WHAT TO DO

1) gameStore additions:
   - `attemptMode: 'practice' | 'test'` (default 'practice') + `setAttemptMode(mode)`.
   - MCQ state:
       `mcqQueue: McqQuestion[]`          // questions still to ask in this test run
       `activeMcq: McqQuestion | null`    // currently shown question
       `mcqResult: 'pending' | 'correct' | 'wrong' | null`
       `mcqSelectedOptionId: string | null`
       `mcqAsked: number`, `mcqCorrect: number`  // running per-scenario score
     where McqQuestion = { id: string; questionText: string; options: {id:string; text:string}[]; correctOptionId?: string; explanation?: string }.
     (Note: the API hides isCorrect; see step 2.4 for how we evaluate. Store correctOptionId only if we choose client-side eval for practice-test; otherwise evaluate via the test-session API. Default: per-scenario test evaluates client-side using a separate authoritative check — see below.)
   - Actions: `startMcqSequence(questions)`, `selectMcqOption(id)`, `submitMcq()`, `advanceMcq()` (pop next from queue or finish), `resetMcq()`.
   - Extend `startScenario` and `resetScenario` to also reset all MCQ fields.
   - Add a derived `isPausedForInput` concept: the car must brake when `activeChallenge` OR `activeMcq` OR an active teaching panel is showing (Step 3 wires the panel). For now expose `mcqActive: boolean` derived in components via the store.

2) Routing / Simulation.tsx:
   - Read mode from the query string with react-router's useSearchParams: `/simulation/:scenarioId?mode=practice|test` (default 'practice').
   - On mount, call setAttemptMode(mode) in addition to startScenario + setDriveMode.

3) Home.tsx scenario list:
   - For each PRACTICE scenario, render TWO buttons/links: "Practice" → `/simulation/${slug}?mode=practice`, and "Test" → `/simulation/${slug}?mode=test`. Keep the lock/premium logic (order ≤ 3 unlocked unless isPremium). Use the existing t() pattern if present, else wrap strings in a local t() placeholder.
   - The TEST-type scenario (full-test-germany) keeps its single "Take Test →" entry → `/simulation/full-test-germany?mode=test` (its full flow lands in Step 8).

4) Questions data hook:
   - Add `api.scenarios.getQuestions(slug)` to utils/api.ts if not present (GET /api/scenarios/:slug/questions).
   - Create apps/web/src/hooks/useScenarioQuestions.ts: fetches questions for a slug once on scenario start, caches in a ref/state, exposes { questions, loading, error }.
   - IMPORTANT correctness decision: the API hides isCorrect. For per-scenario PRACTICE-style Test scoring we still need to know the right answer to show "correct + explanation". Two options — implement option (a):
       (a) Add a NEW endpoint `GET /api/scenarios/:slug/questions/answers` (auth-guarded) that returns questions WITH correctOptionId + explanation, used only by the scored per-scenario test (low stakes, not the graded full test). Wire it in scenarios route + api.ts + the hook.
       (b) Or reuse POST /api/test-sessions answer-checking — heavier. Do NOT use for per-scenario practice test.
     Implement (a). Keep the existing isCorrect-hidden endpoint untouched for the graded Full Test.

FILES
- apps/web/src/store/gameStore.ts
- apps/web/src/pages/Simulation.tsx
- apps/web/src/pages/Home.tsx
- apps/web/src/utils/api.ts
- apps/web/src/hooks/useScenarioQuestions.ts (new)
- apps/api/src/routes/scenarios.ts (new answers endpoint)

ACCEPTANCE
- Navigating to /simulation/traffic-lights?mode=test sets attemptMode='test' in the store (verify via React devtools or a temporary log).
- Each practice scenario in Home shows BOTH Practice and Test buttons; locked scenarios still locked.
- useScenarioQuestions returns the scenario's questions; the new answers endpoint returns correctOptionId + explanation.
- tsc passes in both apps; TASKS.md updated.

COMMIT
branch: feature/practice-test-plumbing ; message: "feat: add practice/test mode state, routing and questions hook"
```

---

## STEP 3 — Overlays (MCQ popup + teaching panel) and CarController integration

```
GOAL
Build the two on-screen experiences and connect them to the autopilot so the car stops, the right overlay shows, and the run resumes. After this step, Practice and Test mode are visibly different and a scenario can be completed end-to-end with MCQs (using whatever scenarios are registered — traffic-lights/basic-controls for now).

READ FIRST
- apps/web/src/components/ChallengeOverlay.tsx (current key-press overlay — the pattern to evolve)
- apps/web/src/simulation/vehicles/CarController.tsx (autopilot useFrame loop; the challenge-pending braking block ~lines 239-273; how challenges trigger via triggerZ/triggerX)
- apps/web/src/simulation/scenarios/ScenarioRunner.tsx (per-frame checker; merges resolvedChallengeIds into objectives)
- apps/web/src/store/gameStore.ts (with the Step 2 additions)
- apps/web/src/components/ResultsScreen.tsx (post-run modal pattern + how it saves via POST /api/progress)

WHAT TO DO

1) MCQOverlay.tsx (new, in components/):
   - Transparent / frosted (backdrop-blur-sm bg-black/40) so the road shows through.
   - DRAGGABLE: mousedown on a header bar + mousemove repositions via a useState offset (translate). Stays within viewport.
   - Renders activeMcq.questionText + 4 lettered option buttons (A/B/C/D); highlight the selected option; a Confirm button submits.
   - On confirm: evaluate against correctOptionId (from the Step-2 answers endpoint); set mcqResult; show ✅/❌ + the explanation; show a Continue/Next button.
   - Continue: advanceMcq() — if more questions in queue, show the next; if none, finish: close overlay, mark the scenario's decision objective complete (so ScenarioRunner can pass), and let the car resume. Accumulate mcqAsked/mcqCorrect.
   - Per-scenario test is SCORED, never instant-fail: a wrong answer still shows correct+explanation and continues.

2) TeachingOverlay.tsx (new, in components/) — PRACTICE mode:
   - Solid, readable panel (not necessarily draggable). Shows the decision point's `prompt` (situation) + `teaching` (the rule explanation, e.g. "This is a give-way sign (Vorfahrt gewähren). You must let crossing/oncoming traffic pass before you go.").
   - One "Continue" button. On Continue: mark the matching objective complete and resume autopilot (the car then performs the correct action automatically).
   - No keyboard requirement; this is teaching, not a test.

3) Decision-point trigger logic:
   - Extend the ChallengePoint/decision type (in simulation/scenarios/types.ts) to carry: `teaching: string` (practice text) and `questionOrders?: number[]` (which DB question orders to ask in test mode; default = all questions for the scenario). Keep optional legacy `correctKey/correctKeyLabel` so existing key-press scenarios still type-check.
   - In CarController (or a small new TriggerWatcher in ScenarioRunner), when the car reaches a decision point:
       practice → store.triggerTeaching(point)  → TeachingOverlay
       test     → build the question queue from useScenarioQuestions (filtered/ordered per questionOrders) and store.startMcqSequence(queue) → MCQOverlay
   - The car must brake while EITHER overlay is open. Extend the existing "challenge pending" braking condition to also brake when activeMcq or active teaching is present. Reuse the existing braking impulse block — do not write a second physics path.

4) Per-scenario test results:
   - ScenarioTestResults.tsx (new): after the last MCQ + the car finishes the path (scenarioPhase 'passed'), show "You scored X / N" with a per-question recap (correct/your-answer/explanation), plus Retry and Back-to-scenarios. Save the attempt via the existing POST /api/progress (passed = score ≥ pass threshold, default ≥ 60%). Practice mode keeps using the normal ResultsScreen.
   - Render ScenarioTestResults instead of ResultsScreen when attemptMode === 'test' (in Simulation.tsx).

5) Mount the overlays in Simulation.tsx (MCQOverlay + TeachingOverlay alongside the existing ChallengeOverlay; only one is active at a time based on store state).

6) Migrate basicControls.ts and trafficLights.ts decision points to add `teaching` text and map to their seeded questions, as the proof-of-concept (so both scenarios work in BOTH modes).

FILES
- apps/web/src/components/MCQOverlay.tsx (new)
- apps/web/src/components/TeachingOverlay.tsx (new)
- apps/web/src/components/ScenarioTestResults.tsx (new)
- apps/web/src/simulation/scenarios/types.ts (extend decision type)
- apps/web/src/simulation/vehicles/CarController.tsx (brake-while-overlay; trigger practice vs test)
- apps/web/src/simulation/scenarios/ScenarioRunner.tsx (if you put the trigger watcher here)
- apps/web/src/pages/Simulation.tsx (mount overlays + choose results screen)
- apps/web/src/simulation/scenarios/basicControls.ts, trafficLights.ts (add teaching + question mapping)

ACCEPTANCE
- traffic-lights in PRACTICE: car stops, teaching panel explains the red light, Continue resumes, light turns green, car drives on, normal results screen.
- traffic-lights in TEST: car stops, transparent draggable MCQ popup appears, you can drag it aside to see the road, answering all its MCQs accumulates a score, then ScenarioTestResults shows X/N with explanations.
- Car physically brakes whenever an overlay is open; resumes after.
- tsc passes both apps; TASKS.md updated.

COMMIT
branch: feature/mcq-and-teaching-overlays ; message: "feat: add MCQ popup, teaching panel and practice/test results"
```

---

## STEP 4 — German environment (buildings, road details, signs, street furniture)

```
GOAL
Make the world look German. Static props only (no moving traffic yet — that's Step 5). Keep the junction clearance + CityEnvironment safety margins intact.

READ FIRST
- apps/web/src/simulation/scene/Building.tsx, Tree.tsx, CityEnvironment.tsx (placement + safety zones)
- apps/web/src/simulation/scene/GermanCityRoad.tsx (exact road coords)
- apps/web/src/simulation/scene/TrafficLight.tsx (procedural-prop pattern to mimic)

WHAT TO DO

1) German-style buildings — extend Building.tsx with a `style` prop: 'altbau' | 'fachwerk' | 'shop' | 'modern' (default keeps current look).
   - altbau: 4–6 storeys, plastered pastel facade (ochre/cream/terracotta/pale-green/blue), regular rows of windows (instanced small boxes computed from height), simple cornice, pitched/gabled roof (two angled boxes or an extruded prism) in red/grey tile colour.
   - fachwerk (half-timbered): cream wall with dark timber beams (thin dark boxes forming an X/grid), steep gable roof.
   - shop: altbau body with a glazed ground-floor shopfront (darker glass band + awning).
   - modern: current flat box (keep as fallback).
   - Keep performance sane: build window grids with instancedMesh or memoized geometry; pre-allocate, no per-frame allocation.

2) Use the new styles in CityEnvironment.tsx — vary styles deterministically (seededRand) along both streets. DO NOT change the safety margins or junction clearance (left side z≥8, right side z≥-6, road-2 north x≤-16, road-2 south x≤-12; turn arc x∈[0,-14], z∈[-2,-6] stays empty).

3) German road details in GermanCityRoad.tsx (additive, keep existing coords):
   - A red-tinted **bike lane** strip alongside the right curb of one street (very German).
   - **Give-way "shark teeth" (Haifischzähne)** triangle markings option near a side approach.
   - Optional **parking bay** dashed markings on one straight.
   - Keep stop line (x=-44.8) + zebra crosswalk (x=-46.5).

4) New procedural prop components in scene/ (each takes a position prop, all geometry, no assets):
   - RoadSign.tsx — a pole + a sign face whose `kind` prop renders the right German sign via a canvas-drawn texture or simple geometry: give-way (downward red triangle), stop (red octagon "STOP"), priority-road (yellow diamond), right-of-way/rechts-vor-links (cross warning), pedestrian-crossing (blue square + walker), speed-limit (red ring + number prop), roundabout (3 blue arrows), no-entry, no-overtaking, autobahn (blue), tram, school/children. Use a `label`/`number` prop for variants.
   - BusStop.tsx — green/yellow German "H" bus-stop sign + a simple shelter (posts + flat roof + bench).
   - StreetFurniture: StreetLamp.tsx, Bench.tsx, Bollard.tsx (small, reusable).
   - PedestrianCrossingSign or reuse RoadSign kind='pedestrian-crossing'.

5) Do NOT wire these per-scenario yet (Step 6 does the declarative placement). For this step, render a small demonstrative set in the shared scene (or behind a dev flag) so you can verify they look right, but keep the turn arc + clearances clear.

FILES
- apps/web/src/simulation/scene/Building.tsx (style variants)
- apps/web/src/simulation/scene/CityEnvironment.tsx (use variants; preserve margins)
- apps/web/src/simulation/scene/GermanCityRoad.tsx (bike lane, shark teeth, parking bays)
- apps/web/src/simulation/scene/RoadSign.tsx, BusStop.tsx, StreetLamp.tsx, Bench.tsx, Bollard.tsx (new)

ACCEPTANCE
- The streets read as German (altbau/fachwerk facades, pitched roofs, pastel colours, bike lane).
- RoadSign renders at least: give-way, stop, priority-road, speed-limit(number), pedestrian-crossing, roundabout — recognizable.
- No object intrudes into the turn arc or the documented safety zones; the car still drives basic-controls cleanly.
- Frame rate is acceptable (use instancing/memo for windows); tsc passes; TASKS.md updated.

COMMIT
branch: feature/german-environment ; message: "feat: german-style buildings, road details, road signs and street furniture"
```

---

## STEP 5 — Reusable NPC traffic system (vehicles, pedestrians, manager, light cycles)

```
GOAL
Add moving, procedural NPCs that scenarios can place declaratively. Build the SYSTEM here; Step 6 choreographs specific scenarios with it.

READ FIRST
- apps/web/src/simulation/vehicles/CarController.tsx (procedural CarMesh + waypoint-follow math: desiredYaw = atan2(-dx,-dz); reuse the approach)
- apps/web/src/simulation/scene/TrafficLight.tsx (phase prop)
- The empty folder apps/web/src/simulation/traffic/ (put new code here)

WHAT TO DO

1) NPCVehicle.tsx (traffic/) — a procedural vehicle that follows a Waypoint[] path.
   - `variant` prop: 'car' | 'bus' | 'ambulance' | 'cyclist'. Distinct procedural meshes (bus = long box; ambulance = white van + roof bar with BLUE flashing lights (German emergency = blue) — animate emissive; cyclist = thin frame + rider capsule + 2 wheels).
   - Movement: simplest robust approach is KINEMATIC position+yaw lerp along the path (not full Rapier dynamics) to avoid NPC-player physics fights. Expose props: path, speed, loop?, startDelay?, onArrive?.
   - `stopUntil?: () => boolean` or a `paused` prop so a manager can hold an NPC at a red light / give-way.
   - Pre-allocate THREE.Vector3 outside useFrame; clean up on unmount.

2) Pedestrian.tsx (traffic/) — a simple walking figure (capsule body + head + swinging legs via small rotation) that walks along a short path across the zebra crossing; `paused` prop to make it wait.

3) TrafficManager.tsx (traffic/) — given a declarative list of NPC spawns (variant, path, speed, behavior), renders the NPCVehicle/Pedestrian set and coordinates simple rules:
   - stop at red traffic light (reads the light phase / resolvedChallengeIds),
   - yield/give-way hold until a condition,
   - emergency vehicle approach trigger.
   Keep collision handling minimal (spacing along a path / stop flags), not full AI.

4) Timed traffic-light cycle: add an optional self-cycling mode to TrafficLight (red→green→yellow→red with configurable durations) OR a small useTrafficLight hook, so scenarios that aren't gated by a challenge can still show realistic lights. Keep the existing challenge-driven phase for traffic-lights scenario.

5) Types: add an NpcSpawn type to simulation/scenarios/types.ts (variant, path: Waypoint[], speed, behavior?, startDelay?). Step 6 will let a ScenarioDef declare `npcs: NpcSpawn[]`.

FILES
- apps/web/src/simulation/traffic/NPCVehicle.tsx (new)
- apps/web/src/simulation/traffic/Pedestrian.tsx (new)
- apps/web/src/simulation/traffic/TrafficManager.tsx (new)
- apps/web/src/simulation/traffic/useTrafficPath.ts (new, optional helper)
- apps/web/src/simulation/scene/TrafficLight.tsx (optional timed cycle)
- apps/web/src/simulation/scenarios/types.ts (NpcSpawn type)

ACCEPTANCE
- A temporary dev mount shows: a car driving a path, a bus, an ambulance with flashing blue lights, a cyclist on the bike lane, and a pedestrian crossing the zebra — all smooth and cleaned up on unmount.
- NPCs can be paused/held (verify the manager can stop a car at the red light).
- No NPC fights the player car's physics; framerate stays smooth; tsc passes; TASKS.md updated.

COMMIT
branch: feature/npc-traffic-system ; message: "feat: reusable procedural NPC traffic (car/bus/ambulance/cyclist/pedestrian) + manager"
```

---

## STEP 6 — Declarative scene-prop system + 4–5 core choreographed scenarios

```
GOAL
Stop hard-coding scene elements with `isTrafficLights`. Let each ScenarioDef declare the signs, lights, NPCs and stop zones it needs, and SimulationScene renders them generically. Then fully build the 4–5 flagship scenarios.

READ FIRST
- apps/web/src/simulation/scene/SimulationScene.tsx (the isTrafficLights gating to replace)
- apps/web/src/simulation/scenarios/types.ts, index.ts
- The Step 4 props (RoadSign, BusStop) and Step 5 NPCs/manager

WHAT TO DO

1) Extend ScenarioDef (types.ts) with declarative scene data:
   - `signs?: { kind: string; position:[number,number,number]; rotationY?: number; label?: string; number?: number }[]`
   - `npcs?: NpcSpawn[]`
   - keep existing `stopZone?`, `waypoints?`, and the decision points (now carrying teaching + questionOrders from Step 3).
2) SimulationScene: replace the isTrafficLights boolean with a generic renderer that reads def.signs → <RoadSign/>, def.npcs → <TrafficManager spawns={def.npcs}/>, def.stopZone → <StopZone/>, and keeps traffic lights where a scenario declares them. Remove the special-case boolean (but keep traffic-lights working through the new declarative path).
3) Build/upgrade these flagship scenarios end-to-end (module + register in index.ts + ensure seeded MCQs from Step 1 match by order). Each needs: waypoints, ONE primary decision point with teaching text + questionOrders, signs, and NPCs where relevant. Challenge/decision id MUST equal objective id.
   a) give-way-sign (Vorfahrt gewähren) — approach a side road with a give-way sign; an NPC car crosses from the priority road; PRACTICE teaches "give way to crossing traffic", TEST asks the MCQs. Car waits for the NPC then proceeds.
   b) rechts-vor-links — unmarked 4-way; NPC car approaches from the RIGHT; rule: right before left; car yields then goes.
   c) pedestrian-crossing — pedestrian (Step 5) steps onto the zebra at x≈-46.5; car must stop; teaches "must stop for pedestrians at a Zebrastreifen".
   d) emergency-vehicle — ambulance approaches from behind with blue lights; teaches Rettungsgasse / pull right; car moves right and stops.
   e) cyclist-blind-spot — turning across a bike lane; a cyclist is in the blind spot (toter Winkel); teaches shoulder-check before turning.
4) traffic-lights and basic-controls: re-express their scene elements through the new declarative fields (remove any remaining special-casing).

FILES
- apps/web/src/simulation/scenarios/types.ts (signs/npcs on ScenarioDef)
- apps/web/src/simulation/scene/SimulationScene.tsx (generic renderer)
- apps/web/src/simulation/scenarios/{give-way-sign,rechts-vor-links,pedestrian-crossing,emergency-vehicle,cyclist-blind-spot}.ts (new)
- apps/web/src/simulation/scenarios/index.ts (register the new modules)
- apps/web/src/simulation/scenarios/{trafficLights,basicControls}.ts (migrate to declarative scene data)

ACCEPTANCE
- SimulationScene no longer references isTrafficLights; all scene elements come from the ScenarioDef.
- All 5 flagship scenarios play in BOTH practice and test, with correct teaching text and matching MCQs, NPCs behaving (give-way car crosses, rechts-vor-links car from right, pedestrian crosses, ambulance from behind, cyclist in blind spot).
- Junction clearance respected; tsc passes; TASKS.md updated.

COMMIT
branch: feature/declarative-scenarios-core ; message: "feat: declarative scene props + 5 core German scenarios with NPCs"
```

---

## STEP 7 — Remaining scenarios (batch) — every scenario playable

```
GOAL
Make EVERY remaining Germany practice scenario at least playable in both modes, using the generic system from Step 6. Bespoke geometry (true roundabout ring, long Autobahn) can be simplified now and deepened later via TASKS.md — but nothing should be "Coming soon".

READ FIRST
- The Step 6 flagship modules as templates
- Appendix A (full slug list) + the seeded MCQs from Step 1

WHAT TO DO

1) Create a small helper `makeScenario(...)` (in scenarios/) that builds a standard ScenarioDef from: slug, name, objectives, a base waypoint path on the shared L-road, decision point(s) with teaching + questionOrders, and optional signs/npcs. This keeps each remaining module short and consistent.
2) Implement and register every remaining slug from Appendix A that isn't done yet, e.g.: mirror-signal-maneuver, speed-stopping-distance, parking-rules-de, stop-sign, vorfahrt-priority-intersection, priority-road-signs, turning-left-oncoming, roundabout, green-arrow, signals-override, prohibition-signs, mandatory-signs, speed-limit-tempo30, warning-signs, tram-priority, school-zone, bus-stop, autobahn-rules, zipper-merge, railway-crossing, adverse-conditions.
   - Each: reuse the shared road + a sign + (where natural) an NPC; one decision point with teaching text; questionOrders mapping to its seeded MCQs.
   - For roundabout/autobahn/railway-crossing: use a SIMPLIFIED representation now (e.g. a curved waypoint set + a roundabout sign for roundabout; a straight fast section + autobahn sign; a level-crossing prop + barrier). Note the "deepen later" item in TASKS.md.
3) Verify each is registered in index.ts and that its slug exactly matches the seeded slug, so it shows as playable in Home.

FILES
- apps/web/src/simulation/scenarios/makeScenario.ts (new helper)
- apps/web/src/simulation/scenarios/<each-remaining-slug>.ts (new)
- apps/web/src/simulation/scenarios/index.ts (register all)

ACCEPTANCE
- Every Germany practice scenario in Home launches and completes in BOTH practice and test (no "Coming soon", no crash).
- Slugs match the DB exactly; MCQs load per scenario.
- tsc passes; TASKS.md updated (list which scenarios are full vs simplified-for-now).

COMMIT
branch: feature/all-germany-scenarios ; message: "feat: implement remaining Germany scenarios via generic builder"
```

---

## STEP 8 — Aggregate Full Test flow + polish + i18n + QA + docs

```
GOAL
Finish the graded "Full Test — Germany", harden the whole experience, scaffold i18n, and tidy docs.

READ FIRST
- apps/api/src/routes/testSessions.ts (create/answer/complete/grade A/B/C/F at 75%)
- apps/web/src/pages/Home.tsx (TestCard) and Simulation.tsx

WHAT TO DO

1) Full Test — Germany flow (full-test-germany, type TEST):
   - On start: POST /api/test-sessions { countryId } → session id (maxScore = count of all active DE questions).
   - Drive a short combined route that pauses at several decision zones; at each, present MCQs drawn across scenarios (use the isCorrect-HIDDEN endpoint; submit each answer to POST /api/test-sessions/:id/answers and show the returned explanation).
   - On finish: PATCH /api/test-sessions/:id/complete → show TestResultsScreen.tsx with grade (A/B/C/F), total/max, pass/fail, and a per-question breakdown (GET /api/test-sessions/:id).
2) i18n scaffolding: add apps/web/src/utils/i18n.ts exporting a `t(key, fallback?)` returning English now; replace hard-coded user-facing strings in the new overlays/results/Home buttons with t(). No translation files required yet.
3) Polish & QA:
   - Responsive: overlays + HUD usable on small screens; MCQ popup stays in-viewport when dragged.
   - Ensure the car always brakes for any open overlay and resumes cleanly; no double-trigger of decision points (reuse triggeredRef guard).
   - Confirm progress saving still works (POST /api/progress) and UserScenarioProgress updates.
   - Run `npm run build` at root; fix any build errors.
4) Docs: update README scenario tables, TASKS.md (move everything delivered to Done; list deferred deepening — true roundabout mesh, long Autobahn, weather/day-night, France parity), and add a short "Practice vs Test" section to SIMULATION_DESIGN.md describing the overlays + scoring.

FILES
- apps/web/src/simulation/scenarios/fullTestGermany.ts (new) + index.ts
- apps/web/src/components/TestResultsScreen.tsx (new or finish)
- apps/web/src/utils/i18n.ts (new)
- README.md, TASKS.md, SIMULATION_DESIGN.md

ACCEPTANCE
- Full Test runs: creates a session, records answers, completes with a real grade + breakdown.
- `npm run build` succeeds; tsc passes both apps; overlays responsive.
- Docs updated; TASKS.md reflects final state.

COMMIT
branch: feature/full-test-and-polish ; message: "feat: graded full test, i18n scaffolding, polish and docs"
```

---

## Appendix A — Germany scenarios (slug · name · category · order)

Basic Skills

- basic-controls · Basic Controls · 1
- mirror-signal-maneuver · Mirror, Signal, Maneuver (Spiegel–Blinker–Schulterblick) · 2
- speed-stopping-distance · Speed & Stopping Distance · 3
- parking-rules-de · Parking & Stopping (Halten & Parken) · 4

Right of Way & Priority

- rechts-vor-links · Rechts vor Links — Right before Left · 5
- give-way-sign · Give Way / Yield (Vorfahrt gewähren) · 6
- stop-sign · Stop Sign (Stoppschild) · 7
- priority-road-signs · Priority Road (Vorfahrtstraße) · 8
- vorfahrt-priority-intersection · Vorfahrt at Next Intersection · 9
- turning-left-oncoming · Turning Left with Oncoming Traffic · 10
- roundabout · Roundabout (Kreisverkehr) · 11

Traffic Lights & Signals

- traffic-lights · Traffic Lights · 12
- green-arrow · Green Arrow — Right Turn on Red (Grünpfeil) · 13
- signals-override · Signal Priority Order (police/lights/signs) · 14

Road Signs

- prohibition-signs · Prohibition Signs (no entry / no overtaking) · 15
- mandatory-signs · Mandatory Direction Signs · 16
- speed-limit-tempo30 · Speed Limits & Tempo-30 Zone · 17
- warning-signs · Warning Signs · 18

Vulnerable Road Users

- pedestrian-crossing · Pedestrian Crossing (Zebrastreifen) · 19
- cyclist-blind-spot · Cyclists & Blind Spot (Toter Winkel) · 20
- tram-priority · Tram Priority (Straßenbahn) · 21
- school-zone · School Zone & Children · 22

Special Situations & Highway

- emergency-vehicle · Emergency Vehicle & Rettungsgasse · 23
- bus-stop · Bus Stop (Linienbus pulling out) · 24
- autobahn-rules · Autobahn Rules · 25
- zipper-merge · Zipper Merge (Reißverschlussverfahren) · 26
- railway-crossing · Railway Crossing (Bahnübergang) · 27
- adverse-conditions · Fog, Rain & Night Driving · 28

Test

- full-test-germany · Full Test — Germany · 29 · type TEST (no own questions)

## Appendix B — MCQ authoring rules (apply when seeding in Step 1)

- 3–5 questions per practice scenario; exactly 4 options each; exactly one correct.
- Content must be accurate to German rules (StVO). Examples to cover:
  - rechts-vor-links: at unmarked junctions, yield to traffic from the right.
  - give-way / Vorfahrt gewähren (inverted triangle): let crossing/priority traffic pass.
  - stop sign: full stop at the line even if clear.
  - priority road (yellow diamond): you have priority until it ends.
  - roundabout: traffic IN the roundabout has priority; indicate right when exiting; do not indicate on entry.
  - traffic lights: red = stop at line; amber = stop if safe; right-turn-on-red ONLY with a green arrow sign (Grünpfeil) after a full stop.
  - pedestrian crossing (Zebrastreifen): must stop for waiting/crossing pedestrians.
  - cyclist blind spot: shoulder-check (Schulterblick) before turning across a bike lane.
  - emergency vehicle: form a Rettungsgasse (between left lane and the rest); on a single carriageway pull right and stop.
  - bus stop: a bus indicating to leave a stop in town has priority — let it pull out; pass a stopped bus with hazard lights at walking pace.
  - Autobahn: keep right, overtake on the left only; recommended 130 km/h where unlimited; hard shoulder not for driving.
  - zipper merge (Reißverschluss): merge alternately at the point the lane ends.
  - Tempo-30 zone: 30 km/h; often rechts-vor-links inside.
  - tram: trams generally have priority; pass a stopped tram carefully, stop if passengers board/alight where required.
- Each question's `explanation` is one clear sentence that teaches the rule (reused in practice teaching where helpful).

## Appendix C — Key coordinates & guardrails (do not violate)

- Car spawn (0, 1.5, 40), facing -Z. -Z forward, +Y = left turn.
- Road 1 (N-S) centre x=0, width 7, edges x=±3.5, z from 45 to -9.
- Road 2 (E-W) centre z=-5, width 7, x from ~3.5 to -62.
- Stop line x=-44.8; zebra crosswalk x=-46.5.
- Junction clearance (keep empty): turn arc x∈[0,-14], z∈[-2,-6].
- CityEnvironment safety margins: left side z≥8, right side z≥-6, road-2 north x≤-16, road-2 south x≤-12. Do not soften.
- Decision/challenge id MUST equal the matching objective id.
- Prisma 6.0.0 pinned; no prisma.config.ts; seed is upsert/idempotent.
- tsc --noEmit must pass in BOTH apps before committing.
