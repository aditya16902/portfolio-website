/**
 * Semantic CV Chunks
 * Manually curated sections for optimal RAG retrieval
 */

export interface CVChunk {
  id: string;
  section: string;
  content: string;
  keywords: string[];
  embedding?: number[]; // For future vector search
}

export const cvData: CVChunk[] = [
  {
    id: "summary",
    section: "Professional Summary",
    content: "Experienced data science professional with MSc Data Science from LSE. Expertise in classical ML (predictive modeling, classification), NLP, and Applied AI. Unique strength: Building production-ready AI engineering solutions—including RAG systems, intelligent agents, and automation workflows—that deliver commercial impact.",
    keywords: ["data science", "lse", "ml", "nlp", "ai", "rag", "production", "machine learning"]
  },
  {
    id: "contact",
    section: "Contact Information",
    content: "Based in London. Email: aditya16902@gmail.com. LinkedIn: linkedin.com/in/aditya-tamilisetti. GitHub: github.com/aditya16902. Phone: +44 07400684829",
    keywords: ["london", "contact", "email", "linkedin", "github", "location"]
  },
  {
    id: "skills_programming",
    section: "Technical Skills - Programming",
    content: "Programming Languages: Python, R, SQL. Strong proficiency in Python for data science and AI engineering.",
    keywords: ["python", "r", "sql", "programming", "languages", "coding"]
  },
  {
    id: "skills_tools",
    section: "Technical Skills - Tools",
    content: "Tools and Platforms: n8n, MySQLWorkbench, Docker, GitHub, AWS, Tableau, Pinecone. Experience with cloud deployment and automation.",
    keywords: ["n8n", "mysql", "docker", "github", "aws", "tableau", "pinecone", "cloud", "tools"]
  },
  {
    id: "skills_frameworks",
    section: "Technical Skills - Libraries & Frameworks",
    content: "Libraries and Frameworks: Pandas, Numpy, scikit-learn, TensorFlow, MLflow, Langchain. Specialized in ML libraries and AI frameworks.",
    keywords: ["pandas", "numpy", "sklearn", "tensorflow", "mlflow", "langchain", "libraries", "frameworks"]
  },
  {
    id: "achievement_allianz",
    section: "Key Achievement - LSE Allianz Challenge",
    content: "Winner (1st place out of 10 teams; £1000 prize), LSE - ALLIANZ Personal Insurance PGPC Challenge. Tackled highly zero-inflated dataset comprising 96% zero instances by implementing REBAGG and ensemble learning techniques. Presented results to 100+ attendees at Allianz annual meeting, effectively communicating technical insights to non-technical stakeholders.",
    keywords: ["allianz", "winner", "lse", "insurance", "machine learning", "ensemble", "presentation", "achievement"]
  },
  {
    id: "education_masters",
    section: "Education - Masters Degree",
    content: "MSc Data Science from The London School of Economics (LSE), September 2023 - August 2024, London, UK. Completed comprehensive data science program at one of the world's leading universities.",
    keywords: ["msc", "masters", "lse", "london school of economics", "data science", "education", "degree"]
  },
  {
    id: "education_bachelors",
    section: "Education - Bachelors Degree",
    content: "BBA in Business Analytics from GITAM, September 2020 - May 2023, Vizag, India. Coursework included Financial Accounting, Financial Management, Business Economics, Statistics, and Predictive Analytics.",
    keywords: ["bba", "bachelors", "gitam", "business analytics", "india", "undergraduate"]
  },
  {
    id: "experience_kcm",
    section: "Work Experience - KCM",
    content: "AI Engineer / Business Developer at KCM, October 2025 - December 2025, London, UK. Built scrapers to track US, UK and EU government funding opportunities. Implemented an NLP-powered SQL query generator to retrieve the most relevant funding data efficiently. Deployed the framework on AWS using EC2 and Aurora RDS, with query caching to reduce LLM API costs and authentication to enable different teams to use different database schemas.",
    keywords: ["kcm", "ai engineer", "business developer", "nlp", "sql", "aws", "ec2", "rds", "scraping", "government funding", "recent", "current"]
  },
  {
    id: "experience_souq",
    section: "Work Experience - Souq AI",
    content: "Data Scientist at Souq AI, July 2025 - November 2025, London, UK. Built the backend for an AI tools marketplace, delivering personalized, enterprise-ready AI recommendations. Scraped Product Hunt, Capterra and latest blogs to discover latest AI tools. Enriched the scraped content with LLM & AI Agent workflow and classified tools into enterprise level, niche, and newly launched categories.",
    keywords: ["souq ai", "data scientist", "ai marketplace", "scraping", "llm", "ai agents", "product hunt", "recent"]
  },
  {
    id: "experience_oxford",
    section: "Work Experience - Oxford Data Plan",
    content: "Data Scientist at Oxford Data Plan, March 2025 - August 2025, London, UK. Built and managed 15+ forecasting models for major airlines including IAG and EasyJet to track revenue and financial KPIs. Owned the process end-to-end, from SEC filing research, curating relevant features from large-scale datasets (transaction records, pricing data, text, satellite/geospatial imagery) to AWS deployment.",
    keywords: ["oxford data plan", "data scientist", "forecasting", "iag", "easyjet", "airlines", "financial modeling", "aws", "deployment"]
  },
  {
    id: "experience_kpmg",
    section: "Work Experience - KPMG",
    content: "Student Data Scientist at KPMG, December 2023 - August 2024, Manchester, UK. Led an urban traffic optimization project, analyzing bus ridership, rental trends, and air quality using predictive modeling. Modeled bus network coverage vs. vehicle pollution impact using Linear Regression and Random Forest on GCP, integrating OpenWeather API pollutants (NO2, SO2) with traffic data.",
    keywords: ["kpmg", "student data scientist", "traffic optimization", "predictive modeling", "gcp", "random forest", "air quality"]
  },
  {
    id: "project_portfolio",
    section: "Project - Portfolio Management with Deep Learning",
    content: "Portfolio Management with Deep Learning Techniques project. Achieved 19x higher returns with CNN-BiLSTM architecture compared to equal-weight portfolio. Leveraged SHAP for model explainability. Employed weekly rebalancing and Markowitz mean-variance optimization to effectively adapt to market conditions.",
    keywords: ["deep learning", "cnn", "lstm", "portfolio", "finance", "shap", "optimization", "trading"]
  },
  {
    id: "project_depression",
    section: "Project - Depression Detection NLP",
    content: "Automated Dictionary Creation for Depression Detection in Social Media Text (NLP project). Developed an automated corpus-native dictionary from 7000+ Reddit posts by integrating Latent Dirichlet Allocation (LDA) for topic modeling and Elastic Net for classification. Achieved 71% classification and 79% sentiment analysis accuracy, capturing mental health discourse nuances.",
    keywords: ["nlp", "depression detection", "reddit", "lda", "topic modeling", "sentiment analysis", "mental health", "text analysis"]
  },
  {
    id: "project_research_agent",
    section: "Project - AI Deep Research Agent",
    content: "AI Deep Research Agent project. Built LangChain Deep Agent-based AI Research Agent orchestrating multi-agent workflow for topic decomposition, Tavily/Perplexity web searches, and McKinsey-style report generation with human-in-the-loop feedback.",
    keywords: ["langchain", "ai agents", "research", "multi-agent", "tavily", "perplexity", "automation", "rag"]
  },
  {
    id: "project_ticker",
    section: "Project - TickerPredict Stock Platform",
    content: "TickerPredict: AI-Powered Stock Prediction Platform. Developed end-to-end AWS-deployed AI system tracking 5+ stock tickers (closing prices) for companies like Coca-Cola and EasyJet. Utilized SLM (Small Language Model) for personalized portfolio optimization strategies.",
    keywords: ["stock prediction", "aws", "deployment", "finance", "slm", "portfolio optimization", "trading"]
  },
  {
    id: "project_crime",
    section: "Project - UK Crime Analysis",
    content: "United Kingdom Crime Analysis project. Achieved 67% explainability using SARIMA in forecasting by integrating UK Police data and ONS data. Analyzed an 8 GB messy dataset, achieving insights into crime patterns, stop and search procedures in UK.",
    keywords: ["crime analysis", "sarima", "forecasting", "uk", "police data", "time series", "big data"]
  },
  {
    id: "certifications",
    section: "Certifications",
    content: "Professional certifications include: IELTS 7.0, Blockchain & Crypto (Udemy), Machine Learning Introduction (IBM), Linear Regression (Rice University), AI For Everyone (DeepLearning.AI), Python Programming (University of Michigan), Probability & Statistics (HSE University), Research Design (Rice University), Data Analysis with R (IBM), Tableau Visualization (UC Davis), Introduction to Calculus (University of Sydney).",
    keywords: ["certifications", "ielts", "ibm", "deeplearning.ai", "coursera", "courses", "learning"]
  },
  {
    id: "expertise_ai",
    section: "Expertise Areas - AI & ML",
    content: "Deep expertise in AI and Machine Learning including RAG systems, LLM applications, intelligent agents, NLP, predictive modeling, ensemble methods, and deep learning architectures (CNN, LSTM, BiLSTM). Strong focus on production-ready solutions that deliver commercial impact.",
    keywords: ["ai", "machine learning", "rag", "llm", "agents", "nlp", "deep learning", "production", "expertise"]
  },
  {
    id: "expertise_data",
    section: "Expertise Areas - Data Science",
    content: "Comprehensive data science skills including statistical modeling, forecasting, time series analysis, predictive analytics, feature engineering, handling large-scale datasets, and data pipeline development. Experience with both classical ML and modern AI approaches.",
    keywords: ["data science", "statistics", "forecasting", "time series", "analytics", "data engineering", "expertise"]
  },
  {
    id: "expertise_deployment",
    section: "Expertise Areas - Deployment & Engineering",
    content: "Production deployment experience on AWS (EC2, RDS, S3), GCP, containerization with Docker, version control with GitHub, automation workflows, and building scalable AI systems. Focus on end-to-end ownership from research to production.",
    keywords: ["aws", "gcp", "deployment", "docker", "devops", "production", "engineering", "cloud", "expertise"]
  }
];

// Helper function to find relevant chunks by keywords
export function findChunksByKeywords(query: string, topK: number = 3): CVChunk[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  // Score each chunk
  const scored = cvData.map(chunk => {
    let score = 0;
    
    // Exact keyword matches (high weight)
    chunk.keywords.forEach(keyword => {
      if (queryLower.includes(keyword)) {
        score += 10;
      }
    });
    
    // Query word matches in content (medium weight)
    queryWords.forEach(word => {
      if (chunk.content.toLowerCase().includes(word)) {
        score += 2;
      }
    });
    
    // Section title relevance (low weight)
    queryWords.forEach(word => {
      if (chunk.section.toLowerCase().includes(word)) {
        score += 1;
      }
    });
    
    return { chunk, score };
  });
  
  // Sort by score and return top K
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.chunk);
}

// Helper function to get chunks by section
export function getChunksBySection(section: string): CVChunk[] {
  return cvData.filter(chunk => 
    chunk.section.toLowerCase().includes(section.toLowerCase())
  );
}

// Helper function to get all sections
export function getAllSections(): string[] {
  return [...new Set(cvData.map(chunk => chunk.section))];
}
