import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { findRelevantContext } from '@/lib/rag';

// Abuse detection system
const abuseTracker = new Map<string, { count: number; lastReset: number }>();

function isRelevantQuery(message: string): boolean {
  // Normalize message
  const normalized = message.toLowerCase().trim();
  
  // Detect obvious abuse patterns FIRST (before checking keywords)
  // Math patterns - catch anywhere in the message
  const mathPatterns = [
    /\d+\s*[+\-*/x÷]\s*\d+/,  // "1+1", "5*3", "whats 1+1", "calculate 5-2"
    /\d+\s*(plus|minus|times|divided by|multiplied by)\s*\d+/i,
    /(what('s| is)|calculate|compute|solve)\s*\d+\s*[+\-*/x÷]\s*\d+/i,
  ];
  
  // General knowledge patterns
  const generalKnowledgePatterns = [
    /what('s| is) the (capital|population|currency|language) of/i,
    /what('s| is) the (weather|temperature|time|date)/i,
    /who (is|was) (the )?(president|prime minister|king|queen)/i,
    /when (did|was|is)/i,
    /where (is|was|are)/i,
  ];
  
  // Personal assistance patterns
  const assistancePatterns = [
    /(write|draft|create|compose) (a|an|my) (email|letter|essay|story|poem|document)/i,
    /(book|schedule|reserve|order|buy|purchase) (a|an|my|me)/i,
    /(play|stream|download|watch|listen)/i,
    /(cook|recipe for|how to (make|cook|prepare)) (?!.*(resume|cv|portfolio))/i,
    /translate .* to/i,
  ];
  
  // Combine all abuse patterns
  const allAbusePatterns = [...mathPatterns, ...generalKnowledgePatterns, ...assistancePatterns];
  
  // Check for abuse FIRST - if it's abuse, reject immediately regardless of keywords
  const isAbuse = allAbusePatterns.some(pattern => pattern.test(normalized));
  if (isAbuse) {
    console.log('🚫 Abuse pattern detected:', normalized);
    return false;
  }
  
  // Professional/resume-related keywords (more specific now, removed overly broad "what")
  const relevantKeywords = [
    // Identity & info - be more specific
    'aditya', 'your background', 'your experience', 'your skills',
    'who are you', 'tell me about you', 'about you',
    // Experience related
    'experience', 'work', 'worked', 'job', 'role', 'position', 'company', 'employer',
    'google', 'kpmg', 'kcm', 'souq', 'oxford', 'lse',
    // Skills & technical
    'skill', 'python', 'ai', 'ml', 'machine learning', 'data', 'project',
    'tensorflow', 'pytorch', 'aws', 'cloud', 'langchain', 'rag',
    // Education
    'education', 'degree', 'university', 'study', 'studied', 'london school',
    // Projects
    'project', 'portfolio', 'built', 'developed', 'created',
    // General career
    'career', 'background', 'qualification', 'achievement', 'award',
    'expertise', 'specialize', 'focus',
    // Conversational (safe greetings)
    'hello', 'hi', 'hey', 'help', 'can you help'
  ];
  
  // Check if query contains relevant keywords
  const hasRelevantKeywords = relevantKeywords.some(keyword => 
    normalized.includes(keyword)
  );
  
  if (hasRelevantKeywords) return true;
  
  // For very short queries (< 15 chars), be more strict
  // Allow generic greetings but nothing else
  if (normalized.length < 15) {
    const safeShortQueries = ['hi', 'hello', 'hey', 'help', 'thanks', 'ok', 'yes', 'no'];
    return safeShortQueries.some(q => normalized === q || normalized === q + '!');
  }
  
  // Medium length queries (15-30 chars) without keywords are likely off-topic
  if (normalized.length < 30) return false;
  
  // Long queries without relevant keywords are definitely off-topic
  return false;
}

function trackAbuse(sessionId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const WINDOW_MS = 3600000; // 1 hour
  const MAX_WARNINGS = 3; // 3 warnings per hour
  
  let tracker = abuseTracker.get(sessionId);
  
  // Reset if window expired
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
  try {
    const { message, history = [] } = await request.json();

    console.log('📩 Received message:', message);

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get session identifier (using IP or generate session ID)
    const sessionId = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'anonymous';

    // Check if query is relevant
    const isRelevant = isRelevantQuery(message);
    
    if (!isRelevant) {
      // Track abuse attempt
      const { allowed, remaining } = trackAbuse(sessionId);
      
      console.log('⚠️ Off-topic query detected:', message);
      console.log(`🔢 Abuse count for ${sessionId}: ${4 - remaining}/3, remaining: ${remaining}`);
      
      if (!allowed) {
        // Rate limit exceeded
        console.log('🚫 RATE LIMITED:', sessionId);
        return NextResponse.json({
          response: "I appreciate your interest, but I've noticed multiple queries unrelated to Aditya's professional background. This chat is designed to answer questions about his experience, projects, and skills. Please ask relevant questions, or try again in an hour."
        });
      }
      
      // First few warnings - be helpful
      console.log(`⚠️ WARNING ${4 - remaining}/3 for ${sessionId}`);
      return NextResponse.json({
        response: `I'm Aditya's AI assistant, designed to answer questions about his professional background, experience, projects, and skills. Your question doesn't seem related to these topics.\n\nYou have ${remaining} ${remaining === 1 ? 'warning' : 'warnings'} remaining before being rate-limited.\n\nPlease ask about:\n• My work experience and roles\n• My technical skills and projects\n• My education and achievements\n• My AI/ML expertise\n\nHow can I help you learn about Aditya's professional background?`
      });
    }
    
    console.log('✅ Query is relevant, processing with RAG...');

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        response: 'Please add GROQ_API_KEY to your .env.local file. Get it from https://console.groq.com/keys'
      });
    }

    // 🔍 RAG: Find relevant context from CV
    console.log('🔍 Finding relevant context...');
    const relevantContext = findRelevantContext(message, 3);
    console.log('✅ Found context:', relevantContext.substring(0, 200) + '...');

    // Build system prompt with RAG context
    const systemPrompt = `You are Aditya Tamilisetti, a Data Scientist and AI Engineer based in London.

CONTEXT FROM CV:
${relevantContext}

Answer questions as Aditya in first person ("I", "my"). Be concise (2-3 sentences unless detail is requested), professional, and helpful. Use information from the context above when relevant.`;

    // Build conversation messages
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...history.slice(-4).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    console.log('🤖 Calling Groq API...');

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: messages as any,
      model: 'llama-3.1-8b-instant', // Fast and good quality
      temperature: 0.7,
      max_tokens: 300,
      top_p: 0.9,
    });

    const response = completion.choices[0]?.message?.content || 
      "I'm Aditya, a Data Scientist and AI Engineer in London. Ask me about my experience, projects, or skills!";

    console.log('✅ Response generated:', response.substring(0, 100) + '...');

    return NextResponse.json({ response });

  } catch (error: any) {
    console.error('❌ Chat error:', error.message);
    
    if (error.message?.includes('API key')) {
      return NextResponse.json({
        response: 'API key error. Please check your GROQ_API_KEY in .env.local'
      });
    }

    return NextResponse.json({
      response: "Hi! I'm Aditya, a Data Scientist and AI Engineer in London. I specialize in RAG systems, intelligent agents, and production AI. Ask me about my work!"
    });
  }
}
