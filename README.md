# TDC Matchmaker Dashboard

## 🔗 Live Demo

Frontend:  
https://tdc-match-j6p5kqeww-swejal-s-projects1.vercel.app

**Login Page:**  
https://tdc-match.vercel.app/login

Backend API:  
https://tdc-match-api.onrender.com


## 🔐 Demo Login

```
Username: matchmaker
Password: password123
```

---

## 📌 About

TDC Matchmaker Dashboard is a full-stack AI-powered matchmaking CRM that helps matchmakers manage customers, view profiles, find compatible matches, track customer journeys, and send personalized match recommendations.

---

## 🛠 Tech Stack

**Frontend**
- React + Vite
- JavaScript
- Tailwind CSS
- React Router
- Axios

**Backend**
- Node.js
- Express.js
- Prisma ORM
- SQLite

**AI**
- Google Gemini API

**Authentication**
- JWT + bcrypt

---

## ✨ Features

- Matchmaker login with JWT authentication
- Customer dashboard
- Detailed matchmaking profiles
- 20 customers + 100 dummy match profiles
- Gender-specific compatibility algorithm
- AI match explanations using Gemini
- AI-generated introduction messages
- Send match workflow
- Customer notes management
- Analytics dashboard


---

## 📂 Project Structure

```
tdc-matchmaker/

├── client/   # React frontend
├── server/   # Express backend
└── README.md
```

---

## 🚀 Local Setup

### Backend

```bash
cd server
npm install
```

Create `.env`

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret"
GEMINI_API_KEY="your-api-key"
PORT=5000
```

Run:

```bash
npx prisma generate
npx prisma db seed
npm run dev
```

---

### Frontend

```bash
cd client
npm install
npm run dev
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧠 Matching Logic

The algorithm considers:

- Age compatibility
- Height preference
- Income compatibility
- Profession
- Education
- Family values
- Lifestyle
- Relocation preference
- Children preference

Each match receives a compatibility score and AI explanation.

---

## 🤖 AI Integration

Gemini AI is used for:

- Match compatibility explanations
- Personalized introduction messages
- AI matchmaker assistant

---

## 🚢 Deployment

Frontend deployed on Vercel.

Backend deployed on Render.

Environment variables are configured for API communication and Gemini AI.

---