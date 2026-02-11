# Quick Start Guide

Get your portfolio running in 5 minutes!

## Step 1: Install (2 min)

```bash
cd "/Users/aditya16902/Desktop/Github/aditya16902/portfolio website"
npm install
```

## Step 2: Get API Key (2 min)

1. Go to: https://huggingface.co/settings/tokens
2. Click "New token"
3. Name: "portfolio-chatbot"
4. Access: **Read**
5. Copy the token

## Step 3: Configure (30 sec)

```bash
cp .env.example .env.local
```

Open `.env.local` and add your key:
```
HUGGINGFACE_API_KEY=hf_your_actual_key_here
```

## Step 4: Run! (30 sec)

```bash
npm run dev
```

Open: http://localhost:3000

## Test Everything

✅ Homepage loads  
✅ Brief persona selector works (try clicking Technical, Creative, etc.)  
✅ Chat button appears (bottom-right)  
✅ Chat opens and responds  
✅ All personas in chat work  
✅ Mobile responsive  

## What to Update Next

### 1. Chat Context (IMPORTANT)
**File**: `src/app/api/chat/route.ts`

Find `ADITYA_CONTEXT` and replace with your info:
```typescript
const ADITYA_CONTEXT = `
Your education: ...
Your experience: ...
Your projects: ...
Your skills: ...
`;
```

### 2. Persona Brief Content
**File**: `src/app/page.tsx`

Find `briefContent` object and update all 5 personas:
```typescript
const briefContent = {
  technical: {
    thinking: "Your thinking message",
    content: "Your technical brief..."
  },
  // ... update all 5 personas
};
```

### 3. Main Sections
**File**: `src/app/page.tsx`

Update:
- Experience section (your jobs)
- Projects section (your projects)
- Skills section (your skills)
- Social links (GitHub, LinkedIn, Twitter)

## Deploy to Vercel

### Step 1: GitHub

```bash
git init
git add .
git commit -m "Initial portfolio"
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main
```

### Step 2: Vercel

1. Go to vercel.com
2. Click "Add New Project"
3. Import your repository
4. Add environment variable:
   - Key: `HUGGINGFACE_API_KEY`
   - Value: Your API key
5. Click "Deploy"

Done! Your site is live at: `https://your-name.vercel.app`

## Features Working Now

✅ **Persona Brief** - Click dropdown in Brief section to change persona  
✅ **Thinking Animation** - Shows "Detailing My Background..." etc.  
✅ **Typing Effect** - Text appears fast, character by character  
✅ **AI Chatbot** - 5 different personas in chat  
✅ **Smooth Animations** - Professional polish  
✅ **Mobile Responsive** - Works on all devices  

## Troubleshooting

### Chat Not Responding?
1. Check `.env.local` has correct API key
2. Restart server: `Ctrl+C` then `npm run dev`
3. Check browser console (F12) for errors

### Persona Brief Not Working?
1. Make sure you saved `page.tsx`
2. Restart server
3. Hard refresh browser (`Cmd+Shift+R` or `Ctrl+Shift+R`)

### Build Fails?
```bash
rm -rf .next node_modules
npm install
npm run build
```

## Cost

- Hugging Face: **FREE** (30,000 chars/month)
- Vercel: **FREE** (100GB bandwidth/month)
- **Total: $0/month** 🎉

## Need More Help?

Check `DEVELOPER_REFERENCE.md` for:
- Detailed customization guide
- Advanced features
- Deployment checklist
- Complete troubleshooting

---

**Time to Live Site**: 30-60 minutes  
**Monthly Cost**: $0  
**Impressiveness**: High! ⭐️
