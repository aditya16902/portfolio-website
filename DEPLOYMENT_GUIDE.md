# 🚀 Deployment Guide

## Pre-Deployment Checklist

### ✅ What to Push to GitHub

**Include these files:**
```bash
✓ src/                    # All source code
✓ public/                 # Public assets
✓ package.json            # Dependencies
✓ package-lock.json       # Lock file
✓ next.config.js          # Next.js config
✓ tailwind.config.ts      # Tailwind config
✓ tsconfig.json           # TypeScript config
✓ .gitignore              # Git ignore rules
✓ README.md               # Documentation
```

**EXCLUDE these files:**
```bash
✗ .env.local              # Contains your GROQ_API_KEY (secret!)
✗ .env                    # Any environment variables
✗ node_modules/           # Dependencies (auto-installed)
✗ .next/                  # Build output (auto-generated)
```

---

## Step-by-Step Deployment

### Step 1: Verify .gitignore

Make sure `.gitignore` contains:
```
# dependencies
/node_modules

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env
.env.local
.env.production

# vercel
.vercel
```

### Step 2: Push to GitHub

```bash
# Check what will be committed (should NOT include .env.local)
git status

# Add all files except .env.local (should already be ignored)
git add .

# Commit your changes
git commit -m "Add RAG chat system with guardrails and new features"

# Push to GitHub
git push origin main
```

### Step 3: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Click "Deploy"

#### Option B: Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Deploy
vercel

# Follow prompts
```

### Step 4: Add Environment Variables on Vercel

**CRITICAL: Add your GROQ API key**

1. Go to your project on Vercel
2. Click "Settings" tab
3. Click "Environment Variables" in left sidebar
4. Add new environment variable:
   ```
   Name:  GROQ_API_KEY
   Value: gsk_... (your key from .env.local)
   ```
5. Select environments: ☑️ Production ☑️ Preview ☑️ Development
6. Click "Save"

### Step 5: Redeploy (if needed)

After adding environment variables:

1. Go to "Deployments" tab
2. Click "..." on the latest deployment
3. Click "Redeploy"

OR trigger redeploy by pushing a small change:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

---

## Verification Checklist

### ✅ After Deployment

Visit your Vercel URL and test:

- [ ] Site loads correctly
- [ ] Chat widget opens
- [ ] Can send messages
- [ ] Bot responds (if this fails, check GROQ_API_KEY)
- [ ] Time icon appears bottom left
- [ ] Time cycling works
- [ ] Reset chat button works
- [ ] Guardrails block math queries
- [ ] No console errors

### 🐛 Troubleshooting

#### Problem: "API key error" or bot not responding
**Solution:** 
1. Check environment variable is set in Vercel
2. Variable name is exactly `GROQ_API_KEY`
3. Redeploy after adding variable

#### Problem: Build fails
**Solution:**
1. Check TypeScript errors locally: `npm run build`
2. Fix errors
3. Push again

#### Problem: .env.local was pushed to GitHub
**Solution:**
1. Remove from Git history:
```bash
git rm --cached .env.local
git commit -m "Remove .env.local"
git push origin main
```
2. Rotate your GROQ API key (generate new one)
3. Update in Vercel environment variables

---

## Environment Variables Reference

| Variable | Required | Where to Get | Where to Set |
|----------|----------|--------------|--------------|
| `GROQ_API_KEY` | Yes | https://console.groq.com/keys | Vercel Settings |

---

## Continuous Deployment

After initial setup, every push to `main` branch will:
1. Trigger automatic build on Vercel
2. Run tests (if any)
3. Deploy to production
4. Update your live site

---

## Custom Domain (Optional)

### Add Custom Domain:

1. Go to Vercel project settings
2. Click "Domains" tab
3. Add your domain (e.g., `aditya.com`)
4. Follow DNS configuration instructions
5. Vercel provides SSL automatically

---

## Performance Monitoring

### Vercel Analytics (Free)

1. Go to "Analytics" tab
2. View visitor stats
3. Monitor performance
4. Track Web Vitals

---

## Rollback (If Needed)

If something breaks:

1. Go to "Deployments" tab
2. Find last working deployment
3. Click "..." → "Promote to Production"

---

## Summary

```bash
# Quick deployment steps:
1. git add .
2. git commit -m "Deploy message"
3. git push origin main
4. Go to vercel.com → Import project
5. Add GROQ_API_KEY in Settings → Environment Variables
6. Deploy! 🚀
```

**Remember:** 
- ✅ Push code to GitHub
- ❌ Do NOT push .env.local
- ✅ Add GROQ_API_KEY on Vercel
- ✅ Redeploy after adding env vars

---

## Next Steps After Deployment

1. Test all features on production
2. Share your portfolio URL
3. Monitor for errors in Vercel logs
4. Update README with live URL
5. Add Google Analytics (optional)

Your portfolio is now live! 🎉
