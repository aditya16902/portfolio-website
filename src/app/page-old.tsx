'use client';

import { Github, Linkedin, Twitter, Moon, ChevronDown, MapPin } from 'lucide-react';
import ChatWidget from '@/components/ChatWidget';
import { useState, useEffect } from 'react';

export default function Home() {
  const [activeSection, setActiveSection] = useState('brief');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [timeFormatIndex, setTimeFormatIndex] = useState(0);

  // Time formats that cycle through
  const timeFormats = [
    () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
    () => new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    () => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: '2-digit' })
  ];

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(timeFormats[timeFormatIndex]());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timeFormatIndex]);

  const cycleTimeFormat = () => {
    setTimeFormatIndex((prev) => (prev + 1) % timeFormats.length);
  };

  // Persona-specific brief content
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

  // Persona state management
  const [selectedBriefPersona, setSelectedBriefPersona] = useState('default');
  const [isThinking, setIsThinking] = useState(false);
  const [displayedText, setDisplayedText] = useState(briefContent.default.content);
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);

  // Handle persona change with thinking animation
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
      {/* Chat Panel - Left Side (50%) */}
      {isChatOpen && <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}

      {/* Main Content - Shifts when chat opens */}
      <main className="flex-1 min-h-screen text-white flex flex-col relative">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-[#0a0a0a]/80 backdrop-blur-sm z-40">
          <div className="max-w-4xl mx-auto px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-serif font-bold">Aditya Tamilisetti</h1>
              <p className="text-gray-400 text-sm">Data Science & AI</p>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="px-4 py-2 bg-white/90 hover:bg-white text-black rounded-lg transition-all duration-200 text-sm font-medium hover:shadow-lg hover:shadow-white/20"
              >
                {isChatOpen ? 'Close chat (⌘K)' : 'Open chat (⌘K)'}
              </button>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="border-b border-gray-800/50 bg-[#0a0a0a]/80 backdrop-blur-sm z-40">
          <div className="max-w-4xl mx-auto px-8">
            <div className="flex gap-8">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`py-4 text-sm transition-colors relative ${activeSection === section.id
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
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

        {/* Content Area with Widgets */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="max-w-4xl mx-auto px-8 py-12 pb-24">
            {/* Brief Section */}
            {activeSection === 'brief' && (
              <section className="space-y-8">
                <div className="relative mb-6">
                  <button
                    onClick={() => setShowPersonaSelector(!showPersonaSelector)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
                  >
                    {selectedBriefPersona}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${showPersonaSelector ? 'rotate-180' : ''}`}
                    />
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

            {/* Other sections placeholder */}
            {activeSection !== 'brief' && (
              <section>
                <h2 className="text-4xl font-serif font-bold mb-6 capitalize">{activeSection}</h2>
                <p className="text-gray-400">Content for {activeSection} section...</p>
              </section>
            )}
          </div>

          {/* Fixed Widgets - Positioned within main content area */}
          <div className={`fixed bottom-8 transition-all duration-300 ${isChatOpen ? 'left-[calc(50%+2rem)]' : 'left-8'}`}>
            <button
              onClick={cycleTimeFormat}
              className="flex items-center gap-3 px-4 py-2.5 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg hover:bg-gray-900 transition-colors group"
            >
              <MapPin size={16} className="text-gray-400" />
              <span className="text-sm text-gray-300">San Francisco</span>
              <span className="text-gray-600">•</span>
              <span className="text-sm text-gray-300 font-mono relative">
                {currentTime}
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </span>
            </button>
          </div>

          <div className="absolute bottom-8 right-8">
            <div className="flex items-center gap-0 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition-colors border-r border-gray-800"
              >
                <Twitter size={16} className="text-gray-400 hover:text-white" />
              </a>
              <a
                href="https://github.com/aditya16902"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition-colors border-r border-gray-800"
              >
                <Github size={16} className="text-gray-400 hover:text-white" />
              </a>
              <a
                href="https://linkedin.com/in/aditya-tamilisetti"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-800 transition-colors border-r border-gray-800"
              >
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
