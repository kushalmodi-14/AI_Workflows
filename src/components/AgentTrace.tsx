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
    <div className="mt-4 border border-zinc-100 rounded-xl overflow-hidden bg-white shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 px-4 hover:bg-[#F4F9F5] transition-colors text-xs font-bold text-zinc-600 uppercase tracking-widest outline-none"
      >
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[#2E6F40]" />
          <span>Internal reasoning ({trace.length} steps)</span>
        </div>
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-zinc-50"
          >
            <div className="p-4 space-y-4 bg-zinc-50/30">
              {trace.map((step, idx) => (
                <div key={idx} className="space-y-2 border-l-2 border-[#2E6F40]/20 pl-4 ml-1">
                  <div className="flex items-center justify-between">
                    <AgentBadge agent={step.agent} size="sm" />
                    <span className="text-[9px] font-bold text-zinc-400">{new Date(step.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-medium lowercase italic">"{step.reasoning}"</p>
                  <pre className="text-[11px] text-zinc-700 bg-white border border-zinc-100 p-3 rounded-lg whitespace-pre-wrap max-h-40 overflow-y-auto font-mono shadow-inner">
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
