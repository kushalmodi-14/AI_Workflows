'use client';

import React, { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { FlowSwitcher } from '@/components/FlowSwitcher';
import { ModelSelector } from '@/components/ModelSelector';
import { RagUploader } from '@/components/RagUploader';
import { FlowMode, GeminiModelId, RagContext } from '@/types';
import { Bot, Search, Code2, PenLine, Activity, Layers3, BrainCircuit, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const NODES = [
  { id: 'search', label: 'Research', desc: 'Gathers facts & data', icon: Search, colorClass: 'text-sky-500 bg-sky-50 border-sky-200' },
  { id: 'code', label: 'Technical', desc: 'Writes code & blueprints', icon: Code2, colorClass: 'text-violet-500 bg-violet-50 border-violet-200' },
  { id: 'summarize', label: 'Synthesis', desc: 'Polishes final output', icon: PenLine, colorClass: 'text-primary bg-primary/10 border-primary/20' },
];

const SidebarSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] px-1">{title}</p>
    {children}
  </div>
);

export default function Home() {
  const [flowMode, setFlowMode] = useState<FlowMode>('sequential');
  const [model, setModel] = useState<GeminiModelId>('gemini-2.0-flash');
  const [ragContext, setRagContext] = useState<RagContext | null>(null);

  useEffect(() => {
    const savedFlow = sessionStorage.getItem('flow-mode');
    const savedModel = sessionStorage.getItem('selected-model');
    const savedRag = sessionStorage.getItem('rag-context');
    if (savedFlow) setFlowMode(savedFlow as FlowMode);
    if (savedModel) setModel(savedModel as GeminiModelId);
    if (savedRag) setRagContext(JSON.parse(savedRag));
  }, []);

  useEffect(() => sessionStorage.setItem('flow-mode', flowMode), [flowMode]);
  useEffect(() => sessionStorage.setItem('selected-model', model), [model]);
  useEffect(() => {
    if (ragContext) sessionStorage.setItem('rag-context', JSON.stringify(ragContext));
    else sessionStorage.removeItem('rag-context');
  }, [ragContext]);

  return (
    <main className="h-screen w-full bg-muted/40 flex overflow-hidden p-3 gap-3">

      <aside className="w-[288px] xl:w-[308px] flex-shrink-0 flex flex-col gap-3 overflow-y-auto no-scrollbar">

        <Card className="py-0 gap-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-md shadow-primary/20 flex-shrink-0">
                <Bot size={20} className="text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-base font-black text-foreground leading-none tracking-tight">
                  Zen<span className="text-primary">Flow</span>
                </h1>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">Agentic Sandbox</p>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-[10px] font-bold gap-1 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                LIVE
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0 gap-0">
          <CardContent className="p-4 space-y-4">

            <SidebarSection title="AI Model">
              <ModelSelector value={model} onChange={setModel} />
            </SidebarSection>

            <Separator />

            <SidebarSection title="Workflow Mode">
              <FlowSwitcher mode={flowMode} onChange={setFlowMode} />
              <div className="flex items-start gap-2.5 p-3 bg-accent/40 rounded-xl border border-border mt-1">
                {flowMode === 'sequential'
                  ? <Layers3 size={13} className="text-primary mt-0.5 flex-shrink-0" />
                  : <BrainCircuit size={13} className="text-primary mt-0.5 flex-shrink-0" />
                }
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {flowMode === 'sequential'
                    ? 'Runs Research → Technical → Synthesis in a fixed chain.'
                    : 'Supervisor LLM picks the best agents dynamically based on intent.'}
                </p>
              </div>
            </SidebarSection>

          </CardContent>
        </Card>

        <Card className="py-0 gap-0">
          <CardContent className="p-4">
            <SidebarSection title="Knowledge Context">
              <RagUploader
                currentContext={ragContext}
                onUploadSuccess={setRagContext}
                onClear={() => setRagContext(null)}
              />
            </SidebarSection>
          </CardContent>
        </Card>

        <Card className="py-0 gap-0 flex-1">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Execution Nodes</span>
              <div className="flex items-center gap-1 text-primary">
                <Activity size={11} />
                <span className="text-[10px] font-bold text-primary">3 Online</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {NODES.map((node, idx) => {
              const Icon = node.icon;
              return (
                <Tooltip key={node.id}>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border cursor-default transition-colors hover:shadow-sm',
                      node.colorClass.split(' ').slice(1).join(' ')
                    )}>
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center border bg-white/70', node.colorClass.split(' ')[2])}>
                        <Icon size={13} className={node.colorClass.split(' ')[0]} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground">{node.label}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{node.desc}</p>
                      </div>
                      <div className={cn(
                        'w-1.5 h-1.5 rounded-full flex-shrink-0',
                        flowMode === 'sequential' && idx > 0 ? 'bg-muted-foreground/30' : 'bg-primary animate-pulse'
                      )} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    {node.desc}
                  </TooltipContent>
                </Tooltip>
              );
            })}

            <div className="mt-2 p-3 rounded-xl bg-primary/5 border border-primary/15 flex items-center gap-2">
              <Zap size={12} className="text-primary flex-shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Session-only · No data stored · Powered by <span className="font-bold text-foreground">Gemini</span>
              </p>
            </div>
          </CardContent>
        </Card>

      </aside>

      <section className="flex-1 min-w-0 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
          <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full bg-primary/4 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-[300px] h-[300px] rounded-full bg-sky-500/3 blur-3xl" />
        </div>

        <Card className="relative z-10 h-full py-0 gap-0 shadow-sm overflow-hidden rounded-xl">
          <ChatInterface flowMode={flowMode} model={model} ragContext={ragContext} />
        </Card>
      </section>

    </main>
  );
}
