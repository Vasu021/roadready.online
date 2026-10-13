# RoadReady — Claude Agent Instructions

## Read first

- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** — setup, structure, how the
  product works, conventions, troubleshooting. Read it before changing content,
  quiz flow, the sign library or the API.
- **[TASKS.md](./TASKS.md)** — what is done and what is pending. Read at the
  start of every session, and update it when work completes.

This file holds only what an agent needs on top of those.

## What this is

A browser-based driving **theory** platform: sign library, topic-by-topic MCQ
practice, illustrated driving situations, and a timed graded theory test.
Germany is complete; France is a country record awaiting content.

**There is no 3D simulation.** Three.js, React Three Fiber, Rapier and the
autopilot system were removed in the October 2026 rewrite. Do not reintroduce
them or add a 3D dependency unless asked.

## Stack

React 18 + TypeScript + Vite (:5173, `strictPort`) · Zustand · Tailwind ·
inline SVG graphics — Express + TypeScript (:3001) · Prisma **6.0.0** (never
7.x) · PostgreSQL · custom JWT (bcryptjs 12 + jsonwebtoken, HS256) in
`localStorage` as `rr_token`.

## API routes

| Method   | Route                                            | Auth | Notes                                        |
| -------- | ------------------------------------------------ | ---- | -------------------------------------------- |
| GET      | `/api/health`                                    | —    | `{ status: "ok" }`                           |
| POST     | `/api/auth/register` · `/api/auth/login`         | —    | Normalised email, bcrypt 12, rate limited    |
| GET      | `/api/countries` · `/api/countries/:code/facts`  | —    | Facts are HTML, sanitised before render      |
| GET      | `/api/topic-tests/:code`                         | —    | Active topics + question counts              |
| GET      | `/api/topic-tests/:code/attempts`                | ✓    | Best / last score per topic                  |
| GET      | `/api/topic-tests/:code/:slug/questions`         | —    | Shuffled options, **no** `isCorrect`         |
| GET      | `/api/topic-tests/:code/:slug/questions/answers` | ✓    | Answer key for client-side practice scoring  |
| POST     | `/api/topic-tests/attempts`                      | ✓    | Records a finished topic run                 |
| GET      | `/api/scenarios/:code`                           | —    | Situations + their question                  |
| GET      | `/api/scenarios/:code/:id/answer`                | ✓    | Answer key for one situation                 |
| GET      | `/api/scenarios/progress/:userId/:code`          | ✓    | Own data only                                |
| GET      | `/api/final-test/:code/questions`                | ✓    | 30 mixed questions, no answer key            |
| POST     | `/api/test-sessions`                             | ✓    | Starts a graded session                      |
| POST     | `/api/test-sessions/:id/answers`                 | ✓    | Graded server-side; response reveals nothing |
| PATCH    | `/api/test-sessions/:id/complete`                | ✓    | Scores, grades, closes                       |
| GET      | `/api/test-sessions/:id`                         | ✓    | Breakdown only after completion              |
| GET      | `/api/users/me`                                  | ✓    | Profile + attempt count                      |
| POST     | `/api/user-country-access`                       | ✓    | Records the chosen country                   |
| GET/POST | `/api/progress/:userId` · `/api/progress`        | ✓    | Legacy; nothing in the new UI writes here    |

## Database

Fourteen models in `apps/api/prisma/schema.prisma`. The ones that matter:

```
TopicTest   countryCode, slug (unique), name, nameEN, order, isActive, isSignTopic
Scenario    slug (unique), name, order, isActive, type, imagePrompt?, imageUrl?
Question    scenarioId? XOR topicTestId?, questionText, order, explanation
Option      questionId, optionText, isCorrect, order
Sign        metadata table — signs render from CODE and it is NOT seeded
ScenarioAttempt  scenarioId? XOR topicTestId?, mode, passed, score, totalQuestions?
TestSession      userId, countryId, totalScore, maxScore, passed?, grade?
TestSessionAnswer UNIQUE(testSessionId, questionId) — answers upsert
```

Notes: one rewrite migration (`20261013120000_rewrite_for_theory_platform`); no
`prisma.config.ts` (do not recreate it); migrations are committed; use
`UserScenarioProgress` / `ScenarioAttempt`, not the legacy `UserProgress`.

## Rules that are easy to break

- Every question has **exactly four options and exactly one correct answer** —
  the seed validator enforces it and will fail the build of your content.
- Content must be accurate to the **StVO**. Explanations state the rule; signs
  cite their Zeichen number.
- **Practice never fails a user** on a wrong answer. Only the final test grades.
- Topic answer keys are deliberately client-visible; final-test answers are
  not. Do not move that line without moving topic scoring into a session too.
- `isCorrect` must never be serialised by a question-serving endpoint.
- All API calls go through `apps/web/src/utils/api.ts` — never `fetch` in a
  component.
- Signs are inline SVG components in a `0 0 100 100` viewBox using
  `SIGN_COLORS` — never image files, never hardcoded hex.
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

1. `npx prettier --write` in both apps
2. `npx tsc --noEmit` in **both** `apps/web` and `apps/api` — zero errors
3. `npm run build` if anything structural changed
4. Update `TASKS.md`
5. Check existing files before creating new ones; reuse `components/ui.tsx`

## Git

Branches `feature/…`, `fix/…`, `chore/…`. Conventional commits (`feat:`,
`fix:`, `chore:`, `docs:`). Commit migrations. Never commit `.env`.
