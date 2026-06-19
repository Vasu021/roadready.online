# RoadReady — Simulation Design

> Technical reference for Claude agents working on the 3D simulation system.
> Read this alongside `CLAUDE.md` at the start of any session touching simulation code.

---

## Product Philosophy

The car always drives itself (autopilot). The user never needs to steer — they only make **decisions** at critical moments. This mirrors what actually matters in a real driving test: knowing the rules, not operating the pedals. Scenarios pause at a key moment and present the user with an MCQ question or a key-press challenge. The simulation teaches muscle memory: "I've been in this situation before — I know what to do."

---

## Coordinate System

Three.js uses a **right-handed, Y-up coordinate system**:

```
     +Y (up)
      │
      │    -Z (forward = car default facing direction)
      │   /
      │  /
      │ /
      └──────── +X (right)
```

- Car spawns at `(0, y, 40)` facing **-Z** (south in the scene)
- A left turn = increasing Euler Y rotation (+Y rotation)
- Car forward vector = `(-sin(rotY), 0, -cos(rotY))`
- Camera behind car = `(+sin(rotY) * dist, ..., +cos(rotY) * dist)` (opposite direction)
- `atan2(-dx, -dz)` gives the yaw needed to face a target at `(tx, _, tz)` from `(cx, _, cz)` where `dx = tx-cx`, `dz = tz-cz`

---

## German Road Geometry (`GermanCityRoad.tsx`)

L-shaped road — two segments meeting at the junction at `(0, 0, -5)`:

```
               spawn (0, y, 40)
                    │
                    │ Road 1 (N-S)
                    │ centred at x=0, width 7m
                    │ z: 45 → -9
                    │
                (0, 0, -2) ← car slows here
                    │
              LEFT TURN ↙
                    ─────────────────────────────
                    Road 2 (E-W), centred at z=-5
                    x: 0 → -62, width 7m
                    ─────────────────────────────
                                            (x=-45)
                                         stop line here
                                         crosswalk at x=-46.5
```

Key geometry numbers:

- Road 1 left edge: `x = -3.5`, right edge: `x = +3.5`
- Road 2 north edge: `z = -8.5`, south edge: `z = -1.5`
- Intersection fill: box at `(−3.5, 0, −5)` to cover the corner
- Stop line: white box at `x = -44.8, z = -5`
- Crosswalk: 5 white stripes centred at `x = -46.5`
- Car turn arc: sweeps approximately `x ∈ [0, -14], z ∈ [-2, -6]` — **this zone must stay clear of buildings**

---

## CarController Architecture

File: `apps/web/src/simulation/vehicles/CarController.tsx`

### Props

```typescript
interface Props {
  waypoints?: Waypoint[]; // autopilot path (empty = manual control)
  challenges?: ChallengePoint[]; // moments that pause the car and ask for input
}
```

### Physics

- Rapier `RigidBody` with kinematic-friendly damping
- Mass: 1200 kg
- Linear damping: 0.9 (strong damping to prevent sliding)
- Angular damping: 0.99 (almost locked rotation; only Y-axis impulses steer)
- Y-rotation locking: enforced each frame to prevent roll

### Autopilot Loop (in `useFrame`)

```
1. Get current car position from bodyRef
2. For each active ChallengePoint not yet triggered:
     if carState.position matches trigger (triggerZ or triggerX):
       triggerChallenge(challengePoint) → sets gameStore.activeChallenge
3. If activeChallenge.result === 'pending':
     apply braking impulse (decelerate car)
     apply yaw damping
     return  ← skip waypoint navigation while paused
4. Advance waypointIndex when car is within 3m of current target
5. Point toward current waypoint: desiredYaw = atan2(-dx, -dz)
6. Apply angular impulse proportional to angle error (clamped to ±π)
7. Apply forward impulse toward current waypoint's speed target
8. Export carState to gameStore (position, rotation, velocity)
```

### Challenge Triggers

```typescript
interface ChallengePoint {
  id: string;
  triggerZ?: number; // fires when car.position.z <= triggerZ (N→S travel)
  triggerX?: number; // fires when car.position.x <= triggerX (E→W travel)
  prompt: string;
  instruction: string;
  correctKey: string; // e.g. 'ArrowLeft', 'Space'
  correctKeyLabel: string; // e.g. '← LEFT', 'SPACE'
}
```

**Important:** `challenge.id` MUST match the corresponding `objective.id` in `ScenarioDef.config.objectives`. `resolveChallenge('correct')` uses the challenge ID to mark the matching objective completed in the store.

---

## ChallengeOverlay

File: `apps/web/src/components/ChallengeOverlay.tsx`

Reads `activeChallenge` from `gameStore`. When `result === 'pending'`, adds a `keydown` listener. On keydown:

- Correct key → `resolveChallenge('correct')` → overlay shows ✅ for 1600 ms then clears
- Any other key → `resolveChallenge('wrong', keyLabel)` → overlay shows ❌ for 1600 ms then `setScenarioPhase('failed')`

**Evolution plan:** This key-press challenge will evolve into the MCQ pop-up (see below). The `activeChallenge` in the store will be replaced with `activeMCQQuestion` carrying the full question + options from the DB.

---

## MCQ Overlay (Implemented — see "Practice vs Test" below)

The product vision for challenges:

```
Simulation running → car autopilots → trigger zone reached
         ↓
Car brakes to a stop
         ↓
Transparent draggable popup appears
  ┌──────────────────────────────────────────┐
  │  🚦 There is a red light ahead.          │
  │  What should you do?                     │
  │                                          │
  │  [A] Stop before the line               │
  │  [B] Slow down and proceed with care    │
  │  [C] Speed up to clear the light        │
  │  [D] Honk to alert other drivers        │
  │                                          │
  │  [Drag to move]           [Confirm ▶]   │
  └──────────────────────────────────────────┘
         ↓
User selects option → clicks Confirm
         ↓
  Practice mode:                Test mode:
  Correct → ✅ explanation      Correct → ✅ explanation
            → simulation        Wrong   → ❌ explanation
              resumes                   → scenario FAILED
  Wrong   → ❌ shows correct
            → simulation
              resumes
```

### Implementation Plan

1. **`MCQOverlay.tsx`** — draggable (mouse drag repositions via `useState` offset), transparent (`backdrop-blur-sm bg-black/40`), 4 option buttons, confirm button, result state
2. **`gameStore` additions**: `pausedForMCQ: boolean`, `activeMCQQuestion: Question | null`, `mcqResult: 'pending'|'correct'|'wrong'|null`
3. **`useScenarioQuestions.ts`** — fetches `GET /api/scenarios/:slug/questions` on scenario start; result stored in a ref so it's available frame-by-frame
4. **`CarController`** — when `pausedForMCQ`, apply braking (same as current challenge pending)
5. **Question trigger** — `ScenarioRunner` or `CarController` sets `pausedForMCQ = true` when car enters a question zone; question is selected from the cached list by `questionId`
6. **After confirm** — submit answer to `POST /api/test-sessions/:id/answers` (test mode) or just evaluate locally (practice mode); show result; set timer to resume

---

## Practice vs Test (Implemented)

Both modes share the same autopilot + decision-point machinery; they differ only in what happens when the car reaches a decision and how the run is scored.

**Launching:** `Home` links each practice scenario to `/simulation/:slug?mode=practice` and `?mode=test`; the TEST card links the Full Test to `/simulation/full-test-germany?mode=test`. `Simulation.tsx` reads `?mode` into `gameStore.attemptMode`.

**At a decision point** — `TriggerWatcher` is an invisible `useFrame` watcher that fires once per decision (guarded by a fired-set + `runId`), one decision at a time:

- **Practice** → `triggerTeaching(point)` → `TeachingOverlay` shows the situation + the rule. **Continue** marks the objective complete (`resolveTeaching`) and the car performs the correct action automatically. No score.
- **Test (per scenario)** → `startMcqSequence(decisionId, queue)` (questions filtered by the decision's `questionOrders`) → `MCQOverlay`. Answers are scored **client-side** against the answer key from `GET /api/scenarios/:slug/questions/answers`. A wrong answer is never instant-fail — it shows the correct option + explanation and continues. `ScenarioTestResults` shows `X / N` (pass ≥ 60%) and saves via `POST /api/progress`.

**The car brakes** whenever any overlay is open — `CarController` halts on `activeChallenge || activeTeaching || activeMcq` (one shared braking path) and resumes when it clears.

### The graded Full Test (`full-test-germany`, `fullTest: true`)

A separate, **server-scored** flow that reuses the same overlay + braking:

1. On start, `Simulation.tsx` fetches a sample of questions drawn across all active DE scenarios (`GET /api/countries/DE/test-questions?limit=N`, `isCorrect` hidden) and opens a `TestSession` (`POST /api/test-sessions { countryId, maxScore = N }`, so the grade is out of what's actually asked).
2. The car drives the shared L-route and pauses at three checkpoints; `TriggerWatcher`'s full-test branch spreads the questions evenly across them (`chunkForZone`).
3. Each answer posts to `POST /api/test-sessions/:id/answers`; the server returns `{ isCorrect, explanation }`, which the overlay shows via `submitMcqServer` (the answer key never reaches the client).
4. When the final checkpoint is done, `TestResultsScreen` calls `PATCH …/complete` (grade A/B/C/F, pass ≥ 75%) and renders the per-question breakdown from `GET …/:id`. **Retake** opens a fresh session.

---

## Scenario Definition Format

File: `apps/web/src/simulation/scenarios/types.ts`

```typescript
interface Waypoint {
  x: number;
  z: number;
  speed: number; // m/s target speed at this waypoint
}

interface ChallengePoint {
  id: string; // MUST match objective.id
  triggerZ?: number; // trigger when car.z <= this value
  triggerX?: number; // trigger when car.x <= this value
  prompt: string; // shown as heading in overlay
  instruction: string; // shown as subtext in overlay
  correctKey: string; // KeyboardEvent.code value
  correctKeyLabel: string; // display label for the key
}

interface ScenarioDef {
  config: ScenarioConfig; // id, name, city, country, timeLimit, objectives[]
  check: ScenarioChecker; // (carState, completed) => { newlyCompleted, passed, failed }
  driveMode?: "manual" | "auto";
  waypoints?: Waypoint[];
  challenges?: ChallengePoint[];
  stopZone?: { cx: number; cz: number; hw: number; hd: number };
}
```

---

## How to Add a New Autopilot Scenario

### 1. Design the path

Sketch the waypoints on paper first. Remember:

- Car spawns at `(0, y, 40)` facing south (-Z)
- Left turns = increasing X magnitude going negative
- Right turns = increasing X magnitude going positive
- Set `speed` to match the road type (city = 5–8 m/s, junction approach = 2–3 m/s)

### 2. Design the challenge point(s)

Decide where to pause the car. A good challenge point is:

- Just **before** the decision zone (trigger a few metres before the actual point)
- Matches a real traffic rule decision a learner might get wrong
- Has one clearly correct answer and 3 plausible wrong ones (for MCQ)

### 3. Create the simulation module

```typescript
// apps/web/src/simulation/scenarios/your-slug.ts
import type {
  ScenarioDef,
  ScenarioChecker,
  Waypoint,
  ChallengePoint,
} from "./types";

export const WAYPOINTS: Waypoint[] = [
  { x: 0, z: 30, speed: 7 }, // accelerate from spawn
  { x: 0, z: 5, speed: 4 }, // slow approaching challenge
  // ... more waypoints after challenge zone
];

export const CHALLENGES: ChallengePoint[] = [
  {
    id: "your-challenge-id", // MUST match an objective id below
    triggerZ: 8, // fire when car.z <= 8
    prompt: "What should you do here?",
    instruction: "Press SPACE to stop",
    correctKey: "Space",
    correctKeyLabel: "SPACE",
  },
];

const check: ScenarioChecker = (_carState, completed) => ({
  newlyCompleted: [],
  passed: completed["your-challenge-id"] === true,
  failed: false,
});

const yourScenario: ScenarioDef = {
  config: {
    id: "your-slug",
    name: "Your Scenario Name",
    city: "Aachen",
    country: "Germany",
    difficulty: "beginner",
    description: "One sentence description.",
    timeLimit: 180,
    objectives: [
      {
        id: "your-challenge-id",
        description: "Do the right thing",
        completed: false,
      },
    ],
  },
  check,
  driveMode: "auto",
  waypoints: WAYPOINTS,
  challenges: CHALLENGES,
};

export default yourScenario;
```

### 4. Register it

```typescript
// apps/web/src/simulation/scenarios/index.ts
import yourScenario from "./your-slug";

const registry: Record<string, ScenarioDef> = {
  "basic-controls": basicControls,
  "traffic-lights": trafficLights,
  "your-slug": yourScenario, // add this
};
```

### 5. Add to database (seed)

Add scenario + question + options in `apps/api/prisma/seed.ts`, then `npm run db:seed`.

### 6. Add scene elements (if needed)

If the scenario needs new 3D objects (new road, traffic lights, NPC car), add a component in `apps/web/src/simulation/scene/` and render it conditionally in `SimulationScene.tsx`:

```typescript
const isYourScenario = scenarioId === 'your-slug'
// ...
{isYourScenario && <YourSceneElements />}
```

---

## FollowCamera Math

File: `apps/web/src/simulation/scene/FollowCamera.tsx`

The car's forward direction is `(-sin θ, 0, -cos θ)` where `θ = carState.rotation[1]` (Euler Y from Rapier).

Camera position (behind car):

```
cx + sin(θ) * CAM_BACK,  cy + CAM_UP,  cz + cos(θ) * CAM_BACK
```

LookAt target (ahead of car):

```
cx - sin(θ) * CAM_AHEAD,  cy + 1,  cz - cos(θ) * CAM_AHEAD
```

Constants: `CAM_BACK = 11`, `CAM_UP = 5`, `CAM_AHEAD = 5`
Lerp factors: camera position = 0.10, look target = 0.15 (look tracks faster for snappy turns)

---

## gameStore — Simulation-Relevant Fields

```typescript
// Drive mode
driveMode: 'manual' | 'auto'
setDriveMode(mode: DriveMode): void

// Active challenge (key-press, current system)
activeChallenge: ActiveChallenge | null    // non-null while paused waiting for input
resolvedChallengeIds: Record<string, boolean>  // set to true when correctly resolved
triggerChallenge(point: ChallengePoint): void
resolveChallenge(result: 'correct' | 'wrong', wrongKeyLabel?: string): void
clearChallenge(): void

// Scenario lifecycle
startScenario(scenario, objectives): void   // resets all challenge state
setScenarioPhase(phase): void              // 'running'|'passed'|'failed'|'idle'

// Car state (exported each frame by CarController)
carState: CarState | null   // { position, rotation, velocity, speed }
setCarState(state: CarState): void
```

---

## Scene Architecture in `SimulationScene.tsx`

All scenarios share the same base scene:

- `<Lighting />` — ambient + directional + hemisphere lights
- `<Ground />` — large grass plane
- `<GermanCityRoad />` — L-shaped road (Germany-specific; each country will have its own)
- `<CityEnvironment />` — trees, buildings, sidewalks along road
- `<CarController />` — the player car
- `<FollowCamera />` — always rendered

Scenario-specific elements added conditionally:

- `<TrafficLightSet />` — only for `traffic-lights` scenario (reads `resolvedChallengeIds`)
- `<StopZone />` — if `def.stopZone` is defined
- `<ScenarioRunner />` — always if a scenario is active

Future pattern: instead of `isTrafficLights` boolean in `SimulationScene`, each scenario def should declare the scene elements it needs. This keeps `SimulationScene` clean as we add more scenarios.

---

## Progress Saving

`ResultsScreen.tsx` calls `api.progress.save()` exactly once per run (guarded by `hasSaved` ref):

```
POST /api/progress
Body: { scenarioId, passed, timeSeconds }
Auth: Bearer <JWT>
```

The backend (`apps/api/src/routes/progress.ts`) creates a `ScenarioAttempt` row and upserts `UserScenarioProgress` (unique on `userId + scenarioId`). This is fully working. No additional progress saving code needed unless implementing test mode (which uses `TestSession` instead).

---

## Known Issues / Watch-Outs

1. **Junction clearance**: The car turn arc at the L-junction sweeps `x ∈ [0,-14], z ∈ [-2,-6]`. Any buildings or trees placed in this zone will be driven through. The `CityEnvironment.tsx` has hard safety margins — do not soften them.

2. **Challenge ID = Objective ID**: These must match exactly. `resolveChallenge` looks up `activeChallenge.id` to find the matching objective in the store. If they differ, the objective will never be marked completed.

3. **Multiple concurrent challenges**: The current system only supports one active challenge at a time. `triggeredRef` tracks which challenge IDs have been fired to prevent re-triggering. Do not place two challenge `triggerZ` or `triggerX` values close together, or the first may not fully resolve before the second fires.

4. **Rapier body center**: The physics body center sits at `y ≈ 0.35` when the car is on the ground (half the collider height). The visual car mesh `groupRef` is positioned at the body's translation directly. Wheels are at `y = -0.07` local offset (slightly into ground — standard game look).

5. **`trafficLights` scenario**: The traffic light phase (`red`/`green`) is derived from `resolvedChallengeIds['red-light-stop']`. Once the user correctly stops (presses SPACE), the light turns green. The car then continues west. This is the intended UX.
