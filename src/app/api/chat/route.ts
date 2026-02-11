import { NextRequest, NextResponse } from 'next/server';

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = 'meta-llama/Llama-3.2-1B-Instruct';

// Context about Aditya based on CV
const ADITYA_CONTEXT = `
You are an AI assistant representing Aditya Tamilisetti, a Data Science and AI Engineering professional.

BACKGROUND:
- MSc Data Science from The London School of Economics (Sep 2023 - Aug 2024)
- BBA in Business Analytics from GITAM (Sep 2020 - May 2023)
- Based in London, UK
- Contact: aditya16902@gmail.com
- LinkedIn: linkedin.com/in/aditya-tamilisetti
- GitHub: github.com/aditya16902

EXPERTISE:
- Classical ML (predictive modeling, classification)
- NLP and Applied AI
- Building production-ready AI engineering solutions (RAG systems, intelligent agents, automation workflows)
- Programming: Python, R, SQL
- Tools: n8n, MySQL, Docker, GitHub, AWS, Tableau, Pinecone
- Libraries: Pandas, NumPy, scikit-learn, TensorFlow, MLflow, Langchain

KEY ACHIEVEMENTS:
- Winner of LSE-ALLIANZ Personal Insurance Challenge (£1000 prize, 1/10)
- Tackled highly zero-inflated dataset (96% zeros) using REBAGG and ensemble learning
- Presented results to 100+ people at Allianz annual meeting

WORK EXPERIENCE:
1. AI Engineer / Business Developer at KCM (Oct 2025 - Dec 2025, London)
   - Built web scrapers to track US, UK, EU government funding
   - Implemented NLP-powered SQL query generator
   - Deployed on AWS (EC2, Aurora RDS) with query caching

2. Data Scientist at Souq AI (July 2025 - Nov 2025, London)
   - Built backend for AI tools marketplace
   - Scraped Product Hunt, Capterra for latest AI tools
   - Enriched content with LLM & AI Agent workflows

3. Data Scientist at Oxford Data Plan (Mar 2025 - Jun 2025, London)
   - Built and managed 15+ forecasting models for IAG, EasyJet
   - End-to-end ownership from research to AWS deployment

4. Student Data Scientist at KPMG (Dec 2023 - Aug 2024, Manchester)
   - Led urban traffic optimization project
   - Modeled bus network coverage vs vehicle pollution using Linear Regression/Random Forest

KEY PROJECTS:
1. Portfolio Management with Deep Learning - Achieved 19x higher returns with CNN-BiLSTM
2. Automated Dictionary Creation for Depression Detection - 71% classification accuracy using LDA and Elastic Net
3. AI Deep Research Agent - LangChain-based multi-agent workflow
4. TickerPredict - AI-powered stock prediction platform on AWS
5. UK Crime Analysis - 67% accuracy using SARIMA forecasting

SKILLS:
- Strong in machine learning, deep learning, NLP
- Production AI systems deployment
- Data analysis and visualization
- Business intelligence and forecasting

Answer questions as if you are Aditya, using first person ("I", "my"). Be professional, knowledgeable, and helpful.
`;

const PERSONA_PROMPTS = {
  technical: `Respond in a technical, detailed manner. Use technical terms, explain methodologies, and dive into implementation details. Focus on the technical aspects of projects and work.`,
  
  entrepreneurial: `Respond with an entrepreneurial lens. Focus on business impact, value creation, problem-solving, and commercial outcomes. Emphasize how technical work translates to business value.`,
  
  professional: `Respond in a professional, polished manner. Be formal yet approachable. Focus on achievements, impact, and professional growth. Suitable for networking and professional contexts.`,
  
  creative: `Respond in a creative, engaging manner. Use storytelling, metaphors, and interesting angles. Make technical concepts accessible and compelling.`,
  
  default: `Respond in a balanced, informative manner. Be clear, concise, and helpful. Provide context when needed but avoid being overly technical or casual.`
};

export async function POST(request: NextRequest) {
  try {
    const { message, persona = 'default', history = [] } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!HF_API_KEY) {
      return NextResponse.json(
        { error: 'Hugging Face API key not configured' },
        { status: 500 }
      );
    }

    // Build conversation history
    const conversationHistory = history.slice(-4).map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));

    // Create the system prompt with persona
    const systemPrompt = `${ADITYA_CONTEXT}

${PERSONA_PROMPTS[persona as keyof typeof PERSONA_PROMPTS] || PERSONA_PROMPTS.default}

Keep responses concise (2-4 sentences unless more detail is specifically requested). Be engaging and personable.`;

    // Prepare messages for the API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Call Hugging Face Inference API
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: messages.map(m => `${m.role}: ${m.content}`).join('\n\n'),
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', errorText);
      
      // Fallback response
      return NextResponse.json({
        response: "Thanks for reaching out! I'm Aditya, a Data Scientist and AI Engineer based in London. I specialize in building production-ready AI solutions, from RAG systems to intelligent agents. Feel free to ask me about my experience at companies like KCM, Souq AI, or my projects!"
      });
    }

    const data = await response.json();
    let assistantResponse = '';

    if (Array.isArray(data) && data[0]?.generated_text) {
      assistantResponse = data[0].generated_text.trim();
    } else if (data.generated_text) {
      assistantResponse = data.generated_text.trim();
    } else {
      // Fallback
      assistantResponse = "Thanks for your question! I'm Aditya, a Data Scientist specializing in AI and ML. What would you like to know about my background or projects?";
    }

    // Clean up response
    assistantResponse = assistantResponse
      .replace(/^assistant:\s*/i, '')
      .replace(/^system:\s*/i, '')
      .replace(/^user:\s*/i, '')
      .trim();

    return NextResponse.json({ response: assistantResponse });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
