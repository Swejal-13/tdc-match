# TDC Matchmaker Dashboard

## 🔗 Live Demo

**Frontend:** [https://tdc-matchmaker.vercel.app](https://tdc-matchmaker.vercel.app)
**Backend:** [https://tdc-match-api.onrender.com](https://tdc-matchmaker-api.onrender.com)
**Login:** matchmaker / password123

> ⚠️ Replace the URLs above with your real deployed URLs after deploying to Vercel and Render.

A production-quality Full Stack Matchmaking CRM built with React + Vite + Node.js + Express + Prisma + SQLite + Google Gemini AI.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, JavaScript, Tailwind CSS, shadcn/ui, React Router DOM |
| Backend | Node.js, Express.js |
| ORM | Prisma |
| Database | SQLite |
| Auth | JWT + bcryptjs |
| AI | Google Gemini API (`@google/genai`) |
| Charts | Recharts |
| Forms | React Hook Form |
| HTTP | Axios |
| Icons | Lucide React |

## Project Structure

```
tdc-matchmaker/
├── client/          # React + Vite frontend
└── server/          # Node.js + Express backend
```

## Quick Start

### 1. Clone & Install

```bash
# Install backend deps
cd server
npm install

# Install frontend deps
cd ../client
npm install
```

### 2. Environment Variables

**server/.env**
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=5000
NODE_ENV=development
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Database Setup

```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run Development Servers

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

### Demo Credentials
- **Username:** `matchmaker`
- **Password:** `password123`

## Deployment

### Backend → Render
1. Create a new Web Service on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set Root Directory to `server`
4. Build Command: `npm install && npx prisma generate && npx prisma migrate deploy && npx prisma db seed`
5. Start Command: `npm start`
6. Add environment variables in Render dashboard

### Frontend → Vercel
1. Import project on [vercel.com](https://vercel.com)
2. Set Root Directory to `client`
3. Set `VITE_API_URL` to your Render backend URL
4. Deploy

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login |
| GET | `/api/customers` | List customers |
| GET | `/api/customers/:id` | Get customer detail |
| POST | `/api/customers` | Create customer |
| PUT | `/api/customers/:id` | Update customer |
| GET | `/api/customers/:id/matches` | Get match suggestions |
| POST | `/api/matches/send` | Send a match |
| GET | `/api/notes` | List all notes |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |
| GET | `/api/analytics` | Analytics data |
| POST | `/api/ai/explain-match` | AI match explanation |
| POST | `/api/ai/generate-intro` | AI intro message |
| POST | `/api/ai/assistant` | AI assistant query |

## Features
- JWT Authentication with protected routes
- 20 customers + 100 match pool profiles (Indian dummy data)
- AI-powered matching engine with gender-specific logic
- Google Gemini AI integration for match explanations, intros, and assistant
- Customer journey timeline
- Profile completion percentage
- Notes module (add/edit/delete)
- Analytics dashboard with Recharts
- Send match flow with modal + toast
- Pagination, search, filter, sort

---

## About This Project

**Tech Stack Choices.** The frontend uses React 18 with Vite because Vite's near-instant HMR dramatically speeds up iteration during development, and React's component model maps cleanly onto the CRM's card-and-panel UI. Tailwind CSS handles styling without runtime overhead, and Lucide React provides a consistent, lightweight icon set. On the backend, Express.js was chosen for its minimal footprint and familiarity — it lets the API stay thin and explicit. Prisma ORM sits on top of SQLite for local development and easy Render deployment: SQLite requires zero infrastructure setup, Prisma's type-safe query builder prevents raw-SQL mistakes, and the schema can be migrated to PostgreSQL in one config-line change if the app scales. Google Gemini (`gemini-2.0-flash`) powers the AI layer because it handles long, structured prompts with biographical data reliably and its free tier is generous enough for a demo.

**Matching Logic Rationale.** The engine applies separate scoring rubrics for male and female customers, reflecting preferences documented across professional Indian matchmaking practices. For male customers, the algorithm weights age compatibility (25 pts — slight preference for a younger partner), height (15 pts — shorter partner preferred), income (20 pts — lower or equal income preferred for financial balance), children preference (25 pts — exact match required, the single most important deal-breaker), and same-city location (15 pts). For female customers, the rubric shifts toward career prestige of the match (25 pts), educational pedigree such as IIT/IIM/ISB (20 pts), alignment on family values such as traditional/moderate/liberal (20 pts), location proximity (15 pts), the customer's own openness to relocation (10 pts), and lifestyle compatibility (10 pts). Scores are capped at 98% and classified as Exceptional (90+), High Potential (80+), Good (70+), Moderate (60+), or Weak (below 60).

**AI Integration Details.** Gemini is used in three distinct flows, each with a plain-text fallback so the app works even without an API key. First, *match explanation* (`POST /api/ai/explain-match`) sends both profiles and the computed score to Gemini and returns a 2–3 sentence human-readable rationale that the matchmaker can share with the client. Second, *personalised introduction generation* (`POST /api/ai/generate-intro`) produces a warm, specific intro message addressed to the customer by first name, referencing at least one shared quality — this message is editable in the Send Match modal before dispatch. Third, the *AI Matchmaker Assistant panel* on the customer detail page accepts four preset questions (profile summary, match strengths, concerns/red flags, ideal match characteristics) and streams Gemini's answer back; if the API is unavailable, rule-based fallback answers are constructed from the customer's stored fields.

**Assumptions.** The match pool is gender-binary (Male/Female) and cross-gender only — same-gender matching is outside this version's scope. All cities are the seven major Indian metros (Mumbai, Pune, Bangalore, Hyderabad, Chennai, Delhi, Ahmedabad). Income figures are stored and displayed in Lakhs Per Annum (LPA) as is standard in Indian professional contexts. All seeded profiles are assumed to be Indian nationals; caste, religion, and horoscope fields are included because they are standard data points in Indian matrimonial services and are treated as neutral preference fields, not editorial judgements.
