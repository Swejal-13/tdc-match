# TDC Matchmaker Dashboard

## 🔗 Live Demo

**Frontend:**  
https://tdc-match-j6p5kqeww-swejal-s-projects1.vercel.app

**Login Page:**  
https://tdc-match.vercel.app/login

**Backend API:**  
https://tdc-match-api.onrender.com


## 🔐 Demo Credentials

```
Username: matchmaker
Password: password123
```

---

# Overview

TDC Matchmaker Dashboard is a full-stack AI-powered matchmaking CRM built to help matchmakers manage customers, track matchmaking journeys, view detailed profiles, discover compatible matches, and send personalized recommendations.

This MVP simulates a real matchmaking workflow with customer management, compatibility scoring, AI-generated match explanations, personalized introductions, notes management, and analytics.

---

# Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, JavaScript |
| Styling | Tailwind CSS, shadcn/ui |
| Routing | React Router DOM |
| Backend | Node.js, Express.js |
| Database | SQLite |
| ORM | Prisma |
| Authentication | JWT + bcrypt |
| AI | Google Gemini API |
| Charts | Recharts |
| HTTP Client | Axios |
| Icons | Lucide React |

---

# Project Structure

```
tdc-matchmaker/

├── client/             
│   └── React + Vite frontend

├── server/             
│   ├── prisma/
│   ├── routes/
│   ├── controllers/
│   └── Express backend

└── README.md
```

---

# Features

## 🔐 Authentication

- Matchmaker login system
- JWT authentication
- Protected routes


## 👥 Customer Management

- View customer list
- Search and filter customers
- Customer journey tracking
- Profile completion tracking


## 🧑 Customer Profile View

Complete matchmaking biodata:

- First Name
- Last Name
- Gender
- Date of Birth
- Country
- City
- Height
- Email
- Phone
- Education
- Degree
- Income
- Current Company
- Designation
- Marital Status
- Languages
- Siblings
- Religion
- Caste
- Family details
- Lifestyle preferences
- Relationship preferences


## 💑 AI Matchmaking Engine

The matching system generates compatibility scores using:

- Age compatibility
- Height preferences
- Income compatibility
- Profession
- Education
- Family values
- Lifestyle
- Relocation preference
- Children preference
- Location


## 🤖 Gemini AI Integration

Google Gemini AI is used for:

### Match Explanation

Generates human-readable explanations for suggested matches.

Example:

> High Potential Match because both profiles share similar values, location preference, and lifestyle compatibility.


### Personalized Introduction

Generates customized introduction messages before sending matches.


### AI Matchmaker Assistant

Provides:

- Profile summary
- Match strengths
- Compatibility insights
- Potential concerns


## 📝 Notes Management

Matchmakers can:

- Add notes
- Update notes
- Delete notes
- Track customer interactions


## 📊 Analytics Dashboard

Includes:

- Customer statistics
- Match activity
- Journey progress
- Profile insights


---

# Dataset

The project includes:

- 20 customer profiles
- 100 matchmaking pool profiles


Dummy profiles contain:

- Indian cities
- Education details
- Professional information
- Income
- Religion
- Caste
- Lifestyle
- Family preferences


---

# Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/Swejal-13/tdc-match.git

cd tdc-matchmaker
```

---

# Backend Setup

```bash
cd server

npm install
```

Create `.env` file:

```env
DATABASE_URL="file:./dev.db"

JWT_SECRET="your-secret-key"

GEMINI_API_KEY="your-gemini-api-key"

PORT=5000

NODE_ENV=development
```

Setup database:

```bash
npx prisma generate

npx prisma migrate dev

npx prisma db seed
```

Run backend:

```bash
npm run dev
```

Backend:

```
http://localhost:5000
```

---

# Frontend Setup

Open another terminal:

```bash
cd client

npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run:

```bash
npm run dev
```

Frontend:

```
http://localhost:5173
```

---

# Deployment

## Backend Deployment - Render

Live Backend:

```
https://tdc-match-api.onrender.com
```

Configuration:

Root Directory:

```
server
```

Build Command:

```bash
npm install && npx prisma generate && npx prisma migrate deploy && npx prisma db seed
```

Start Command:

```bash
npm start
```

Environment Variables:

```
DATABASE_URL=file:./dev.db

JWT_SECRET=your-secret

GEMINI_API_KEY=your-gemini-key

PORT=5000
```

---

## Frontend Deployment - Vercel

Live Frontend:

```
https://tdc-match-j6p5kqeww-swejal-s-projects1.vercel.app
```

Configuration:

Root Directory:

```
client
```

Environment Variable:

```
VITE_API_URL=https://tdc-match-api.onrender.com/api
```

---

# API Endpoints

| Method | Endpoint | Description |
|-|-|-|
| POST | `/api/auth/login` | Login |
| GET | `/api/customers` | Customer list |
| GET | `/api/customers/:id` | Customer details |
| GET | `/api/customers/:id/matches` | Suggested matches |
| POST | `/api/matches/send` | Send match |
| GET | `/api/notes` | Get notes |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |
| GET | `/api/analytics` | Analytics |
| POST | `/api/ai/explain-match` | AI explanation |
| POST | `/api/ai/generate-intro` | AI intro generation |
| POST | `/api/ai/assistant` | AI assistant |

---

# Matching Logic

## Male Customer Matching

The algorithm considers:

- Younger partner preference
- Height compatibility
- Income compatibility
- Children preference
- Location


## Female Customer Matching

The algorithm considers:

- Profession compatibility
- Education background
- Family values
- Lifestyle compatibility
- Relocation preference


Each match receives:

- Compatibility score
- Match category
- AI-generated explanation


---

# Technical Decisions

## Frontend

React was chosen because its component-based architecture makes it suitable for building reusable dashboard components.

Vite provides fast development and optimized production builds.

Tailwind CSS enables efficient and consistent UI development.


## Backend

Express.js provides a lightweight and scalable API layer.

Prisma ORM simplifies database management and allows future migration to PostgreSQL.


## Database

SQLite was selected because:

- Easy setup
- No external database dependency
- Suitable for MVP deployment


---

# Assumptions

- Matching is cross-gender for this MVP
- Dummy profiles represent Indian matchmaking users
- Income values are stored in LPA
- Religion and caste are treated as user preference fields
- AI assists matchmakers and does not replace human decisions
