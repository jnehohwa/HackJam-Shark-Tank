# 🦈 Shark Tank Mode

**A Campus Innovation Platform for Student Idea Validation**

Transform your campus into an innovation hub where students pitch ideas, receive peer validation, and get mentor endorsements - all integrated seamlessly with your existing Microsoft ecosystem.

---

## 🎯 Problem Statement

Universities have brilliant students with innovative ideas, but lack a structured platform to:
- Validate ideas through peer feedback
- Connect with mentors for guidance  
- Build community around campus innovation
- Gamify the innovation process to drive engagement

**Shark Tank Mode** solves this by creating a mini "Shark Tank" experience on campus, leveraging Microsoft's existing infrastructure.

---

## ✨ Key Features

### 🚀 For Students
- **Pitch Ideas** - Submit text, images, and video pitches (OneDrive compatible)
- **Get Validated** - Real-time voting and community feedback
- **AI Scoring** - Automated idea quality assessment
- **Gamification** - Earn badges, climb leaderboards, compete weekly

### 👨‍🏫 For Mentors
- **Review Queue** - Curated feed of student ideas
- **Endorsements** - "Mentor's Pick" badge for promising ideas
- **Feedback System** - Guide students toward success

### 🏫 For Campus
- **Microsoft Integration** - SSO, OneDrive, Teams notifications
- **Zero Setup** - Works with existing campus Microsoft accounts
- **Analytics** - Track innovation metrics across campus
- **Categories** - Science, Humanities, Business, IT, Design

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (Build tool)
- TailwindCSS + shadcn/ui (Design system)
- React Router v6 (Navigation)
- TanStack Query (State management)
- React Hook Form + Zod (Form handling)

**UI Components:**
- Radix UI primitives (Accessibility-first)
- Lucide React (Icons)
- Recharts (Data visualization)
- Sonner (Notifications)

**Planned Integrations:**
- Microsoft Azure AD (Authentication)
- OneDrive API (Video storage)
- Microsoft Teams (Notifications)
- OpenAI GPT-4 (AI scoring)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd HackJam-Shark-Tank

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 📁 Project Structure

```
src/
├── pages/              # Route components
│   ├── Home.tsx            # Landing page
│   ├── Login.tsx           # Microsoft SSO
│   ├── Dashboard.tsx       # Browse ideas
│   ├── SubmitIdea.tsx      # Submit new ideas
│   ├── Leaderboard.tsx     # Rankings & badges
│   └── NotFound.tsx        # 404 page
│
├── components/
│   ├── IdeaCard.tsx        # Idea display component
│   └── ui/                 # Reusable UI components
│
├── hooks/              # Custom React hooks
├── lib/                # Utilities
├── App.tsx             # Root component with routing
└── main.tsx            # Entry point
```

---

## 🎨 Design System

Our custom design system is built on HSL color tokens for easy theming:

- **Primary (Shark Blue)** - Professional, trustworthy
- **Secondary (Innovation Orange)** - Energy, achievement  
- **Accent (Mentor Green)** - Success, endorsement
- **Full dark mode support**
- **Custom gradients and shadows**
- **Smooth animations throughout**

---

## 🎮 Gamification System

**Point System:**
- Submit idea: +50 points
- Receive upvote: +5 points
- Mentor endorsement: +100 points
- Comment on idea: +2 points

**Achievement Badges:**
- 🏆 **Top Pitcher** - Submit 5+ ideas with 10+ votes each
- 📈 **Idea Refiner** - Receive 100+ total votes
- ⭐ **Mentor Magnet** - Get 3+ mentor endorsements
- 💡 **Community Hero** - Help others with 50+ comments
- 🥇 **Innovation Champion** - Top 3 for 3 consecutive weeks
- 🌟 **Rising Star** - New member with exceptional ideas

---

## 🔐 Microsoft Integration

Shark Tank Mode leverages your campus's existing Microsoft infrastructure:

✅ **Single Sign-On** - Login with campus Microsoft account  
✅ **OneDrive Storage** - Host video pitches in your OneDrive  
✅ **Teams Integration** - Get notifications in Microsoft Teams  
✅ **Azure Security** - Enterprise-grade authentication  

No extra accounts. No new passwords. Just innovation.

---

## 🚀 Roadmap

### Current Phase (MVP)
- [x] Landing page and marketing site
- [x] User authentication flow
- [x] Idea submission with rich media
- [x] Browsing and filtering ideas
- [x] Voting system
- [x] Leaderboard and badges
- [x] Responsive design

### Next Phase
- [ ] Backend API integration
- [ ] Real Microsoft OAuth
- [ ] Individual idea detail pages
- [ ] Comments and discussions
- [ ] Real-time updates (WebSocket)
- [ ] AI-powered idea scoring
- [ ] User profile pages
- [ ] Admin dashboard

### Future Enhancements
- [ ] Mobile app (PWA)
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mentor dashboard
- [ ] Idea collaboration tools

---

## 🤝 Contributing

We welcome contributions! Areas we'd love help with:
- Backend API development
- Microsoft Graph API integration
- AI/ML for idea scoring
- Mobile optimization
- Accessibility improvements

---

## 📄 License

MIT License - feel free to use this for your campus!

---

## 👥 Team

Built with ❤️ by [Gub Gub] for [HackJam]

---

## 📞 Contact

Questions? Reach out 

---

**🦈 Ready to make your campus the next innovation powerhouse?**
