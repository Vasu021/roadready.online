# RoadReady — Claude Agent Instructions

## Project Overview
RoadReady (roadready.online) is a browser-based 3D driving simulation platform.
Users practice driving in realistic city environments with country-specific traffic rules.
MVP: Aachen, Germany. Expanding to more cities and countries over time.

## Tech Stack
- **Frontend:** React + TypeScript + Vite
- **3D Engine:** Three.js via React Three Fiber (R3F) + @react-three/drei
- **Physics:** Rapier.js (@dimforge/rapier3d-compat)
- **State:** Zustand
- **Styling:** Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth
- **Payments:** Stripe (later)
- **Hosting:** Vercel (frontend), Railway (backend)

## Monorepo Structure
```
roadready.online/
├── apps/
│   ├── web/          # React frontend
│   └── api/          # Node.js backend
├── packages/
│   └── shared/       # Shared TypeScript types
├── CLAUDE.md
├── README.md
├── .gitignore
└── package.json      # Root workspace package.json
```

## Frontend Structure (apps/web/src/)
```
src/
├── components/       # Reusable UI components (buttons, modals, HUD)
├── pages/            # Route-level pages (Home, Simulation, Dashboard)
├── simulation/       # All 3D simulation code
│   ├── scene/        # Main Canvas scene setup
│   ├── vehicles/     # Car model + physics controller
│   ├── roads/        # Road mesh generation
│   ├── traffic/      # AI traffic, traffic lights
│   └── scenarios/    # Individual scenario logic + pass/fail
├── store/            # Zustand stores
├── hooks/            # Custom React hooks
├── types/            # TypeScript types (import from packages/shared too)
└── utils/            # Helper functions
```

## Key Conventions
- All code in **TypeScript** — no plain JS files
- Use **functional components** with hooks only — no class components
- Use **Zustand** for global state — no Redux, no Context API for state
- Use **React Three Fiber** for all 3D — never raw Three.js imperative code in components
- CSS via **Tailwind** utility classes — no CSS modules, no styled-components
- API calls go through a central `src/utils/api.ts` file
- All environment variables prefixed with `VITE_` on frontend
- Backend routes follow REST conventions: `GET /api/scenarios`, `POST /api/users`, etc.

## Naming Conventions
- Components: PascalCase (`CarController.tsx`, `ScenarioSelector.tsx`)
- Hooks: camelCase with `use` prefix (`useCarPhysics.ts`, `useScenario.ts`)
- Stores: camelCase with `Store` suffix (`gameStore.ts`, `userStore.ts`)
- Utils: camelCase (`formatScore.ts`, `osmParser.ts`)
- Types/Interfaces: PascalCase with descriptive names (`ScenarioConfig`, `CarState`)

## Current MVP Scope (Aachen, Germany)
The MVP includes:
1. A 3D scene with a basic road environment (Aachen-inspired)
2. A drivable car with keyboard controls (WASD or arrow keys)
3. A scenario selection screen
4. At least 3 scenarios: Basic Controls, Intersection (Rechts vor Links), Roundabout
5. Pass/fail detection with feedback
6. User auth (sign up / login)
7. Progress saved to database

## Scenarios Architecture
Each scenario is a self-contained module:
```typescript
interface ScenarioConfig {
  id: string;
  name: string;
  city: string;
  country: string;
  difficulty: 'beginner' | 'easy' | 'medium' | 'hard';
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
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Backend (apps/api/.env)
```
DATABASE_URL=
JWT_SECRET=
PORT=3001
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
```

## Development Commands
```bash
# Root — run everything
npm run dev

# Frontend only
npm run dev:web

# Backend only
npm run dev:api

# Build all
npm run build

# Run tests
npm run test
```

## Important Notes for Claude Agent
- **Always read `TASKS.md` at the start of every session** to understand what has been built and what is pending
- **Always update `TASKS.md`** when work is completed — move items from 📋 Todo to ✅ Done with implementation details
- Always check existing files before creating new ones
- Keep Three.js/R3F code performant — use `useMemo` and `useRef` for 3D objects
- Physics bodies must be cleaned up on component unmount
- Never hardcode German traffic rule logic inline — put it in `src/simulation/scenarios/rules/`
- When adding a new scenario, create a new file in `src/simulation/scenarios/` and register it in `src/simulation/scenarios/index.ts`
- The simulation canvas must be responsive — works on all screen sizes
- All user-facing text should support i18n from the start (use a `t()` function wrapper even if translations aren't wired up yet)

## Git Workflow
- Branch naming: `feature/scenario-roundabout`, `fix/car-physics-drift`, `chore/setup-prisma`
- Commit messages: conventional commits — `feat:`, `fix:`, `chore:`, `docs:`
- Never commit `.env` files
- Always run `npm run build` before pushing to main
