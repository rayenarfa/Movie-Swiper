# 🎬 MovieSwiper

A Tinder-style movie recommender that suggests movies based on your current activity and mood.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
git clone <repository-url>
cd movie-swiper
npm install
cd web && npm install
cd ../server && npm install
```

### 2. Environment Setup

**Frontend** (`web/.env`):

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://localhost:5000/api
```

**Backend** (`server/.env`):

```env
PORT=5000
DATABASE_URL=your-postgresql-url
JWT_SECRET=your-jwt-secret
TMDB_API_KEY=your-tmdb-api-key
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run the App

```bash
npm run dev
```

Visit: http://localhost:5173

## 🎯 How It Works

1. **Sign up/Login** with email
2. **Choose Activity** (Gym, Eating, Relaxing, etc.)
3. **Pick Mood** (Funny, Thrilling, Romantic, etc.)
4. **Swipe Movies** - Right to save, Left to skip
5. **View Saved** movies in your collection

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, PostgreSQL
- **Auth**: Supabase
- **State**: Zustand
- **Movies**: TMDB API

## 📦 Project Structure

```
movie-swiper/
├── web/          # React frontend
├── server/       # Node.js backend
└── README.md
```

## 🔑 Required APIs

- **Supabase**: Authentication & database
- **TMDB**: Movie data ([Get API key](https://www.themoviedb.org/settings/api))

## 🚀 Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel deployment guide.

## 🎬 Features

- ✅ Context-aware recommendations
- ✅ Swipe-based interface
- ✅ Save favorite movies
- ✅ Detailed movie info
- ✅ User profiles
- ✅ Responsive design

Built with ❤️ for movie lovers
