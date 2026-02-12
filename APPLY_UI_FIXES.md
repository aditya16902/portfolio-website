# 🔧 Apply All UI Fixes

Run these commands in order:

## Step 1: Update page.tsx (Main panel responsive + Social icons inverted)

Find this line:
```typescript
<main className="flex-1 min-h-screen text-white flex flex-col relative">
```

Replace with:
```typescript
<main className={`flex-1 min-h-screen text-white flex flex-col relative ${
  isChatOpen ? 'hidden md:flex' : 'flex'
}`}>
```

---

Find this block (social icons):
```typescript
<div className="fixed bottom-8 right-8 z-50">
  <div className="flex items-center gap-0 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
```

Replace with:
```typescript
<div className="fixed bottom-8 right-8 z-50">
  <div className="flex items-center gap-0 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg overflow-hidden shadow-lg">
```

---

Find social icon links:
```typescript
<Twitter size={16} className="text-gray-400 hover:text-white" />
```

Replace ALL social icons with:
```typescript
<Twitter size={16} className="text-gray-700 hover:text-black" />
<Github size={16} className="text-gray-700 hover:text-black" />
<Linkedin size={16} className="text-gray-700 hover:text-black" />
<Moon size={16} className="text-gray-700 hover:text-black" />
```

---

## Step 2: Update ChatWidget.tsx (Better close button)

Find:
```typescript
<button
  onClick={onClose}
  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
  aria-label="Close chat"
>
  <X size={24} />
</button>
```

Replace with:
```typescript
<button
  onClick={onClose}
  className="text-white bg-gray-800 hover:bg-gray-700 transition-colors p-2.5 rounded-lg shadow-md"
  aria-label="Close chat"
>
  <X size={22} />
</button>
```

---

## Expected Results

### Desktop (Chat Closed):
- Header visible ✅
- Navigation visible ✅
- Main content visible ✅
- Time icon bottom-left ✅
- Social icons bottom-right (WHITE background, DARK icons) ✅

### Desktop (Chat Open):
- Chat panel left (50%) ✅
- Chat header with visible X button ✅
- Main panel right (50%) ✅
- Header VISIBLE on main panel ✅
- Navigation VISIBLE on main panel ✅
- Time icon hidden ✅
- Social icons visible (WHITE background, DARK icons) ✅

### Mobile (Chat Closed):
- Header visible ✅
- Navigation visible ✅
- Main content visible ✅
- Time icon bottom-left ✅
- Social icons bottom-right (WHITE background) ✅

### Mobile (Chat Open):
- Chat full-screen ✅
- Main content HIDDEN ✅
- Close button visible ✅
- Social icons bottom-right (WHITE background) ✅

---

## Quick Test After Applying:

1. Restart dev server: `npm run dev`
2. Open site on desktop
3. Click "Open chat"
4. Verify:
   - [ ] Header shows on right panel
   - [ ] Navigation shows on right panel
   - [ ] Close X button visible and prominent
   - [ ] Social icons are dark on white background
5. Close chat
6. Verify:
   - [ ] Time icon appears
   - [ ] Social icons still dark on white
7. Resize browser to mobile (<768px)
8. Open chat
9. Verify:
   - [ ] Chat full-screen
   - [ ] Main content hidden
   - [ ] Social icons visible at bottom

---

Alternatively, I can make these changes for you directly. Want me to apply them?
