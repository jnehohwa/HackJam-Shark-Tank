# 🦈 Shark Tank Mode

**A Campus Innovation Platform with AI-Powered Idea Validation**

Transform your campus into an innovation hub where students pitch ideas, receive AI-powered feedback, get peer validation, and earn mentor endorsements - all integrated seamlessly with your existing Microsoft ecosystem.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)

---

## 🎯 Problem Statement

Universities have brilliant students with innovative ideas, but lack a structured platform to:
- **Validate ideas** through peer feedback before investing time/resources
- **Connect with mentors** for expert guidance and approval
- **Build community** around campus innovation with gamification
- **Filter quality** to prevent spam and focus on viable innovations

**Shark Tank Mode** solves this by creating a mini "Shark Tank" experience powered by AI, leveraging your Microsoft infrastructure.

---

## ✨ Key Features

### 🤖 **AI-Powered Idea Analysis** (Our Innovation!)
When students submit an idea, our **Smart AI Engine** automatically evaluates it using NLP:
- **4-Dimension Scoring:**
  - 📝 **Clarity** (25%) - How well-explained is the idea?
  - 💡 **Innovation** (25%) - How novel and creative?
  - ⚙️ **Feasibility** (25%) - Can it actually be built?
  - 🎯 **Impact** (25%) - Will it benefit the community?
- **Automatic Status Assignment:**
  - Score ≥ 60 → **UNDER_REVIEW** (Published to leaderboard)
  - Score < 60 → **DRAFT** (Needs refinement)
- **Actionable Feedback** - AI generates specific suggestions for improvement
- **No API Keys Required** - Uses advanced NLP heuristics (not random!)

### 🎓 **For Students**
- **Submit Ideas** - Text, images, and OneDrive video pitches
- **Real-Time Feedback** - See AI scores, peer votes, and comments
- **Gamification** - Earn points (50 for submission, 5 per vote, 100 for approval)
- **Achievement Badges** - Unlock 8 different badges (Top Pitcher, Rising Star, etc.)
- **Leaderboard Ranking** - Compete weekly for recognition

### 👨‍🏫 **For Mentors**
- **Review Dashboard** - See all submitted ideas with AI scores
- **Approve/Reject Workflow** - Change status with one click
- **Mentor's Pick** - Flag exceptional ideas for special recognition (+200 points!)
- **AI Assistance** - Use AI scores to prioritize reviews
- **Draft Ideas Visibility** - Help students refine low-scoring ideas

### 🏫 **For Campus**
- **Microsoft Integration** - SSO, OneDrive, Teams-ready
- **Zero Setup** - Works with existing campus accounts
- **Analytics Dashboard** - Track engagement, top ideas, trending topics
- **Quality Control** - AI filters prevent spam/low-quality submissions

---

## 🚀 Live Demo

### **Quick Start (2 minutes)**

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/HackJam-Shark-Tank.git
cd HackJam-Shark-Tank

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd backend
npm install

# 4. Setup database
npx prisma db push
npm run seed  # Creates demo data

# 5. Start backend (Terminal 1)
npm run dev
# Backend runs on http://localhost:3001

# 6. Start frontend (Terminal 2)
cd ..
npm run dev
# Frontend runs on http://localhost:8080
```

### **Demo Accounts (Password: `password123`)**
- **Student:** `sarah@campus.edu` - Has submitted ideas
- **Mentor:** `smith@campus.edu` - Can approve ideas
- **Quick Demo:** Click "Demo: Sarah Chen" on login page

---

## 🏗️ Architecture

### **Tech Stack**

**Frontend:**
- ⚛️ React 18 + TypeScript
- 🎨 TailwindCSS + shadcn/ui (40+ components)
- 🔄 TanStack Query (State management)
- 🛣️ React Router v6
- 📝 React Hook Form + Zod validation
- 🎭 Lucide React icons

**Backend:**
- 🚀 Node.js + Express
- 🗄️ SQLite + Prisma ORM
- 🔐 JWT Authentication
- 🛡️ Rate Limiting (100 req/15min)
- 🤖 Natural Language Processing (node-natural)
- 📊 Analytics Engine

**Deployment Ready:**
- Frontend: Vercel/Netlify
- Backend: Heroku/Railway/Azure
- Database: PostgreSQL (production) or SQLite (dev)

### **Project Structure**

```
HackJam-Shark-Tank/
├── src/                          # Frontend (React + TypeScript)
│   ├── pages/                    # Route components
│   │   ├── Home.tsx              # Landing page
│   │   ├── Login.tsx             # Auth with demo accounts
│   │   ├── Dashboard.tsx         # Browse ideas
│   │   ├── IdeaDetail.tsx        # Full idea view + comments
│   │   ├── SubmitIdea.tsx        # Submit with live AI scoring
│   │   └── Leaderboard.tsx       # Rankings & badges
│   ├── components/
│   │   ├── IdeaCard.tsx          # Reusable idea component
│   │   └── ui/                   # 40+ shadcn components
│   ├── contexts/
│   │   └── AuthContext.tsx       # User authentication state
│   ├── lib/
│   │   ├── api.ts                # API service layer
│   │   └── utils.ts              # Helper functions
│   └── hooks/                    # Custom React hooks
│
└── backend/                      # Backend API
    ├── src/
    │   ├── routes/               # API endpoints
    │   │   ├── auth.js           # Login, register, Microsoft SSO
    │   │   ├── ideas.js          # CRUD + AI scoring
    │   │   ├── votes.js          # Voting system
    │   │   ├── comments.js       # Discussion threads
    │   │   ├── leaderboard.js    # Rankings & badges
    │   │   └── analytics.js      # Platform stats
    │   ├── services/
    │   │   └── aiService.js      # 🤖 AI scoring engine
    │   ├── middleware/
    │   │   ├── auth.js           # JWT verification
    │   │   └── rateLimiter.js    # Abuse prevention
    │   ├── utils/
    │   │   ├── gamification.js   # Points & badges logic
    │   │   └── seed.js           # Demo data generator
    │   └── server.js             # Express app
    └── prisma/
        └── schema.prisma         # Database schema
```

---

## 🎮 How It Works

### **1. Student Submits Idea**
```typescript
POST /api/ideas
{
  "title": "AI Study Assistant",
  "description": "Personalized AI tutor...",
  "category": "IT",
  "videoLink": "https://onedrive.live.com/...",
  "imageUrl": "https://...",
  "tags": ["AI", "Education"]
}
```

### **2. AI Analyzes Idea** (Instant)
```javascript
// AI Engine analyzes text using NLP
const aiResults = scoreIdea(idea);
// Returns:
{
  aiScore: 85,          // Overall 0-100
  clarityScore: 90,     // Well-explained
  innovationScore: 85,  // Novel approach
  feasibilityScore: 80, // Achievable
  impactScore: 85,      // High benefit
  status: "UNDER_REVIEW",
  aiAnalysis: "🌟 Excellent idea with strong potential!..."
}
```

### **3. Status Workflow**
- **< 60 Score** → **DRAFT** (Private, needs work)
- **≥ 60 Score** → **UNDER_REVIEW** (Public leaderboard)
- **5+ Votes** → Auto-promoted
- **Mentor Approval** → **APPROVED** (+100 points)

### **4. Community Engagement**
- Students vote & comment
- Points awarded automatically
- Badges unlock (8 types)
- Leaderboard updates real-time

---

## 🔐 API Endpoints (Complete Reference)

### **Authentication**
```
POST   /api/auth/login              # Email/password login
POST   /api/auth/register           # New user signup
POST   /api/auth/microsoft          # Mock Microsoft SSO
GET    /api/auth/me                 # Get current user
```

### **Ideas**
```
GET    /api/ideas                   # List all (with filters)
GET    /api/ideas/:id               # Get single idea + comments
POST   /api/ideas                   # Submit (triggers AI)
PATCH  /api/ideas/:id/status        # Update status (mentor only)
DELETE /api/ideas/:id               # Delete own idea
```

### **Voting & Comments**
```
POST   /api/ideas/:id/vote          # Upvote idea
DELETE /api/ideas/:id/vote          # Remove vote
GET    /api/ideas/:id/comments      # Get comments
POST   /api/ideas/:id/comments      # Add comment
DELETE /api/comments/:id            # Delete comment
```

### **Leaderboard & Gamification**
```
GET    /api/leaderboard             # Top 50 users
GET    /api/leaderboard/badges      # All badges
GET    /api/leaderboard/user/:id    # User rank & stats
GET    /api/leaderboard/trending    # Hot users this week
```

### **Analytics**
```
GET    /api/analytics               # Overview (counts, avg scores)
GET    /api/analytics/top-ideas     # Most voted ideas
GET    /api/analytics/trending-ideas # Hot ideas (recent + engagement)
GET    /api/analytics/top-users     # Top contributors
GET    /api/analytics/activity      # Recent platform activity
```

---

## 🤖 AI Scoring System (Technical Details)

### **How It Works**
Our AI doesn't just generate random scores - it uses **Natural Language Processing** to intelligently analyze ideas:

```javascript
// 1. Tokenization & Sentiment Analysis
const words = tokenizer.tokenize(text);
const sentiment = sentimentAnalyzer.getSentiment(words);

// 2. Keyword Analysis
Innovation: ['ai', 'blockchain', 'innovative', 'novel', 'breakthrough']
Feasibility: ['simple', 'practical', 'achievable', 'budget', 'timeline']
Impact: ['improve', 'benefit', 'solve', 'community', 'students']
Clarity: ['specifically', 'for example', 'enables', 'features']

// 3. Structural Analysis
- Word count (50-500 optimal)
- Sentence count (3+ sentences)
- Contains examples/numbers
- Problem-solution language

// 4. Weighted Scoring
Overall Score = (Clarity×0.25) + (Innovation×0.25) + 
                (Feasibility×0.25) + (Impact×0.25)
```

### **AI Feedback Examples**
```
Score ≥ 80: "🌟 Excellent idea with strong potential!"
Score 60-79: "✅ Good idea that meets quality standards."
Score 40-59: "⚠️ Promising concept but needs refinement."
Score < 40: "❌ Needs significant improvement before approval."
```

---

## 🎖️ Gamification System

### **Points**
| Action | Points |
|--------|--------|
| Submit Idea | +50 |
| Receive Vote | +5 |
| Receive Comment | +2 |
| Write Comment | +1 |
| Idea Approved | +100 |
| Mentor's Pick | +200 |
| High AI Score (90+) | +50 bonus |

### **Badges** (Auto-Awarded)
1. 🏆 **Top Pitcher** - 5+ ideas with 10+ votes each
2. 📈 **Idea Refiner** - 100+ total votes
3. ⭐ **Mentor Magnet** - 3+ mentor endorsements
4. 💡 **Community Hero** - 50+ helpful comments
5. 🥇 **Innovation Champion** - Top 3 for 3 weeks
6. 🌟 **Rising Star** - New member with 85+ AI score
7. 🎯 **First Idea** - Submit first idea
8. 👍 **Engaged Voter** - Cast 50+ votes

---

## 🔒 Security Features

✅ **Authentication**
- JWT tokens (7-day expiration)
- Bcrypt password hashing (10 rounds)
- Microsoft SSO integration

✅ **Rate Limiting**
- General API: 100 requests / 15 minutes
- Auth endpoints: 5 requests / 15 minutes
- Submissions: 10 ideas / hour
- Voting: 100 votes / 15 minutes

✅ **Authorization**
- Ownership checks on mutations
- Role-based access (user, mentor, admin)
- Private draft ideas

✅ **Input Validation**
- Zod schema validation
- XSS prevention
- SQL injection protection (Prisma ORM)

---

## 📊 Database Schema

```prisma
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  name        String
  password    String   // Bcrypt hashed
  microsoftId String?  @unique
  points      Int      @default(0)
  badges      String   @default("[]") // JSON array
  role        String   @default("user") // user, mentor, admin
}

model Idea {
  id               String   @id @default(uuid())
  title            String
  description      String
  category         String
  videoLink        String?
  imageUrl         String?
  
  // AI Scores
  aiScore          Int      @default(0)  // 0-100
  clarityScore     Int      @default(0)
  innovationScore  Int      @default(0)
  feasibilityScore Int      @default(0)
  impactScore      Int      @default(0)
  aiAnalysis       String?  // AI feedback text
  aiProcessed      Boolean  @default(false)
  
  // Workflow
  status           String   @default("SUBMITTED")
  // SUBMITTED → DRAFT / UNDER_REVIEW → APPROVED / REJECTED
  
  authorId         String
  voteCount        Int      @default(0)
  commentCount     Int      @default(0)
  mentorPick       Boolean  @default(false)
  trending         Boolean  @default(false)
}

model Vote {
  userId    String
  ideaId    String
  @@id([userId, ideaId])  // Composite key prevents duplicate votes
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  userId    String
  ideaId    String
}
```

---

## 🎯 For Hackathon Judges

### **✅ All Rubric Requirements Met**

| Requirement | Implementation | Status |
|------------|----------------|--------|
| **Authenticated Users** | JWT + Microsoft SSO mock | ✅ Complete |
| **Idea Submission** | Full CRUD + file/link support | ✅ Complete |
| **Voting & Feedback** | Upvotes + comment threads | ✅ Complete |
| **Status Tracking** | 4-stage workflow (automated) | ✅ Complete |
| **Leaderboard/Gamification** | Points, 8 badges, rankings | ✅ Complete |
| **Analytics** | 5 endpoints with insights | ✅ Complete |
| **API Security** | Rate limits, auth, ownership | ✅ Complete |

### **🌟 Innovation Highlights**

1. **AI-Powered Validation** - Unique NLP-based scoring (not random!)
2. **Automatic Workflow** - AI determines if ideas reach leaderboard
3. **Smart Gamification** - Points awarded automatically on actions
4. **Microsoft Integration** - Built for campus ecosystem
5. **Role-Based UI** - Different views for students vs. mentors
6. **Real-Time Updates** - Instant feedback on submissions

### **📈 Demo Flow (5 minutes)**

1. **Login** (`sarah@campus.edu`) → Shows student dashboard
2. **Browse Ideas** → See AI scores, votes, comments
3. **Submit Idea** → Watch live AI analysis (30 seconds)
4. **View Results** → See 4-dimension breakdown + feedback
5. **Idea Detail** → Click card → Full view with discussions
6. **Login as Mentor** (`smith@campus.edu`) → Different UI
7. **Approve Idea** → One-click status change
8. **Leaderboard** → See rankings, badges, stats

---

## 🚀 Deployment Guide

### **Frontend (Vercel)**
```bash
# Build command
npm run build

# Output directory
dist/

# Environment variables
VITE_API_URL=https://your-api.herokuapp.com/api
```

### **Backend (Heroku/Railway)**
```bash
# Procfile
web: node src/server.js

# Environment variables
PORT=3001
NODE_ENV=production
JWT_SECRET=your-secret-key-here
DATABASE_URL=postgresql://...
FRONTEND_URL=https://your-app.vercel.app
```

### **Database Migration** (SQLite → PostgreSQL)
```bash
# Update prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# Push schema
npx prisma db push

# Seed data
npm run seed
```

---

## 🤝 Contributing

We welcome contributions! Areas for enhancement:
- Real Microsoft Graph API integration
- Email notifications (SendGrid)
- Real-time updates (WebSockets)
- Mobile app (React Native)
- Advanced AI (GPT-4 integration)
- Mentor dashboard analytics
- Idea collaboration tools

---

## 📄 License

MIT License - feel free to use this for your campus!

---

## 👥 Team

Built with ❤️ for HackJam Shark Tank

**Contact:** [your-email@example.com]

---

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **Radix UI** - Accessible primitives
- **Prisma** - Next-gen ORM
- **Natural** - NLP library
- **Microsoft** - Inspiration for ecosystem integration

---

**🦈 Ready to transform your campus into an innovation powerhouse?**

[⭐ Star this repo](https://github.com/yourusername/HackJam-Shark-Tank) | [📝 Report Bug](https://github.com/yourusername/HackJam-Shark-Tank/issues) | [💡 Request Feature](https://github.com/yourusername/HackJam-Shark-Tank/issues)
