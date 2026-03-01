'use client';

import React from 'react';
import { FlowMode } from '@/types';
import { Layers3, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlowSwitcherProps {
  mode: FlowMode;
  onChange: (mode: FlowMode) => void;
}

const MODES: { value: FlowMode; label: string; Icon: React.ElementType; description: string; accent: string }[] = [
  {
    value: 'sequential',
    label: 'Sequential',
    Icon: Layers3,
    description: 'Step-by-step',
    accent: 'from-violet-600 to-violet-500',
  },
  {
    value: 'supervisor',
    label: 'Supervisor',
    Icon: BrainCircuit,
    description: 'Orchestrated',
    accent: 'from-cyan-600 to-cyan-500',
  },
];

export const FlowSwitcher: React.FC<FlowSwitcherProps> = ({ mode, onChange }) => {
  return (
    <div className="flex gap-2 p-1.5 bg-white/[0.03] rounded-2xl border border-white/[0.06]">
      {MODES.map(({ value, label, Icon, description, accent }) => {
        const isActive = mode === value;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={cn(
              'relative flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-250 group',
              isActive
                ? 'text-white shadow-lg'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
            )}
          >
            {/* Active background */}
            {isActive && (
              <div className={cn('absolute inset-0 rounded-xl bg-gradient-to-br opacity-100', accent)} />
            )}
            {/* Active glow */}
            {isActive && (
              <div className={cn('absolute inset-0 rounded-xl bg-gradient-to-br blur-md -z-10 opacity-50', accent)} />
            )}

            <Icon
              size={15}
              className={cn(
                'relative z-10 transition-transform duration-200',
                isActive ? 'text-white' : 'group-hover:scale-110'
              )}
            />
            <div className="relative z-10 text-center">
              <span className={cn(
                'block text-[11px] font-bold leading-none',
                isActive ? 'text-white' : 'text-slate-400'
              )}>
                {label}
              </span>
              <span className={cn(
                'block text-[9px] font-medium mt-0.5',
                isActive ? 'text-white/70' : 'text-slate-600'
              )}>
                {description}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};