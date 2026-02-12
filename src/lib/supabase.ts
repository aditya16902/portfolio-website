/**
 * Supabase Client
 * For database operations (logging, analytics, document storage)
 */

import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL) {
  console.warn('⚠️ SUPABASE_URL not set - database features disabled');
}

if (!process.env.SUPABASE_SERVICE_KEY) {
  console.warn('⚠️ SUPABASE_SERVICE_KEY not set - database features disabled');
}

// Create Supabase client (server-side only - uses service key)
export const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
  ? createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    )
  : null;

// Check if database is available
export const isDatabaseAvailable = !!supabase;

/**
 * Log chat interaction to database
 */
export async function logChatInteraction(data: {
  sessionId: string;
  userQuery: string;
  assistantResponse: string;
  relevantContext?: string;
  responseTimeMs: number;
  wasCached: boolean;
  wasBlocked: boolean;
  blockReason?: string;
  userIp?: string;
  userAgent?: string;
}) {
  if (!supabase) {
    console.log('📊 Logging skipped (database not configured)');
    return null;
  }

  try {
    const { data: log, error } = await supabase
      .from('chat_logs')
      .insert({
        session_id: data.sessionId,
        user_query: data.userQuery,
        assistant_response: data.assistantResponse,
        relevant_context: data.relevantContext,
        response_time_ms: data.responseTimeMs,
        was_cached: data.wasCached,
        was_blocked: data.wasBlocked,
        block_reason: data.blockReason,
        user_ip: data.userIp,
        user_agent: data.userAgent,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to log chat interaction:', error);
      return null;
    }

    console.log('📝 Logged chat interaction:', log.id);
    return log;
  } catch (error) {
    console.error('❌ Error logging chat interaction:', error);
    return null;
  }
}

/**
 * Update abuse session tracking
 */
export async function updateAbuseSession(
  sessionId: string,
  abuseCount: number,
  isBlocked: boolean,
  blockedUntil?: Date
) {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('abuse_sessions')
      .upsert({
        session_id: sessionId,
        abuse_count: abuseCount,
        last_abuse_at: new Date().toISOString(),
        is_blocked: isBlocked,
        blocked_until: blockedUntil?.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to update abuse session:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('❌ Error updating abuse session:', error);
    return null;
  }
}

/**
 * Get analytics data
 */
export async function getAnalytics(since?: Date) {
  if (!supabase) return null;

  try {
    const query = supabase
      .from('chat_logs')
      .select('*');

    if (since) {
      query.gte('created_at', since.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Failed to get analytics:', error);
      return null;
    }

    // Calculate stats
    const stats = {
      totalQueries: data.length,
      cachedQueries: data.filter(d => d.was_cached).length,
      blockedQueries: data.filter(d => d.was_blocked).length,
      avgResponseTime: data.reduce((acc, d) => acc + d.response_time_ms, 0) / data.length,
      cacheHitRate: (data.filter(d => d.was_cached).length / data.length) * 100,
      blockRate: (data.filter(d => d.was_blocked).length / data.length) * 100,
    };

    return stats;
  } catch (error) {
    console.error('❌ Error getting analytics:', error);
    return null;
  }
}
