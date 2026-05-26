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
- ✅ Realistic Aachen city roads using OpenStreetMap data
- ✅ German traffic signs and road markings
- ✅ Scenario selection system (choose what to practice)
- ✅ Pass/fail feedback with explanations
- ✅ Basic car physics (steering, acceleration, braking)
- ✅ User accounts and progress tracking

### Planned Features
- 🔜 Multiple scenarios per city (roundabout, priority road, Autobahn, school zone, parking)
- 🔜 Day/night and weather conditions
- 🔜 AI traffic — other cars, pedestrians, cyclists
- 🔜 Leaderboards and scoring system
- 🔜 Theory test integration
- 🔜 Mobile support
- 🔜 Multilingual UI (German, English, Turkish, Arabic, Hindi, etc.)

---

## 🧩 Scenario Library (Germany)

Each scenario is a self-contained practice module:

| Scenario | Difficulty | Description |
|---|---|---|
| Basic Controls | ⭐ Beginner | Get familiar with throttle, braking, steering |
| Intersection — Right of Way | ⭐⭐ Easy | Rechts vor Links — right-before-left rule |
| Roundabout | ⭐⭐ Easy | Enter, navigate, and exit a roundabout correctly |
| Traffic Lights | ⭐⭐ Easy | React correctly to all light states including amber |
| Pedestrian Crossing | ⭐⭐ Easy | Yield to pedestrians at zebra crossings |
| Priority Road | ⭐⭐⭐ Medium | Identify and follow priority road signs |
| Overtaking | ⭐⭐⭐ Medium | Safe overtaking on country roads |
| Autobahn Merge | ⭐⭐⭐⭐ Hard | Merge onto motorway at correct speed |
| Parking | ⭐⭐⭐ Medium | Parallel parking, bay parking |
| Emergency Corridor | ⭐⭐⭐⭐ Hard | Form Rettungsgasse on a congested Autobahn |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React** + **TypeScript** | UI framework — menus, HUD, scenario selector, progress |
| **React Three Fiber (R3F)** | Declarative React bindings for Three.js |
| **Three.js** | 3D rendering engine (WebGL) |
| **@react-three/drei** | Helpers — cameras, lighting, controls, loaders |
| **Rapier.js** | Physics engine — car movement, collisions, gravity |
| **Tailwind CSS** | UI styling |
| **Zustand** | Global state management (game state, user session) |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** + **Express** | REST API server |
| **TypeScript** | Type safety across the codebase |
| **Prisma ORM** | Type-safe database queries |
| **PostgreSQL** | Primary database (users, progress, scenarios, scores) |

### Infrastructure & Services
| Service | Purpose | Cost |
|---|---|---|
| **Vercel** | Frontend hosting + CDN | Free |
| **Railway** | Backend API hosting | Free tier |
| **Supabase** | Managed PostgreSQL + Auth | Free tier |
| **Cloudflare** | DNS, DDoS protection, CDN | Free |
| **Clerk** / **Supabase Auth** | User authentication (Google, GitHub, email) | Free tier |
| **Stripe** | Payments and subscriptions | Pay per transaction |

### Map & Road Data
| Technology | Purpose |
|---|---|
| **OpenStreetMap (OSM)** | Free open-source road, lane, and intersection data |
| **Overpass API** | Query specific city road geometry from OSM |
| **osm-to-geojson** | Convert OSM data to usable GeoJSON for 3D generation |

### Development Tools
| Tool | Purpose |
|---|---|
| **Vite** | Fast frontend build tool |
| **ESLint** + **Prettier** | Code quality and formatting |
| **Vitest** | Unit testing |
| **GitHub Actions** | CI/CD pipeline |
| **Docker** | Containerized backend for consistent environments |

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
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend (`apps/api/.env`)**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/roadready
JWT_SECRET=your_jwt_secret
PORT=3001
```

---

## 💰 Business Model

### Freemium SaaS

| Plan | Price | Features |
|---|---|---|
| **Free** | €0 | 3 scenarios/month, Aachen only, basic feedback |
| **Learner** | €9.99/month | Unlimited scenarios, 1 city, detailed feedback |
| **Pro** | €19.99/month | All cities, all countries, leaderboards, certificates |
| **School License** | €99/month | Multiple student accounts, instructor dashboard |

### Revenue Projections (Conservative)
- 500 free users → 50 paid (10% conversion) = **€500/month** at month 6
- 2,000 free users → 200 paid = **€2,000/month** at month 12
- 10,000 free users → 1,000 paid = **€10,000/month** at year 2

---

## 🌐 Domain & Hosting

| Asset | Details |
|---|---|
| **Domain** | roadready.online |
| **Registrar** | Namecheap |
| **SSL** | PositiveSSL (Namecheap) + Vercel auto SSL |
| **DNS** | Cloudflare |
| **Frontend** | Vercel (roadready.online) |
| **API** | Railway (api.roadready.online) |
| **Database** | Supabase (Frankfurt region) |

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

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-scenario`)
3. Commit your changes (`git commit -m 'Add Autobahn merge scenario'`)
4. Push to the branch (`git push origin feature/new-scenario`)
5. Open a Pull Request

---

*Built with ❤️ in Aachen, Germany 🇩🇪*
