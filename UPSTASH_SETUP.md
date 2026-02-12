# ⚡ Upstash Redis Setup Guide

## Step 1: Create Upstash Account

1. Go to [upstash.com](https://upstash.com)
2. Click "Get Started"
3. Sign up with GitHub (recommended)

## Step 2: Create Redis Database

1. Click "Create Database"
2. Fill in details:
   - **Name:** `aditya-portfolio-cache`
   - **Type:** Regional
   - **Region:** `eu-west-1` (Europe - London)
   - **Eviction:** Enable eviction (automatically remove old entries)
   - **TLS:** Enabled (secure connection)
3. Click "Create"

## Step 3: Get Connection Details

After database is created, you'll see:

```
Endpoint: https://xxxxx.upstash.io
REST API Tokens:
  - UPSTASH_REDIS_REST_URL: https://xxxxx.upstash.io
  - UPSTASH_REDIS_REST_TOKEN: AXXXXxxxxXXX
```

## Step 4: Add to .env.local

```bash
# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXXxxxxXXX
```

## Step 5: Install Upstash Redis SDK

```bash
npm install @upstash/redis
```

## Step 6: Test Connection

Create a test file to verify connection:

```typescript
// test-redis.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function test() {
  // Set a value
  await redis.set('test-key', 'Hello from Upstash!');
  
  // Get it back
  const value = await redis.get('test-key');
  console.log('Retrieved:', value);
  
  // Delete it
  await redis.del('test-key');
  console.log('Test complete!');
}

test();
```

Run: `npx tsx test-redis.ts`

If you see "Hello from Upstash!", ✅ Setup complete!

---

## 📦 What is Redis Used For?

### Primary Use: Query Caching

```
User asks: "What's your experience?"
  ↓
1. Check Redis cache
  ↓
  Cache HIT? → Return cached response (fast! ~50ms)
  ↓
  Cache MISS? → Call LLM, cache result, return (~600ms)
```

### Cache Structure

```typescript
// Key format
const cacheKey = `query:${hashQuery(userQuery)}`;

// Value format
{
  response: "I worked at...",
  context: "Relevant CV chunks",
  timestamp: 1234567890,
  hitCount: 5  // How many times this was served from cache
}
```

### TTL (Time To Live)

```typescript
// Cache for 24 hours
await redis.set(cacheKey, value, { ex: 86400 });

// After 24 hours, entry automatically deleted
// This ensures fresh responses for updated CVs
```

---

## 🎯 Benefits

### 1. **Cost Savings**
```
Without cache:
- 1000 queries/day × $0.0001 = $0.10/day
- ~$3/month

With 80% cache hit rate:
- 200 LLM calls/day × $0.0001 = $0.02/day
- ~$0.60/month
- Savings: 80%! 💰
```

### 2. **Speed**
```
Cache HIT:  ~50ms  (Redis lookup)
Cache MISS: ~600ms (LLM generation)

Result: 12x faster for cached queries!
```

### 3. **Load Reduction**
```
Without cache: Every query hits Groq API
With cache: Only unique queries hit Groq API
```

---

## 💡 Redis Commands We'll Use

### Basic Operations
```typescript
// Set with expiration
await redis.set('key', 'value', { ex: 3600 }); // 1 hour

// Get
const value = await redis.get('key');

// Delete
await redis.del('key');

// Check if exists
const exists = await redis.exists('key');
```

### Advanced Operations
```typescript
// Increment counter (for hit tracking)
await redis.incr('query:abc123:hits');

// Set if not exists (atomic operation)
await redis.setnx('key', 'value');

// Get multiple keys
const values = await redis.mget('key1', 'key2', 'key3');

// Delete pattern (clear all caches)
await redis.del('query:*');
```

### Hash Operations (for structured data)
```typescript
// Store structured cache entry
await redis.hset('query:abc123', {
  response: 'I worked at...',
  context: 'Relevant chunks',
  timestamp: Date.now()
});

// Get all fields
const entry = await redis.hgetall('query:abc123');

// Get specific field
const response = await redis.hget('query:abc123', 'response');
```

---

## 🔧 Configuration Options

### Environment Variables
```bash
# Required
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXXxxxxXXX

# Optional (for advanced usage)
CACHE_TTL=86400  # 24 hours in seconds
CACHE_ENABLED=true
```

### Redis Client Setup
```typescript
// lib/redis.ts
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  
  // Optional: Configure retry logic
  retry: {
    retries: 3,
    backoff: (retryCount) => Math.min(retryCount * 50, 500),
  },
  
  // Optional: Add timeout
  automaticDeserialization: true,
});
```

---

## 📊 Monitoring

### View Cache Stats in Upstash Dashboard

1. Go to your database in Upstash
2. Click "Metrics" tab
3. View:
   - Total commands (requests)
   - Hit/miss ratio
   - Storage used
   - Key count

### Custom Monitoring
```typescript
// Track cache performance
export async function getCacheStats() {
  const totalKeys = await redis.dbsize();
  const info = await redis.info('stats');
  
  return {
    totalKeys,
    keyspaceHits: info.keyspace_hits,
    keyspaceMisses: info.keyspace_misses,
    hitRate: info.keyspace_hits / (info.keyspace_hits + info.keyspace_misses)
  };
}
```

---

## 🧹 Cache Management

### Clear All Caches
```typescript
// When CV is updated, clear all query caches
export async function clearAllCaches() {
  const keys = await redis.keys('query:*');
  if (keys.length > 0) {
    await redis.del(...keys);
  }
  console.log(`🧹 Cleared ${keys.length} cache entries`);
}
```

### Clear Expired Entries (automatic)
```
Upstash automatically removes expired entries.
No manual cleanup needed! ✅
```

---

## Verification Checklist

- [ ] Upstash account created
- [ ] Redis database created
- [ ] Connection details copied to .env.local
- [ ] @upstash/redis package installed
- [ ] Test connection successful
- [ ] Ready for Phase 3!

---

## 💰 Cost

**Free Tier Includes:**
- 10,000 commands/day
- 256 MB storage
- TLS encryption
- Global replication

**This is MORE than enough for your portfolio!** ✅

**Usage estimate:**
- ~1000 queries/day
- 80% cached = 200 Redis reads + 200 Redis writes = 400 commands
- Well within 10k free limit! 🎉

---

## 🐛 Troubleshooting

### Issue: Connection timeout
**Solution:**
- Check UPSTASH_REDIS_REST_URL is correct
- Ensure TLS is enabled in dashboard
- Verify token is valid

### Issue: Commands not working
**Solution:**
- Check if eviction is enabled (should be)
- Verify you're using REST API (not TCP)
- Ensure @upstash/redis is latest version

### Issue: Data disappearing
**Solution:**
- Check TTL settings (expiration time)
- Verify eviction policy (should be `allkeys-lru`)
- Ensure you're not hitting storage limit

---

## 🎯 Next Steps

1. ✅ Upstash account created
2. ✅ Redis database created
3. ✅ Connection details added to .env.local
4. ➡️ Proceed to Phase 3 (Implementation)

---

## 📚 Additional Resources

- [Upstash Docs](https://docs.upstash.com/redis)
- [Redis SDK](https://github.com/upstash/upstash-redis)
- [Redis Commands](https://redis.io/commands/)
