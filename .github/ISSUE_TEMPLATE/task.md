---
name: Task / Technical work
about: Planned engineering work — new component, refactor, new scenario module, or infrastructure change
title: "[Task] "
labels: task
assignees: ""
---

## What needs to be done?

<!-- Clear description of the technical work. Link to the relevant TASKS.md item if it exists. -->

## Why is this needed?

<!-- What problem does it solve, or what does it unblock? -->

---

## Area of the codebase

<!-- Check all that apply -->

- [ ] `apps/web/src/simulation/scenarios/` — new 3D scenario module
- [ ] `apps/web/src/simulation/scene/` — road mesh or scene setup
- [ ] `apps/web/src/simulation/vehicles/` — car physics or controller
- [ ] `apps/web/src/simulation/traffic/` — AI traffic or traffic lights
- [ ] `apps/web/src/components/` — UI component (HUD, overlay, modal)
- [ ] `apps/web/src/pages/` — page-level component (Home, Simulation, Dashboard)
- [ ] `apps/web/src/store/` — Zustand store (gameStore, userStore)
- [ ] `apps/web/src/hooks/` — custom React hook
- [ ] `apps/api/src/routes/` — Express API route
- [ ] `apps/api/prisma/` — schema change or new migration
- [ ] `packages/shared/` — shared TypeScript types
- [ ] Infrastructure / CI / tooling / docs

---

## New scenario checklist (only if this task adds a scenario)

Refer to `DEVELOPER_GUIDE.md` Section 10 for the full walkthrough.

- [ ] Entry added to `apps/api/prisma/seed.ts` (slug, question, 4 options) and seed re-run with `npm run db:seed`
- [ ] `apps/web/src/simulation/scenarios/<slug>.ts` created with `ScenarioDef` + `ScenarioChecker`
- [ ] Registered in `apps/web/src/simulation/scenarios/index.ts`
- [ ] Road mesh added or reused in `SimulationScene.tsx` if the scenario needs a different layout
- [ ] Traffic rule logic added to `src/simulation/scenarios/rules/<ruleName>.ts` if a new rule is enforced

---

## Acceptance criteria

<!-- List specific, testable conditions that define "done". Be precise enough that someone else can verify. -->

- [ ] <!-- condition 1 -->
- [ ] <!-- condition 2 -->
- [ ] `npx tsc --noEmit` passes in `apps/web` — zero errors
- [ ] `npx tsc --noEmit` passes in `apps/api` — zero errors

---

## Dependencies

<!-- Does this block or get blocked by another issue or PR? List them. -->

---

## Estimated effort

- [ ] Small (< 2 hours)
- [ ] Medium (half a day)
- [ ] Large (1–2 days)
- [ ] XL (multiple days — consider splitting into smaller tasks)
