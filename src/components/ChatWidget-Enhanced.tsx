'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare, ChevronDown } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  thinking?: boolean;
}

const personas = [
  { value: 'technical', label: 'Technical', description: 'Detailed technical responses' },
  { value: 'entrepreneurial', label: 'Entrepreneurial', description: 'Business-focused insights' },
  { value: 'professional', label: 'Professional', description: 'Polished, formal tone' },
  { value: 'creative', label: 'Creative', description: 'Engaging storytelling' },
  { value: 'default', label: 'Default', description: 'Balanced approach' }
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('technical');
  const [showPersonas, setShowPersonas] = useState(false);
  const [thinkingText, setThinkingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate thinking animation
  useEffect(() => {
    if (isLoading) {
      const thinkingStates = [
        'Analyzing your question...',
        'Gathering context...',
        'Crafting response...'
      ];
      let index = 0;
      const interval = setInterval(() => {
        setThinkingText(thinkingStates[index % thinkingStates.length]);
        index++;
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          persona: selectedPersona,
          history: messages.slice(-6) // Keep last 3 exchanges for context
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'I apologize, but I encountered an issue processing your request. Please try asking in a different way or refresh the page.' 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.response 
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I\'m having trouble connecting right now. Please check your internet connection and try again.' 
      }]);
    } finally {
      setIsLoading(false);
      setThinkingText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <>
      {/* Open Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 bg-white text-black px-6 py-3 rounded-full hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 shadow-xl hover:shadow-2xl z-50 group"
          aria-label="Open chat"
        >
          <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
          <span className="font-medium">Open chat (⌘K)</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full md:w-[480px] h-[100vh] md:h-[680px] bg-[#0a0a0a] border-l md:border border-gray-800 md:rounded-2xl shadow-2xl flex flex-col z-50 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-gradient-to-b from-black to-[#0a0a0a]">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                Aditya Tamilisetti
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </h3>
              <p className="text-sm text-gray-400">AI & Data Science</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Persona Selector */}
          <div className="px-5 py-3 border-b border-gray-800 bg-[#0a0a0a]">
            <div className="relative">
              <button
                onClick={() => setShowPersonas(!showPersonas)}
                className="flex items-center justify-between w-full px-4 py-2.5 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-all duration-200 border border-gray-800 group"
              >
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Persona</span>
                  <span className="text-sm text-gray-200 font-medium">
                    {personas.find(p => p.value === selectedPersona)?.label}
                  </span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-200 ${showPersonas ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {showPersonas && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl z-20 overflow-hidden animate-fade-in">
                  {personas.map((persona, index) => (
                    <button
                      key={persona.value}
                      onClick={() => {
                        setSelectedPersona(persona.value);
                        setShowPersonas(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors ${
                        selectedPersona === persona.value ? 'bg-gray-800' : ''
                      } ${index !== 0 ? 'border-t border-gray-800' : ''}`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm text-white font-medium">{persona.label}</span>
                        <span className="text-xs text-gray-400 mt-0.5">{persona.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#0a0a0a]">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500 max-w-xs">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm leading-relaxed">
                    Hi! I'm Aditya. Feel free to ask me about my experience, projects, or technical expertise.
                  </p>
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => setInput("Tell me about your experience at Google")}
                      className="block w-full text-xs text-gray-400 hover:text-white bg-gray-900/50 hover:bg-gray-900 px-3 py-2 rounded-lg transition-colors"
                    >
                      Tell me about your experience →
                    </button>
                    <button
                      onClick={() => setInput("What projects have you worked on?")}
                      className="block w-full text-xs text-gray-400 hover:text-white bg-gray-900/50 hover:bg-gray-900 px-3 py-2 rounded-lg transition-colors"
                    >
                      What projects have you worked on? →
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-white text-black rounded-br-md'
                      : 'bg-gray-900 text-gray-100 rounded-bl-md border border-gray-800'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-gray-900 text-gray-100 px-4 py-3 rounded-2xl rounded-bl-md border border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                    <p className="text-xs text-gray-400">{thinkingText || 'Thinking...'}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-5 border-t border-gray-800 bg-gradient-to-t from-black to-[#0a0a0a]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 bg-gray-900/50 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-700 disabled:opacity-50 border border-gray-800 placeholder-gray-500 transition-all"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-white text-black p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2 text-center">
              Press Enter to send • Shift + Enter for new line
            </p>
          </form>
        </div>
      )}
    </>
  );
}
