'use client';

import React from 'react';
import { FlowMode } from '@/types';
import { motion } from 'framer-motion';
import { LayoutList, BrainCircuit } from 'lucide-react';

interface FlowSwitcherProps {
  mode: FlowMode;
  onChange: (mode: FlowMode) => void;
}

export const FlowSwitcher: React.FC<FlowSwitcherProps> = ({ mode, onChange }) => {
  return (
    <div className="flex p-1 bg-zinc-900/80 border border-zinc-800 rounded-2xl w-fit">
      <button
        onClick={() => onChange('sequential')}
        className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${mode === 'sequential' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
      >
        {mode === 'sequential' && (
          <motion.div layoutId="activeFlow" className="absolute inset-0 bg-indigo-600 rounded-xl" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
        )}
        <LayoutList size={16} className="relative z-10" />
        <span className="relative z-10">Sequential</span>
      </button>
      <button
        onClick={() => onChange('supervisor')}
        className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${mode === 'supervisor' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
      >
        {mode === 'supervisor' && (
          <motion.div layoutId="activeFlow" className="absolute inset-0 bg-indigo-600 rounded-xl" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
        )}
        <BrainCircuit size={16} className="relative z-10" />
        <span className="relative z-10">Supervisor</span>
      </button>
    </div>
  );
};
