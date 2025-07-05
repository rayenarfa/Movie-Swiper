# 🚀 MovieSwiper - Deployment Guide

## 📋 Quick Setup

Deploy your MovieSwiper app to Vercel for free hosting with automatic deployments from GitHub.

## 🔐 Environment Variables Setup

### ✅ Security First:

- ✅ `.gitignore` prevents `.env` files from being committed
- ✅ `.env.example` files show what variables are needed (without real values)
- ✅ Only add real API keys to Vercel environment variables

### 🚨 IMPORTANT: API Keys Security

- **NEVER commit real API keys to GitHub**
- Keep your API keys safe locally
- Only add real values to Vercel environment variables
- Use `.env.example` files as templates

## 📋 Step-by-Step Deployment

### 1. 📂 Prerequisites

- GitHub repository with your MovieSwiper code
- Vercel account (free)
- Supabase account and project
- TMDB API key

### 2. 🌐 Deploy Backend on Vercel

1. **Go to [vercel.com](https://vercel.com)** → Sign in with GitHub
2. **New Project** → Import your `movie-swiper` repository
3. **Configure Backend:**

   - **Root Directory**: `server`
   - **Framework Preset**: Other
   - **Build Command**: `npm install`
   - **Output Directory**: (leave empty)

4. **Add Environment Variables:**

   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   TMDB_API_KEY=your-tmdb-api-key
   DATABASE_URL=your-database-connection-string
   JWT_SECRET=your-jwt-secret-key
   ```

5. **Deploy** → Copy the backend URL (e.g., `https://your-backend.vercel.app`)

### 3. 🎬 Deploy Frontend on Vercel

1. **New Project** → Import same repository
2. **Configure Frontend:**

   - **Root Directory**: `web`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Add Environment Variables:**

   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_TMDB_API_KEY=your-tmdb-api-key
   VITE_API_URL=https://your-backend.vercel.app
   ```

4. **Deploy** → Your app is LIVE! 🎉

## 🔑 Getting API Keys

### Supabase Setup

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Go to Settings → API
3. Copy your `URL` and `anon/public` key

### TMDB API Setup

1. Go to [themoviedb.org](https://www.themoviedb.org)
2. Create account → Settings → API
3. Request API key → Copy the key

## 🎯 Repository Structure

```
movie-swiper/
├── web/                    # Frontend (React/Vite)
│   ├── src/
│   ├── .env.example       # Safe template
│   ├── vercel.json        # Frontend deploy config
│   └── package.json
├── server/                 # Backend (Node.js/Express)
│   ├── src/
│   ├── .env.example       # Safe template
│   ├── vercel.json        # Backend deploy config
│   └── package.json
├── .gitignore             # Protects secrets
├── README.md              # Documentation
└── DEPLOYMENT.md          # This guide
```

## 🔒 Security Checklist

Before deploying:

- ✅ No real API keys in committed files
- ✅ `.env.example` files are safe templates
- ✅ All sensitive data is in Vercel environment variables
- ✅ `.gitignore` protects local `.env` files

## 🌟 After Deployment

Your app will be live at:

- **Frontend**: `https://your-frontend.vercel.app`
- **Backend API**: `https://your-backend.vercel.app`

## 🤝 Sharing Your App

Send friends your frontend URL to test the app:

```
🎬 Check out my MovieSwiper app!
https://your-frontend.vercel.app
```

## 🔄 Future Updates

To update your deployed app:

```bash
git add .
git commit -m "Update feature"
git push
```

Both frontend and backend will automatically redeploy! 🚀

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Errors**: Check that all dependencies are in `package.json`
2. **Environment Variables**: Verify all keys are set in Vercel
3. **API Errors**: Check backend logs in Vercel dashboard
4. **Database Connection**: Verify Supabase connection string

### Getting Help:

- Check Vercel deployment logs
- Verify environment variables are set correctly
- Ensure API keys are valid and active
