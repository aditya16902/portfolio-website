import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { findRelevantContext } from '@/lib/rag';
import { getCachedResponse, cacheResponse, isCachingEnabled } from '@/lib/redis';
import { logChatInteraction, isDatabaseAvailable, updateAbuseSession } from '@/lib/supabase';

// Abuse detection system (in-memory fallback)
const abuseTracker = new Map<string, { count: number; lastReset: number }>();

function isRelevantQuery(message: string): boolean {
  const normalized = message.toLowerCase().trim();
  
  // Detect abuse patterns FIRST
  const mathPatterns = [
    /\d+\s*[+\-*/x÷]\s*\d+/,
    /\d+\s*(plus|minus|times|divided by|multiplied by)\s*\d+/i,
    /(what('s| is)|calculate|compute|solve)\s*\d+\s*[+\-*/x÷]\s*\d+/i,
  ];
  
  const generalKnowledgePatterns = [
    /what('s| is) the (capital|population|currency|language) of/i,
    /what('s| is) the (weather|temperature|time|date)/i,
    /who (is|was) (the )?(president|prime minister|king|queen)/i,
    /when (did|was|is)/i,
    /where (is|was|are)/i,
  ];
  
  const assistancePatterns = [
    /(write|draft|create|compose) (a|an|my) (email|letter|essay|story|poem|document)/i,
    /(book|schedule|reserve|order|buy|purchase) (a|an|my|me)/i,
    /(play|stream|download|watch|listen)/i,
    /(cook|recipe for|how to (make|cook|prepare)) (?!.*(resume|cv|portfolio))/i,
    /translate .* to/i,
  ];
  
  const allAbusePatterns = [...mathPatterns, ...generalKnowledgePatterns, ...assistancePatterns];
  
  const isAbuse = allAbusePatterns.some(pattern => pattern.test(normalized));
  if (isAbuse) {
    console.log('🚫 Abuse pattern detected:', normalized);
    return false;
  }
  
  // Relevant keywords
  const relevantKeywords = [
    'aditya', 'your background', 'your experience', 'your skills',
    'who are you', 'tell me about you', 'about you', 'overview', 'quick overview', 'summary',
    'experience', 'work', 'worked', 'job', 'role', 'position', 'company', 'employer',
    'google', 'kpmg', 'kcm', 'souq', 'oxford', 'lse',
    'skill', 'python', 'ai', 'ml', 'machine learning', 'data', 'project',
    'tensorflow', 'pytorch', 'aws', 'cloud', 'langchain', 'rag',
    'education', 'degree', 'university', 'study', 'studied', 'london school',
    'project', 'portfolio', 'built', 'developed', 'created',
    'career', 'background', 'qualification', 'achievement', 'award',
    'expertise', 'specialize', 'focus',
    'hello', 'hi', 'hey', 'help', 'can you help'
  ];
  
  const hasRelevantKeywords = relevantKeywords.some(keyword => 
    normalized.includes(keyword)
  );
  
  if (hasRelevantKeywords) return true;
  
  // Short queries
  if (normalized.length < 15) {
    const safeShortQueries = ['hi', 'hello', 'hey', 'help', 'thanks', 'ok', 'yes', 'no'];
    return safeShortQueries.some(q => normalized === q || normalized === q + '!');
  }
  
  if (normalized.length < 30) return false;
  return false;
}

function trackAbuse(sessionId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const WINDOW_MS = 3600000; // 1 hour
  const MAX_WARNINGS = 3;
  
  let tracker = abuseTracker.get(sessionId);
  
  if (!tracker || now - tracker.lastReset > WINDOW_MS) {
    tracker = { count: 0, lastReset: now };
    abuseTracker.set(sessionId, tracker);
  }
  
  tracker.count++;
  
  return {
    allowed: tracker.count <= MAX_WARNINGS,
    remaining: Math.max(0, MAX_WARNINGS - tracker.count)
  };
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { message, history = [] } = await request.json();

    console.log('📩 Received message:', message);

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get session ID
    const sessionId = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'anonymous';
    
    const userIp = sessionId;
    const userAgent = request.headers.get('user-agent') || '';

    // Check if query is relevant
    const isRelevant = isRelevantQuery(message);
    
    if (!isRelevant) {
      const { allowed, remaining } = trackAbuse(sessionId);
      
      console.log('⚠️ Off-topic query detected:', message);
      console.log(`🔢 Abuse count for ${sessionId}: ${4 - remaining}/3, remaining: ${remaining}`);
      
      // Update abuse tracking in database
      if (isDatabaseAvailable) {
        await updateAbuseSession(sessionId, 4 - remaining, !allowed, 
          !allowed ? new Date(Date.now() + 3600000) : undefined
        );
      }
      
      const responseTimeMs = Date.now() - startTime;
      const warningMessage = allowed
        ? `I'm Aditya's AI assistant, designed to answer questions about his professional background, experience, projects, and skills. Your question doesn't seem related to these topics.\n\nYou have ${remaining} ${remaining === 1 ? 'warning' : 'warnings'} remaining before being rate-limited.\n\nPlease ask about:\n• My work experience and roles\n• My technical skills and projects\n• My education and achievements\n• My AI/ML expertise\n\nHow can I help you learn about Aditya's professional background?`
        : "I appreciate your interest, but I've noticed multiple queries unrelated to Aditya's professional background. This chat is designed to answer questions about his experience, projects, and skills. Please ask relevant questions, or try again in an hour.";
      
      // Log to database
      if (isDatabaseAvailable) {
        await logChatInteraction({
          sessionId,
          userQuery: message,
          assistantResponse: warningMessage,
          responseTimeMs,
          wasCached: false,
          wasBlocked: true,
          blockReason: 'off_topic',
          userIp,
          userAgent,
        });
      }
      
      if (!allowed) {
        console.log('🚫 RATE LIMITED:', sessionId);
      } else {
        console.log(`⚠️ WARNING ${4 - remaining}/3 for ${sessionId}`);
      }
      
      return NextResponse.json({ response: warningMessage });
    }
    
    console.log('✅ Query is relevant, processing...');

    // ========================================
    // STEP 1: Check cache BEFORE calling LLM
    // ========================================
    if (isCachingEnabled()) {
      console.log('💾 Checking cache...');
      const cached = await getCachedResponse(message);
      
      if (cached) {
        const responseTimeMs = Date.now() - startTime;
        console.log(`⚡ Serving from cache (${responseTimeMs}ms)`);
        
        // Log cache hit
        if (isDatabaseAvailable) {
          await logChatInteraction({
            sessionId,
            userQuery: message,
            assistantResponse: cached.response,
            relevantContext: cached.context,
            responseTimeMs,
            wasCached: true,
            wasBlocked: false,
            userIp,
            userAgent,
          });
        }
        
        return NextResponse.json({ 
          response: cached.response,
          cached: true 
        });
      }
    }

    // ========================================
    // STEP 2: Not cached - call LLM
    // ========================================
    
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        response: 'Please add GROQ_API_KEY to your .env.local file. Get it from https://console.groq.com/keys'
      }, { status: 500 });
    }

    // Find relevant context using RAG
    console.log('🔍 Finding relevant context...');
    const relevantContext = findRelevantContext(message);

    // Build system prompt
    const systemPrompt = `You are Aditya Tamilisetti, a Data Scientist and AI Engineer based in London.

CONTEXT FROM CV:
${relevantContext}

Answer questions as Aditya in first person ("I", "my"). Be concise (2-3 sentences unless detail is requested), professional, and helpful. Use information from the context above when relevant.`;

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    console.log('🤖 Calling Groq API...');
    const completion = await groq.chat.completions.create({
      messages: messages as any,
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 300,
      top_p: 0.9,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I encountered an error.';
    const responseTimeMs = Date.now() - startTime;

    console.log(`✅ Response generated (${responseTimeMs}ms)`);

    // ========================================
    // STEP 3: Cache the response
    // ========================================
    if (isCachingEnabled()) {
      console.log('💾 Caching response...');
      await cacheResponse(message, response, relevantContext);
    }

    // ========================================
    // STEP 4: Log to database
    // ========================================
    if (isDatabaseAvailable) {
      console.log('📝 Logging to database...');
      await logChatInteraction({
        sessionId,
        userQuery: message,
        assistantResponse: response,
        relevantContext,
        responseTimeMs,
        wasCached: false,
        wasBlocked: false,
        userIp,
        userAgent,
      });
    }

    return NextResponse.json({ 
      response,
      cached: false 
    });

  } catch (error) {
    console.error('❌ Chat API error:', error);
    const responseTimeMs = Date.now() - startTime;
    
    return NextResponse.json({
      response: 'Sorry, I encountered an error. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
