'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          history: messages.slice(-6)
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
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
          content: 'Sorry, I encountered an error. Please try again.' 
        }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="
      fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col
      md:sticky md:top-0 md:w-1/2 md:h-screen md:border-r md:border-gray-800/50 md:z-auto md:flex-shrink-0
    ">
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
        <h2 className="text-lg font-semibold">Chat</h2>
        <button
          onClick={onClose}
          className="text-white bg-gray-800 hover:bg-gray-700 transition-colors p-2.5 rounded-lg shadow-md"
          aria-label="Close chat"
        >
          <X size={22} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 max-w-md">
              <h4 className="text-4xl font-serif mb-6">What's on your mind?</h4>
              <p className="text-sm leading-relaxed text-gray-400 mb-10">
                Ask anything.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setInput("What can you help me with?")}
                  className="text-sm text-left text-gray-300 hover:text-white bg-gray-900/50 hover:bg-gray-900 px-4 py-3 rounded-lg transition-colors"
                >
                  What can you help me with?
                </button>
                <button
                  onClick={() => setInput("Explain your background.")}
                  className="text-sm text-left text-gray-300 hover:text-white bg-gray-900/50 hover:bg-gray-900 px-4 py-3 rounded-lg transition-colors"
                >
                  Explain your background.
                </button>
                <button
                  onClick={() => setInput("Give me a quick overview of you.")}
                  className="text-sm text-left text-gray-300 hover:text-white bg-gray-900/50 hover:bg-gray-900 px-4 py-3 rounded-lg transition-colors"
                >
                  Give me a quick overview of you.
                </button>
                <button
                  onClick={() => setInput("Tell me about your projects.")}
                  className="text-sm text-left text-gray-300 hover:text-white bg-gray-900/50 hover:bg-gray-900 px-4 py-3 rounded-lg transition-colors"
                >
                  Tell me about your projects.
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
              className={`max-w-[75%] px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-white text-black'
                  : 'bg-gray-900/50 text-gray-100 border border-gray-800'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-gray-900/50 text-gray-100 px-4 py-3 rounded-lg border border-gray-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800/50">
        <form onSubmit={handleSubmit} className="p-6 pb-3">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-white px-4 py-3 focus:outline-none disabled:opacity-50 placeholder-gray-500"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
        
        {/* Reset Chat Button */}
        {messages.length > 0 && (
          <div className="px-6 pb-6 flex justify-center">
            <button
              onClick={() => {
                setMessages([]);
                setInput('');
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 hover:bg-gray-900 rounded-lg"
            >
              Reset Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
