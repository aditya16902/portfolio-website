/**
 * Redis Cache Client (Upstash)
 * For caching query/response pairs
 */

import { Redis } from '@upstash/redis';
import crypto from 'crypto';

if (!process.env.UPSTASH_REDIS_REST_URL) {
  console.warn('⚠️ UPSTASH_REDIS_REST_URL not set - caching disabled');
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn('⚠️ UPSTASH_REDIS_REST_TOKEN not set - caching disabled');
}

// Create Redis client
export const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Check if cache is available
export const isCacheAvailable = !!redis;

// Cache TTL (24 hours)
const CACHE_TTL = parseInt(process.env.CACHE_TTL || '86400');

/**
 * Generate cache key from query
 * Uses hash to create consistent, short keys
 */
export function generateCacheKey(query: string): string {
  const normalized = query.toLowerCase().trim();
  const hash = crypto.createHash('md5').update(normalized).digest('hex');
  return `query:${hash}`;
}

/**
 * Cache entry interface
 */
export interface CacheEntry {
  response: string;
  context: string;
  timestamp: number;
  hitCount: number;
}

/**
 * Get cached response for query
 */
export async function getCachedResponse(query: string): Promise<CacheEntry | null> {
  if (!redis) {
    console.log('💾 Cache skipped (Redis not configured)');
    return null;
  }

  try {
    const key = generateCacheKey(query);
    const cached = await redis.get<CacheEntry>(key);

    if (cached) {
      console.log(`✅ Cache HIT for query: "${query.substring(0, 50)}..."`);
      
      // Increment hit count
      await redis.hincrby(key, 'hitCount', 1);
      
      return cached;
    }

    console.log(`❌ Cache MISS for query: "${query.substring(0, 50)}..."`);
    return null;
  } catch (error) {
    console.error('❌ Error getting cached response:', error);
    return null;
  }
}

/**
 * Cache a response
 */
export async function cacheResponse(
  query: string,
  response: string,
  context: string
): Promise<boolean> {
  if (!redis) {
    console.log('💾 Caching skipped (Redis not configured)');
    return false;
  }

  try {
    const key = generateCacheKey(query);
    const entry: CacheEntry = {
      response,
      context,
      timestamp: Date.now(),
      hitCount: 0,
    };

    await redis.set(key, entry, { ex: CACHE_TTL });
    
    console.log(`💾 Cached response for query: "${query.substring(0, 50)}..." (TTL: ${CACHE_TTL}s)`);
    return true;
  } catch (error) {
    console.error('❌ Error caching response:', error);
    return false;
  }
}

/**
 * Clear all caches
 * Call this when CV is updated
 */
export async function clearAllCaches(): Promise<number> {
  if (!redis) {
    console.log('💾 Cache clear skipped (Redis not configured)');
    return 0;
  }

  try {
    const keys = await redis.keys('query:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    
    console.log(`🧹 Cleared ${keys.length} cache entries`);
    return keys.length;
  } catch (error) {
    console.error('❌ Error clearing caches:', error);
    return 0;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  totalKeys: number;
  estimatedSize: number;
} | null> {
  if (!redis) return null;

  try {
    const keys = await redis.keys('query:*');
    const totalKeys = keys.length;
    
    // Estimate size (each entry ~1-2KB)
    const estimatedSize = totalKeys * 1.5; // KB

    return {
      totalKeys,
      estimatedSize,
    };
  } catch (error) {
    console.error('❌ Error getting cache stats:', error);
    return null;
  }
}

/**
 * Check if caching is enabled
 */
export function isCachingEnabled(): boolean {
  const enabled = process.env.CACHE_ENABLED !== 'false';
  return enabled && isCacheAvailable;
}
