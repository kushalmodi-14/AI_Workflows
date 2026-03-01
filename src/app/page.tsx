'use client';

import React, { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { FlowSwitcher } from '@/components/FlowSwitcher';
import { ModelSelector } from '@/components/ModelSelector';
import { RagUploader } from '@/components/RagUploader';
import { FlowMode, GeminiModelId, RagContext } from '@/types';
import { Bot, Info } from 'lucide-react';

export default function Home() {
  const [flowMode, setFlowMode] = useState<FlowMode>('sequential');
  const [model, setModel] = useState<GeminiModelId>('gemini-2.0-flash');
  const [ragContext, setRagContext] = useState<RagContext | null>(null);

  // Sync state from sessionStorage on mount
  useEffect(() => {
    const savedFlow = sessionStorage.getItem('flow-mode');
    const savedModel = sessionStorage.getItem('selected-model');
    const savedRag = sessionStorage.getItem('rag-context');

    if (savedFlow) setFlowMode(savedFlow as FlowMode);
    if (savedModel) setModel(savedModel as GeminiModelId);
    if (savedRag) setRagContext(JSON.parse(savedRag));
  }, []);

  // Save state to sessionStorage
  useEffect(() => sessionStorage.setItem('flow-mode', flowMode), [flowMode]);
  useEffect(() => sessionStorage.setItem('selected-model', model), [model]);
  useEffect(() => {
    if (ragContext) sessionStorage.setItem('rag-context', JSON.stringify(ragContext));
    else sessionStorage.removeItem('rag-context');
  }, [ragContext]);

  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-200">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 h-screen flex flex-col gap-8">
        {/* Nav / Controls */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-zinc-800/50">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
               <Bot className="text-white" size={24} />
             </div>
             <div>
               <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                 AI Agent Workflow Sandbox
               </h1>
               <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium mt-0.5">
                  <span>Sequential Flow</span>
                  <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                  <span>Supervisor Orchestration</span>
                  <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                  <span>RAG Support</span>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <ModelSelector value={model} onChange={setModel} />
             <FlowSwitcher mode={flowMode} onChange={setFlowMode} />
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row gap-8 overflow-hidden">
          {/* Left Sidebar: Settings & Context */}
          <aside className="w-full md:w-80 flex flex-col gap-6 shrink-0">
             {/* RAG Section */}
             <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Document Context</h3>
                   <div className="group relative">
                      <Info size={12} className="text-zinc-600 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-zinc-800 text-[10px] text-zinc-400 rounded-lg shadow-xl border border-zinc-700 z-50">
                        Content is extracted and sent to the models to provide factual context. No server storage.
                      </div>
                   </div>
                </div>
                <RagUploader 
                  currentContext={ragContext}
                  onUploadSuccess={setRagContext}
                  onClear={() => setRagContext(null)}
                />
             </div>

             <div className="flex-1 rounded-3xl border border-zinc-800/50 bg-zinc-900/40 p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Flow Details</h3>
                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-zinc-300">
                        {flowMode === 'sequential' ? 'Linear Pipeline' : 'Dynamic Orchestrator'}
                      </p>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        {flowMode === 'sequential' 
                          ? 'Prompt flows through Search, Code, and Synthesis agents in a fixed order.'
                          : 'A supervisor LLM analyzes your request and routes it to the most relevant specialized agents.'
                        }
                      </p>
                   </div>
                   
                   <div className="pt-4 border-t border-zinc-800/50 space-y-3">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                         <span className="text-[10px] font-medium text-zinc-400">Search Agent v1.0</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                         <span className="text-[10px] font-medium text-zinc-400">Code Agent v1.0</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                         <span className="text-[10px] font-medium text-zinc-400">Summarize Agent v1.0</span>
                      </div>
                   </div>
                </div>
             </div>
          </aside>

          {/* Right Area: Large Chat Box */}
          <div className="flex-1 h-full min-h-[500px]">
            <ChatInterface 
              flowMode={flowMode}
              model={model}
              ragContext={ragContext}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
