# RoadReady — Claude Agent Instructions

## Read first

- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** — setup, structure, how each
  subsystem works, conventions, troubleshooting. Read before changing content,
  lessons, quizzes, the sign library, scenes, i18n or themes.
- **[TASKS.md](./TASKS.md)** — what is done and what is pending. Read at the
  start of every session; update it when work completes.

This file holds the orientation an agent needs on top of those two.

## What this is

A browser-based **driving-theory course** for Germany. It teaches, then tests:

1. **Learn** — 14 modules / 92 lessons following the legally mandated curriculum
   (FahrschAusbO Anlage 1 Grundstoff + Anlage 2.2 class-B Zusatzstoff)
2. **Signs** — a browsable catalogue of 136 signs, signals and road markings
3. **Practice** — topic tests and per-module quizzes with instant explanations
4. **Situations** — illustrated driving scenes with a judgement question
5. **Final test** — 30 questions graded with official error points

Supporting features: **13 languages** (the set the official exam offers),
**6 themes**, and **read-aloud** on every text surface.

**There is no 3D simulation.** Three.js, React Three Fiber and Rapier were
removed in the October 2026 rewrite. Do not reintroduce them.

## Stack

React 18 + TypeScript + Vite (:5173, `strictPort`) · Zustand · Tailwind with CSS
custom-property theme tokens · inline SVG for all graphics — Express + TypeScript
(:3001) · Prisma **6.0.0** (never 7.x) · PostgreSQL · custom JWT (bcryptjs 12 +
jsonwebtoken, HS256) in `localStorage` as `rr_token`.

No i18n library, no charting library, no icon library — all hand-rolled and
intentionally dependency-free.

## Where things live

```
apps/web/src/
├── i18n/            Provider + en.ts (base, 151 keys) + locales/<lang>.ts × 12
├── theme/           themes.css (6 themes as CSS tokens) + ThemeProvider
├── components/
│   ├── signs/       136 SVG sign components + DE_SIGNS catalogue metadata
│   ├── scene/       SceneRenderer + roads + actors + geometry (situation art)
│   ├── brand/       Logo (priority-diamond mark) + 3 alternates
│   ├── SpeakButton  Web Speech with German-term voice switching
│   ├── AppShell     Header, nav, toolbar slot, SettingsMenu
│   └── ui.tsx       Card, Badge, ProgressBar, ScoreRing, EmptyState, ErrorNote
└── pages/           Home, Dashboard, Learn, ModuleView, ModuleQuiz,
                     SignsLibrary, PracticeTests, TopicQuiz, ScenarioPractice,
                     FinalTest

apps/api/src/
├── config/finalTest.ts   Exam shape + error-point grading
├── lib/                  prisma, jwt, validation, i18n (translation resolver)
├── middleware/           auth (requireAuth + optionalAuth), rateLimit, errors
└── routes/               auth, countries, modules, topicTests, scenarios,
                          finalTest, testSessions, users, progress,
                          userCountryAccess

apps/api/prisma/data/
├── modules/         m01…m14 — the 14 modules, 92 lessons, 184 questions
├── germanyTopics.ts 12 topic tests, 87 questions
├── germanyScenarios.ts  18 driving situations
├── scenes.ts        Scene JSON per situation slug
└── countries.ts     Germany + France records
```

## API routes

| Method | Route                                              | Auth | Notes                                        |
| ------ | -------------------------------------------------- | ---- | -------------------------------------------- |
| GET    | `/api/health`                                      | —    | `{ status: "ok" }`                           |
| POST   | `/api/auth/register` · `/api/auth/login`           | —    | bcrypt 12, rate limited, email normalised    |
| GET    | `/api/countries` · `/api/countries/:code/facts`    | —    | Facts are HTML, sanitised before render      |
| GET    | `/api/modules/:code`                               | opt  | Curriculum + progress when signed in         |
| GET    | `/api/modules/:code/:slug`                         | opt  | One module with all lessons                  |
| GET    | `/api/modules/:code/:slug/questions`               | —    | Module quiz pool, **no** `isCorrect`         |
| GET    | `/api/modules/:code/:slug/questions/answers`       | ✓    | Answer key for client-side scoring           |
| POST   | `/api/modules/progress`                            | ✓    | Marks one lesson read                        |
| GET    | `/api/topic-tests/:code` · `…/attempts`            | — ✓  | Topics; per-topic best/last score            |
| GET    | `/api/topic-tests/:code/:slug/questions[/answers]` | — ✓  | Same split as modules                        |
| POST   | `/api/topic-tests/attempts`                        | ✓    | Records a finished topic run                 |
| GET    | `/api/scenarios/:code`                             | —    | Situations incl. `sceneJson`                 |
| GET    | `/api/scenarios/:code/:id/answer`                  | ✓    | Answer key for one situation                 |
| GET    | `/api/final-test/:code/questions`                  | ✓    | 30 mixed questions with `errorPoints`        |
| POST   | `/api/test-sessions` · `…/:id/answers`             | ✓    | Graded server-side; response reveals nothing |
| PATCH  | `/api/test-sessions/:id/complete`                  | ✓    | Error-point grading + five-point rule        |
| GET    | `/api/test-sessions/:id`                           | ✓    | Breakdown only after completion              |
| GET    | `/api/users/me` · PATCH `…/me/preferences`         | ✓    | Profile; locale + theme                      |
| POST   | `/api/user-country-access`                         | ✓    | Records the chosen country                   |

Every content endpoint accepts `?locale=` and falls back field by field to the
base English text. `apps/web/src/utils/api.ts` appends it automatically.

## Database

18 models in `apps/api/prisma/schema.prisma`. The ones that matter:

```
Module       countryCode, slug, order, officialTitle (German), title, summary,
             intro, estimatedMinutes, isZusatzstoff
Lesson       moduleId, slug, order, title, body (restricted markdown),
             keyPoints (JSON), sceneJson?, signIds?
UserModuleProgress   UNIQUE(userId, moduleId), completedLessonIds (JSON)
TopicTest    countryCode, slug, name, nameEN, order, isSignTopic
Scenario     slug, name, order, type, imagePrompt?, imageUrl?, sceneJson?
Question     scenarioId? XOR topicTestId? XOR moduleId?, questionText,
             explanation, errorPoints (2–5)
Option       questionId, optionText, isCorrect, order
Translation  UNIQUE(entityType, entityId, field, locale) — one generic table
TestSession  totalScore, maxScore, errorPoints, failedByFivePointRule, grade
```

Two migrations define the current shape:
`20261013120000_rewrite_for_theory_platform` and
`20261013180000_learning_modules_i18n_scenes`. No `prisma.config.ts`.

## The exam, exactly

Configured only in `apps/api/src/config/finalTest.ts`:

- 30 questions: **20 Grundstoff + 10 class-B Zusatzstoff**, as the real exam splits them
- questions weigh **2 to 5 error points**
- pass with **≤ 10 error points**, and **never two 5-point questions wrong**
- grade letters derive from error points (A ≤ 2, B ≤ 6, C ≤ 10, else F)

Do not reintroduce percentage-based pass marks for the final test. Topic and
module practice still score by percentage (75% to pass) — that is deliberate.

## Rules that are easy to break

- Every question has **exactly four options and exactly one correct answer**,
  and `errorPoints` between 2 and 5. The seed validator enforces all of it.
- Content must be accurate to the **StVO**. Explanations state the rule; signs
  cite their Zeichen number; lessons cite the official lesson title.
- **Practice never fails a user** on a wrong answer. Only the final test grades.
- `isCorrect` must never be serialised by a question-serving endpoint.
- All API calls go through `apps/web/src/utils/api.ts` — never `fetch` in a component.
- **Never use raw Tailwind palette colours** (`bg-gray-900`, `text-white`, …) in
  components. Use the theme tokens: `ground surface raised ink muted faint line
line-strong accent accent-ink correct wrong warn premium sign-card`.
  A raw colour breaks four of the six themes.
- Traffic-sign colours are the exception: they are fixed hex values in
  `signs/primitives.tsx` and must never be themed.
- Scene art (roads, vehicles) also stays realistic rather than themed.
- Every user-facing string goes through `t()` with a key in `i18n/en.ts`.
  Adding a key means adding it to all 12 other locale files, or it falls back
  to English.
- German traffic terms stay German in every language.
- Vite is on 5173 with `strictPort`; the API is always on 3001.
- Prisma stays pinned to **6.0.0** in both the root and `apps/api`.

## Security invariants — do not regress

- `JWT_SECRET` has no production fallback (API refuses to boot without ≥ 24
  chars); JWT algorithm pinned to HS256
- CORS is an allowlist from `CORS_ORIGIN`
- `/api/auth/*` rate limited 20 / 15 min; everything else 300 / min
- JSON bodies capped at 32 kb
- Every URL param and body field parsed via `lib/validation.ts` before Prisma
- Ownership checked on every user-scoped route
- Login runs a bcrypt compare even when no user exists (timing)
- The final test is graded server-side; its breakdown is withheld until the
  session is completed
- API HTML passes through `sanitizeHtml` before `dangerouslySetInnerHTML`
- Never commit `.env`

## Before you finish

1. `npx prettier --write` across both apps
2. `npx tsc --noEmit` in **both** `apps/web` and `apps/api` — zero errors
3. `npm run build`
4. `cd apps/api && npm run db:seed` — the validator must pass
5. Update `TASKS.md`

There is an API test suite worth re-running after backend changes; see
DEVELOPER_GUIDE § Testing. UI changes are best verified with a headless
screenshot pass across themes and languages — the guide explains how, and it is
the only way to catch theme-contrast bugs.

## Git

Branches `feature/…`, `fix/…`, `chore/…`. Conventional commits (`feat:`, `fix:`,
`chore:`, `docs:`). Commit migrations. Never commit `.env`.
Work lands on `main` through a PR.
