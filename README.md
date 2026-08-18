# 🚦 RoadReady

> **Read the road, not just the rulebook.**
> A browser-based driving theory trainer built around illustrated road scenarios.

🌐 **Website:** [roadready.online](https://roadready.online)
📦 **Status:** In development
🗓️ **Started:** 2026

---

## 🧭 What is RoadReady?

RoadReady teaches country-specific traffic rules through **scenario-based multiple choice
questions**. Every question puts you in a real situation — an unmarked junction, a roundabout entry,
a sign you have half a second to read — shows you the scene, and asks what you would do.

Answer, find out whether you were right, and read the rule behind it. Then the questions you got
wrong come back until they stick.

```
pick a country  →  choose a topic (or a mock exam)
                →  answer illustrated questions one at a time
                →  practice: instant feedback + explanation
                   exam:     graded at the end, answers hidden until you finish
                →  review your score, your mistakes, and your bookmarks
```

### The problem it solves

- A German licence costs **€2,500–€4,500**, and a failed theory test adds fees and weeks of delay
- Existing theory apps are walls of text — you memorise answer positions, not situations
- **Internationals and expats** have to relearn rules that locals absorbed by osmosis, and the
  rules that catch them out (Rechts vor Links, priorité à droite) are exactly the visual ones
- Rules make sense when you can _see_ the junction. So every question ships with a picture.

> **Note on project history:** RoadReady began as a 3D driving simulator. That direction was retired
> — it was expensive to build, brutally slow to add content to, and the learning value was always in
> the decision and the explanation rather than in the rendered world. See
> [`REWRITE_PLAN.md`](./REWRITE_PLAN.md) for the full reasoning.

---

## 🎯 Who it's for

- **Learners** preparing for their theory test
- **Internationals and expats** learning the rules of a new country
- **Drivers converting a foreign licence** who need country-specific rules fast
- **Returning drivers** brushing up before getting back behind the wheel

---

## 🗺️ Content

| Country    | Topics | Questions | Categories                                       |
| ---------- | ------ | --------- | ------------------------------------------------ |
| 🇩🇪 Germany | 9      | 45        | Basic Skills, Traffic Rules, Road Signs, Hazards |
| 🇫🇷 France  | 9      | 45        | Basic Skills, Traffic Rules, Road Signs, Hazards |

### 🇩🇪 Germany

| Topic                       | Category      | Covers                                                          |
| --------------------------- | ------------- | --------------------------------------------------------------- |
| Vehicle Basics & Moving Off | Basic Skills  | Warning lights, pulling out, narrow streets, reversing          |
| Rechts vor Links            | Traffic Rules | Default priority — and where it does _not_ apply                |
| Roundabouts                 | Traffic Rules | Entry, signalling, and the roundabout with no yield sign        |
| Traffic Lights              | Traffic Rules | Red-amber, green arrows, blocked junctions, penalties           |
| Priority Signs              | Road Signs    | Yellow diamond, STOP, Zeichen 301, narrowings                   |
| Speed Limits                | Traffic Rules | Defaults, Tempo-30 zones, derestriction, fog                    |
| Pedestrians & Cyclists      | Hazards       | Zebra crossings, school zones, buses, the 1.5 m rule            |
| Autobahn Rules              | Traffic Rules | Lane discipline, Richtgeschwindigkeit, Rettungsgasse, zip merge |
| Hazards & Emergencies       | Hazards       | Emergency vehicles, level crossings, roadworks, overtaking      |

### 🇫🇷 France

| Topic                      | Category      | Covers                                             |
| -------------------------- | ------------- | -------------------------------------------------- |
| Vehicle Basics & Equipment | Basic Skills  | Compulsory kit, pulling out, stationnement gênant  |
| Priorité à Droite          | Traffic Rules | The default rule and the signs that override it    |
| Roundabouts                | Traffic Rules | The giratoire vs. the old rond-point               |
| Traffic Lights             | Traffic Rules | No red-amber phase, filter arrows, flashing amber  |
| Priority Signs             | Road Signs    | Yellow diamond, STOP, narrowings, children         |
| Speed Limits               | Traffic Rules | 80 vs 90 debate, wet-weather limits, fog           |
| Pedestrians & Cyclists     | Hazards       | Crossings, school zones, the 1 m rule, buses       |
| Motorway Driving           | Traffic Rules | Lane discipline, merging, tolls, the hard shoulder |
| Enforcement & Hazards      | Hazards       | The 12-point licence, radars, emergency vehicles   |

---

## 🖼️ Scenario images

Every question carries an illustration and required alt text. The whole library —
junction diagrams, roundabouts, motorway scenes, and German/French road signs — is **generated
from a single script**, so the entire set shares one visual language:

```bash
npm run gen:images --workspace=apps/web
```

Your car is always blue with a dashed ring; other traffic is red or amber. SVG rather than
photography means no licensing risk, no CDN dependency, tiny payloads, and crisp rendering at any
size. `imageUrl` also accepts an absolute URL, so real photos can be swapped in per question later.

---

## ✨ Features

### Working now

- ✅ Scenario-based MCQs with illustrations and required alt text
- ✅ **Practice mode** — instant ✅/❌ and the rule behind the answer
- ✅ **Exam mode** — answers withheld until you finish, then graded A–F with pass/fail
- ✅ **Mistake drilling** — every question you got wrong, most-wrong first
- ✅ **Bookmarks** — save anything to revisit, with explanations
- ✅ Per-topic mastery tracking and a progress dashboard
- ✅ Two countries, four categories each, 90 questions total
- ✅ JWT accounts with progress saved server-side
- ✅ Freemium gating — first 3 topics per country free
- ✅ Keyboard-driven quizzes (`1`–`4` / `A`–`D` to choose, `Enter` to continue)
- ✅ Responsive down to 390 px

### Planned

- 🔜 Stripe subscriptions in place of the dev premium flag
- 🔜 Spaced repetition (the `QuestionStat` table is already shaped for it)
- 🔜 Admin CMS for authoring questions without a redeploy
- 🔜 More countries — UK, Netherlands, Austria
- 🔜 Multilingual UI (German, French, Turkish, Arabic, Hindi)

---

## 🛠️ Tech Stack

| Layer        | Technology                                        |
| ------------ | ------------------------------------------------- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Zustand |
| **Backend**  | Node.js, Express, TypeScript                      |
| **Database** | PostgreSQL via Prisma 6                           |
| **Auth**     | JWT (bcryptjs + jsonwebtoken)                     |
| **Hosting**  | Vercel (web), Railway (API + Postgres)            |
| **Payments** | Stripe (planned)                                  |

No 3D engine, no physics, no canvas. The frontend bundle is ~213 kB (67 kB gzipped).

---

## 🏗️ Architecture

```
roadready.online/
├── apps/
│   ├── web/
│   │   ├── public/images/scenarios/   # 49 generated SVG illustrations
│   │   ├── scripts/                   # Scenario image generator
│   │   └── src/
│   │       ├── components/            # layout · auth · quiz · results · home
│   │       ├── pages/                 # Home · Quiz · Results · Dashboard · Review
│   │       ├── store/                 # userStore · quizStore
│   │       ├── i18n/                  # t() / tn()
│   │       └── utils/api.ts           # The only place fetch is called
│   └── api/
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed/                  # index · types · germany · france
│       └── src/
│           ├── lib/                   # prisma · jwt · http · serialize · quiz
│           ├── middleware/auth.ts
│           └── routes/                # auth · countries · topics · quizzes · questions · progress
└── packages/shared/                   # The API contract, shared by both apps
```

Two design decisions worth knowing before reading the code:

- **`QuizItem` freezes a quiz's question set at creation.** Scoring, resuming and reviewing all read
  from that snapshot, so a quiz stays reproducible even as the question bank changes.
- **Nothing reaches the client except through `lib/serialize.ts`.** That is the single choke point
  keeping `Option.isCorrect` out of responses for questions you haven't answered yet.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm

### Setup

```bash
git clone https://github.com/Vasu021/roadready.online.git
cd roadready.online
npm install

cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# edit apps/api/.env with your DATABASE_URL and JWT_SECRET

npm run db:reset --workspace=apps/api   # migrate + seed 90 questions
npm run dev                             # http://localhost:5173
```

See [`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md) for local PostgreSQL setup, adding content, and
troubleshooting.

### Environment variables

**`apps/web/.env.local`**

```env
VITE_API_URL=http://localhost:3001
```

**`apps/api/.env`**

```env
DATABASE_URL=postgresql://roadready_user:roadready_pass@localhost:5432/roadready
JWT_SECRET=your_jwt_secret_here
PORT=3001
```

---

## 💰 Business Model

| Plan               | Price        | Includes                                         |
| ------------------ | ------------ | ------------------------------------------------ |
| **Free**           | €0           | First 3 topics per country, full explanations    |
| **Learner**        | €7.99/month  | All topics for one country, mock exams, drilling |
| **Pro**            | €14.99/month | Every country, all features                      |
| **School licence** | €99/month    | Student accounts and an instructor dashboard     |

---

## 📚 Documentation

| Document                                     | Contents                                    |
| -------------------------------------------- | ------------------------------------------- |
| [`REWRITE_PLAN.md`](./REWRITE_PLAN.md)       | Why the product changed, and the new design |
| [`CLAUDE.md`](./CLAUDE.md)                   | Architecture reference and conventions      |
| [`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md) | Setup, adding content, troubleshooting      |
| [`TASKS.md`](./TASKS.md)                     | What is done and what is next               |

---

## 👨‍💻 About the Developer

**Amlendu Shekhar**

- 🎓 MSc Data Science — RWTH Aachen University, Germany
- 💼 Software Engineer (Working Student) — trivago, Düsseldorf
- 🔗 [LinkedIn](https://linkedin.com/in/amlendu-shekhar) · [GitHub](https://github.com/Vasu021)

---

## 🤝 Contributing

1. Fork and branch (`git checkout -b feature/topic-motorway`)
2. Follow [Conventional Commits](https://www.conventionalcommits.org/)
3. Run `npm run typecheck` and `npm run build` — both must be clean
4. Open a PR against `main` using the template

Issue and PR templates live under [`.github/`](./.github/).

---

## 📄 License

MIT — see [LICENSE](./LICENSE).

---

_Built with ❤️ in Aachen, Germany 🇩🇪_
