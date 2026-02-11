# Phase 2: RAG-Powered Portfolio - Implementation Plan

## Current Issues

### UI Issues
1. ✅ Duplicate "Aditya Tamilisetti" header in chat (left side)
2. ✅ Time/social icons don't move to right edge when chat opens
3. ✅ Experience, Projects, Skills sections are empty
4. ✅ Social icons not properly attached to right edge

### AI/API Issues
1. ✅ Hugging Face API endpoint deprecated (410 error)
2. ✅ Need RAG implementation with CV
3. ✅ No context retrieval from documents

## Phase 2 Implementation

### 1. RAG Setup (Priority)

**Components:**
- CV storage in `/public/data/cv.txt`
- Hugging Face embeddings API
- Simple vector store (in-memory for now)
- Context retrieval on each query

**Tech Stack:**
- Hugging Face `sentence-transformers/all-MiniLM-L6-v2` for embeddings
- LangChain for RAG orchestration
- Hugging Face Inference API for LLM

**Installation:**
```bash
npm install @huggingface/inference langchain
```

### 2. UI Fixes

**ChatWidget.tsx:**
- Remove header with name (redundant)
- Keep only close button

**page.tsx:**
- Fix time/social icons positioning
- Add conditional class: `${isChatOpen ? 'right-8' : 'right-8'}`
- Invert icon order when chat opens
- Hide time widget or move to right

**Content Sections:**
- Add full Experience from CV
- Add full Projects from CV  
- Add full Skills from CV

### 3. File Structure

```
portfolio website/
├── phase1/                    # Old redundant files
│   ├── *.md (old docs)
│   └── ChatWidget-old.tsx
├── public/
│   └── data/
│       └── cv.txt            # Your CV content
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts  # RAG-powered chat
│   │   │   └── embeddings/
│   │   │       └── route.ts  # CV embedding endpoint
│   │   ├── page.tsx          # Full content from CV
│   │   └── globals.css
│   └── components/
│       └── ChatWidget.tsx    # Simplified, no header
├── README.md                 # Main docs only
└── QUICKSTART.md            # Quick setup only
```

### 4. RAG Implementation Details

**Step 1: Process CV**
```typescript
// On app start, chunk CV into paragraphs
// Generate embeddings for each chunk
// Store in memory: { text, embedding, metadata }
```

**Step 2: Query Processing**
```typescript
// 1. User asks question
// 2. Generate embedding for question
// 3. Find top 3 most similar CV chunks (cosine similarity)
// 4. Build context from chunks
// 5. Send context + question to LLM
// 6. Return response
```

**Step 3: Hugging Face Integration**
```typescript
// Use @huggingface/inference package
// Model: HuggingFaceH4/zephyr-7b-beta (reliable, fast)
// Embeddings: sentence-transformers/all-MiniLM-L6-v2
```

## Next Steps

1. Install dependencies
2. Create CV text file
3. Implement RAG endpoint
4. Update chat API route
5. Fix UI issues
6. Test thoroughly
7. Deploy

## Questions for You

1. ✅ Should I use Hugging Face Inference API (free but rate limited) or Serverless Inference (need credit card)?
2. ✅ Keep time widget when chat opens or hide it?
3. ✅ Do you want github projects scraped now or just CV for phase 2?

---

**Status**: Ready to implement
**Est. Time**: 2-3 hours
**Priority**: RAG > UI > Content > Docs cleanup
