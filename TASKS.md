# RoadReady — Task Tracker

> Read this at the start of every session. Update it as work completes.
> Product context: [`REWRITE_PLAN.md`](./REWRITE_PLAN.md) · Architecture: [`CLAUDE.md`](./CLAUDE.md)

---

## ✅ Done

### The rewrite (branch `Idea-rewrite`)

The 3D driving simulation was retired and the product rebuilt as a scenario-based MCQ trainer.
Removed: `apps/web/src/simulation/**` (~1,900 LOC), `three`, `@react-three/fiber`,
`@react-three/drei`, `@dimforge/rapier3d-compat`, `@types/three`, `ChallengeOverlay`,
`ScenarioHUD`, `ResultsScreen`, `Simulation.tsx`, `gameStore`, `apps/api/src/data/scenarios.ts`,
`SIMULATION_DESIGN.md`, `public/models/volvo.glb`.

Frontend bundle went from ~1.5 MB to **213 kB (67 kB gzipped)**.

### Database — PostgreSQL + Prisma 6.0.0

- Fresh baseline migration `20260818000000_init`; the three old migrations were dropped
- **10 models:** Country, Category, Topic, Question, Option, User, Quiz, QuizItem,
  TopicProgress, QuestionStat
- `QuizItem` freezes a quiz's question set at creation, so scoring and resuming are deterministic
- `QuestionStat` powers mistake drilling and bookmarks, and is shaped for spaced repetition later
- Old models gone: ScenarioAttempt, UserProgress, TestSession, TestSessionAnswer,
  UserCountryAccess, UserScenarioProgress. `UserCountryAccess` collapsed into `User.selectedCountryId`.

### Seed content — 90 questions

- Split into `prisma/seed/{index,types,germany,france}.ts`
- 🇩🇪 Germany: 4 categories, 9 topics, 45 questions · 🇫🇷 France: 4 categories, 9 topics, 45 questions
- Every question has an image, required alt text, 4 options and a rule-referenced explanation
- `validate()` runs before any DB write — catches duplicate slugs, unknown categories, wrong option
  counts, multiple/zero correct answers, missing alt text or explanation
- Options are shuffled with a hash of `topic#order`: answers spread A/23 · B/18 · C/23 · D/26,
  and re-seeding never reshuffles a question out from under existing quiz history
- Questions are keyed by `(topic, order)` and updated in place, so re-seeding does not orphan rows

### Scenario images — 49 SVGs

- `apps/web/scripts/generate-scenario-images.mjs` generates the full library into
  `public/images/scenarios/`
- Junction, roundabout, motorway, crossing, level-crossing, toll, fog and cockpit scenes, plus
  German and French road signs
- One shared visual language: ego car blue with a dashed ring, other traffic red/amber
- Rendered and visually reviewed; four scenes reworked after the first pass read badly

### Backend — Express API

| Method | Route                         | Auth | Notes                                          |
| ------ | ----------------------------- | ---- | ---------------------------------------------- |
| GET    | `/api/health`                 | —    | `{ status: "ok" }`                             |
| POST   | `/api/auth/register`          | —    | bcrypt 12, returns JWT                         |
| POST   | `/api/auth/login`             | —    | identical error either way (no enumeration)    |
| GET    | `/api/auth/me`                | ✓    | current user                                   |
| PATCH  | `/api/auth/me`                | ✓    | `name` / `countryCode`                         |
| GET    | `/api/countries`              | —    | active countries + counts                      |
| GET    | `/api/countries/:code`        | —    | incl. `facts`                                  |
| GET    | `/api/countries/:code/topics` | opt  | grouped by category, progress if authed        |
| GET    | `/api/topics/:slug`           | opt  | topic detail + progress                        |
| POST   | `/api/quizzes`                | ✓    | 4 sources: TOPIC / EXAM / MISTAKES / BOOKMARKS |
| GET    | `/api/quizzes`                | ✓    | history                                        |
| GET    | `/api/quizzes/:id`            | ✓    | quiz + questions                               |
| POST   | `/api/quizzes/:id/answer`     | ✓    | practice reveals, exam withholds               |
| POST   | `/api/quizzes/:id/complete`   | ✓    | grades; idempotent on refresh                  |
| GET    | `/api/progress/overview`      | ✓    | dashboard in one round trip                    |
| POST   | `/api/questions/:id/bookmark` | ✓    | toggle                                         |
| GET    | `/api/questions/bookmarks`    | ✓    | saved questions with answers                   |

- `lib/http.ts` — `HttpError`, `route()` async wrapper, body parsing helpers; a single error
  middleware turns anything unexpected into a generic 500
- `lib/serialize.ts` — the only place responses are built, which is what keeps `Option.isCorrect`
  and `User.password` off the wire
- `lib/quiz.ts` — question selection, premium gating and grading, so no quiz source can be a side
  door onto premium content
- `optionalAuth` — public content enriched with progress when a token is present; an invalid token
  degrades to anonymous rather than 401
- A quiz owned by someone else returns 404, not 403

### Frontend

- **`Home.tsx`** keeps its three states: landing → country picker with facts → topic list by
  category, plus a mock-exam CTA
- **`Quiz.tsx`** — one question at a time, progress bar, bookmark toggle, keyboard control
  (`1`–`4` / `A`–`D` select, `Enter` continues); practice checks-then-explains, exam records silently
- **`Results.tsx`** — score ring, grade, pass/fail, stat tiles, All/Wrong filter, expandable
  per-question review; retry topic and drill-mistakes actions
- **`Dashboard.tsx`** — quizzes completed, questions answered, accuracy, topics completed, topic
  mastery bars, recent quizzes
- **`Review.tsx`** — mistake drilling and bookmarks, both launching ordinary practice quizzes
- `quizStore` — active quiz, pending selections, submit, optimistic bookmark with rollback
- `userStore` — user, `isBootstrapping`, selected country cached in localStorage
- Session restore verifies the stored token against `/api/auth/me` rather than decoding it locally,
  so a stale token yields a clean logged-out state instead of a UI that 401s on every request
- `ProtectedRoute` waits on `isBootstrapping` — no redirect flash on reload
- `i18n` — `t()` and `tn()`; every user-facing string already routed through them

### Verification

- `npm run typecheck` and `npm run build` clean across all workspaces
- API smoke-tested end to end: registration, country selection, practice quiz, answer, re-answer
  rejection, completion and grading, exam-mode answer withholding, premium gate (403 on a locked
  topic), free-user exam drawn only from free topics, bookmarks, mistake drilling, dashboard totals
- Full quiz driven through the real UI in headless Chrome; every route screenshotted and reviewed
  at 1100 px and at 390 px

### Bugs found and fixed during verification

- Correct answer was always option A — fixed with the deterministic seed-time shuffle
- Explanation panel rendered behind the sticky footer — now scrolls into view on reveal
- Bookmarked questions showed a red ✕ as though answered wrongly — `isCorrect: null` now renders a
  neutral ★
- "1 questions saved" — added `tn()` plural handling

---

## 📋 Todo

### Content depth (highest impact)

- [ ] Grow each topic from 5 to 15–20 questions — 90 questions is a demo, not a test-prep product
- [ ] Add harder distractors; several current wrong options are eliminable without knowing the rule
- [ ] Native-language question sets (German for 🇩🇪, French for 🇫🇷) rather than English throughout
- [ ] Cover the remaining sign families: warning triangles, prohibition circles, motorway boards
- [ ] Have the German and French content reviewed by someone who has sat the actual test

### Stripe payments

- [ ] `POST /api/payments/create-checkout-session` + webhook handler
- [ ] Upgrade page / modal → Stripe Checkout
- [ ] Replace the `User.isPremium` flag with a real subscription check
- [ ] Store `stripeCustomerId` and `subscriptionStatus` on `User`

### Spaced repetition

- [ ] Add `dueAt` and `intervalDays` to `QuestionStat`
- [ ] SM-2-style scheduler in `lib/quiz.ts`
- [ ] A "Due today" source alongside MISTAKES and BOOKMARKS

### Admin CMS

- [ ] `/admin` behind `role === "ADMIN"` — question CRUD
- [ ] Image picker over the generated scenario library
- [ ] Export back to seed format so the files stay the source of truth

### Testing

- [ ] Vitest coverage for `lib/quiz.ts` selection and grading
- [ ] API route tests, especially answer-leakage in exam mode
- [ ] A seed-validation test that runs in CI
- [ ] Component tests for `optionState` and the quiz store's reveal logic

### Polish

- [ ] Timer on exam mode
- [ ] Resume banner on the topic list for an unfinished quiz
- [ ] Per-question difficulty surfaced in the UI (the field exists and is populated)
- [ ] Streaks / daily goals
- [ ] Print or PDF export of a wrong-answer sheet
- [ ] `prefers-reduced-motion` handling for the score ring animation

### Countries

- [ ] 🇬🇧 UK — left-hand traffic, different sign vocabulary, Highway Code references
- [ ] 🇳🇱 Netherlands — cycle infrastructure priority rules
- [ ] 🇦🇹 Austria
