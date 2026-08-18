# RoadReady — Claude Agent Instructions

## Project Overview

RoadReady (roadready.online) is a **scenario-based driving theory trainer**.

Each question shows an illustrated road situation — a junction, a sign, a hazard — and asks what
the driver should do. Four options, one correct, and an explanation of the rule behind it. Users
work through topics, drill the questions they get wrong, and sit a mock exam.

Countries live: Germany 🇩🇪 and France 🇫🇷, 9 topics and 45 questions each.

> **The 3D driving simulation was removed.** Everything under `apps/web/src/simulation/`, the
> Three.js / R3F / Rapier dependencies and `SIMULATION_DESIGN.md` are gone as of the `Idea-rewrite`
> branch. See `REWRITE_PLAN.md` for why. Do not reintroduce them.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite (port 5173)
- **State:** Zustand
- **Styling:** Tailwind CSS
- **Backend:** Node.js + Express + TypeScript (port 3001)
- **ORM:** Prisma **6.0.0** — do NOT upgrade to 7.x (requires a driver adapter we don't use)
- **Database:** PostgreSQL — local in dev, swap `DATABASE_URL` for production
- **Auth:** Custom JWT (bcryptjs + jsonwebtoken) — token in `localStorage` as `rr_token`
- **Payments:** Stripe (later)
- **Hosting:** Vercel (frontend), Railway (backend)

There is no 3D, no physics engine, and no canvas rendering anywhere in the project.

## Monorepo Structure

```
roadready.online/
├── apps/
│   ├── web/          # React frontend (Vite, port 5173)
│   └── api/          # Express backend (port 3001)
├── packages/
│   └── shared/       # The API contract — types shared by both apps
├── CLAUDE.md
├── REWRITE_PLAN.md   # Why the product changed, and the design of the new one
├── TASKS.md
├── DEVELOPER_GUIDE.md
└── README.md
```

## Domain Vocabulary

The word "scenario" used to mean two different things. It now means exactly one:

| Term         | Meaning                                                                  |
| ------------ | ------------------------------------------------------------------------ |
| **Scenario** | The road situation an individual question depicts. Not a database table. |
| **Question** | One scenario-based MCQ: image + prompt + 4 options + explanation.        |
| **Topic**    | A themed group of questions ("Roundabouts"). The unit users start.       |
| **Category** | A group of topics ("Traffic Rules"). Used to section the topic list.     |
| **Quiz**     | One run through a frozen set of questions. Practice or exam.             |

## Database Schema (Prisma 6.0.0)

Ten models — see `apps/api/prisma/schema.prisma`.

```
── Content ────────────────────────────────────────────────────
Country       code (unique), name, flagEmoji, isActive, order, facts,
              examQuestionCount, examPassPercent
Category      countryId, slug, name, description, order   UNIQUE(countryId, slug)
Topic         countryId, categoryId?, slug (unique), name, description,
              iconEmoji, order, isActive, isPremium
Question      topicId, order, prompt, imageUrl?, imageAlt?, explanation,
              difficulty (EASY|MEDIUM|HARD), isActive
Option        questionId, label ("A".."D"), text, isCorrect, order

── Users & progress ───────────────────────────────────────────
User          email (unique), password (bcrypt 12), name?, role (USER|ADMIN),
              isPremium, selectedCountryId?
Quiz          userId, countryId, topicId?, mode (PRACTICE|EXAM),
              source (TOPIC|EXAM|MISTAKES|BOOKMARKS),
              status (IN_PROGRESS|COMPLETED|ABANDONED),
              totalQuestions, correctCount, scorePercent, passed?, grade?
QuizItem      quizId, questionId, order, selectedOptionId?, isCorrect?, answeredAt?
              UNIQUE(quizId, questionId)
TopicProgress userId, topicId, status, bestScorePercent, attemptCount,
              passCount, lastAttemptAt   UNIQUE(userId, topicId)
QuestionStat  userId, questionId, timesSeen, timesCorrect, timesWrong,
              isBookmarked, lastSeenAt   UNIQUE(userId, questionId)
```

**Rules that matter:**

- **`QuizItem` freezes the question set at quiz creation.** Never re-derive a quiz's questions at
  read time — resuming, scoring and reviewing all depend on that snapshot.
- **`QuestionStat` is written at quiz completion, not on each answer.** An abandoned quiz must not
  pollute the user's mistake list.
- **A topic that has been passed stays `COMPLETED`.** A later bad run updates the score but never
  removes the completion.
- Migrations live in `apps/api/prisma/migrations/` and are committed. There is one baseline,
  `20260818000000_init`.
- No `prisma.config.ts` — Prisma 6 reads `DATABASE_URL` from env.

## Backend Structure (apps/api/src/)

```
src/
├── index.ts              # Express entry — dotenv/config FIRST, errorHandler LAST
├── lib/
│   ├── prisma.ts         # PrismaClient singleton (globalThis pattern)
│   ├── jwt.ts            # signToken / verifyToken (7-day expiry)
│   ├── http.ts           # HttpError, route() async wrapper, body parsing helpers
│   ├── serialize.ts      # Prisma rows → shared API types
│   └── quiz.ts           # Question selection, premium gating, grading
├── middleware/auth.ts    # requireAuth + optionalAuth
└── routes/
    ├── auth.ts       # register, login, GET/PATCH me
    ├── countries.ts  # list, detail, topics-by-category
    ├── topics.ts     # topic detail + progress
    ├── quizzes.ts    # create, history, detail, answer, complete
    ├── questions.ts  # bookmarks list, bookmark toggle
    └── progress.ts   # dashboard overview
```

**Non-negotiables:**

- **Never spread a Prisma row into a response.** Every payload goes through `lib/serialize.ts`.
  That is what keeps `Option.isCorrect` and `User.password` off the wire.
- **`reveal` is derived server-side only** — from quiz mode and status, never from a client flag.
  Exam mode withholds correctness and explanations until `/complete`.
- **Access control lives in `lib/quiz.ts`, not the routes.** `MISTAKES` and `BOOKMARKS` are filtered
  to unlocked topics too, so no source can be a side door onto premium content.
- Throw `HttpError` subclasses (`badRequest`, `notFound`, …) and wrap handlers in `route()`.
  Anything else that escapes becomes a generic 500 — internal details never leak.
- A quiz belonging to another user is reported as **404, not 403**, so ids cannot be probed.

## API Surface

| Method | Route                         | Auth | Purpose                                   |
| ------ | ----------------------------- | ---- | ----------------------------------------- |
| GET    | `/api/health`                 | —    | liveness                                  |
| POST   | `/api/auth/register`          | —    | bcrypt 12, returns JWT                    |
| POST   | `/api/auth/login`             | —    | returns JWT                               |
| GET    | `/api/auth/me`                | ✓    | current user                              |
| PATCH  | `/api/auth/me`                | ✓    | update `name` / `countryCode`             |
| GET    | `/api/countries`              | —    | active countries + counts                 |
| GET    | `/api/countries/:code`        | —    | one country incl. `facts`                 |
| GET    | `/api/countries/:code/topics` | opt  | topics by category (+ progress if authed) |
| GET    | `/api/topics/:slug`           | opt  | topic detail                              |
| POST   | `/api/quizzes`                | ✓    | create quiz, freeze question set          |
| GET    | `/api/quizzes`                | ✓    | history                                   |
| GET    | `/api/quizzes/:id`            | ✓    | quiz + questions                          |
| POST   | `/api/quizzes/:id/answer`     | ✓    | record answer                             |
| POST   | `/api/quizzes/:id/complete`   | ✓    | grade + breakdown (idempotent)            |
| GET    | `/api/progress/overview`      | ✓    | dashboard data                            |
| POST   | `/api/questions/:id/bookmark` | ✓    | toggle                                    |
| GET    | `/api/questions/bookmarks`    | ✓    | saved questions, answers revealed         |

`POST /api/quizzes` takes `{ countryCode, mode, source, topicSlug?, limit? }`:

| source      | question set                                      |
| ----------- | ------------------------------------------------- |
| `TOPIC`     | all active questions in `topicSlug`, in order     |
| `EXAM`      | random sample across the user's unlocked topics   |
| `MISTAKES`  | questions with `timesWrong > 0`, most-wrong first |
| `BOOKMARKS` | bookmarked questions                              |

**Grading:** `scorePercent = round(correct / total * 100)`. Grade A ≥ 90, B ≥ 80, C ≥ 70, D ≥ 60,
else F. Pass threshold is `Country.examPassPercent` (75), so it can differ per country.

## Frontend Structure (apps/web/src/)

```
src/
├── App.tsx                 # Routes + boot-time session restore
├── i18n/index.ts           # t() and tn() — every user-facing string goes through these
├── components/
│   ├── layout/index.tsx    # AppHeader, PageShell, Spinner, LoadingPanel, ErrorBanner, EmptyState
│   ├── auth/               # AuthModal, ProtectedRoute
│   ├── quiz/index.tsx      # ScenarioImage, QuizProgressBar, OptionButton, optionState,
│   │                       #   ExplanationPanel, BookmarkButton, ModeBadge
│   ├── results/index.tsx   # ScoreRing, StatTile, QuestionReviewRow
│   └── home/index.tsx      # TopicCard, CountryFacts
├── pages/
│   ├── Home.tsx            # THREE STATES — landing / country select / topic list
│   ├── Quiz.tsx            # One question at a time
│   ├── Results.tsx         # Score, grade, per-question review
│   ├── Dashboard.tsx       # Totals, topic mastery, recent quizzes
│   └── Review.tsx          # Mistakes + bookmarks
├── store/
│   ├── userStore.ts        # user, isBootstrapping, selectedCountry, auth modal
│   └── quizStore.ts        # active quiz, index, pending selections, submit/bookmark
├── utils/api.ts            # The only place `fetch` is called
└── scripts/generate-scenario-images.mjs   # Generates public/images/scenarios/*.svg
```

### Routes

| Route              | Guard     |
| ------------------ | --------- |
| `/`                | public    |
| `/quiz/:quizId`    | protected |
| `/results/:quizId` | protected |
| `/dashboard`       | protected |
| `/review`          | protected |

## Scenario Images

Questions reference an image by path: `/images/scenarios/<name>.svg`.

The whole set is **generated**, not hand-drawn, by `apps/web/scripts/generate-scenario-images.mjs`
(`npm run gen:images --workspace=apps/web`). One script means one visual language — the same road
colour, the same car glyph, the same sign proportions everywhere — and a tweak to that language is
a one-line change rather than 49 file edits.

- The user's own car is always blue with a dashed ring; other traffic is red or amber.
- `Question.imageUrl` also accepts an absolute `http(s)` URL, so a real photo can replace a diagram
  per-question with no schema change.
- **`imageAlt` is required on every question.** The image carries the question's information; a
  missing alt makes it unanswerable with a screen reader. The seed validator enforces this.
- Adding an image: add an entry to `scenes` or `signs` in the generator, run it, commit the SVG.

## Seed Content

```
apps/api/prisma/seed/
├── index.ts     # Validates, then upserts. Run with `npm run db:seed`
├── types.ts     # CountrySeed / TopicSeed / QuestionSeed shapes
├── germany.ts   # 9 topics × 5 questions
└── france.ts    # 9 topics × 5 questions
```

The seed is the source of truth for the question bank — there is no admin CMS.

- **`validate()` runs before any DB write** and fails loudly on a duplicate topic slug, an unknown
  category, a question without exactly 4 options or exactly 1 correct one, or a missing
  `imageAlt` / `explanation`.
- **Content files list the correct answer first** because that is far easier to write and review.
  The seed then shuffles options with a hash of `topic#order`, so answers spread across A–D but
  re-running the seed never reshuffles an existing question out from under quiz history.
- Questions are keyed by `(topic, order)` and **updated in place**, so re-seeding edits rows rather
  than orphaning `QuizItem` references.
- `isPremium` is derived: topics with `order > 3` are premium. First 3 topics per country are free.

## Key Conventions

- All code in **TypeScript** — no plain JS files (the image generator is the one `.mjs` build script)
- **Functional components** with hooks only
- **Zustand** for global state — no Redux, no Context for state
- Tailwind utility classes — no CSS modules, no styled-components
- **All API calls go through `src/utils/api.ts`** — never call `fetch` in a component
- **All user-facing strings go through `t()`** (or `tn()` for plurals) from `src/i18n`
- Frontend env vars are prefixed `VITE_`
- Backend routes follow REST conventions

## Naming Conventions

- Components: PascalCase (`QuestionReviewRow`, `AuthModal`)
- Hooks: camelCase with `use` prefix
- Stores: camelCase with `Store` suffix (`quizStore.ts`)
- Types/Interfaces: PascalCase (`QuizDetail`, `TopicSummary`)
- Topic slugs are country-prefixed: `de-roundabouts`, `fr-priorite-a-droite`

## Environment Variables

**Frontend** (`apps/web/.env.local`)

```
VITE_API_URL=http://localhost:3001
```

**Backend** (`apps/api/.env`)

```
DATABASE_URL=postgresql://roadready_user:roadready_pass@localhost:5432/roadready
JWT_SECRET=your_jwt_secret_here
PORT=3001
```

## Development Commands

```bash
npm run dev                              # API + frontend together
npm run dev:web                          # frontend only (5173)
npm run dev:api                          # backend only (3001)
npm run build                            # build all workspaces
npm run typecheck                        # tsc --noEmit across workspaces

cd apps/api
npm run db:seed                          # validate + seed content
npm run db:reset                         # migrate reset --force (drops data, reseeds)
npx prisma studio                        # GUI at localhost:5555
npx prisma migrate dev                   # create + apply a migration

npm run gen:images --workspace=apps/web  # regenerate scenario SVGs
```

## Adding Content

**A new question:** add it to the topic's `questions` array in `germany.ts` / `france.ts`, pick an
existing image name (or add one to the generator), then `npm run db:seed`.

**A new topic:** add a `TopicSeed` to the country's `topics` array with a country-prefixed slug and
a `category` that exists in that country. Order is positional, so inserting into the middle shifts
`order` — and therefore premium gating — for everything after it.

**A new country:** create `apps/api/prisma/seed/<country>.ts` exporting a `CountrySeed`, add it to
`COUNTRIES` in `seed/index.ts`. No code changes needed anywhere else.

## Important Notes for Claude Agent

- **Read `TASKS.md` at the start of every session**, and update it as work completes
- **Read `REWRITE_PLAN.md`** before making architectural changes — it records why this design exists
- **Do not reintroduce 3D, physics or canvas rendering.** That direction was retired deliberately.
- **Prisma is pinned to 6.0.0** — do not upgrade
- **Never leak answers**: `isCorrect` must not appear in any payload for an unanswered question in
  an in-progress quiz. If you touch `lib/serialize.ts` or `routes/quizzes.ts`, re-verify this.
- `Home.tsx` keeps its three conditional states — do not split them into separate routes
- `ProtectedRoute` waits on `isBootstrapping`; never gate a route on the raw localStorage token
- Question images need `imageAlt`; the seed validator will reject content without it
- Check existing files before creating new ones; component barrels live at `components/<group>/index.tsx`
- Run `npm run typecheck` and `npm run build` before pushing

## Git Workflow

- Branch naming: `feature/topic-motorway`, `fix/quiz-resume`, `chore/seed-validation`
- Conventional commits — `feat:`, `fix:`, `chore:`, `docs:`
- Never commit `.env`; `.env.example` files are safe
- Prisma migrations must be committed
- Run `npm run build` before pushing to main
