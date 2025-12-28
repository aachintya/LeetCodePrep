# LeetCode Company Questions

A modern LeetCode interview prep website with company-wise questions, cloud-synced progress tracking, and beautiful dark UI.

🔗 **Live Demo:** [aachintya.github.io/LeetCodePrep](https://aachintya.github.io/LeetCodePrep)

## ✨ Features

- 📊 **666 Companies** with 3,227 unique LeetCode questions
- ⏰ **Timeframe Filters** - 30 Days, 3 Months, 6 Months, All Time
- ✅ **Cross-Company Solved Tracking** - Mark once, tracked everywhere
- ☁️ **Cloud Sync** - Progress synced via Google Sign-In
- 🎨 **Premium Dark UI** - NextLeet-inspired design
- 📱 **Responsive** - Works on all devices

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Styling:** Custom CSS (NextLeet-inspired dark theme)
- **Auth:** Firebase Authentication (Google Sign-In)
- **Database:** Firestore
- **Routing:** React Router (Hash-based for GitHub Pages)
- **Hosting:** GitHub Pages

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/aachintya/LeetCodePrep.git
cd LeetCodePrep

# Install dependencies
npm install

# Run locally
npm run dev
```

## 🔧 Firebase Setup (for your own deployment)

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** → Google Sign-In
3. Enable **Firestore Database** (test mode)
4. Create `.env` with your credentials:

```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📦 Deployment

```bash
npm run build
npx gh-pages -d dist
```

## 📄 License

MIT
