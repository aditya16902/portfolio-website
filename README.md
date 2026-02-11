# AI-Powered Portfolio Website

> Production-ready Next.js portfolio with AI chatbot and persona-based brief feature

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC)](https://tailwindcss.com/)

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local
# Add your Hugging Face API key to .env.local

# 3. Run
npm run dev
```

Visit: http://localhost:3000

**Get API Key**: https://huggingface.co/settings/tokens (Create token with Read access)

## ✨ Features

- **AI Chatbot** - Powered by Llama 3.2-1B via Hugging Face
- **5 Chat Personas** - Technical, Entrepreneurial, Professional, Creative, Default
- **Persona Brief** - Julius Lipp-style brief with 5 different persona versions
- **Thinking Animation** - Shows "Detailing My Background..." with typing effect
- **Responsive Design** - Mobile, tablet, desktop optimized
- **Dark Theme** - Professional black theme
- **Free Hosting** - $0/month on Vercel
- **Production Ready** - Optimized and tested

## 📁 Key Files to Update

### 1. Personal Info (CRITICAL)
**File**: `src/app/api/chat/route.ts`
- Update `ADITYA_CONTEXT` with your background
- Replace with your real experience, projects, skills

### 2. Main Content
**File**: `src/app/page.tsx`
- Update `briefContent` object (5 persona versions)
- Update Experience, Projects, Skills sections
- Change social media links

### 3. Environment
**File**: `.env.local` (create from .env.example)
```
HUGGINGFACE_API_KEY=hf_your_key_here
```

## 🎯 How to Use Persona Brief

1. Go to Brief section
2. Click persona dropdown (DEFAULT, TECHNICAL, etc.)
3. Watch thinking animation
4. See text type out fast
5. Content changes based on persona

**All content is pre-written** - no API calls for brief!

## 🚀 Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial portfolio"
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main

# 2. Deploy on Vercel
# - Go to vercel.com
# - Import repository
# - Add HUGGINGFACE_API_KEY environment variable
# - Deploy!
```

Your site: `https://your-name.vercel.app`

## 💰 Cost

- Hugging Face: **$0/month** (30k chars free)
- Vercel Hosting: **$0/month** (100GB bandwidth free)
- **Total: $0/month** 🎉

## 📚 Tech Stack

- Next.js 14 + TypeScript
- Tailwind CSS
- Llama 3.2-1B (Hugging Face)
- Vercel Hosting
- Lucide Icons

## 🎨 Customization

### Change Persona Content
Edit `briefContent` object in `src/app/page.tsx`:
```typescript
const briefContent = {
  technical: {
    thinking: "Your thinking message",
    content: "Your content..."
  },
  // ... add more personas
};
```

### Adjust Typing Speed
In `src/app/page.tsx`:
```typescript
const typingSpeed = 8; // milliseconds per character (lower = faster)
```

### Change Thinking Time
```typescript
setTimeout(() => { ... }, 1500); // 1500ms = 1.5 seconds
```

## 🔧 Commands

```bash
npm run dev     # Development server
npm run build   # Build for production
npm start       # Start production server
```

## 🐛 Troubleshooting

**Chat not working?**
- Check API key in `.env.local`
- Restart server
- Check browser console (F12)

**Build errors?**
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📖 Full Documentation

For comprehensive guides, see `DEVELOPER_REFERENCE.md`

## 🎯 What's Next

1. Update your personal information
2. Customize persona content
3. Test locally
4. Deploy to Vercel
5. Share your portfolio!

---

**Created**: February 11, 2026  
**Status**: Production Ready  
**Cost**: $0/month
