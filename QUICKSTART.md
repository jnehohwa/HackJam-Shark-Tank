# 🚀 Quick Start Guide

## **Get Running in 2 Minutes**

### **Prerequisites**
- Node.js 18+ installed
- npm or yarn

### **Step 1: Install Dependencies**
```bash
# In project root
npm install

# In backend folder
cd backend
npm install
cd ..
```

### **Step 2: Setup Database**
```bash
cd backend
npx prisma generate
npx prisma db push
npm run seed
cd ..
```

### **Step 3: Start Both Servers**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend running at: `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
✅ Frontend running at: `http://localhost:8080`

---

## **🎭 Demo Accounts**

Login with these accounts (password: `password123`):

### **Student View:**
- Email: `sarah@campus.edu`
- Password: `password123`
- Can: Submit ideas, vote, comment

### **Mentor View:**
- Email: `smith@campus.edu`
- Password: `password123`
- Can: Approve ideas, add "Mentor's Pick", see drafts

### **Quick Demo Button:**
On login page, click **"Demo: Sarah Chen"** for instant access!

---

## **🎯 Demo Flow for Judges**

### **1. Student Experience (3 min)**
1. Click "Demo: Sarah Chen" on login
2. Browse dashboard → See ideas with AI scores
3. Click any idea → View full details, AI breakdown, comments
4. Click "Submit Idea" in header
5. Fill form:
   - Title: "Smart Study Rooms"
   - Description: "IoT-enabled study rooms that let students reserve spaces, check availability, and control lighting/temperature. Uses sensors to optimize energy usage when rooms are empty."
   - Category: IT
6. Click "Submit & Analyze"
7. **⭐ Watch AI analyze in real-time!**
8. See 4-dimension score breakdown
9. View status (Draft vs Under Review)

### **2. Mentor Experience (2 min)**
1. Logout → Click "Demo: Dr. Smith"
2. Dashboard shows ALL ideas (including drafts)
3. Click any idea
4. See "Approve" and "Mentor's Pick" buttons
5. Click "Approve" → Idea status changes
6. Click "Mentor's Pick" → Idea gets special badge

### **3. Leaderboard (30 sec)**
1. Click "Leaderboard" in header
2. See top 3 podium
3. Scroll to view full rankings
4. See achievement badges section

---

## **🔍 Testing the AI**

### **High Score Test** (Should get 70-85)
```
Title: "AI-Powered Campus Navigation"
Description: "A mobile app that uses augmented reality and AI to help students navigate campus buildings, find classrooms, and discover nearby facilities. The app includes indoor mapping, real-time directions, and integration with class schedules. It solves the problem of new students getting lost and helps optimize routes between classes. We plan to implement this using ARKit for iOS and ARCore for Android, with a backend API for location data."
Category: IT
```

### **Low Score Test** (Should get < 60, goes to DRAFT)
```
Title: "Cool idea"
Description: "Make things better"
Category: Business
```

### **Medium Score Test** (Should get 60-70, goes to UNDER_REVIEW)
```
Title: "Campus Carpooling Platform"
Description: "A web platform where students can find and offer rides to campus events, reducing parking congestion and carbon emissions. Users can create profiles, schedule rides, and split costs."
Category: Business
```

---

## **🎪 Features to Show Off**

✅ **AI Scoring** - Live analysis with 4 dimensions
✅ **Status Workflow** - Automatic Draft/Review assignment
✅ **Real-Time Updates** - Vote counts, comments
✅ **Role-Based UI** - Student vs Mentor views
✅ **Gamification** - Points, badges, leaderboard
✅ **Clean API** - RESTful with proper auth
✅ **Security** - Rate limits, ownership checks

---

## **🐛 Troubleshooting**

### **Backend won't start**
```bash
cd backend
rm -rf prisma/dev.db
npx prisma db push
npm run seed
npm run dev
```

### **Frontend shows errors**
```bash
rm -rf node_modules
npm install
npm run dev
```

### **"Cannot find module" errors**
```bash
cd backend
rm -rf node_modules
npm install
npx prisma generate
```

### **Port already in use**
```bash
# Kill processes
lsof -ti:3001 | xargs kill -9  # Backend
lsof -ti:8080 | xargs kill -9  # Frontend
```

---

## **📊 API Testing (Optional)**

Use curl or Postman:

```bash
# Health check
curl http://localhost:3001/health

# Get ideas (no auth needed)
curl http://localhost:3001/api/ideas

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sarah@campus.edu","password":"password123"}'

# Returns: {"success":true,"data":{"token":"...","user":{...}}}
```

---

## **🎯 What Makes This Special**

1. **Smart AI** - Not random scores! Uses real NLP analysis
2. **Automatic Workflow** - AI decides if ideas go public
3. **Complete System** - Frontend + Backend + Database working together
4. **Production Ready** - Security, rate limiting, error handling
5. **Great UX** - Loading states, animations, toast notifications

---

## **Need Help?**

Check the main README.md for:
- Full architecture details
- API documentation
- Deployment guide
- Technical deep-dive

**Good luck with your demo! 🚀**

