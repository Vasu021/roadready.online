# RoadReady — Developer Guide

Everything you need to go from zero to a running local environment, contribute features, and add
new questions and topics.

> **Product context:** RoadReady is a scenario-based driving theory trainer. The 3D driving
> simulation was retired — see [`REWRITE_PLAN.md`](./REWRITE_PLAN.md). If you find a reference to
> `simulation/`, `CarController`, waypoints or challenge points anywhere, it is stale documentation.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Cloning the repo](#2-cloning-the-repo)
3. [Installing dependencies](#3-installing-dependencies)
4. [Environment variables](#4-environment-variables)
5. [Setting up the local database](#5-setting-up-the-local-database)
6. [Running locally](#6-running-locally)
7. [Project structure](#7-project-structure)
8. [Auth architecture](#8-auth-architecture)
9. [How a quiz works end to end](#9-how-a-quiz-works-end-to-end)
10. [Adding content](#10-adding-content)
11. [Git workflow](#11-git-workflow)
12. [Common errors and fixes](#12-common-errors-and-fixes)

---

## 1. Prerequisites

| Tool           | Version     | Notes                                                                                 |
| -------------- | ----------- | ------------------------------------------------------------------------------------- |
| **Node.js**    | 20 or later | Includes npm 10+. Download from [nodejs.org](https://nodejs.org).                     |
| **npm**        | 10 or later | Bundled with Node 20. This project uses **npm workspaces** — do not use pnpm or yarn. |
| **PostgreSQL** | 14 or later | Local install or Docker. The API connects via `DATABASE_URL`.                         |
| **Git**        | Any recent  | For cloning and branching.                                                            |

Verify your setup:

```bash
node -v     # v20.x.x or higher
npm -v      # 10.x.x or higher
psql --version
git --version
```

---

## 2. Cloning the repo

```bash
git clone https://github.com/Vasu021/roadready.online.git
cd roadready.online
```

---

## 3. Installing dependencies

Run this **once from the repo root**. npm workspaces installs dependencies for all three packages
(`apps/web`, `apps/api`, `packages/shared`) in a single command.

```bash
npm install
```

> Do not run `npm install` inside individual app directories — always install from the root so the
> workspace symlinks are set up correctly.

---

## 4. Environment variables

### `apps/api/.env`

```env
# PostgreSQL connection string
DATABASE_URL=postgresql://roadready_user:roadready_pass@localhost:5432/roadready

# Secret used to sign JWTs — use a long random string in production
JWT_SECRET=your_jwt_secret_here

# Port the Express API listens on
PORT=3001
```

### `apps/web/.env.local`

```env
# Base URL of the running API
VITE_API_URL=http://localhost:3001
```

Copy the committed examples to get started:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

**Never commit `.env` files.** The `.env.example` files are safe and should stay committed.

---

## 5. Setting up the local database

### 5.1 Create the database and user

Connect to PostgreSQL as a superuser and run:

```sql
CREATE USER roadready_user WITH PASSWORD 'roadready_pass';
CREATE DATABASE roadready OWNER roadready_user;
GRANT ALL ON SCHEMA public TO roadready_user;
ALTER USER roadready_user CREATEDB;
```

> `CREATEDB` is required so Prisma can create the shadow database used during `migrate dev`.

### 5.2 Apply the schema and seed content

All Prisma commands run from `apps/api/`. The fastest path from empty database to working app:

```bash
cd apps/api
npm run db:reset      # migrate reset --force, then seed
```

`db:reset` **drops all data**. On a database that already has users you care about, apply
migrations without resetting instead:

```bash
cd apps/api
npx prisma migrate deploy
npm run db:seed
```

There is a single baseline migration, `20260818000000_init`, which creates:

| Table            | Description                                                         |
| ---------------- | ------------------------------------------------------------------- |
| `countries`      | Country records with HTML facts and mock-exam configuration         |
| `categories`     | Topic groups within a country (Basic Skills, Traffic Rules, …)      |
| `topics`         | A themed group of questions — slug, order, premium flag             |
| `questions`      | One scenario MCQ — prompt, image, alt text, explanation, difficulty |
| `options`        | Four answer options per question, one marked `is_correct`           |
| `users`          | Registered users, role, premium flag, selected country              |
| `quizzes`        | One run through a question set — mode, source, score, grade         |
| `quiz_items`     | The frozen, ordered question set for a quiz, plus the answer given  |
| `topic_progress` | Best score and status per user + topic                              |
| `question_stats` | Per-user, per-question history — powers mistakes and bookmarks      |

### 5.3 What the seed inserts

```bash
cd apps/api
npm run db:seed
```

Germany and France, each with 4 categories, 9 topics and 45 questions — 90 questions in total, each
with an image, alt text, four options and an explanation.

The seed **validates before it writes**. If a question has two correct answers, three options, a
missing `imageAlt`, an unknown category or a duplicate topic slug, it aborts with a list of every
problem rather than half-seeding the database.

It is also **safe to re-run**. Questions are keyed by `(topic, order)` and updated in place, so
re-seeding edits existing rows rather than orphaning the `quiz_items` that reference them.

### 5.4 Generate the Prisma client

```bash
cd apps/api
npx prisma generate
```

> This also runs automatically via the `postinstall` script whenever you `npm install` from the root.

### 5.5 Inspect the database (optional)

```bash
cd apps/api
npm run db:studio    # Prisma Studio at http://localhost:5555
```

---

## 6. Running locally

From the repo root, one command starts both the frontend and the API in parallel:

```bash
npm run dev
```

| Service           | URL                              | Description                  |
| ----------------- | -------------------------------- | ---------------------------- |
| Frontend (Vite)   | http://localhost:5173            | React app with HMR           |
| Backend (Express) | http://localhost:3001            | REST API                     |
| Health check      | http://localhost:3001/api/health | Returns `{ "status": "ok" }` |

To run them separately:

```bash
npm run dev:web   # frontend only  → http://localhost:5173
npm run dev:api   # backend only   → http://localhost:3001
```

> Vite is pinned to port **5173** with `strictPort: true`. If 5173 is busy the process errors rather
> than silently stealing another port. The API is always on **3001**.

---

## 7. Project structure

```
roadready.online/
├── apps/
│   ├── web/                                  # React + Vite frontend (port 5173)
│   │   ├── public/images/scenarios/          # 49 generated SVG illustrations
│   │   ├── scripts/
│   │   │   └── generate-scenario-images.mjs  # Generates the SVG library
│   │   └── src/
│   │       ├── App.tsx                       # Routes + boot-time session restore
│   │       ├── i18n/index.ts                 # t() and tn()
│   │       ├── components/
│   │       │   ├── layout/index.tsx          # AppHeader, PageShell, Spinner, ErrorBanner…
│   │       │   ├── auth/                     # AuthModal, ProtectedRoute
│   │       │   ├── quiz/index.tsx            # ScenarioImage, OptionButton, ExplanationPanel…
│   │       │   ├── results/index.tsx         # ScoreRing, StatTile, QuestionReviewRow
│   │       │   └── home/index.tsx            # TopicCard, CountryFacts
│   │       ├── pages/
│   │       │   ├── Home.tsx                  # Three states: landing / country / topics
│   │       │   ├── Quiz.tsx                  # One question at a time
│   │       │   ├── Results.tsx               # Score, grade, per-question review
│   │       │   ├── Dashboard.tsx             # Totals, topic mastery, history
│   │       │   └── Review.tsx                # Mistakes + bookmarks
│   │       ├── store/
│   │       │   ├── userStore.ts              # Session, selected country, auth modal
│   │       │   └── quizStore.ts              # Active quiz, selections, submit
│   │       └── utils/api.ts                  # The only place fetch is called
│   │
│   └── api/                                  # Express backend (port 3001)
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/                   # Committed — one baseline
│       │   └── seed/
│       │       ├── index.ts                  # Validate, then upsert
│       │       ├── types.ts                  # CountrySeed / TopicSeed / QuestionSeed
│       │       ├── germany.ts                # 9 topics × 5 questions
│       │       └── france.ts                 # 9 topics × 5 questions
│       └── src/
│           ├── index.ts                      # dotenv FIRST, errorHandler LAST
│           ├── lib/
│           │   ├── prisma.ts                 # Client singleton
│           │   ├── jwt.ts                    # sign / verify
│           │   ├── http.ts                   # HttpError, route(), body parsers
│           │   ├── serialize.ts              # Prisma rows → API types
│           │   └── quiz.ts                   # Selection, gating, grading
│           ├── middleware/auth.ts            # requireAuth + optionalAuth
│           └── routes/                       # auth · countries · topics · quizzes ·
│                                             #   questions · progress
└── packages/shared/src/types.ts              # The API contract, shared by both apps
```

### Three files worth reading before you change anything

- **`packages/shared/src/types.ts`** — the API contract. Both apps import from here, so a change
  that breaks the frontend fails to compile in the backend too.
- **`apps/api/src/lib/serialize.ts`** — the only place responses are constructed. This is what keeps
  `Option.isCorrect` and `User.password` off the wire. Never spread a Prisma row into a response.
- **`apps/api/src/lib/quiz.ts`** — question selection, premium gating and grading. Access control
  lives here rather than in the routes, so no quiz source can become a side door onto premium
  content.

---

## 8. Auth architecture

Authentication is fully self-contained — no third-party auth service.

### Flow

```
Register / Login
  → POST /api/auth/register  or  POST /api/auth/login
  → API bcrypt-hashes (cost 12) and creates/verifies the User row
  → API returns { token: "<JWT>", user: AuthUser }
  → Frontend stores the token in localStorage as "rr_token"

Subsequent requests
  → utils/api.ts reads "rr_token" and sets Authorization: Bearer <token>
  → requireAuth verifies it and sets req.userId + req.userEmail
  → optionalAuth attaches the user when present, and continues anonymously when not

Session restore (App.tsx, on mount)
  → If "rr_token" exists, call GET /api/auth/me to VERIFY it
  → Valid   → populate userStore, resolve the selected country
  → Invalid → clear the token and continue logged out
  → Either way, set isBootstrapping = false

Logout
  → clear "rr_token" and the cached country, reset the store
```

> **The token is verified, not decoded.** An earlier version decoded the JWT payload locally, which
> meant an expired or tampered token rendered a signed-in UI that then 401'd on every request.
> `ProtectedRoute` waits on `isBootstrapping` for the same reason — gating on the raw localStorage
> value causes a redirect flash on reload.

### Token details

- Signed with `JWT_SECRET` from `apps/api/.env`
- 7-day expiry
- Payload: `{ sub: userId, email }`

### Login does not leak account existence

A wrong password and an unknown email both return the same 401 with `"Invalid email or password"`.
Keep it that way — differentiating them turns the endpoint into an account enumeration oracle.

---

## 9. How a quiz works end to end

```
1. POST /api/quizzes { countryCode, mode, source, topicSlug?, limit? }
     → lib/quiz.ts selects question ids for the source
     → premium gating applied HERE, for every source
     → Quiz row created with one QuizItem per question, in order
     → The question set is now FROZEN

2. GET /api/quizzes/:id
     → Serves questions with options, correct answers withheld

3. POST /api/quizzes/:id/answer { questionId, optionId }
     → Records selectedOptionId + isCorrect on the QuizItem
     → PRACTICE → responds with isCorrect, correctOptionId, explanation
     → EXAM     → responds { recorded: true } and nothing else

4. POST /api/quizzes/:id/complete
     → Counts correct answers, computes scorePercent and grade
     → Writes QuestionStat rows (timesSeen / timesCorrect / timesWrong)
     → Updates TopicProgress if the quiz was a topic quiz
     → Returns the full breakdown with every explanation
```

### Rules that are easy to break by accident

- **`reveal` is derived server-side only**, from quiz mode and status. Never from a client flag.
- **`QuestionStat` is written at completion, not on each answer.** An abandoned quiz must not
  pollute the user's mistake list.
- **A topic that has been passed stays `COMPLETED`.** A later bad run updates the best score but
  never removes the completion badge.
- **`/complete` is idempotent.** Calling it twice — a refresh, a double click — returns the same
  result instead of erroring. `Results.tsx` relies on this: it calls `/complete` as its fetch.
- **A quiz owned by another user returns 404, not 403**, so ids cannot be probed for existence.
- **Practice mode rejects a second answer** to the same question with 409. Without that, a user
  could see the revealed answer and re-submit for a perfect score.

### Quiz sources

| `source`    | Question set                                        |
| ----------- | --------------------------------------------------- |
| `TOPIC`     | All active questions in `topicSlug`, in order       |
| `EXAM`      | Random sample across the user's **unlocked** topics |
| `MISTAKES`  | Questions with `timesWrong > 0`, most-wrong first   |
| `BOOKMARKS` | Bookmarked questions                                |

A free user's mock exam is drawn from their three free topics rather than being refused — the
gating narrows the pool instead of blocking the feature.

---

## 10. Adding content

The seed files are the source of truth for the question bank. There is no admin CMS yet.

### 10.1 Adding a question

Add a `QuestionSeed` to the topic's `questions` array in `apps/api/prisma/seed/germany.ts` or
`france.ts`:

```typescript
{
  prompt:
    "A pedestrian is waiting at the kerb of a zebra crossing and is clearly intending to cross. What must you do?",
  image: "zebra-pedestrian-waiting",     // basename in public/images/scenarios
  imageAlt:
    "Zebra crossing with a pedestrian waiting at the kerb and a car approaching",
  difficulty: "EASY",                    // optional, defaults to MEDIUM
  explanation:
    "§26 StVO gives pedestrians who visibly want to use a Fußgängerüberweg priority over vehicles…",
  options: [
    { text: "Approach slowly and stop to let them cross — they have priority", correct: true },
    { text: "Carry on — priority begins only once they have stepped onto the road" },
    { text: "Sound the horn to warn them and continue" },
    { text: "Stop only if there is a school or a kindergarten nearby" },
  ],
},
```

Then:

```bash
cd apps/api && npm run db:seed
```

**Conventions the validator enforces:** exactly four options, exactly one marked `correct`, a
non-empty `imageAlt`, and a non-empty `explanation`.

**Conventions it cannot enforce, but that matter:**

- **Write the correct answer first.** It is far easier to review that way. The seed shuffles options
  deterministically from a hash of `topic#order`, so the correct answer still lands anywhere in
  A–D — and re-seeding never reshuffles an existing question out from under quiz history.
- **Make the distractors plausible.** An option nobody would pick teaches nothing. The best wrong
  answers are the misconceptions people actually hold.
- **Cite the rule in the explanation** (§8 StVO, article R413-17). It is what separates this from a
  flashcard, and it tells a learner where to read more.

### 10.2 Adding an image

Add an entry to `scenes` or `signs` in `apps/web/scripts/generate-scenario-images.mjs`, then:

```bash
npm run gen:images --workspace=apps/web
```

The script regenerates the whole directory, so commit the new SVG along with the script change.

Use the shared helpers (`roadH`, `roadV`, `dashH`, `car`, `egoCar`, `pedestrian`, `cyclist`,
`zebraH`, `building`, `caption`, `arrow`) rather than raw SVG — they are what keeps the set visually
consistent. **The user's car is always `egoCar`** (blue with a dashed ring); other traffic is
`C.other` (red) or `C.third` (amber).

To check your work, render a contact sheet:

```bash
# with any local browser that can screenshot a file:// page of <img> tags
```

### 10.3 Adding a topic

Add a `TopicSeed` to the country's `topics` array:

```typescript
{
  slug: "de-level-crossings",     // country-prefixed, globally unique
  name: "Level Crossings",
  description: "Signals, barriers, and what to do when you are stuck on the tracks.",
  iconEmoji: "🚂",
  category: "hazards",            // must match a CategorySeed slug in this country
  questions: [ /* … */ ],
}
```

> **Order is positional.** A topic's `order` comes from its index in the array, and premium gating
> is derived from it (`order > 3` is premium). Inserting a topic in the middle shifts the order —
> and therefore the free/premium boundary — for everything after it. Append unless you intend that.

### 10.4 Adding a country

Create `apps/api/prisma/seed/<country>.ts` exporting a `CountrySeed`, then add it to the `COUNTRIES`
array in `seed/index.ts`. No code changes are needed anywhere else — the API, the country picker,
the topic list and the dashboard are all driven by the data.

```typescript
export const netherlands: CountrySeed = {
  code: "NL",
  name: "Netherlands",
  flagEmoji: "🇳🇱",
  order: 3,
  examQuestionCount: 20,
  examPassPercent: 75,
  facts: "<p>…</p>",
  categories: [/* … */],
  topics: [/* … */],
};
```

---

## 11. Git workflow

### Opening an issue

Use the templates under `.github/ISSUE_TEMPLATE/` — GitHub shows a picker when you click
**New Issue**:

| Template             | Use when                                                     |
| -------------------- | ------------------------------------------------------------ |
| `bug_report.md`      | Something isn't working correctly                            |
| `feature_request.md` | Proposing a new feature or improvement                       |
| `task.md`            | Planned engineering work — new component, content, refactor  |
| `documentation.md`   | A doc is wrong, outdated, or missing something               |
| `question.md`        | Something unclear in the codebase or an open design decision |

Blank issues are disabled. Check `TASKS.md` and Section 12 below before filing a bug.

### Branch naming

```
feature/<description>   # New functionality
fix/<description>       # Bug fix
chore/<description>     # Tooling, deps, config
docs/<description>      # Documentation only
```

Examples:

```
feature/topic-level-crossings
fix/quiz-resume-index
chore/pin-prisma-6
docs/update-content-guide
```

### Before committing

```bash
npx prettier --write "**/*.{ts,tsx,json,md}"
```

### Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add level crossings topic for Germany
fix: prevent answer re-submission in practice mode
chore: pin prisma to 6.0.0
docs: rewrite developer guide for the MCQ product
```

If the commit closes an issue, add `Fixes #<issue_number>` at the end of the message.

### Before pushing

```bash
npm run typecheck    # tsc --noEmit across all workspaces
npm run build        # must be clean
```

**Never commit `.env` files.** **Always commit migration files** —
`apps/api/prisma/migrations/` tracks schema history and must not be gitignored.

---

## 12. Common errors and fixes

### "PrismaClientInitializationError: PrismaClient needs to be constructed with valid options"

**Cause:** Prisma 7 is installed. It requires a driver adapter this project does not use.

**Fix:** Prisma must be pinned to `6.0.0` in both `package.json` files:

```json
"@prisma/client": "6.0.0",
"prisma": "6.0.0"
```

Then reinstall and regenerate:

```bash
rm -rf node_modules/.prisma node_modules/@prisma
npm install
cd apps/api && npx prisma generate
```

---

### "permission denied to create database" during `prisma migrate dev`

**Cause:** The database user lacks `CREATEDB` (needed for Prisma's shadow database).

**Fix:**

```bash
psql -U postgres -c "ALTER USER roadready_user CREATEDB;"
# or, if the postgres role doesn't exist, use your OS username:
psql -c "ALTER USER roadready_user CREATEDB;"
```

---

### "permission denied for schema public"

**Cause:** PostgreSQL 15+ removed the default `CREATE` privilege on the `public` schema.

**Fix:**

```bash
psql -d roadready -c "GRANT ALL ON SCHEMA public TO roadready_user;"
```

---

### "P1001: Can't reach database server"

1. Confirm PostgreSQL is running: `pg_isready`
2. Verify `DATABASE_URL` in `apps/api/.env`
3. Test the connection directly: `psql -U roadready_user -d roadready`

---

### Seeding fails with "Seed validation failed"

**Cause:** Working as intended — the validator ran before touching the database.

**Fix:** Read the list it printed. Each line names the country, topic and question index, e.g.
`DE/de-roundabouts#3: expected 1 correct option, got 2`. Nothing was written, so fix the content
file and re-run.

---

### Questions appear but every answer is "A"

**Cause:** The option shuffle did not run — usually because options were inserted by something other
than the seed.

**Fix:** Re-run `npm run db:seed`. Options are shuffled from a hash of `topic#order` at insert time,
so check the distribution:

```bash
psql "$DATABASE_URL" -c "select label, count(*) from options where is_correct group by label order by label;"
```

---

### Images show as a grey box with the alt text

**Cause:** `Question.imageUrl` points at a file that does not exist in
`apps/web/public/images/scenarios/`. `ScenarioImage` degrades to a labelled placeholder rather than
a broken-image icon.

**Fix:** Regenerate the library and confirm every referenced name exists:

```bash
npm run gen:images --workspace=apps/web
grep -ho 'image: "[^"]*"' apps/api/prisma/seed/*.ts | sed 's/image: "//;s/"//' | sort -u > /tmp/used
ls apps/web/public/images/scenarios | sed 's/\.svg//' | sort > /tmp/have
comm -23 /tmp/used /tmp/have    # anything printed is referenced but missing
```

---

### Port 5173 or 3001 already in use

```bash
lsof -ti:5173 | xargs kill
lsof -ti:3001 | xargs kill
```

Vite uses `strictPort: true`, so it errors rather than silently moving port.

---

### Routes return 404 after adding a new route file

**Cause:** `tsx watch` occasionally misses file-change events on macOS, so the running server never
reloaded.

**Fix:**

```bash
lsof -ti:3001 | xargs kill
npm run dev:api
```

---

### TypeScript: "Property 'X' does not exist on type 'PrismaClient'"

**Cause:** The generated client is out of sync with `schema.prisma`.

**Fix:**

```bash
cd apps/api && npx prisma generate
```

---

### "File '../../packages/shared/src/index.ts' is not under rootDir"

**Fix:** In `apps/api/tsconfig.json`:

```json
{
  "compilerOptions": {
    "rootDir": "../../",
    "outDir": "./dist"
  },
  "include": ["src", "../../packages/shared/src"]
}
```

---

### `npm run dev` starts only one app

**Cause:** `concurrently` is not installed at the root.

**Fix:** Run `npm install` from the repo root, not from an app directory.
