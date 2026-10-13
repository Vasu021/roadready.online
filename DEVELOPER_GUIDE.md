# RoadReady — Developer Guide

Everything needed to run the project, understand how it works, and add to it.
For what the product _is_, see the [README](./README.md).

**Contents**

1. [Setup](#1-setup)
2. [Project structure](#2-project-structure)
3. [How it works](#3-how-it-works)
4. [Adding content](#4-adding-content)
5. [Languages, themes and audio](#5-languages-themes-and-audio)
6. [Testing](#6-testing)
7. [Conventions](#7-conventions)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Setup

**Requirements:** Node 20+, npm, PostgreSQL (Docker is easiest).

```bash
git clone https://github.com/Vasu021/roadready.online.git
cd roadready.online
npm install

cp apps/api/.env.example apps/api/.env
echo "VITE_API_URL=http://localhost:3001" > apps/web/.env.local

docker run -d --name roadready-pg \
  -e POSTGRES_USER=roadready_user -e POSTGRES_PASSWORD=roadready_pass \
  -e POSTGRES_DB=roadready -p 5432:5432 postgres:16

cd apps/api && npx prisma migrate deploy && npm run db:seed && cd ../..
npm run dev          # web on :5173, api on :3001
```

`apps/api/.env`:

```env
DATABASE_URL=postgresql://roadready_user:roadready_pass@localhost:5432/roadready
JWT_SECRET=at_least_24_random_characters   # openssl rand -base64 48
PORT=3001
CORS_ORIGIN=http://localhost:5173          # comma-separated allowlist
TRUST_PROXY=false                          # true behind a reverse proxy
```

> `JWT_SECRET` has **no production fallback**. The insecure development secret
> is only used when `NODE_ENV` is explicitly `development` or `test`; with it
> unset or set to anything else, the API refuses to start unless `JWT_SECRET` is
> present and at least 24 characters. `npm run dev:api` sets
> `NODE_ENV=development` for you — if you run `tsx` directly, set it yourself.

> **Prisma is pinned to 6.0.0** in both the root and `apps/api`. Do not upgrade:
> 7.x requires a driver adapter this project does not use.

Useful Prisma commands from `apps/api`: `npx prisma studio`,
`npx prisma migrate dev`, `npx prisma generate`.

---

## 2. Project structure

```
roadready.online/
├── apps/
│   ├── web/                        # React + Vite frontend (:5173)
│   │   └── src/
│   │       ├── i18n/               # Provider, en.ts base, locales/<lang>.ts
│   │       ├── theme/              # themes.css tokens + ThemeProvider
│   │       ├── components/
│   │       │   ├── signs/          # 136 SVG signs + DE_SIGNS metadata
│   │       │   ├── scene/          # Situation renderer (roads, actors, geometry)
│   │       │   ├── brand/          # Logo mark and alternates
│   │       │   ├── AppShell.tsx    # Header, nav, toolbar slot
│   │       │   ├── SettingsMenu.tsx# Language + theme picker
│   │       │   ├── SpeakButton.tsx # Read-aloud
│   │       │   ├── QuestionCard.tsx# The MCQ renderer used by every quiz
│   │       │   ├── LessonBody.tsx  # Restricted-markdown renderer
│   │       │   └── ui.tsx          # Card, Badge, ProgressBar, ScoreRing, …
│   │       ├── pages/
│   │       └── utils/              # api client, jwt helpers, html sanitiser
│   │
│   └── api/                        # Express backend (:3001)
│       ├── prisma/
│       │   ├── schema.prisma       # 18 models
│       │   ├── migrations/         # Committed
│       │   ├── data/               # Seed content (modules/, topics, scenarios, scenes)
│       │   └── seed.ts             # Seeds and validates
│       └── src/
│           ├── config/finalTest.ts # Exam shape and error-point grading
│           ├── lib/                # prisma, jwt, validation, i18n
│           ├── middleware/         # auth, rateLimit, errors
│           └── routes/
│
└── packages/shared/                # Types shared by both apps (incl. SceneSpec)
```

---

## 3. How it works

### The learning path

**Learn → Practice → Prove.** A learner reads a module, takes its quiz, drills
the topic tests, works through situations, then sits the final exam. Practice
never punishes a wrong answer; only the final test grades.

### Routes

```
/                      Home — three states (landing / country picker / redirect)
/dashboard             Hub
/learn                 The 14 modules with progress
/learn/:slug           Module reader: lesson rail + lesson body
/learn/:slug/quiz      That module's own question pool
/signs                 Sign catalogue
/practice              Topic list
/practice/:slug        One topic run
/scenarios             Driving situations
/final-test            Brief → timed exam → graded breakdown
```

### Who can see what

The API is the security boundary, not the frontend.

- **Public:** `/api/health`, `/api/countries`, `/api/countries/:code/facts` —
  exactly what the signed-out landing page renders, and nothing more.
- **Everything else needs a session.** Lessons, questions, signs topics,
  situations, the exam and all user data are behind `requireAuth`.

The guard is applied where the routers are mounted in `apps/api/src/index.ts`,
not inside each route file, so a route added to a protected router is protected
whether or not its author remembered to say so. There is no `optionalAuth`
helper — it was removed, because a middleware that attaches a user but never
rejects is how a content endpoint quietly becomes public.

On the frontend, `ProtectedRoute` keeps signed-out visitors off those pages, but
it does **not** trust the token in `localStorage`: a JWT payload is just base64,
so anyone can write `{"sub":"…","exp":<next year>}` into it. `utils/session.ts`
asks `/api/users/me` whether the session is real, caches the answer per token,
and a rejected token is discarded rather than left showing an identity in the
header. A network failure is not treated as a rejection — only a 401 is.

When adding a route, the question to answer is not "should I add
`requireAuth`?" but "does this belong in a protected router?" — the answer is
yes unless a signed-out visitor genuinely needs it.

### Content model

Four content types, one `Question` table. A question belongs to exactly one of
a **module**, a **topic test** or a **scenario** — the other two FKs are null.

| Type       | Parent                 | Count           |
| ---------- | ---------------------- | --------------- |
| Module     | `Question.moduleId`    | 14 / 92 lessons |
| Topic test | `Question.topicTestId` | 12              |
| Scenario   | `Question.scenarioId`  | 18              |

Every question carries `errorPoints` (2–5) and has exactly four options with
exactly one correct. The seed asserts all of this and fails loudly otherwise.

### Where the answer key lives

Deliberately different per mode:

- **Practice** (modules, topics, situations) is scored on the client. The key
  comes from an auth-guarded `…/answers` endpoint so the explanation appears
  instantly. A determined user could read it from the network tab — acceptable
  when there is nothing to cheat for.
- **The final test is scored on the server.** Its payload never includes
  `isCorrect`, the answer response reveals nothing, and the breakdown stays
  empty until the session has `completedAt`.

### The exam

All of it lives in `apps/api/src/config/finalTest.ts`: 30 questions split
20 Grundstoff / 10 Zusatzstoff, weighted 2–5 error points, pass at ≤ 10 points,
and never two 5-pointers wrong. `gradeSession()` is the single grading function;
unanswered questions are charged 3 points each.

### The sign library

Each sign is a self-contained React SVG built from a shell in
`signs/primitives.tsx` — no image files, no CDN. Components take
`{ size?, className? }` and draw in a `0 0 100 100` viewBox. Colours come from
`SIGN_COLORS`; **sign colours are never themed**. `DE_SIGNS` in `signs/index.ts`
carries the metadata (both names, meaning, action, Zeichen number).

### The scene system

Situations are **data, not drawings**. A `SceneSpec` (in `packages/shared`)
names a road layout, actors at named slots, signs, markings, annotations and
weather; `components/scene/SceneRenderer.tsx` turns it into SVG.

```ts
{
  road: "crossroads",
  actors: [
    { kind: "car", at: "south", you: true },
    { kind: "car", at: "east", tone: "accent" },
  ],
  signs: [{ id: "de-priority-give-way", at: "right-verge" }],
  annotations: [{ kind: "order", at: "east", text: "has priority" }],
  caption: "An unmarked crossroads with a car approaching from the right",
}
```

Slot names map to coordinates per layout in `scene/geometry.ts`. Adding a
situation is a ten-line edit; adding a layout means adding a case in
`scene/roads.tsx` and a slot map in `geometry.ts`.

### Quiz state

One `gameStore` drives every quiz surface: `questions`, `currentQuestion`,
`questionIndex`, `answers`, `quizScore`, plus `startQuiz` / `answerQuestion` /
`nextQuestion` / `goToQuestion` / `resetQuiz`. Every quiz page calls `resetQuiz`
on unmount. The final test keeps its selections in local component state,
because the client is not told whether an answer is correct until grading.

---

## 4. Adding content

Nothing here needs a new route or page. After any change:
`cd apps/api && npm run db:seed`.

### A lesson or a module

Edit `apps/api/prisma/data/modules/mNN-*.ts`:

```ts
{
  slug: "de-mXX-topic",
  order: 15,
  officialTitle: "German title from the FahrschAusbO",
  title: "English display title",
  summary: "One line for the module card.",
  intro: "Why this module matters, three or four sentences.",
  estimatedMinutes: 20,
  isZusatzstoff: false,
  lessons: [
    {
      slug: "de-mXX-l1-something",
      title: "Lesson title",
      body: "Paragraphs, **bold**, and \"- \" bullet lines.",
      keyPoints: ["Three short takeaways", "…", "…"],
      signIds: ["de-priority-give-way"],   // optional sign strip
      scene: { road: "crossroads", actors: [...] }, // optional illustration
    },
  ],
  questions: [ /* same shape as topic questions, with errorPoints */ ],
}
```

Then register it in `prisma/data/modules/index.ts`.

**Writing rules:** exactly one unambiguously correct answer; three wrong options
a real learner might pick; an explanation that states the rule and cites the
Zeichen number or StVO paragraph; `errorPoints` 5 only where a wrong answer
would endanger someone.

### A driving situation

Add a `SeedScenario` to `prisma/data/germanyScenarios.ts` and its scene to
`prisma/data/scenes.ts`, keyed by the same slug.

### A sign

Build the component from a shell in the right category file, then add a
`SignMeta` entry to `DE_SIGNS` in `signs/index.ts`:

```tsx
export function DangerYourSign(p: SignProps) {
  return (
    <DangerShell {...p}>
      <rect x={46} y={36} width={8} height={30} fill={C.black} />
    </DangerShell>
  );
}
```

### Checklist

- [ ] Content added under `apps/api/prisma/data/`
- [ ] New modules registered in `data/modules/index.ts`
- [ ] New signs in both the category file and `DE_SIGNS`
- [ ] `npm run db:seed` passes validation
- [ ] `npx prettier --write` and `npx tsc --noEmit` clean in both apps
- [ ] `TASKS.md` updated

---

## 5. Languages, themes and audio

### Languages

13 locales — the set the official exam is offered in. `i18n/en.ts` is the base
and the source of truth for the key list (151 keys); every other locale is a
`Partial`, so a missing key falls back to English rather than showing blank.

Adding a key means adding it to `en.ts` **and** the 12 locale files. Locale
files are loaded on demand, so a visitor downloads one language, not thirteen.

Two rules that matter:

- **German traffic terms stay German in every language** — they are the words on
  the sign and in the exam.
- Arabic flips the document to RTL automatically (`dir` on `<html>`); use
  logical CSS (`ms-`/`me-`, `text-start`) rather than left/right where it matters.

Database content is translated through the generic `Translation` table
(`entityType, entityId, field, locale`), resolved in `lib/i18n.ts` with
field-by-field fallback. Nothing is seeded there yet: content is English with
German titles, and the mechanism is ready for a translation pass.

### Themes

Six themes, defined entirely as CSS custom properties in `theme/themes.css` and
mapped into Tailwind as colour tokens. Channels are stored as `"r g b"` so
opacity modifiers keep working (`bg-surface/60`).

| Token                                    | Use                                           |
| ---------------------------------------- | --------------------------------------------- |
| `ground`                                 | page background                               |
| `surface` / `raised`                     | cards and hover states                        |
| `ink` / `muted` / `faint`                | text, in decreasing emphasis                  |
| `line` / `line-strong`                   | borders                                       |
| `accent` / `accent-ink` / `accent-soft`  | primary action                                |
| `correct` / `wrong` / `warn` / `premium` | state colours                                 |
| `sign-card`                              | the light plate a sign sits on in dark themes |

**Never use a raw Tailwind palette colour in a component.** It will look wrong
in at least four themes. The one exception is the sign library and scene art,
which use fixed realistic colours on purpose.

When adding a theme, check that text on `ground` uses `ink`/`muted` that
actually contrast with `ground` — the wood theme originally failed exactly this
way, with dark ink on a dark ground.

### Audio

`SpeakButton` uses the Web Speech API (no dependency, no key). It splits text by
language so German terms inside a Turkish or Arabic sentence are spoken by a
German voice — `segmentForSpeech()` holds the term list. Navigation cancels
speech. If browser voice quality proves inadequate, the fallback is
pre-generated audio files; that decision is not made yet.

---

## 6. Testing

### API suite

`scripts/smoke-test.mjs` exercises the whole backend with no dependencies:
content counts, lesson progress, i18n fallback, exam composition, error-point
grading in both directions, the module quiz, preferences, and — at length —
access control.

```bash
npm run dev     # one terminal
npm run smoke   # another
```

It answers a full exam correctly (expecting 0 error points, grade A, passed),
then answers six questions wrong (expecting over 10 points and a fail), so a
regression in grading shows up immediately.

The last four sections are the ones to watch when touching routes or middleware:

- **access control** — every protected path returns 401 with no token, and the
  three public paths still return 200
- **forged tokens** — a made-up signature, an `alg: none` downgrade and plain
  garbage are all rejected
- **cross-user access** — one account cannot read, answer in, or complete
  another account's test session or progress
- **input validation** — bad country codes, slug traversal and out-of-range
  progress payloads are refused

64 assertions, all green.

### UI verification

Theme and translation bugs are invisible to TypeScript, so UI changes should be
checked by rendering. Any Chromium works headless over the DevTools protocol —
no extension, no Playwright:

```bash
"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
  --headless=new --remote-debugging-port=9223 --user-data-dir=/tmp/cdp &
# then drive it from Node: fetch /json/version, open a WebSocket to
# webSocketDebuggerUrl, Target.createTarget → Page.navigate →
# Page.captureScreenshot, and read the PNGs.
```

Seed `localStorage` with `rr_token`, `rr_country`, `rr_locale` and `rr_theme` to
land directly on an authenticated page in a given language and theme. The token
has to be a real one (register through the API first) — since `ProtectedRoute`
verifies the session, a hand-made token now lands you back on `/`, which is the
point. Capture at
least: one lesson in every theme, the dashboard in German, Turkish and Arabic,
and one mobile width. Check the console-error count is zero.

### Always

```bash
npx prettier --write ...        # both apps
npx tsc --noEmit                # both apps, zero errors
npm run build
cd apps/api && npm run db:seed  # validator must pass
```

---

## 7. Conventions

- **TypeScript only**, functional components with hooks, Zustand for state
- **All API calls go through `apps/web/src/utils/api.ts`** — never `fetch` in a component
- **Theme tokens only** in components; no raw palette colours
- **Every user-facing string through `t()`**, with the key added to `en.ts`
- Reuse `components/ui.tsx` primitives before writing new Tailwind
- Signs and scenes are inline SVG — never image files
- Page controls that must stay visible go in `AppShell`'s `toolbar` slot
- Every page must work down to 375 px wide
- Naming: components `PascalCase`; signs `<Category><Name>`; stores
  `camelCase` + `Store`; sign ids `de-<category>-<name>`; module slugs
  `de-mNN-<topic>`; lesson slugs `de-mNN-lN-<topic>`; situations `de-sc-<name>`

**Accessibility:** quizzes are keyboard-operable (`A`–`D` / `1`–`4`, `Enter`);
modals handle `Escape` and take focus; sign SVGs are `aria-hidden` with the name
on the card button; `prefers-reduced-motion` disables animation and texture.

**Git:** branches `feature/…`, `fix/…`, `chore/…`; conventional commits; never
commit `.env`; always commit migrations; work lands on `main` through a PR.

---

## 8. Troubleshooting

**`PrismaClientInitializationError`** — Prisma 7 got installed. Both the root and
`apps/api` must pin `6.0.0`. Reinstall, then `npx prisma generate`.

**`Property 'X' does not exist on type 'PrismaClient'`** — stale client after a
schema change. `npx prisma generate` in `apps/api`.

**New content does not appear** — the seed was not re-run or failed validation.
Run `npm run db:seed` from `apps/api` and read the output; a line starting `✖`
names the offending question or lesson.

**A theme looks broken** — almost always a raw Tailwind colour left in a
component. Grep for `bg-gray-`, `text-white`, `border-white/` under
`src/components` and `src/pages`.

**A string shows in English inside another language** — the key is missing from
that locale file. The fallback is intentional; add the key.

**The API will not start in production** — `JWT_SECRET` missing or under 24
characters. That is deliberate.

**`429 Too many requests` while testing login** — the auth limiter allows 20
attempts per 15 minutes per IP. Restart the API to clear the in-memory window.

**Port 5173 in use** — Vite runs with `strictPort` and fails rather than moving.
Stop the other process; do not change the port.
