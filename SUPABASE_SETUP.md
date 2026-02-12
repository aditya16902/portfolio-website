# 🗄️ Supabase Setup Guide

## Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended)

## Step 2: Create New Project

1. Click "New Project"
2. Fill in details:
   - **Name:** `aditya-portfolio`
   - **Database Password:** (Generate strong password - **SAVE THIS!**)
   - **Region:** `London (EU West)` (closest to you)
   - **Pricing Plan:** Free
3. Click "Create new project"
4. Wait 2-3 minutes for setup

## Step 3: Get Connection Details

1. Go to **Project Settings** (gear icon, bottom left)
2. Click **API** in left sidebar
3. Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGc...
service_role key: eyJhbGc... (SECRET - keep safe!)
```

4. Save to `.env.local`:
```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...  # Only use in API routes (server-side)
```

## Step 4: Create Database Tables

1. Go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy and paste the schema below
4. Click **Run** or press Cmd/Ctrl + Enter

### Database Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: chat_logs (store every query/response)
CREATE TABLE chat_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  user_query TEXT NOT NULL,
  assistant_response TEXT NOT NULL,
  relevant_context TEXT,
  response_time_ms INTEGER,
  was_cached BOOLEAN DEFAULT false,
  was_blocked BOOLEAN DEFAULT false,
  block_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  user_ip TEXT,
  user_agent TEXT
);

-- Indexes for performance
CREATE INDEX idx_chat_logs_session_id ON chat_logs(session_id);
CREATE INDEX idx_chat_logs_created_at ON chat_logs(created_at);
CREATE INDEX idx_chat_logs_was_blocked ON chat_logs(was_blocked);
CREATE INDEX idx_chat_logs_was_cached ON chat_logs(was_cached);

-- Table 2: documents (uploaded CV/documents)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  content TEXT NOT NULL,
  file_type TEXT NOT NULL,
  upload_date TIMESTAMP DEFAULT NOW(),
  file_size INTEGER,
  chunk_count INTEGER,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'error'))
);

-- Table 3: document_chunks (semantic chunks with metadata)
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  chunk_id TEXT NOT NULL,
  section TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[],
  char_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for retrieval
CREATE INDEX idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_document_chunks_chunk_id ON document_chunks(chunk_id);
CREATE INDEX idx_document_chunks_keywords ON document_chunks USING GIN(keywords);

-- Table 4: abuse_sessions (track rate limiting)
CREATE TABLE abuse_sessions (
  session_id TEXT PRIMARY KEY,
  abuse_count INTEGER DEFAULT 0,
  last_abuse_at TIMESTAMP,
  window_start TIMESTAMP DEFAULT NOW(),
  is_blocked BOOLEAN DEFAULT false,
  blocked_until TIMESTAMP
);

-- Index for cleanup
CREATE INDEX idx_abuse_sessions_blocked_until ON abuse_sessions(blocked_until);

-- Table 5: cache_entries (optional - can use Redis instead)
CREATE TABLE cache_entries (
  query_hash TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  response TEXT NOT NULL,
  context TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  hit_count INTEGER DEFAULT 0
);

-- Index for expiration cleanup
CREATE INDEX idx_cache_entries_expires_at ON cache_entries(expires_at);
```

## Step 5: Enable Row Level Security (Optional but Recommended)

```sql
-- Enable RLS on all tables
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE abuse_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cache_entries ENABLE ROW LEVEL SECURITY;

-- Create policies (allow service role to do everything)
CREATE POLICY "Allow service role all" ON chat_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role all" ON documents
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role all" ON document_chunks
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role all" ON abuse_sessions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role all" ON cache_entries
  FOR ALL USING (auth.role() = 'service_role');
```

## Step 6: Setup Storage (for document uploads)

1. Go to **Storage** (left sidebar)
2. Click **New bucket**
3. Name: `documents`
4. **Public bucket:** No (keep private)
5. Click **Create bucket**

## Step 7: Test Connection

Run this test query in SQL Editor:
```sql
-- Insert test log
INSERT INTO chat_logs (session_id, user_query, assistant_response, was_cached)
VALUES ('test', 'Hello', 'Hi there!', false);

-- Verify
SELECT * FROM chat_logs WHERE session_id = 'test';

-- Clean up
DELETE FROM chat_logs WHERE session_id = 'test';
```

If you see the test row, ✅ Setup complete!

## Step 8: Add to .env.local

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...  # Public key (safe for frontend)
SUPABASE_SERVICE_KEY=eyJhbGc...  # Secret key (only use server-side!)
```

## Verification Checklist

- [ ] Supabase account created
- [ ] Project created
- [ ] Connection details copied to .env.local
- [ ] All 5 tables created successfully
- [ ] RLS enabled (optional)
- [ ] Storage bucket created
- [ ] Test query passed
- [ ] Ready for Phase 3!

---

## 📊 What You Just Created

### Tables Overview

| Table | Purpose | Records Expected |
|-------|---------|------------------|
| `chat_logs` | Every Q&A interaction | Grows with usage |
| `documents` | Uploaded CV/docs | 1-5 documents |
| `document_chunks` | Semantic chunks | 20-50 chunks per doc |
| `abuse_sessions` | Rate limiting | Active sessions only |
| `cache_entries` | Optional cache | Alternative to Redis |

### Storage Structure
```
documents/
  └── cv/
      ├── cv-2024.pdf
      ├── cv-2024.txt
      └── ...
```

---

## 🎯 Next Steps

After setup is complete:
1. Test connection in your app
2. Set up Upstash Redis (next guide)
3. Implement Phase 3 (caching + logging)

---

## 🐛 Troubleshooting

### Issue: Tables not created
**Solution:** 
- Make sure you selected the correct database
- Run schema commands one table at a time
- Check for error messages in SQL Editor

### Issue: Can't connect from app
**Solution:**
- Double-check SUPABASE_URL is correct
- Verify ANON_KEY (not service key) for client-side
- Ensure .env.local is loaded (restart dev server)

### Issue: RLS blocking queries
**Solution:**
- Use service_role key in API routes (server-side)
- Don't use service_role in browser (security risk)

---

## 💰 Cost

**Free Tier Includes:**
- 500 MB database
- 1 GB file storage  
- 50k monthly active users
- 2 GB bandwidth

**This is MORE than enough for your portfolio!** ✅
