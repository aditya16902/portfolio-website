# Developer Reference - Internal Documentation

This file consolidates all technical documentation, troubleshooting, and implementation details.

---

## TABLE OF CONTENTS

1. [Complete Implementation Guide](#complete-implementation-guide)
2. [Persona Brief Feature](#persona-brief-feature)
3. [Enhanced Chat Widget](#enhanced-chat-widget)
4. [Deployment Guide](#deployment-guide)
5. [Customization Guide](#customization-guide)
6. [Troubleshooting](#troubleshooting)
7. [Performance & Optimization](#performance--optimization)
8. [API Integration](#api-integration)
9. [File Structure](#file-structure)

---

## COMPLETE IMPLEMENTATION GUIDE

### Project Structure
```
portfolio website/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts         # Chatbot API endpoint
│   │   ├── globals.css               # Current styles
│   │   ├── globals-enhanced.css      # Enhanced styles (backup)
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Main page (WITH PERSONA BRIEF)
│   └── components/
│       ├── ChatWidget.tsx            # Enhanced chat widget
│       └── ChatWidget-Enhanced.tsx   # Backup of enhanced version
├── public/                           # Static assets
├── .env.example                      # Environment template
├── .env.local                        # Your API key (create this)
├── README.md                         # Main documentation
├── QUICKSTART.md                     # Quick setup guide
└── DEVELOPER_REFERENCE.md            # This file
```

### Initial Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env.local
```

Add to `.env.local`:
```
HUGGINGFACE_API_KEY=hf_your_key_here
```

3. **Run Development Server**
```bash
npm run dev
```

4. **Test**
- Open http://localhost:3000
- Test persona selector in Brief
- Test chat widget
- Check all sections

---

## PERSONA BRIEF FEATURE

### How It Works

The Brief section has a dropdown that lets users view your background through 5 different lenses:
- **Technical**: Focus on technical skills and implementation
- **Entrepreneurial**: Business impact and value creation
- **Professional**: Formal, polished presentation
- **Creative**: Engaging storytelling approach
- **Default**: Balanced, informative

### Implementation Details

**File**: `src/app/page.tsx`

#### 1. Content Structure
```typescript
const briefContent = {
  technical: {
    thinking: "Detailing My Background",  // Shown during animation
    content: "Your technical brief..."     // The actual content
  },
  // ... 4 more personas
};
```

#### 2. State Management
```typescript
const [selectedBriefPersona, setSelectedBriefPersona] = useState('default');
const [isThinking, setIsThinking] = useState(false);
const [displayedText, setDisplayedText] = useState(briefContent.default.content);
const [showPersonaSelector, setShowPersonaSelector] = useState(false);
```

#### 3. Persona Change Handler
```typescript
const handlePersonaChange = (persona: keyof typeof briefContent) => {
  setIsThinking(true);           // Show thinking animation
  setDisplayedText('');          // Clear current text
  
  setTimeout(() => {
    setIsThinking(false);        // Hide thinking
    // Start typing animation
    const content = briefContent[persona].content;
    let index = 0;
    const typingSpeed = 8;       // 8ms per character
    
    const typeInterval = setInterval(() => {
      if (index < content.length) {
        setDisplayedText(content.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, typingSpeed);
  }, 1500);  // 1.5 second thinking time
};
```

### Customization

**Change Thinking Time**:
```typescript
setTimeout(() => { ... }, 2000);  // 2 seconds instead of 1.5
```

**Change Typing Speed**:
```typescript
const typingSpeed = 5;  // Faster (lower = faster)
const typingSpeed = 15; // Slower (higher = slower)
```

**Add More Personas**:
```typescript
const briefContent = {
  // ... existing personas
  casual: {
    thinking: "Keeping it Real",
    content: "Hey! So here's my story..."
  }
};
```

---

## ENHANCED CHAT WIDGET

### Features

Current implementation includes:
- ✅ 5 personas (Technical, Entrepreneurial, Professional, Creative, Default)
- ✅ Rotating thinking messages
- ✅ Suggested starter questions
- ✅ Keyboard shortcuts (Enter, Shift+Enter)
- ✅ Custom scrollbar
- ✅ Online indicator
- ✅ Smooth animations

### Location

**File**: `src/components/ChatWidget.tsx`

### Key Components

#### 1. Thinking Animation
```typescript
useEffect(() => {
  if (isLoading) {
    const thinkingStates = [
      'Analyzing your question...',
      'Gathering context...',
      'Crafting response...'
    ];
    // Rotates through messages every 1.5s
  }
}, [isLoading]);
```

#### 2. Persona Selector
Shows description for each persona:
```typescript
const personas = [
  { 
    value: 'technical', 
    label: 'Technical', 
    description: 'Detailed technical responses' 
  },
  // ... more personas
];
```

#### 3. Suggested Questions
```typescript
<button onClick={() => setInput("Tell me about your experience")}>
  Tell me about your experience →
</button>
```

### Animations

**File**: `src/app/globals.css`

```css
/* Slide up animation for chat window */
@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Fade in for messages */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Bounce for loading dots */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
```

---

## DEPLOYMENT GUIDE

### Pre-Deployment Checklist

- [ ] Updated personal info in `route.ts`
- [ ] Updated content in `page.tsx`
- [ ] All 5 persona briefs written
- [ ] API key added to `.env.local`
- [ ] Tested locally: `npm run dev`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] All links work

### Deploy to Vercel

#### Step 1: Build Locally
```bash
npm run build
npm start  # Test production build
```

#### Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Initial portfolio with AI chatbot"
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main
```

#### Step 3: Deploy on Vercel
1. Go to vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Framework: Next.js (auto-detected)
5. Add Environment Variable:
   - Key: `HUGGINGFACE_API_KEY`
   - Value: Your API key
6. Click "Deploy"

#### Step 4: Verify
- Site loads: `https://your-name.vercel.app`
- Brief persona selector works
- Chat works
- All sections visible
- Mobile responsive

### Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate (~1 hour)

---

## CUSTOMIZATION GUIDE

### Colors

**File**: `src/app/page.tsx` and components

Current theme:
```css
Background: black (#000000)
Text: white (#ffffff)
Secondary bg: gray-900 (#111827)
Borders: gray-800 (#1f2937)
Accents: white buttons
```

To change:
1. Replace Tailwind classes:
   - `bg-black` → Your background
   - `text-white` → Your text color
   - `bg-gray-900` → Your secondary
   - `border-gray-800` → Your borders

2. Or create custom colors in `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      'custom-bg': '#your-color',
      'custom-text': '#your-color',
    }
  }
}
```

### Typography

**File**: `src/app/globals.css`

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', ...;
}

/* Add custom fonts */
@import url('https://fonts.googleapis.com/css2?family=Your+Font');

body {
  font-family: 'Your Font', sans-serif;
}
```

### Content

#### Brief Content
**File**: `src/app/page.tsx`

```typescript
const briefContent = {
  default: {
    thinking: "Your thinking message",
    content: "Your story in 3 paragraphs..."
  }
};
```

#### Experience
```typescript
{activeSection === 'experience' && (
  <section>
    {/* Add your experiences here */}
  </section>
)}
```

#### Projects
```typescript
{activeSection === 'projects' && (
  <section>
    {/* Add your projects here */}
  </section>
)}
```

### Chat Behavior

**File**: `src/app/api/chat/route.ts`

#### Update Context
```typescript
const ADITYA_CONTEXT = `
Replace with your:
- Education
- Work experience
- Projects
- Skills
- Contact info
`;
```

#### Modify Personas
```typescript
const PERSONA_PROMPTS = {
  technical: `Your custom prompt...`,
  // ... add or modify
};
```

#### Adjust Response Length
```typescript
parameters: {
  max_new_tokens: 250,  // Shorter responses
  max_new_tokens: 500,  // Longer responses
  temperature: 0.7,     // More creative (0.1-1.0)
}
```

---

## TROUBLESHOOTING

### Chat Issues

**Problem**: Chat not responding
**Solutions**:
1. Check `.env.local` has correct API key
2. Verify API key: https://huggingface.co/settings/tokens
3. Restart server: `Ctrl+C` then `npm run dev`
4. Check browser console (F12) for errors
5. Check Hugging Face status: https://status.huggingface.co/

**Problem**: Chat responds slowly
**Solutions**:
1. Normal response time: 2-5 seconds
2. Check internet connection
3. Hugging Face free tier may have rate limits
4. Try different time of day (less load)

### Persona Brief Issues

**Problem**: Typing animation not smooth
**Solutions**:
1. Adjust `typingSpeed` (lower = faster)
2. Check for console errors
3. Reduce content length if too long
4. Test in different browser

**Problem**: Thinking animation stuck
**Solutions**:
1. Check `setTimeout` duration (1500ms default)
2. Clear browser cache
3. Restart dev server
4. Check console for errors

### Build Issues

**Problem**: `npm run build` fails
**Solutions**:
```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Problem**: TypeScript errors
**Solutions**:
1. Check all imports are correct
2. Verify type definitions
3. Run `npm run lint`
4. Check `tsconfig.json`

**Problem**: Missing dependencies
**Solutions**:
```bash
npm install --force
# or
rm package-lock.json
npm install
```

### Deployment Issues

**Problem**: Vercel build fails
**Solutions**:
1. Check build logs in Vercel dashboard
2. Verify environment variable is set
3. Test build locally: `npm run build`
4. Check for console errors
5. Verify all files are committed

**Problem**: API key not working in production
**Solutions**:
1. Verify key is added in Vercel → Settings → Environment Variables
2. Key must be for "Production" environment
3. Redeploy after adding key
4. Check key has Read permissions

**Problem**: Site loads but chat doesn't work
**Solutions**:
1. Check Vercel function logs
2. Verify API endpoint: `/api/chat`
3. Check CORS if applicable
4. Verify Hugging Face API is accessible

---

## PERFORMANCE & OPTIMIZATION

### Current Performance

- Load Time: <1 second
- Time to Interactive: <2 seconds
- Chat Response: 2-5 seconds
- Lighthouse Score: 90+

### Optimization Tips

#### 1. Images
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image 
  src="/your-image.jpg" 
  alt="Description"
  width={800}
  height={600}
  priority  // For above-fold images
/>
```

#### 2. Code Splitting
```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <p>Loading...</p>
});
```

#### 3. API Caching
```typescript
// In route.ts
export const runtime = 'edge';  // Use edge runtime
export const revalidate = 3600; // Cache for 1 hour
```

#### 4. Font Optimization
```typescript
// Use next/font
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
```

---

## API INTEGRATION

### Hugging Face API

**Model**: Llama 3.2-1B Instruct  
**Endpoint**: `https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B-Instruct`

#### API Call Structure
```typescript
const response = await fetch(
  `https://api-inference.huggingface.co/models/${HF_MODEL}`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: messages,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.9,
        return_full_text: false,
      },
    }),
  }
);
```

#### Rate Limits (Free Tier)
- 30,000 characters per month
- ~100-150 messages
- Resets monthly

#### Upgrading
If you need more:
- Hugging Face Pro: $9/month (100k chars)
- Hugging Face Enterprise: Custom pricing

### Alternative Models

Can swap to different models:
```typescript
const HF_MODEL = 'meta-llama/Llama-3.2-3B-Instruct';  // Larger
const HF_MODEL = 'microsoft/phi-3-mini-4k-instruct';  // Alternative
```

Update in `src/app/api/chat/route.ts`

---

## FILE STRUCTURE

### Critical Files

#### `src/app/page.tsx`
- Main page component
- Brief with persona selector
- Experience, Projects, Skills sections
- **Update**: briefContent object, all sections

#### `src/app/api/chat/route.ts`
- Chatbot API endpoint
- Hugging Face integration
- Persona prompts
- **Update**: ADITYA_CONTEXT with your info

#### `src/components/ChatWidget.tsx`
- Enhanced chat interface
- 5 personas
- Thinking animation
- **Update**: persona descriptions if needed

#### `.env.local`
- Environment variables
- API keys
- **Create from**: .env.example
- **Never commit**: in .gitignore

### Configuration Files

#### `package.json`
- Dependencies
- Scripts
- Project metadata

#### `tailwind.config.ts`
- Tailwind CSS configuration
- Custom colors
- Theme extensions

#### `tsconfig.json`
- TypeScript configuration
- Path aliases
- Compiler options

#### `next.config.js`
- Next.js configuration
- Build settings
- Redirects/rewrites

---

## ADDITIONAL FEATURES (FUTURE)

### Blog Section
Add `/blog` route with MDX support

### Contact Form
Integrate email service (SendGrid, Resend)

### Analytics
Add Vercel Analytics or Google Analytics

### Dark/Light Toggle
Implement theme switcher

### Resume Download
Add PDF download button

### Project Filtering
Filter projects by technology

### Search
Add search functionality

---

## MAINTENANCE

### Regular Updates
- npm update (monthly)
- Security patches (as needed)
- Content updates (ongoing)

### Monitoring
- Check Vercel Analytics
- Monitor API usage
- Watch error logs

### Backup
- Code on GitHub
- Environment variables documented
- Deployment settings noted

---

## SUPPORT RESOURCES

- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- Hugging Face: https://huggingface.co/docs
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs

---

## VERSION HISTORY

**v1.0** (Feb 11, 2026)
- Initial release
- Persona brief feature
- Enhanced chat widget
- Production ready

---

**Last Updated**: February 11, 2026  
**Maintainer**: Developer  
**Status**: Production Ready
