'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, FlowMode, GeminiModelId, RagContext } from '@/types';
import { AgentTrace } from './AgentTrace';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
  flowMode: FlowMode;
  model: GeminiModelId;
  ragContext: RagContext | null;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ flowMode, model, ragContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load from session storage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('chat-messages');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Save to session storage when messages change
  useEffect(() => {
    sessionStorage.setItem('chat-messages', JSON.stringify(messages));
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          model,
          flowMode,
          ragContext: ragContext?.extractedText,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch AI response');
      const data = await response.json();

      setMessages(prev => [...prev, {
        ...data,
        id: (Date.now() + 1).toString(),
      }]);

    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    sessionStorage.removeItem('chat-messages');
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/50 rounded-3xl border border-zinc-800/50 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/20">
        <div className="flex items-center gap-2">
           <div className="p-1.5 bg-indigo-500/20 rounded-lg">
             <Bot size={18} className="text-indigo-400" />
           </div>
           <h2 className="text-sm font-semibold text-zinc-200">AI Assistant</h2>
           {isLoading && <Loader2 size={14} className="animate-spin text-indigo-500" />}
        </div>
        <button 
          onClick={clearChat}
          className="text-[10px] font-medium text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-wider"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <Sparkles size={40} className="text-zinc-600" />
            <p className="text-sm text-zinc-400 max-w-[200px]">Send a message to see how the {flowMode} workflow responds.</p>
          </div>
        )}
        
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div 
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border ${m.role === 'user' ? 'bg-zinc-800 border-zinc-700' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                {m.role === 'user' ? <User size={16} className="text-zinc-400" /> : <Bot size={16} className="text-indigo-400" />}
              </div>
              
              <div className={`max-w-[85%] space-y-2 ${m.role === 'user' ? 'text-right' : ''}`}>
                <div className={`text-left p-4 rounded-2xl ${m.role === 'user' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/10' : 'bg-zinc-900/80 border border-zinc-800 text-zinc-300'}`}>
                  <div className={`prose prose-sm max-w-none ${m.role === 'user' ? 'prose-invert' : 'prose-invert prose-zinc'}`}>
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <div className="my-4 rounded-lg overflow-hidden border border-zinc-700/50">
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code className="bg-zinc-800 px-1 rounded text-indigo-300" {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </div>
                
                {m.agentTrace && <AgentTrace trace={m.agentTrace} />}
                
                <div className="text-[10px] text-zinc-600 font-medium px-2">
                   {new Date(m.timestamp).toLocaleTimeString()}
                   {m.model && ` • ${m.model}`}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
             <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Bot size={16} className="text-indigo-400 animate-pulse" />
             </div>
             <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl">
                <div className="flex gap-1.5">
                   <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                   <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                   <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" />
                </div>
             </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 pt-2 bg-gradient-to-t from-zinc-900/40 to-transparent">
        <form onSubmit={handleSend} className="relative group">
          {isLoading && (
            <motion.div 
              layoutId="glow"
              className="absolute -inset-0.5 bg-indigo-500 rounded-2xl opacity-20 blur-sm pointer-events-none"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={isLoading ? `${flowMode === 'supervisor' ? 'Supervisor is orchestrating...' : 'Running pipeline...'}` : `Ask anything using ${flowMode} flow...`}
            className="relative w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-6 pr-14 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all disabled:bg-zinc-800 disabled:text-zinc-600 z-10"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
        <p className="text-[10px] text-center text-zinc-600 mt-4 uppercase tracking-widest font-bold">
          LLM Multi-Agent Sandbox
        </p>
      </div>
    </div>
  );
};
