'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, FlowMode, GeminiModelId, RagContext } from '@/types';
import { Bot, Loader2, Sparkles, SendHorizontal, Copy, Check, RotateCcw, Paperclip } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  flowMode: FlowMode;
  model: GeminiModelId;
  ragContext: RagContext | null;
}

const SUGGESTIONS = [
  { label: 'Explain this concept simply', emoji: '💡' },
  { label: 'Write a custom React hook', emoji: '⚛️' },
  { label: 'Design a REST API schema', emoji: '🔌' },
  { label: 'Summarize my attached PDF', emoji: '📄' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      className="text-slate-400 hover:text-white hover:bg-white/10 h-6 w-6"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
    </Button>
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-card rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Live Session</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
            {flowMode}
          </Badge>
          {ragContext && (
            <>
              <div className="h-4 w-px bg-border" />
              <Badge className="text-[10px] font-bold px-2 py-0.5 rounded-full gap-1 bg-primary/10 text-primary border-0 hover:bg-primary/15">
                <Paperclip size={9} />
                PDF Active
              </Badge>
            </>
          )}
        </div>
        {messages.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={clearChat} className="text-muted-foreground hover:text-foreground">
                <RotateCcw size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs">Clear conversation</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-5 py-5">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center justify-center min-h-[380px] gap-7 text-center"
            >
              <div>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                  <Sparkles size={24} className="text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight mb-1.5">
                  Ready to help
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                  Agents are standing by. Choose a prompt below or describe your goal.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s.label}
                    onClick={() => handleSubmit(undefined, s.label)}
                    className="flex items-start gap-2.5 p-3.5 bg-card border border-border rounded-xl text-left hover:border-primary/30 hover:bg-accent/50 hover:shadow-sm transition-all duration-200 group"
                  >
                    <span className="text-base leading-none mt-0.5 flex-shrink-0">{s.emoji}</span>
                    <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">{s.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="messages" className="space-y-5 pb-2">
              {messages.map((m, idx) => (
                <motion.div
                  key={m.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn('flex gap-3', m.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                >
                  <Avatar className={cn('w-8 h-8 flex-shrink-0 mt-0.5 rounded-xl', m.role === 'user' ? 'bg-foreground' : 'bg-gradient-to-br from-primary to-primary/70 shadow-sm shadow-primary/20')}>
                    <AvatarFallback className={cn('text-xs font-bold rounded-xl', m.role === 'user' ? 'bg-foreground text-background' : 'bg-transparent text-primary-foreground')}>
                      {m.role === 'user' ? 'U' : <Bot size={14} />}
                    </AvatarFallback>
                  </Avatar>

                  <div className={cn('max-w-[80%] flex flex-col gap-1', m.role === 'user' ? 'items-end' : 'items-start')}>
                    <div className={cn(
                      'rounded-2xl overflow-hidden',
                      m.role === 'user'
                        ? 'bg-foreground text-background px-4 py-3 rounded-tr-sm'
                        : 'bg-card border border-border shadow-sm rounded-tl-sm w-full'
                    )}>
                      {m.role === 'user' ? (
                        <p className="text-sm leading-relaxed">{m.content}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none px-4 py-3.5
                          prose-headings:font-bold prose-headings:text-foreground
                          prose-p:text-foreground/80 prose-p:leading-relaxed
                          prose-strong:text-foreground prose-strong:font-semibold
                          prose-ul:my-2 prose-ol:my-2
                          prose-li:text-foreground/80
                          prose-blockquote:border-primary prose-blockquote:bg-accent/40 prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-blockquote:py-1
                        ">
                          <ReactMarkdown
                            components={{
                              code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                const codeText = String(children).replace(/\n$/, '');
                                return !inline && match ? (
                                  <div className="not-prose my-3.5 rounded-xl overflow-hidden border border-slate-800 shadow-md">
                                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                                      <div className="flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                          <span className="w-3 h-3 rounded-full bg-[#FF5F57] block" />
                                          <span className="w-3 h-3 rounded-full bg-[#FEBC2E] block" />
                                          <span className="w-3 h-3 rounded-full bg-[#28C840] block" />
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
                                      customStyle={{ margin: 0, borderRadius: 0, background: '#0D1117', fontSize: '0.78rem', lineHeight: '1.7', padding: '1rem 1.25rem' }}
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
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium px-1">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot size={14} className="text-primary-foreground" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm space-y-2">
                    <Skeleton className="h-3 w-48 rounded-full" />
                    <Skeleton className="h-3 w-36 rounded-full" />
                    <Skeleton className="h-3 w-56 rounded-full" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="px-5 py-4 border-t border-border bg-card/50 rounded-b-xl">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-background border-2 border-border rounded-xl px-4 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all duration-200 shadow-sm">
            <Input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={isLoading ? 'Agents are working…' : 'Describe your goal or ask anything…'}
              disabled={isLoading}
              className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm font-medium placeholder:text-muted-foreground/60 p-0 h-auto"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className={cn(
              'w-10 h-10 rounded-xl flex-shrink-0 transition-all duration-200 shadow-sm',
              input.trim() && !isLoading
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-primary/25'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <SendHorizontal size={16} />}
          </Button>
        </form>
        <p className="text-center text-[10px] text-muted-foreground/60 font-medium mt-2.5 tracking-wide">
          {model} · {flowMode}{ragContext ? ' · PDF context active' : ''}
        </p>
      </div>
    </div>
  );
};
