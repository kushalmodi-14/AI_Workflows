'use client';

import React, { useState } from 'react';
import { AgentTraceStep } from '@/types';
import { AgentBadge } from './AgentBadge';
import { ChevronDown, ChevronRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentTraceProps {
  trace: AgentTraceStep[];
}

export const AgentTrace: React.FC<AgentTraceProps> = ({ trace }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!trace || trace.length === 0) return null;

  return (
    <div className="mt-4 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50 backdrop-blur-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 px-4 hover:bg-zinc-800 transition-colors text-sm text-zinc-400"
      >
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-zinc-500" />
          <span>Agent Trace ({trace.length} steps)</span>
        </div>
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-zinc-800"
          >
            <div className="p-4 space-y-4">
              {trace.map((step, idx) => (
                <div key={idx} className="space-y-2 border-l-2 border-zinc-800 pl-4 ml-1">
                  <div className="flex items-center justify-between">
                    <AgentBadge agent={step.agent} size="sm" />
                    <span className="text-[10px] text-zinc-600">{new Date(step.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-zinc-500 italic">"{step.reasoning}"</p>
                  <pre className="text-xs text-zinc-300 bg-black/40 p-2 rounded-lg whitespace-pre-wrap max-h-40 overflow-y-auto font-mono">
                    {step.output}
                  </pre>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
