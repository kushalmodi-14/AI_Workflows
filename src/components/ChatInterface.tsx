'use client';

import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ChatMessage, FlowMode, GeminiModelId, RagContext } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Check, Copy, Loader2, Paperclip, RotateCcw, SendHorizontal, Sparkles, Zap } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatInterfaceProps {
  flowMode: FlowMode;
  model: GeminiModelId;
  ragContext: RagContext | null;
}

const SUGGESTIONS = [
  { label: 'Explain this concept simply', emoji: '💡', color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 hover:border-amber-400/60' },
  { label: 'Write a custom React hook', emoji: '⚛️', color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 hover:border-cyan-400/60' },
  { label: 'Design a REST API schema', emoji: '🔌', color: 'from-violet-500/20 to-purple-500/10 border-violet-500/30 hover:border-violet-400/60' },
  { label: 'Summarize my attached PDF', emoji: '📄', color: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30 hover:border-emerald-400/60' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all duration-200',
        copied
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
      )}
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
    >
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

/* Animated typing dots */
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-5 py-4">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ flowMode, model, ragContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('chat-messages');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    sessionStorage.setItem('chat-messages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent, override?: string) => {
    e?.preventDefault();
    const query = (override ?? input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, model, flowMode, ragContext: ragContext?.extractedText }),
      });
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      setMessages(prev => [...prev, { ...data, id: (Date.now() + 1).toString() }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '**Connection error.** Please verify your API key in `.env.local` and try again.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const clearChat = () => {
    setMessages([]);
    sessionStorage.removeItem('chat-messages');
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-[#080B14] rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-black/60">

      {/* ── HEADER ── */}
      <div className="relative flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-gradient-to-r from-white/[0.03] to-transparent overflow-hidden">
        {/* subtle glow strip */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

        <div className="flex items-center gap-3">
          {/* live pulse */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest">Live</span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* flow mode badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/25">
            <Zap size={9} className="text-violet-400" />
            <span className="text-[10px] font-bold text-violet-300 capitalize">{flowMode}</span>
          </div>

          {ragContext && (
            <>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/25">
                <Paperclip size={9} className="text-cyan-400" />
                <span className="text-[10px] font-bold text-cyan-300">PDF Active</span>
              </div>
            </>
          )}
        </div>

        {messages.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={clearChat}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200"
              >
                <RotateCcw size={11} />
                Clear
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs bg-[#0F1320] border-white/10">Clear conversation</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* ── MESSAGES ── */}
      <ScrollArea className="flex-1 px-5 py-5">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            /* ── EMPTY STATE ── */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center min-h-[380px] gap-8 text-center"
            >
              {/* icon */}
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 blur-2xl opacity-30 scale-110" />
                <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-violet-900/50">
                  <Sparkles size={26} className="text-white" />
                </div>
                {/* orbit ring */}
                <div className="absolute -inset-3 rounded-full border border-violet-500/20 animate-spin" style={{ animationDuration: '8s' }}>
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-violet-400" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                  Ready to help
                </h3>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                  Agents are standing by. Choose a prompt below or describe your goal.
                </p>
              </div>

              {/* suggestion cards */}
              <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={s.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    onClick={() => handleSubmit(undefined, s.label)}
                    className={cn(
                      'flex items-start gap-2.5 p-3.5 bg-gradient-to-br border rounded-xl text-left transition-all duration-250 group hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]',
                      s.color
                    )}
                  >
                    <span className="text-base leading-none mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">{s.emoji}</span>
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors leading-relaxed">{s.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* ── MESSAGE LIST ── */
            <motion.div key="messages" className="space-y-6 pb-2">
              {messages.map((m, idx) => (
                <motion.div
                  key={m.id || idx}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={cn('flex gap-3', m.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                >
                  {/* Avatar */}
                  <div className={cn(
                    'w-8 h-8 rounded-xl flex-shrink-0 mt-0.5 flex items-center justify-center text-xs font-black shadow-lg',
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-slate-100 to-slate-300 text-slate-900 shadow-white/10'
                      : 'bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-violet-900/50'
                  )}>
                    {m.role === 'user' ? 'U' : <Bot size={14} />}
                  </div>

                  {/* Bubble */}
                  <div className={cn('max-w-[80%] flex flex-col gap-1.5', m.role === 'user' ? 'items-end' : 'items-start')}>
                    {m.role === 'user' ? (
                      /* User bubble */
                      <div className="relative group">
                        <div className="absolute inset-0 rounded-2xl rounded-tr-sm bg-gradient-to-br from-violet-600/30 to-cyan-600/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative bg-gradient-to-br from-violet-600 to-violet-700 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-lg shadow-violet-900/40 border border-violet-500/30">
                          <p className="text-sm leading-relaxed font-medium">{m.content}</p>
                        </div>
                      </div>
                    ) : (
                      /* Assistant bubble */
                      <div className="relative group w-full">
                        <div className="absolute inset-0 rounded-2xl rounded-tl-sm bg-gradient-to-br from-violet-500/5 to-cyan-500/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative bg-[#0D1117]/80 backdrop-blur-sm border border-white/[0.08] rounded-2xl rounded-tl-sm shadow-xl overflow-hidden group-hover:border-white/[0.14] transition-colors duration-300">
                          {/* top accent line */}
                          <div className="h-px w-full bg-gradient-to-r from-violet-500/50 via-cyan-500/30 to-transparent" />
                          <div className="prose prose-sm max-w-none px-5 py-4
                            prose-headings:font-black prose-headings:text-white prose-headings:tracking-tight
                            prose-p:text-slate-300 prose-p:leading-relaxed
                            prose-strong:text-white prose-strong:font-bold
                            prose-ul:my-2 prose-ol:my-2
                            prose-li:text-slate-300
                            prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline
                            prose-blockquote:border-l-violet-500 prose-blockquote:bg-violet-500/5 prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:text-slate-300
                            prose-code:text-cyan-300 prose-code:bg-cyan-950/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-code:font-mono
                            prose-hr:border-white/10
                          ">
                            <ReactMarkdown
                              components={{
                                code({ node, inline, className, children, ...props }: any) {
                                  const match = /language-(\w+)/.exec(className || '');
                                  const codeText = String(children).replace(/\n$/, '');
                                  return !inline && match ? (
                                    <div className="not-prose my-4 rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/50">
                                      <div className="flex items-center justify-between px-4 py-2.5 bg-[#090C14] border-b border-white/[0.06]">
                                        <div className="flex items-center gap-3">
                                          <div className="flex gap-1.5">
                                            <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-400/30 block" />
                                            <span className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-300/30 block" />
                                            <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-400/30 block" />
                                          </div>
                                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{match[1]}</span>
                                        </div>
                                        <CopyButton text={codeText} />
                                      </div>
                                      <SyntaxHighlighter
                                        {...props}
                                        style={oneDark}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{
                                          margin: 0,
                                          borderRadius: 0,
                                          background: '#060910',
                                          fontSize: '0.78rem',
                                          lineHeight: '1.75',
                                          padding: '1.1rem 1.4rem',
                                        }}
                                      >
                                        {codeText}
                                      </SyntaxHighlighter>
                                    </div>
                                  ) : (
                                    <code className={cn(className, 'font-mono')} {...props}>{children}</code>
                                  );
                                }
                              }}
                            >
                              {m.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    <span className={cn(
                      'text-[10px] font-medium px-1',
                      m.role === 'user' ? 'text-violet-400/50' : 'text-slate-600'
                    )}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Loading state */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-violet-900/50">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-[#0D1117]/80 backdrop-blur-sm border border-white/[0.08] rounded-2xl rounded-tl-sm shadow-xl overflow-hidden">
                    <div className="h-px w-full bg-gradient-to-r from-violet-500/50 via-cyan-500/30 to-transparent" />
                    <TypingDots />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* ── INPUT ── */}
      <div className="relative px-5 py-4 border-t border-white/[0.06] bg-gradient-to-t from-[#060910] to-transparent">
        {/* top glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

        <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
          <div className={cn(
            'flex-1 flex items-center gap-2 bg-[#0D1117] border-2 rounded-2xl px-4 py-2.5 transition-all duration-250 shadow-lg',
            isLoading
              ? 'border-white/[0.06]'
              : 'border-white/[0.08] focus-within:border-violet-500/60 focus-within:shadow-violet-900/30 focus-within:shadow-xl'
          )}>
            <Input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={isLoading ? 'Agents are working…' : 'Describe your goal or ask anything…'}
              disabled={isLoading}
              className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm font-medium text-white placeholder:text-slate-600 p-0 h-auto"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={cn(
              'w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all duration-200 shadow-lg',
              input.trim() && !isLoading
                ? 'bg-gradient-to-br from-violet-600 to-violet-700 text-white hover:from-violet-500 hover:to-violet-600 hover:scale-105 active:scale-95 shadow-violet-900/60 hover:shadow-violet-700/40'
                : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/[0.06]'
            )}
          >
            {isLoading
              ? <Loader2 size={16} className="animate-spin text-violet-400" />
              : <SendHorizontal size={16} />
            }
          </button>
        </form>

        {/* meta info */}
        <div className="flex items-center justify-center gap-2 mt-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-700 font-medium">{model}</span>
            <span className="text-slate-700">·</span>
            <span className="text-[10px] text-slate-700 font-medium capitalize">{flowMode}</span>
            {ragContext && (
              <>
                <span className="text-slate-700">·</span>
                <span className="text-[10px] text-cyan-500/70 font-semibold">PDF context active</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};