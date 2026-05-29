# 🚗 RoadReady

> **Learn to drive. Anywhere. Anytime.**
> A browser-based 3D driving simulation platform for learning country-specific traffic rules and real-world road scenarios.

🌐 **Website:** [roadready.online](https://roadready.online)
📦 **Status:** In Development
🗓️ **Started:** 2026

---

## 🧭 What is RoadReady?

RoadReady is an **online 3D driving simulation platform** that allows users to practice driving in realistic, country-specific environments — directly in their browser. No downloads. No expensive driving lessons just to learn the basics.

Users can select a **city**, choose a **scenario** (e.g. roundabout, Autobahn merge, priority road, school zone), and practice driving with real traffic rules enforced. The platform provides instant feedback, pass/fail scoring, and a structured learning path.

### The Problem We Solve

Getting a driving license in Germany (and many other countries) is expensive, stressful, and time-consuming:

- A full German driving license costs between **€2,000 – €4,000**
- A large portion of that cost is simply due to lack of **pre-practice** before getting in a real car
- Existing apps only offer **multiple choice theory tests** — no practical simulation
- Physical simulators exist in some driving schools but are **not accessible from home**
- Millions of **internationals and immigrants** need to re-learn country-specific rules

RoadReady fills this gap: an affordable, accessible, browser-based simulation that lets you practice before you ever sit in a real car.

---

## 🎯 Target Audience

- **Students and first-time drivers** preparing for their driving test
- **Internationals and expats** learning traffic rules of a new country (e.g. moving to Germany)
- **People converting foreign licenses** who need to pass a practical test
- **Nervous drivers** who want more practice in specific scenarios before real road exposure

---

## 🌍 Roadmap: Cities & Countries

RoadReady is designed to scale globally. We start small and expand city by city.

### Phase 1 — Launch (MVP)

- 🇩🇪 **Aachen, Germany** — First city. German traffic rules, road signs, Autobahn scenarios.
- 🇫🇷 **France** — Second country. Priorité à droite, radar cameras, motorway rules.

### Phase 2 — Germany Expansion

- 🇩🇪 Berlin, Munich, Hamburg, Düsseldorf, Frankfurt

### Phase 3 — Europe

- 🇬🇧 UK — Left-hand traffic, roundabout rules
- 🇫🇷 France, 🇳🇱 Netherlands, 🇦🇹 Austria

### Phase 4 — Global

- 🇺🇸 USA, 🇨🇦 Canada, 🇮🇳 India, 🇦🇺 Australia, and more

---

## 🗺️ Core Features

### MVP (Aachen Launch)

- ✅ 3D browser-based driving simulation (no download required)
- ✅ Multi-country: Germany 🇩🇪 and France 🇫🇷 — each with 9 practice modules + 1 full theory test
- ✅ Three-state UI: marketing landing page → country selector with facts → scenario list
- ✅ Freemium gating: first 3 scenarios free per country; rest behind Premium
- ✅ MCQ-pause workflow: car moves automatically, pauses at key moments to ask questions
- ✅ Immediate right/wrong feedback with rule explanation after each question
- ✅ Full test mode: all scenarios back-to-back, graded (A/B/C/F) at the end
- ✅ Basic car physics (steering, acceleration, braking)
- ✅ User accounts and progress tracking (JWT auth, no third-party provider)

### Planned Features

- 🔜 AI traffic — other cars, pedestrians, cyclists
- 🔜 Day/night and weather conditions
- 🔜 Leaderboards and scoring system
- 🔜 Mobile support
- 🔜 Multilingual UI (German, English, Turkish, Arabic, Hindi, etc.)
- 🔜 More cities: Berlin, Munich, Hamburg

---

## 🧩 Scenario Library

Scenarios are database-driven. Each pauses the car at a key moment and asks an MCQ question about the relevant rule.

### 🇩🇪 Germany

| Scenario                                   | Category      | Type     |
| ------------------------------------------ | ------------- | -------- |
| Basic Controls                             | Basic Skills  | PRACTICE |
| Rechts vor Links — Right before Left       | Traffic Rules | PRACTICE |
| Roundabout                                 | Traffic Rules | PRACTICE |
| Traffic Lights                             | Traffic Rules | PRACTICE |
| Priority Road Signs (Vorfahrtstraße)       | Road Signs    | PRACTICE |
| Vorfahrt — Priority at Next Intersection   | Road Signs    | PRACTICE |
| Emergency Vehicle                          | Traffic Rules | PRACTICE |
| Pedestrian Crossing                        | Traffic Rules | PRACTICE |
| Autobahn Rules                             | Traffic Rules | PRACTICE |
| Full Test — Germany                        | Traffic Rules | TEST     |

### 🇫🇷 France

| Scenario                                   | Category      | Type     |
| ------------------------------------------ | ------------- | -------- |
| Basic Controls                             | Basic Skills  | PRACTICE |
| Priorité à droite                          | Traffic Rules | PRACTICE |
| Roundabout — French Style                  | Traffic Rules | PRACTICE |
| Speed Limits                               | Traffic Rules | PRACTICE |
| Radar Cameras                              | Traffic Rules | PRACTICE |
| Motorway Rules                             | Traffic Rules | PRACTICE |
| Pedestrian Crossing                        | Traffic Rules | PRACTICE |
| Traffic Lights                             | Traffic Rules | PRACTICE |
| Parking Rules                              | Basic Skills  | PRACTICE |
| Full Test — France                         | Traffic Rules | TEST     |

---

## 🛠️ Tech Stack

### Frontend

| Technology                  | Purpose                                                |
| --------------------------- | ------------------------------------------------------ |
| **React** + **TypeScript**  | UI framework — menus, HUD, scenario selector, progress |
| **React Three Fiber (R3F)** | Declarative React bindings for Three.js                |
| **Three.js**                | 3D rendering engine (WebGL)                            |
| **@react-three/drei**       | Helpers — cameras, lighting, controls, loaders         |
| **Rapier.js**               | Physics engine — car movement, collisions, gravity     |
| **Tailwind CSS**            | UI styling                                             |
| **Zustand**                 | Global state management (game state, user session)     |

### Backend

| Technology                | Purpose                                               |
| ------------------------- | ----------------------------------------------------- |
| **Node.js** + **Express** | REST API server                                       |
| **TypeScript**            | Type safety across the codebase                       |
| **Prisma ORM**            | Type-safe database queries                            |
| **PostgreSQL**            | Primary database (users, progress, scenarios, scores) |

### Infrastructure & Services

| Service        | Purpose                            | Cost                |
| -------------- | ---------------------------------- | ------------------- |
| **Vercel**     | Frontend hosting + CDN             | Free                |
| **Railway**    | Backend API + PostgreSQL hosting   | Free tier           |
| **Cloudflare** | DNS, DDoS protection, CDN          | Free                |
| **Stripe**     | Payments and subscriptions         | Pay per transaction |

### Map & Road Data

| Technology              | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| **OpenStreetMap (OSM)** | Free open-source road, lane, and intersection data   |
| **Overpass API**        | Query specific city road geometry from OSM           |
| **osm-to-geojson**      | Convert OSM data to usable GeoJSON for 3D generation |

### Development Tools

| Tool                      | Purpose                                           |
| ------------------------- | ------------------------------------------------- |
| **Vite**                  | Fast frontend build tool                          |
| **ESLint** + **Prettier** | Code quality and formatting                       |
| **Vitest**                | Unit testing                                      |
| **GitHub Actions**        | CI/CD pipeline                                    |
| **Docker**                | Containerized backend for consistent environments |

---

## 🏗️ Project Architecture

```
roadready/
│
├── apps/
│   ├── web/                        # React frontend (Vercel)
│   │   ├── src/
│   │   │   ├── components/         # UI components (menus, HUD, modals)
│   │   │   ├── simulation/         # 3D simulation engine
│   │   │   │   ├── scene/          # Three.js scenes per city
│   │   │   │   ├── vehicles/       # Car models + physics
│   │   │   │   ├── roads/          # Road mesh generation from OSM
│   │   │   │   ├── traffic/        # AI traffic, pedestrians, signals
│   │   │   │   └── scenarios/      # Individual scenario logic
│   │   │   ├── store/              # Zustand global state
│   │   │   ├── hooks/              # Custom React hooks
│   │   │   └── pages/              # Route pages
│   │   └── public/
│   │       ├── models/             # 3D car and object models (.glb)
│   │       └── textures/           # Road, building, sign textures
│   │
│   └── api/                        # Node.js backend (Railway)
│       ├── src/
│       │   ├── routes/             # Express API routes
│       │   ├── controllers/        # Business logic
│       │   ├── middleware/         # Auth, validation, error handling
│       │   └── prisma/             # Database schema and migrations
│       └── Dockerfile
│
├── packages/
│   ├── shared/                     # Shared TypeScript types
│   └── scenario-engine/            # Scenario pass/fail logic (shared)
│
└── docs/                           # Documentation
```

---

## 🚀 Getting Started (Development)

### Prerequisites

- Node.js 20+
- npm or pnpm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/roadready.git
cd roadready

# Install dependencies
npm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Start development servers
npm run dev
```

### Environment Variables

**Frontend (`apps/web/.env.local`)**

```env
VITE_API_URL=http://localhost:3001
```

**Backend (`apps/api/.env`)**

```env
DATABASE_URL=postgresql://roadready_user:roadready_pass@localhost:5432/roadready
JWT_SECRET=your_jwt_secret_here
PORT=3001
```

> See [`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md) for full setup instructions including local PostgreSQL configuration.

---

## 💰 Business Model

### Freemium SaaS

| Plan               | Price        | Features                                              |
| ------------------ | ------------ | ----------------------------------------------------- |
| **Free**           | €0           | 3 scenarios/month, Aachen only, basic feedback        |
| **Learner**        | €9.99/month  | Unlimited scenarios, 1 city, detailed feedback        |
| **Pro**            | €19.99/month | All cities, all countries, leaderboards, certificates |
| **School License** | €99/month    | Multiple student accounts, instructor dashboard       |

### Revenue Projections (Conservative)

- 500 free users → 50 paid (10% conversion) = **€500/month** at month 6
- 2,000 free users → 200 paid = **€2,000/month** at month 12
- 10,000 free users → 1,000 paid = **€10,000/month** at year 2

---

## 🌐 Domain & Hosting

| Asset         | Details                                   |
| ------------- | ----------------------------------------- |
| **Domain**    | roadready.online                          |
| **Registrar** | Namecheap                                 |
| **SSL**       | PositiveSSL (Namecheap) + Vercel auto SSL |
| **DNS**       | Cloudflare                                |
| **Frontend**  | Vercel (roadready.online)                 |
| **API**       | Railway (api.roadready.online)            |
| **Database**  | Railway PostgreSQL (Frankfurt region)     |

---

## 👨‍💻 About the Developer

**Amlendu Shekhar**

- 🎓 MSc Data Science — RWTH Aachen University, Germany
- 💼 Software Engineer (Working Student) — trivago, Düsseldorf
- 🔗 [LinkedIn](https://linkedin.com/in/amlendu-shekhar) | [GitHub](https://github.com/Vasu021)
- 📧 amlendushekhar828@gmail.com

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

RoadReady is currently in early development. Contributions, ideas, and feedback are welcome!

### How to contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-scenario`)
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/) (`git commit -m 'feat: add Autobahn merge scenario'`)
4. Push to the branch (`git push origin feature/new-scenario`)
5. Open a Pull Request against `main`

### Pull Request template

When you open a PR, GitHub will automatically fill in a template from [`.github/pull_request_template.md`](./.github/pull_request_template.md). Please complete all sections before requesting a review:

| Section                        | What to write                                          |
| ------------------------------ | ------------------------------------------------------ |
| **Summary**                    | What the PR changes — one or two sentences             |
| **Why is this change needed?** | The problem, feature, or bug it addresses              |
| **Type of change**             | Check one box (bug fix, feature, refactor, docs, etc.) |
| **How was this tested?**       | Steps you took to verify the change works locally      |
| **Checklist**                  | Tick each item before marking the PR ready for review  |

> For larger features, open a draft PR early so others can follow along before the work is complete.

### Before opening a PR

- Run `npx tsc --noEmit` in both `apps/api` and `apps/web` — the PR should have zero TypeScript errors
- Make sure `npm run dev` starts cleanly with no console errors
- Read [`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md) for coding conventions, branch naming, and the scenario checklist

---

_Built with ❤️ in Aachen, Germany 🇩🇪_
