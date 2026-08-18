# RoadReady — Idea Rewrite Plan

> Branch: `Idea-rewrite`
> Status: **plan approved → implementing**
> Supersedes: the 3D simulation product direction (`SIMULATION_DESIGN.md`, deleted in this branch)

---

## 1. Why we are rewriting

The original product was a browser-based **3D driving simulation**: an autopilot car drove a
waypoint path through a procedural German city, paused at "challenge points", and asked the user
to press a key.

That direction is being retired. In practice it turned out to be:

- **Disproportionately hard** — road geometry, physics tuning, camera framing, NPC traffic and
  collision handling are each multi-week problems, and none of them is the thing users pay for.
- **Content-hostile** — every new scenario needed hand-authored waypoints, a bespoke road mesh and
  scene props. Adding one topic cost days. We need to add _hundreds_ of questions, not tens.
- **Fragile** — Rapier + R3F + a 379-line `CarController` is a large surface area for bugs that are
  invisible in code review and only show up as "the car drove into a building".
- **Not the differentiator** — the learning value was always in the _decision_ the user makes and
  the _explanation_ they get afterwards. The 3D world was expensive packaging around an MCQ.

## 2. What RoadReady becomes

**A scenario-based driving-theory trainer.**

Each question shows a **road scene image** — an intersection, a roundabout, a sign, a hazard — and
asks what the driver should do. Four options. Immediate feedback with an explanation of the rule
that applies. Progress and weak spots are tracked per topic.

The product loop:

```
pick country  →  pick a topic (or a full mock exam)
              →  answer image-based MCQs one at a time
              →  practice: instant ✅/❌ + explanation
                 exam:     answers deferred, graded at the end
              →  results screen: score, grade, pass/fail, per-question review
              →  progress + mistakes + bookmarks tracked for later revision
```

Everything the 3D engine did (pause the world, ask a question, explain the rule) survives. The
world itself does not.

### What is kept from the old build

- Monorepo layout (`apps/web`, `apps/api`, `packages/shared`)
- Express + Prisma + PostgreSQL backend, JWT auth with `rr_token` in `localStorage`
- Tailwind + React + Vite + Zustand frontend
- The three-state `Home.tsx` flow (landing → country select → content list)
- Country model with facts panel, freemium gating, premium dev toggle

### What is deleted

| Deleted                                                                                                                          | Reason                                                             |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/web/src/simulation/**` (~1,900 LOC)                                                                                        | Whole 3D engine                                                    |
| `three`, `@react-three/fiber`, `@react-three/drei`, `@dimforge/rapier3d-compat`, `@types/three`                                  | Unused after the above                                             |
| `ChallengeOverlay.tsx`, `ScenarioHUD.tsx`, `ResultsScreen.tsx`                                                                   | Simulation-era UI                                                  |
| `apps/api/src/data/scenarios.ts`                                                                                                 | Dead hardcoded scenario list                                       |
| `SIMULATION_DESIGN.md`                                                                                                           | Documents a product that no longer exists                          |
| `apps/web/public/models/volvo.glb`                                                                                               | Unused 3D asset                                                    |
| Prisma models `ScenarioAttempt`, `UserProgress`, `TestSession`, `TestSessionAnswer`, `UserCountryAccess`, `UserScenarioProgress` | Replaced by `Quiz` / `QuizItem` / `TopicProgress` / `QuestionStat` |

---

## 3. Domain model

The word "scenario" was overloaded — it meant both _a 3D driving situation_ and _a group of
questions_. In the new model:

- **Scenario** = the situation depicted by a single question's image. Not a database table.
- **Topic** = a themed group of scenario questions (Roundabouts, Priority Signs). This is what the
  old `Scenario` table becomes.
- **Category** = a group of topics (Basic Skills, Traffic Rules, Road Signs).

### Prisma schema (new baseline)

```
Country        code, name, flagEmoji, isActive, order, facts,
               examQuestionCount, examPassPercent

Category       countryId → Country, slug, name, description, order
               UNIQUE(countryId, slug)

Topic          countryId → Country, categoryId → Category,
               slug (unique), name, description, order,
               iconEmoji, isActive, isPremium

Question       topicId → Topic, order, prompt, imageUrl, imageAlt,
               explanation, difficulty (EASY|MEDIUM|HARD), isActive

Option         questionId → Question, label (A|B|C|D), text, isCorrect, order

User           email (unique), password (bcrypt 12), name, role (USER|ADMIN),
               isPremium, selectedCountryId → Country

Quiz           userId, countryId, topicId?, mode (PRACTICE|EXAM),
               source (TOPIC|EXAM|MISTAKES|BOOKMARKS),
               status (IN_PROGRESS|COMPLETED|ABANDONED),
               totalQuestions, correctCount, scorePercent, passed, grade,
               startedAt, completedAt

QuizItem       quizId → Quiz, questionId → Question, order,
               selectedOptionId?, isCorrect?, answeredAt?
               UNIQUE(quizId, questionId)
               ← the frozen, ordered question set served for one quiz

TopicProgress  userId, topicId, status (NOT_STARTED|IN_PROGRESS|COMPLETED),
               bestScorePercent, attemptCount, passCount, lastAttemptAt
               UNIQUE(userId, topicId)

QuestionStat   userId, questionId, timesSeen, timesCorrect, timesWrong,
               isBookmarked, lastSeenAt
               UNIQUE(userId, questionId)
               ← powers "review my mistakes" and bookmarks
```

`QuizItem` is the important one: the question set for a quiz is chosen and **frozen at creation
time**, so reordering, resuming, and scoring are all deterministic, and a quiz stays reproducible
even if the question bank changes later.

`UserCountryAccess` is gone — country choice is a single `User.selectedCountryId` column, which is
what it was actually being used for.

### Migration strategy

Table names all change, so the old migration chain is replaced with a **single fresh baseline
migration** (`0_init`). The dev database is reset via `npm run db:reset`. Nothing in the old schema
holds production data.

---

## 4. Scenario images

Every question carries an `imageUrl`. Images are **hand-authored SVG illustrations** committed to
`apps/web/public/images/scenarios/`:

- Junction / roundabout / crossing top-down scene diagrams
- German and French road signs (geometric, so SVG renders them exactly)

Why SVG rather than photos: no licensing risk, no CDN dependency, tiny payloads, crisp at any
resolution, dark-mode friendly, and diffable in git. `imageUrl` also accepts an absolute `http(s)`
URL, so photographic assets can be swapped in per-question later without a schema change.

`imageAlt` is required alongside every image for screen readers.

---

## 5. API surface

| Method | Route                         | Auth | Purpose                                           |
| ------ | ----------------------------- | ---- | ------------------------------------------------- |
| GET    | `/api/health`                 | —    | liveness                                          |
| POST   | `/api/auth/register`          | —    | bcrypt 12, returns JWT                            |
| POST   | `/api/auth/login`             | —    | returns JWT                                       |
| GET    | `/api/auth/me`                | ✓    | user + selected country + premium flag            |
| PATCH  | `/api/auth/me`                | ✓    | update `name` / `countryCode`                     |
| GET    | `/api/countries`              | —    | active countries + topic/question counts          |
| GET    | `/api/countries/:code`        | —    | one country incl. `facts`                         |
| GET    | `/api/countries/:code/topics` | opt  | topics grouped by category (+ progress if authed) |
| GET    | `/api/topics/:slug`           | opt  | topic meta + question count + progress            |
| POST   | `/api/quizzes`                | ✓    | create quiz, freeze its `QuizItem` set            |
| GET    | `/api/quizzes`                | ✓    | quiz history                                      |
| GET    | `/api/quizzes/:id`            | ✓    | quiz + questions (correct answers withheld)       |
| POST   | `/api/quizzes/:id/answer`     | ✓    | record answer; practice → returns explanation     |
| POST   | `/api/quizzes/:id/complete`   | ✓    | grade, pass/fail, per-question breakdown          |
| GET    | `/api/progress/overview`      | ✓    | dashboard stats per country/topic                 |
| POST   | `/api/questions/:id/bookmark` | ✓    | toggle bookmark                                   |
| GET    | `/api/questions/bookmarks`    | ✓    | bookmarked questions                              |

**One creation endpoint, four sources.** `POST /api/quizzes` takes
`{ countryCode, mode, source, topicSlug?, limit? }`:

| source      | question set                                               |
| ----------- | ---------------------------------------------------------- |
| `TOPIC`     | all active questions in `topicSlug`, in `order`            |
| `EXAM`      | random sample across the country, size `examQuestionCount` |
| `MISTAKES`  | questions the user has answered wrong more than right      |
| `BOOKMARKS` | questions the user has bookmarked                          |

**Answer leakage is prevented server-side.** `Option.isCorrect` is never serialised for an
unanswered question. In `PRACTICE` the answer endpoint returns `{ isCorrect, correctOptionId,
explanation }` immediately; in `EXAM` it returns `{ recorded: true }` and the breakdown only appears
after `/complete`.

**Grading.** `scorePercent = round(correctCount / totalQuestions * 100)`.
Grade: A ≥ 90, B ≥ 80, C ≥ 70, D ≥ 60, else F. Pass threshold is `Country.examPassPercent`
(default 75) so it can differ per country.

---

## 6. Frontend

### Routes

| Route              | Page        | Notes                                            |
| ------------------ | ----------- | ------------------------------------------------ |
| `/`                | `Home`      | three states (landing / country select / topics) |
| `/quiz/:quizId`    | `Quiz`      | one question at a time                           |
| `/results/:quizId` | `Results`   | score ring, grade, per-question review           |
| `/dashboard`       | `Dashboard` | real stats, topic mastery, quiz history          |
| `/review`          | `Review`    | mistakes + bookmarks launchpads                  |

`Home` keeps its three conditional states, as required by `CLAUDE.md` — State C now lists **topics**
grouped by category instead of simulation scenarios, each showing question count and mastery.

### Components

```
components/
  layout/    AppHeader, PageShell, Spinner, EmptyState, ErrorBanner
  auth/      AuthModal, ProtectedRoute
  quiz/      QuestionCard, ScenarioImage, OptionButton,
             ExplanationPanel, QuizProgressBar, QuizNavigation
  results/   ScoreRing, GradeBadge, QuestionReviewRow
  home/      TopicCard, CategorySection, CountryPicker, CountryFacts
```

### State

- `userStore` — auth user, selected country, premium flag, auth modal mode
- `quizStore` — active quiz, question set, current index, per-question local answer state,
  practice-vs-exam behaviour

### Accessibility & i18n

- Every option is a real `<button>`; keyboard `1–4` / `A–D` select, `Enter` confirms, `→` advances
- Every image has `alt` text from `imageAlt`
- All user-facing strings go through `t()` in `src/i18n/` from the start

---

## 7. Implementation order

1. **Branch** `Idea-rewrite` ✅
2. **Docs** — this plan; rewrite `CLAUDE.md`, `README.md`, `TASKS.md`; delete `SIMULATION_DESIGN.md`
3. **Schema** — new `schema.prisma`, drop old migrations, fresh `0_init` baseline
4. **Seed** — split into `prisma/seed/` modules; Germany + France, 9 topics each, 5 questions each
5. **Images** — author the SVG scenario/sign library under `apps/web/public/images/scenarios/`
6. **Shared types** — `packages/shared` rewritten as the API contract shared by both apps
7. **Backend** — rewrite every route against the new schema; add `lib/quiz.ts` for selection+grading
8. **Frontend teardown** — delete `src/simulation/**`, simulation UI, and the 3D dependencies
9. **Frontend build** — quiz store, quiz/results/dashboard/review pages, component library
10. **Verify** — `tsc --noEmit` clean in both apps, `npm run build` green, seed + smoke-test the API

## 8. Explicitly out of scope for this branch

- Stripe payments (`isPremium` stays a dev toggle / DB column)
- Admin CMS for authoring questions (seed file is the source of truth)
- Spaced repetition scheduling (the `QuestionStat` table is shaped to support it later)
- Additional countries beyond Germany and France
- Real photography for scenario images
