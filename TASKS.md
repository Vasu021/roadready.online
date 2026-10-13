# RoadReady — Task Tracker

> Read at the start of a session; update when work completes.
> See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for how any of this works.

---

## ✅ Done

### The theory-platform rewrite (merged, PR #22)

Replaced the 3D driving simulator with a theory course: sign library, topic
tests, driving situations and a graded exam. Three.js, React Three Fiber and
Rapier removed; Prisma re-pinned to 6.0.0 at the root. Security hardened
(JWT secret enforcement, CORS allowlist, rate limiting, input validation,
server-side exam grading, HTML sanitising).

### The learning-platform expansion (this branch)

**Learning modules — the whole official curriculum**

- **14 modules, 92 lessons, 184 questions**, one module per lesson of the
  FahrschAusbO (12 Grundstoff + 2 class-B Zusatzstoff), each with the official
  German lesson title
- Lesson reader with a lesson rail, per-lesson progress, resume point, key-point
  boxes, sign strips and inline scene illustrations
- Per-module quiz (`/learn/:slug/quiz`) drawing on the module's own pool
- New models: `Module`, `Lesson`, `UserModuleProgress`

**Official exam scoring**

- Exam now mirrors the real one: 20 Grundstoff + 10 Zusatzstoff, questions
  weighted 2–5 error points, pass at ≤ 10 points, two 5-point mistakes fail
  regardless. Grades derive from error points
- `TestSession` records `errorPoints` and `failedByFivePointRule`; the breakdown
  shows the cost of each wrong answer

**Scene system — situations are drawn, not described**

- `SceneSpec` in the shared package: road layout, actors at named slots, signs,
  markings, annotations, weather
- `SceneRenderer` with 13 road layouts, 11 actor kinds, condition overlays
- All 18 situations carry scene data; lessons can too

**13 languages**

- Dependency-free i18n provider with lazy-loaded locale files, 151 keys each,
  complete for all 13 languages the official exam offers
- Arabic switches the document to RTL
- Generic `Translation` table plus `?locale=` on every content endpoint, with
  field-by-field fallback
- German traffic terms deliberately stay German in every language

**6 themes**

- `study`, `wood`, `greenboard`, `blackboard`, `daylight`, `contrast`, defined
  as CSS custom properties and mapped into Tailwind as tokens
- Every component converted from raw palette colours to tokens
- Sign and scene colours deliberately excluded from theming
- Texture layers for wood and chalk, disabled under `prefers-reduced-motion`

**Read-aloud**

- `SpeakButton` on lessons, questions, explanations, signs and page headers
- Splits text by language so German terms get a German voice mid-sentence
- Speed, cancel-on-navigate, and graceful absence where unsupported

**Brand**

- New logo: the yellow Vorfahrtstraße diamond with a road through it, plus a
  monochrome variant and three alternates kept for comparison

**Verified**

- 39 API assertions green (modules, progress, i18n fallback, exam composition,
  error-point grading both ways, preferences, auth guards)
- Headless-browser pass over every page, all six themes, German/Turkish/Arabic
  and mobile: zero console errors, zero exceptions
- `tsc --noEmit` and `vite build` clean in both apps; seed validator passes

---

## 📋 Todo

### Content depth — the biggest remaining gap

The plan set volume targets that are only partly met. Current counts:

| Content    | Now | Target |
| ---------- | --- | ------ |
| Signs      | 136 | 420    |
| Questions  | 289 | 450    |
| Situations | 18  | 120    |
| Lessons    | 92  | 92 ✓   |

- [ ] Remaining Zusatzzeichen, and more real sign combinations
- [ ] More situations — the scene system makes each one a ten-line edit
- [ ] Deeper question banks per module and topic
- [ ] French course (`fr-…` slugs): 14 modules, topics, situations

### Translation

- [ ] Translate database content (lessons, questions, explanations) into the 12
      non-English locales via the `Translation` table — the mechanism is built
      and unused
- [ ] Native review per language before marketing it; machine rows are flagged
      with `isMachine`
- [ ] Translate sign names and descriptions (currently English + German only)

### Features

- [ ] Sign-recognition quiz mode — render the SVG and ask for its meaning. The
      components are ready; exam sign questions still describe signs in words
- [ ] Review queue of questions the user keeps missing
- [ ] Persist scenario attempts (today `solved` is session-only)
- [ ] Dashboard history: past exam sessions with grade and date
- [ ] Driver's-perspective scene view, for sign recognition at distance

### Platform

- [ ] Stripe checkout + webhook; replace the dev `isPremium` toggle
- [ ] Decide the free/premium split
- [ ] Move the rate limiter to Redis before running more than one API instance
- [ ] Vitest for the quiz store, validators, exam mix and `gradeSession`
- [ ] CI: typecheck + build + seed validation on every PR
- [ ] Deploy: Vercel (web) + Railway (API) with managed PostgreSQL

### Known gaps

- `UserProgress` and `/api/progress` are legacy; nothing in the new UI writes to them
- `Sign` exists in the schema but is intentionally not seeded — signs render from code
- Module quizzes do not record attempts; lesson progress is the module's progress
- `errorPoints` for unanswered final-test questions is charged a flat 3
