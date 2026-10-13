# RoadReady — Task Tracker

> Read at the start of a session; update when work completes.
> See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for how any of this works.

---

## ✅ Done

### The rewrite (October 2026)

The product changed from a 3D driving simulator into a driving-theory platform.
Removed: `apps/web/src/simulation/`, the challenge/HUD/simulation components,
`public/models/`, and the `three` / `@react-three/fiber` / `@react-three/drei` /
`@dimforge/rapier3d-compat` dependencies. No 3D import remains. The root
`package.json` had also drifted to Prisma `^7.8.0` against the pin — both it and
`apps/api` are back on `6.0.0`.

### Database

One migration covers the rewrite (`20261013120000_rewrite_for_theory_platform`):
added `TopicTest` (with `isSignTopic`) and `Sign`; made `Question.scenarioId`
nullable alongside a new `topicTestId`; added `imagePrompt`/`imageUrl` to
`Scenario`; added `topicTestId`/`totalQuestions` and a nullable `scenarioId` to
`ScenarioAttempt`; added `UNIQUE(testSessionId, questionId)` so exam answers
upsert and can be revised mid-test.

### Content — Germany

- **12 topic tests, 87 questions**, StVO-accurate, four options each
- **18 driving situations** with scene descriptions
- **136 signs** defined in code: 27 danger · 8 priority · 24 prohibition ·
  16 mandatory · 19 information · 11 supplementary plates · 12 light signals ·
  13 road markings · 8 sign+plate combinations
- The seed clears, recreates, then validates every question (exactly one correct
  of four) and throws if violated

France is a country record with facts only; the UI degrades to a "being written"
state.

### Backend

New `topicTests` and `finalTest` routes; rewritten `scenarios` and
`testSessions`. The exam is configured in one place (`config/finalTest.ts`) and
graded server-side — the question payload never includes `isCorrect` and the
breakdown is withheld until completion.

### Security

No production fallback for `JWT_SECRET`; HS256 pinned; CORS allowlist; rate
limiting (20 / 15 min on auth, 300 / min elsewhere) with `Retry-After`; 32 kb
body cap; `x-powered-by` off; email normalisation; constant-time-ish login;
JSON 404 and a catch-all error handler; input validation before every Prisma
call; `sanitizeHtml` on the only `dangerouslySetInnerHTML`; expired tokens
treated as signed out, and a 401 anywhere signs the user out.

### Frontend

Dashboard, SignsLibrary (search + 9 category tabs + detail modal),
PracticeTests, TopicQuiz (keyboard-operable), ScenarioPractice, FinalTest
(countdown, question navigator, auto-submit, graded breakdown), and a landing
page built from the real sign components. `AppShell` + `components/ui.tsx` give
every page one vocabulary; the chosen country persists across reloads.

### Verified

`tsc --noEmit` and `vite build` clean in both apps · all 136 signs render
through `react-dom/server` with no bad output · full journey end-to-end
(register → country → topic run → situation → 30-question exam → grade →
breakdown), with double-completion and post-completion answers rejected · UI
captured in a headless browser with zero console errors, including a genuine
83% / grade B exam pass.

---

## 📋 Todo

### Content

- [ ] Grow each topic to 15–20 questions (87 today across 12)
- [ ] Remaining Zusatzzeichen and more real sign combinations
- [ ] The French course: 12 topics + situations (`fr-…` slugs)
- [ ] Tag questions by difficulty and weight the exam accordingly

### Features

- [ ] **Sign-recognition quiz mode** — render the SVG and ask for its meaning.
      The components are ready; only a quiz surface is missing. Exam
      sign-questions currently describe signs in words instead of showing them
- [ ] Review queue of questions the user keeps missing
- [ ] Persist scenario attempts (today `solved` is session-only)
- [ ] Dashboard history: past exam sessions with grade and date
- [ ] i18n — wrap user-facing strings in `t()`, then German and Turkish
- [ ] Real artwork for the 18 situations, filling `imageUrl`

### Platform

- [ ] Stripe checkout + webhook; replace the dev `isPremium` toggle
- [ ] Decide the free/premium split (the `isPremium` column and the old
      "first 3 free" rule are currently unused)
- [ ] Move the rate limiter to Redis before running more than one API instance
- [ ] Tests: Vitest for the quiz store, validators and exam mix
- [ ] CI: typecheck + build + seed validation on every PR
- [ ] Deploy: Vercel (web) + Railway (API) with managed PostgreSQL

### Known gaps

- `UserProgress` and `/api/progress` are legacy; nothing in the new UI writes to
  them
- `Sign` exists in the schema but is intentionally not seeded — signs render
  from code
- New speed limits should be added through the `SpeedLimit` generator in
  `signs/prohibition.tsx`
