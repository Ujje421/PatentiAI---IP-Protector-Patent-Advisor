
import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import { chatWithAdvisor } from '../services/geminiService';

interface ChatBotProps {
  currentProject: Project | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ currentProject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI IP Advisor. How can I help you with your patent journey today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, message: m.content }));
      const response = await chatWithAdvisor(history, userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response || "I'm sorry, I couldn't generate a response." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered an error. Please check your connectivity." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden mb-4 flex flex-col h-[500px]">
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <p className="text-xs font-bold leading-none">IP Advisor</p>
                <p className="text-[10px] text-slate-400">Online & Ready</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}><i className="fa-solid fa-xmark"></i></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1">
                  <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about filing, claims, or prior art..."
              className="flex-1 px-4 py-2 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button 
              onClick={handleSend}
              className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-slate-800 transition active:scale-95 group relative"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-comment-dots'} text-xl`}></i>
        {!isOpen && <span className="absolute right-full mr-4 bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition">Ask AI Advisor</span>}
      </button>
    </div>
  );
};

export default ChatBot;
