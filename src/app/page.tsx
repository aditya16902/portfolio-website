'use client';

import { Github, Linkedin, Twitter, Moon, ChevronDown, Clock } from 'lucide-react';
import ChatWidget from '@/components/ChatWidget';
import { useState, useEffect } from 'react';

export default function Home() {
  const [activeSection, setActiveSection] = useState('brief');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeFormatIndex, setTimeFormatIndex] = useState(0);
  const [location, setLocation] = useState('London');

  const briefContent = {
    technical: {
      thinking: "Detailing My Background",
      content: `Hello! I'm based in London and recently completed my MSc in Data Science from The London School of Economics. I specialize in building production-ready AI engineering solutions using advanced machine learning techniques and modern cloud infrastructure.

My journey into AI started during my time at Google, where I witnessed firsthand the transformative power of Large Language Models. Working with cutting-edge technologies like TensorFlow, PyTorch, and various transformer architectures, I developed a deep understanding of how these systems work under the hood.

Currently, I'm fascinated by the technical challenges in bridging the gap between LLM capabilities and production applications. My work involves implementing RAG systems with vector databases like Pinecone, building multi-agent architectures using LangChain, and optimizing inference pipelines for real-world performance constraints.`
    },
    entrepreneurial: {
      thinking: "Explaining My Journey",
      content: `Hello! I'm based in London and recently completed my MSc in Data Science from The London School of Economics. I specialize in building AI solutions that deliver measurable commercial impact and drive business growth.

My entrepreneurial journey began at Google, where I witnessed how Large Language Models were transforming entire industries. This experience taught me to identify market opportunities and build products that bridge the gap between cutting-edge technology and real business needs.

Currently, I'm focused on the massive opportunity in AI application development. Despite incredible advances in LLMs, most companies still struggle to capture their full value. I'm building solutions in RAG systems, intelligent automation, and AI-powered workflows that help businesses unlock this potential and achieve competitive advantage.`
    },
    professional: {
      thinking: "Outlining My Experience",
      content: `Hello! I'm based in London and recently completed my MSc in Data Science from The London School of Economics. I specialize in developing enterprise-grade AI engineering solutions that meet the highest standards of quality and reliability.

My professional journey includes valuable experience at organizations like Google, KCM, Souq AI, and KPMG. These roles have equipped me with a comprehensive understanding of the full AI development lifecycle, from research and prototyping to production deployment and scaling.

Currently, I'm dedicated to advancing the practical application of AI in business contexts. My work focuses on implementing robust RAG systems, developing intelligent agent frameworks, and creating automation workflows that deliver consistent, measurable results for stakeholders.`
    },
    creative: {
      thinking: "Crafting My Story",
      content: `Hello! I'm based in London, where the rain matches my coffee consumption—both constant and essential. I recently completed my MSc in Data Science from The London School of Economics, trading econometric models for neural networks.

My AI journey? Picture this: a surfer recovering from an accident, discovering that Large Language Models at Google were more transformative than any wave I'd ever caught. That experience didn't just influence my career—it completely redirected it. I went from riding waves to riding the AI revolution.

Today, I'm captivated by a fascinating paradox: we've built incredibly powerful LLMs, yet most applications barely scratch the surface of their capabilities. It's like having a Formula 1 car and using it for grocery runs. I'm working to change that through innovative RAG systems, intelligent agents, and automation workflows that actually unlock what these models can do.`
    },
    default: {
      thinking: "Sharing My Background",
      content: `Hello! I'm based in London and recently completed my MSc in Data Science from The London School of Economics. I specialize in building production-ready AI engineering solutions that deliver real commercial impact.

My journey into AI started during my time at Google, where I witnessed the transformative power of Large Language Models. This experience profoundly influenced my career path and led me to focus on building intelligent systems that bridge the gap between cutting-edge research and practical applications.

Currently, I'm fascinated by the considerable discrepancy between the latent capabilities of LLMs and their current practical applications. My work involves exploring innovative paradigms for AI application, particularly in areas like RAG systems, intelligent agents, and automation workflows.`
    }
  };

  const sections = [
    { id: 'brief', title: 'Brief' },
    { id: 'experience', title: 'Experience' },
    { id: 'projects', title: 'Projects' },
    { id: 'skills', title: 'Skills' }
  ];

  const [selectedBriefPersona, setSelectedBriefPersona] = useState('default');
  const [isThinking, setIsThinking] = useState(false);
  const [displayedText, setDisplayedText] = useState(briefContent.default.content);
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);

  // Update time - faster when showing seconds or milliseconds
  useEffect(() => {
    // Update every 100ms for milliseconds (format 6), every second for seconds (formats 2, 5), otherwise every minute
    let interval = 60000; // Default: every minute
    if (timeFormatIndex === 6) interval = 100; // Milliseconds
    else if (timeFormatIndex === 2 || timeFormatIndex === 5) interval = 1000; // Seconds

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, interval);

    return () => clearInterval(timer);
  }, [timeFormatIndex]);

  // Format time based on current format index
  const getFormattedTime = (date: Date, formatIndex: number, loc: string): string => {
    const formats = [
      // Format 0: 01:47 PM
      () => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      },
      // Format 1: February 11th 2026
      () => {
        const day = date.getDate();
        const suffix = ['th', 'st', 'nd', 'rd'];
        const v = day % 100;
        const ordinal = (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
        return date.toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' }).replace(/\d+/, day + ordinal);
      },
      // Format 2: 1:47:41 pm
      () => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const ampm = hours >= 12 ? 'pm' : 'am';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
      },
      // Format 3: Wednesday
      () => date.toLocaleDateString('en-GB', { weekday: 'long' }),
      // Format 4: Feb 11th 26
      () => {
        const day = date.getDate();
        const suffix = ['th', 'st', 'nd', 'rd'];
        const v = day % 100;
        const ordinal = (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
        const month = date.toLocaleDateString('en-GB', { month: 'short' });
        const year = date.getFullYear().toString().slice(-2);
        return `${month} ${day}${ordinal} ${year}`;
      },
      // Format 5: 13:47:41
      () => date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      // Format 6: 01:47:123 PM (with milliseconds)
      () => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ms = date.getMilliseconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${ms.toString().padStart(3, '0')} ${ampm}`;
      }
    ];

    return formats[formatIndex % formats.length]();
  };

  // Handle time format cycling
  const handleTimeClick = () => {
    setTimeFormatIndex((prev) => (prev + 1) % 7);
  };

  // Format location and time together
  const getFormattedDisplay = (): string => {
    const timeStr = getFormattedTime(currentTime, timeFormatIndex, location);
    return `${location} ${timeStr}`;
  };

  const handlePersonaChange = (persona: keyof typeof briefContent) => {
    if (persona === selectedBriefPersona) {
      setShowPersonaSelector(false);
      return;
    }

    setIsThinking(true);
    setShowPersonaSelector(false);
    setDisplayedText('');

    setTimeout(() => {
      setSelectedBriefPersona(persona);
      setIsThinking(false);

      const content = briefContent[persona].content;
      let index = 0;
      const typingSpeed = 8;

      const typeInterval = setInterval(() => {
        if (index < content.length) {
          setDisplayedText(content.substring(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
        }
      }, typingSpeed);
    }, 1500);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      {isChatOpen && <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}

      <main className="flex-1 min-h-screen text-white flex flex-col relative">
        <header className="border-b border-gray-800/50 bg-[#0a0a0a]/80 backdrop-blur-sm z-40">
          <div className="max-w-4xl mx-auto px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif font-bold">Aditya Tamilisetti</h1>
              <p className="text-gray-400 text-sm">Data Science & AI</p>
            </div>

            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="px-4 py-2 bg-white/90 hover:bg-white text-black rounded-lg transition-all duration-200 text-sm font-medium hover:shadow-lg hover:shadow-white/20"
            >
              {isChatOpen ? 'Close chat (⌘K)' : 'Open chat (⌘K)'}
            </button>
          </div>
        </header>

        <nav className="border-b border-gray-800/50 bg-[#0a0a0a]/80 backdrop-blur-sm z-40">
          <div className="max-w-4xl mx-auto px-8">
            <div className="flex gap-8">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`py-4 text-sm transition-colors relative ${activeSection === section.id ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {section.title}
                  {activeSection === section.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto relative">
          <div className="max-w-4xl mx-auto px-8 py-12 pb-24">

            {/* BRIEF SECTION */}
            {activeSection === 'brief' && (
              <section className="space-y-8">
                <div className="relative mb-6">
                  <button
                    onClick={() => setShowPersonaSelector(!showPersonaSelector)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
                  >
                    {selectedBriefPersona}
                    <ChevronDown size={16} className={`transition-transform duration-200 ${showPersonaSelector ? 'rotate-180' : ''}`} />
                  </button>

                  {showPersonaSelector && (
                    <div className="absolute top-full left-0 mt-2 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-lg shadow-xl z-10 min-w-[200px]">
                      {Object.keys(briefContent).map((persona, index) => (
                        <button
                          key={persona}
                          onClick={() => handlePersonaChange(persona as keyof typeof briefContent)}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 transition-colors capitalize ${selectedBriefPersona === persona ? 'bg-gray-800 text-white' : 'text-gray-300'
                            } ${index === 0 ? 'rounded-t-lg' : ''} ${index === Object.keys(briefContent).length - 1 ? 'rounded-b-lg' : ''
                            }`}
                        >
                          {persona}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isThinking && (
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {briefContent[selectedBriefPersona as keyof typeof briefContent].thinking}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-4xl font-serif font-bold mb-6">Brief</h2>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    {displayedText.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-serif font-bold mb-4">Key Achievement</h3>
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                    <h4 className="font-semibold text-lg mb-2">LSE-ALLIANZ Challenge Winner</h4>
                    <p className="text-gray-400 text-sm mb-3">£1,000 Prize • 1st Place out of 10 teams</p>
                    <p className="text-gray-300">
                      Tackled a highly challenging zero-inflated dataset comprising 96% zero instances
                      by implementing advanced REBAGG and ensemble learning techniques. Presented
                      findings to an audience of 100+ at the Allianz annual meeting, successfully
                      conveying complex technical insights to non-technical stakeholders.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* EXPERIENCE SECTION */}
            {activeSection === 'experience' && (
              <section className="space-y-8">
                <h2 className="text-4xl font-serif font-bold mb-6">Experience</h2>

                <div className="space-y-8">
                  <div className="border-b border-gray-800/50 pb-8">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold">AI Engineer / Business Developer</h3>
                        <p className="text-gray-400">KCM</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Oct 2025 - Dec 2025</p>
                        <p className="text-sm text-gray-400">London, UK</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Built scrappers to track the US, UK and EU related Government fundings and implemented an NLP-powered SQL query generator to retrieve the most relevant funding data efficiently</li>
                      <li>• Deployed the framework in AWS: EC2 and Aurora RDS, with query caching to reduce LLM API costs and authentication to enable different teams to use different DB schemas</li>
                    </ul>
                  </div>

                  <div className="border-b border-gray-800/50 pb-8">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold">Data Scientist</h3>
                        <p className="text-gray-400">Souq AI</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">July 2025 - Nov 2025</p>
                        <p className="text-sm text-gray-400">London, UK</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Built the backend for an AI tools marketplace, delivering personalized, enterprise-ready AI recommendations</li>
                      <li>• Scraped Product hunt, Capterra etc and latest blogs to discover latest AI tools</li>
                      <li>• Enriched the scraped content with LLM & AI Agent workflow and classified tools into enterprise level, niche, newly launched</li>
                    </ul>
                  </div>

                  <div className="border-b border-gray-800/50 pb-8">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold">Data Scientist</h3>
                        <p className="text-gray-400">Oxford Data Plan</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Mar 2025 - Aug 2025</p>
                        <p className="text-sm text-gray-400">London, UK</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Built and managed 15+ forecasting models for IAG, EasyJet, etc to track revenue and Financial KPIs</li>
                      <li>• Owned the process end-to-end, from SEC filing research, curating relevant features from large-scale datasets (transaction records, pricing data, text, satellite/geospatial imagery) to AWS deployment</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold">Student Data Scientist</h3>
                        <p className="text-gray-400">KPMG</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Dec 2023 - Aug 2024</p>
                        <p className="text-sm text-gray-400">Manchester, UK</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Led an urban traffic optimization project, analyzing bus ridership, rental trends, and air quality using predictive modeling</li>
                      <li>• Modeled bus network coverage vs. vehicle pollution impact using Linear Regression/Random Forest on GCP, integrating OpenWeather API pollutants (NO2, S02) with traffic data</li>
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* PROJECTS SECTION */}
            {activeSection === 'projects' && (
              <section className="space-y-8">
                <h2 className="text-4xl font-serif font-bold mb-6">Projects</h2>

                <div className="space-y-6">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">Portfolio Management with Deep Learning</h3>
                    <p className="text-gray-400 text-sm mb-4">Deep Learning • Finance • SHAP</p>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Achieved 19x higher returns with CNN-BiLSTM over equal portfolio, leveraged SHAP for explainability</li>
                      <li>• Employed weekly rebalancing and Markowitz mean-variance optimization to effectively adapt market conditions</li>
                    </ul>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">Automated Dictionary Creation for Depression Detection</h3>
                    <p className="text-gray-400 text-sm mb-4">NLP • Mental Health • LDA</p>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Developed an automated corpus-native dictionary of Reddit posts (7000+) by integrating Latent Dirichlet Allocation (LDA) for topic modeling and Elastic Net for classification</li>
                      <li>• Achieved 71% classification and 79% sentiment analysis accuracy, capturing mental health discourse nuances</li>
                    </ul>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">AI Deep Research Agent</h3>
                    <p className="text-gray-400 text-sm mb-4">LangChain • Multi-Agent • RAG</p>
                    <p className="text-gray-300">
                      Built LangChain Deep Agent-based AI Research Agent orchestrating multi-agent workflow for topic decomposition, Tavily/Perplexity web searches, and McKinsey-style report generation with human-in-the-loop
                    </p>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">TickerPredict: AI-Powered Stock Prediction Platform</h3>
                    <p className="text-gray-400 text-sm mb-4">AWS • SLM • Finance</p>
                    <p className="text-gray-300">
                      Developed end-to-end AWS-deployed AI system tracking 5+ stock tickers (closing-price) for Coca-Cola, EasyJet etc. Utilised SLM for personalised portfolio optimisation strategies
                    </p>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">United Kingdom Crime Analysis</h3>
                    <p className="text-gray-400 text-sm mb-4">Time Series • SARIMA • Big Data</p>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Achieved 67% explainability using SARIMA in forecasting by integrating UK Police data and ONS data</li>
                      <li>• Analysed an 8 GB messy dataset, achieving insights into crime patterns, stop and search procedures in UK</li>
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* SKILLS SECTION */}
            {activeSection === 'skills' && (
              <section className="space-y-8">
                <h2 className="text-4xl font-serif font-bold mb-6">Skills & Expertise</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-400">Programming Languages</h3>
                    <div className="flex flex-wrap gap-3">
                      {['Python', 'R', 'SQL'].map((skill) => (
                        <span key={skill} className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-400">Tools & Platforms</h3>
                    <div className="flex flex-wrap gap-3">
                      {['n8n', 'MySQL Workbench', 'Docker', 'GitHub', 'AWS', 'Tableau', 'Pinecone', 'GCP'].map((skill) => (
                        <span key={skill} className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-400">Libraries & Frameworks</h3>
                    <div className="flex flex-wrap gap-3">
                      {['Pandas', 'NumPy', 'scikit-learn', 'TensorFlow', 'MLflow', 'LangChain', 'SHAP'].map((skill) => (
                        <span key={skill} className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-400">Specializations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Machine Learning</h4>
                        <p className="text-gray-400 text-sm">
                          Predictive modeling, classification, ensemble learning, time series forecasting
                        </p>
                      </div>
                      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Deep Learning</h4>
                        <p className="text-gray-400 text-sm">
                          CNN, LSTM, BiLSTM architectures for financial and NLP applications
                        </p>
                      </div>
                      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Natural Language Processing</h4>
                        <p className="text-gray-400 text-sm">
                          LDA, sentiment analysis, text classification, query generation
                        </p>
                      </div>
                      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Applied AI</h4>
                        <p className="text-gray-400 text-sm">
                          RAG systems, intelligent agents, LLM applications, automation workflows
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Fixed Time/Location Icon - Bottom Left */}
          {!isChatOpen && (
            <div className="fixed bottom-8 left-8 z-50">
              <button
                onClick={handleTimeClick}
                className="flex items-center gap-3 px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors group"
              >
                <Clock size={16} className="text-gray-400" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300 font-medium">
                    {location}
                  </span>
                  <span className="text-xs text-gray-500">|</span>
                  <span className="text-xs text-gray-400 group-hover:underline">
                    {getFormattedTime(currentTime, timeFormatIndex, location)}
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* Fixed Social Icons - Right Edge */}
          <div className="fixed bottom-8 right-8 z-50">
            <div className="flex items-center gap-0 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition-colors border-r border-gray-800">
                <Twitter size={16} className="text-gray-400 hover:text-white" />
              </a>
              <a href="https://github.com/aditya16902" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition-colors border-r border-gray-800">
                <Github size={16} className="text-gray-400 hover:text-white" />
              </a>
              <a href="https://linkedin.com/in/aditya-tamilisetti" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition-colors border-r border-gray-800">
                <Linkedin size={16} className="text-gray-400 hover:text-white" />
              </a>
              <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition-colors">
                <Moon size={16} className="text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
