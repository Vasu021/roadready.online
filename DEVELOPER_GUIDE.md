# RoadReady — Developer Guide

Everything you need to run the project, understand how it is put together, and
add content. For what the product _is_, see the [README](./README.md).

**Contents**

1. [Setup](#1-setup)
2. [Project structure](#2-project-structure)
3. [How it works](#3-how-it-works)
4. [Adding content](#4-adding-content)
5. [Conventions](#5-conventions)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Setup

**Requirements:** Node 20+, npm, and PostgreSQL (Docker is easiest).

```bash
git clone https://github.com/Vasu021/roadready.online.git
cd roadready.online
npm install
```

### Environment

Neither env file is committed. `apps/api/.env.example` is the reference.

```bash
cp apps/api/.env.example apps/api/.env
echo "VITE_API_URL=http://localhost:3001" > apps/web/.env.local
```

`apps/api/.env`:

```env
DATABASE_URL=postgresql://roadready_user:roadready_pass@localhost:5432/roadready
JWT_SECRET=at_least_24_random_characters   # openssl rand -base64 48
PORT=3001
CORS_ORIGIN=http://localhost:5173          # comma-separated allowlist
TRUST_PROXY=false                          # true behind a reverse proxy
```

> `JWT_SECRET` has **no production fallback**. With `NODE_ENV=production` the API
> refuses to start unless it is set and at least 24 characters long.

### Database

```bash
docker run -d --name roadready-pg \
  -e POSTGRES_USER=roadready_user -e POSTGRES_PASSWORD=roadready_pass \
  -e POSTGRES_DB=roadready -p 5432:5432 postgres:16

cd apps/api
npx prisma migrate deploy   # apply migrations
npm run db:seed             # seed + validate the German course
cd ../..
```

### Run

```bash
npm run dev          # web on :5173, api on :3001
npm run dev:web      # frontend only
npm run dev:api      # backend only
npm run build        # build everything
```

Useful Prisma commands, from `apps/api`:

```bash
npx prisma studio          # browse the database at :5555
npx prisma migrate dev     # create and apply a migration
npx prisma generate        # regenerate the client after a schema change
```

> **Prisma is pinned to 6.0.0** in both the root and `apps/api`. Do not upgrade:
> 7.x requires a driver adapter this project does not use.

---

## 2. Project structure

```
roadready.online/
├── apps/
│   ├── web/                        # React + Vite frontend (:5173)
│   │   └── src/
│   │       ├── components/
│   │       │   ├── signs/          # 136 SVG sign components + catalogue
│   │       │   ├── AppShell.tsx    # Header, nav, toolbar slot, footer
│   │       │   ├── QuestionCard.tsx# The MCQ renderer used by every quiz
│   │       │   ├── ResultsScreen.tsx
│   │       │   └── ui.tsx          # Card, Badge, ProgressBar, ScoreRing, …
│   │       ├── pages/              # Home, Dashboard, SignsLibrary,
│   │       │                       # PracticeTests, TopicQuiz,
│   │       │                       # ScenarioPractice, FinalTest
│   │       ├── store/              # gameStore (quiz), userStore (session)
│   │       └── utils/              # api client, jwt helpers, html sanitiser
│   │
│   └── api/                        # Express backend (:3001)
│       ├── prisma/
│       │   ├── schema.prisma       # 14 models
│       │   ├── data/               # Seed content
│       │   └── seed.ts             # Seeds and validates
│       └── src/
│           ├── config/finalTest.ts # Exam shape and grading
│           ├── lib/                # prisma, jwt, validation
│           ├── middleware/         # auth, rateLimit, errors
│           └── routes/
│
└── packages/shared/                # Types shared by both apps
```

There is **no 3D code**. The driving simulator (Three.js, Rapier, autopilot) was
removed in the October 2026 rewrite; the product is now a theory course.

---

## 3. How it works

### The three loops

Passing a theory test is a recognition problem, so the product is built around
three loops in order: **recognise** (sign library) → **drill** (topic tests with
an explanation after every answer) → **prove** (one timed, graded exam).
Practice never punishes a wrong answer. Only the final test grades.

### Routes

```
/                 Home — three states (below)
/dashboard        Hub: three sections + the exam
/signs            Sign library (reference, no scoring)
/practice         Topic list with progress
/practice/:slug   One topic run
/scenarios        Driving situations
/final-test       Brief → timed exam → graded breakdown
```

`Home.tsx` holds three conditional states — do not split them into routes:
logged out → landing page; logged in without a country → country picker; country
chosen → redirect to `/dashboard`. The selection is mirrored to `localStorage`
(`rr_country`) so a refresh or deep link does not bounce the user back.

### Content model

Two kinds of question, one table. Exactly one foreign key is set per row:

| Kind              | Parent                 | Served by                                    |
| ----------------- | ---------------------- | -------------------------------------------- |
| Topic question    | `Question.topicTestId` | `GET /api/topic-tests/:code/:slug/questions` |
| Driving situation | `Question.scenarioId`  | `GET /api/scenarios/:code`                   |

Every question has four options, exactly one correct. The seed asserts this and
fails loudly if it is ever violated.

### Where the answer key lives

This is deliberate, and the two modes differ:

- **Practice** is scored on the client. The key comes from an auth-guarded
  `…/answers` endpoint so the explanation appears instantly. A determined user
  could read it from the network tab — an acceptable trade when there is nothing
  to cheat for.
- **The final test is scored on the server.** Its question payload never
  includes `isCorrect`, the answer response reveals nothing, and the
  per-question breakdown stays empty until the session has `completedAt` set —
  so a running exam cannot be probed for answers.

If that ever needs to change for practice, move topic scoring into a session
like the final test rather than half-hiding the key.

### The exam

All of it is configured in `apps/api/src/config/finalTest.ts`:

```ts
questionCount: 30
timeLimitMinutes: 45
passRatio: 0.75              // grade B or better
mix: { topic: 15, scenario: 10, sign: 5 }
```

Grades: A ≥ 90%, B ≥ 75%, C ≥ 60%, else F. The route draws the configured mix at
random and tops it up from the remaining pool if a bucket is short, so the exam
is always full length. Running out of time submits what has been answered;
unanswered questions count as wrong.

### The sign library

Each sign is a self-contained React SVG component built from a shell in
`primitives.tsx` — no image files, no CDN, no runtime fetches.

```
primitives.tsx   Shells (danger triangle, prohibition ring, blue circle, yellow
                 diamond, info rectangle, plate), shared glyphs (car, truck,
                 bicycle, pedestrian, motorcycle) and the official colours
danger · priority · prohibition · mandatory · information
additional (plates) · signals (lights) · markings (paint) · combinations
index.ts         DE_SIGNS: SignMeta[] — the catalogue and its metadata
```

Every component takes the same props: `{ size?: number; className?: string }`,
and draws inside a `0 0 100 100` viewBox so all signs scale together. Colours
come from `SIGN_COLORS` — never hardcode a hex value in a sign.

### Quiz state

`gameStore` drives every quiz surface: `questions`, `currentQuestion`,
`questionIndex`, `answers`, `quizScore`, plus `startQuiz` / `answerQuestion` /
`nextQuestion` / `goToQuestion` / `resetQuiz`. Every quiz page calls `resetQuiz`
on unmount.

The final test keeps its selections in local component state instead, because
the client is not told whether an answer is correct until grading.

### Security

Worth knowing before you touch the API:

- `JWT_SECRET` is enforced in production; the JWT algorithm is pinned to HS256
- CORS is an allowlist from `CORS_ORIGIN`
- `/api/auth/*` is rate limited (20 / 15 min per IP), everything else 300 / min
- JSON bodies are capped at 32 kb
- Every URL parameter and body field goes through `lib/validation.ts` before it
  reaches Prisma
- `isCorrect` is never serialised by a question-serving endpoint
- Ownership is checked on every user-scoped route
- Login runs a bcrypt compare even when the user does not exist, so timing does
  not reveal whether an email is registered
- API-supplied HTML passes through `sanitizeHtml` before `dangerouslySetInnerHTML`

---

## 4. Adding content

None of this needs a new route or page.

### A topic test

Add a `SeedTopic` to `apps/api/prisma/data/germanyTopics.ts`:

```ts
{
  slug: "de-your-topic",          // unique, country-prefixed
  name: "Deutscher Titel",        // German name — primary label
  nameEN: "English Title",        // English name — secondary label
  description: "One sentence on what this covers.",
  order: 13,
  isSignTopic: false,             // true only for sign-recognition topics
  questions: [
    {
      questionText: "What must you do here?",
      explanation: "State the rule, not just the answer.",
      options: [
        { text: "The correct action", isCorrect: true },
        { text: "A plausible mistake", isCorrect: false },
        { text: "Another plausible mistake", isCorrect: false },
        { text: "A third plausible mistake", isCorrect: false },
      ],
    },
    // 5–10 questions per topic
  ],
}
```

Then `cd apps/api && npm run db:seed`. The topic list, quiz page and exam pool
all read from the database, so nothing else is needed.

**Writing questions:** exactly one unambiguously correct answer; three wrong
options a real learner might actually pick, not filler; an explanation that
states the underlying rule and cites the Zeichen number or StVO paragraph where
it helps. Everything must be accurate to the current StVO.

### A driving situation

Add a `SeedScenario` to `apps/api/prisma/data/germanyScenarios.ts`. The
`imagePrompt` describes the scene concretely — road layout, signs, other road
users, light and weather — and its first two sentences appear on the card. When
real artwork exists, fill `imageUrl` on the row and it is used instead, with no
code change.

### A sign

1. Pick the file for its category and build the component from a shell:

```tsx
export function DangerYourSign(p: SignProps) {
  return (
    <DangerShell {...p}>
      <rect x={46} y={36} width={8} height={30} fill={C.black} />
    </DangerShell>
  );
}
```

2. Add a `SignMeta` entry to `DE_SIGNS` in `signs/index.ts`: German name,
   English name, category, what it means, what to do, Zeichen number.

### Checklist

- [ ] Content added under `apps/api/prisma/data/`
- [ ] `npm run db:seed` run, validation passed
- [ ] New signs registered in both the category file and `DE_SIGNS`
- [ ] `npx prettier --write` and `npx tsc --noEmit` clean in both apps
- [ ] `TASKS.md` updated

---

## 5. Conventions

- **TypeScript only**, functional components with hooks, Zustand for state,
  Tailwind for styling
- **All API calls go through `apps/web/src/utils/api.ts`** — never `fetch` in a
  component
- Reuse the primitives in `components/ui.tsx` before writing new Tailwind
- Signs are inline SVG components — never image files
- Page controls that must stay visible go in `AppShell`'s `toolbar` slot, never
  in a hand-positioned sticky element
- Every page must work down to 375 px wide
- Naming: components `PascalCase`; signs `<Category><Name>`
  (`DangerChildren`); stores `camelCase` + `Store`; sign ids
  `de-<category>-<name>`; topic slugs `de-<topic>`; situations `de-sc-<name>`

**Design system:** dark `gray-950` base; `blue-600` primary, `green-500`
correct, `red-500` wrong, `amber-400` the exam. Surfaces are
`rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm`.

**Accessibility:** quizzes are keyboard-operable (`A`–`D` / `1`–`4` select,
`Enter` confirms then advances); modals handle `Escape` and take focus; sign
SVGs are `aria-hidden` with the name on the card button;
`prefers-reduced-motion` is respected.

**Git:** branches `feature/…`, `fix/…`, `chore/…`; conventional commits
(`feat:`, `fix:`, `chore:`, `docs:`); never commit `.env`; always commit
migrations; run `npm run build` before pushing.

---

## 6. Troubleshooting

**`PrismaClientInitializationError: PrismaClient needs to be constructed with valid options`**
Prisma 7 got installed. Both the root and `apps/api` must pin `6.0.0`. Reinstall
with the pinned version and run `npx prisma generate`.

**`Property 'X' does not exist on type 'PrismaClient'`**
The client is stale after a schema change. Run `npx prisma generate` in
`apps/api`.

**New content does not appear**
The seed was not re-run, or it failed validation. Run `npm run db:seed` from
`apps/api` and read the output: a line starting with `✖` names the offending
question. Also check the topic's `isActive` and that its `countryCode` matches
the country selected in the app.

**The API will not start in production**
Almost always `JWT_SECRET` missing or shorter than 24 characters. That is
deliberate — set a real secret.

**Browser requests fail with a CORS error**
The frontend origin is not in `CORS_ORIGIN`. Add it (comma-separated) and
restart the API.

**`429 Too many requests` while testing login**
The auth rate limiter allows 20 attempts per 15 minutes per IP. Restart the API
to clear the in-memory window.

**Port 5173 already in use**
Vite runs with `strictPort`, so it fails rather than moving. Stop the other
process; do not change the port.
