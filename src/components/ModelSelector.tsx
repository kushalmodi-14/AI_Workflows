'use client';

import React from 'react';
import { GEMINI_MODELS, GeminiModelId } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Cpu, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModelSelectorProps {
  value: GeminiModelId;
  onChange: (id: GeminiModelId) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as GeminiModelId)}>
      <SelectTrigger
        className={cn(
          'w-full h-auto py-3 px-3.5 rounded-2xl border-2 bg-white/[0.03] border-white/[0.08]',
          'hover:bg-white/[0.05] hover:border-violet-500/40',
          'focus:ring-0 focus:border-violet-500/60 focus:shadow-lg focus:shadow-violet-900/20',
          'transition-all duration-250 group',
          '[&>svg]:hidden' // hide default chevron
        )}
      >
        <div className="flex items-center gap-3 min-w-0 w-full">
          {/* Icon */}
          <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shadow-md shadow-violet-900/40">
            <Cpu size={13} className="text-white" />
          </div>

          {/* Label */}
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Model</span>
            <SelectValue
              placeholder="Select model"
              className="text-xs font-bold text-white truncate"
            />
          </div>

          {/* Custom chevron */}
          <ChevronDown
            size={13}
            className="flex-shrink-0 text-slate-600 group-hover:text-slate-400 group-data-[state=open]:rotate-180 transition-all duration-200"
          />
        </div>
      </SelectTrigger>

      <SelectContent className="rounded-2xl border border-white/[0.09] bg-[#0A0E1A]/95 backdrop-blur-xl shadow-2xl shadow-black/60 p-1.5">
        {GEMINI_MODELS.map((model, i) => (
          <SelectItem
            key={model.id}
            value={model.id}
            className={cn(
              'text-sm font-semibold rounded-xl cursor-pointer py-2.5 px-3 my-0.5',
              'text-slate-300 focus:text-white',
              'focus:bg-gradient-to-r focus:from-violet-600/25 focus:to-violet-500/10',
              'data-[state=checked]:text-violet-300 data-[state=checked]:bg-violet-500/10',
              'transition-all duration-150',
              '[&>span:first-child]:hidden' // hide checkmark container for custom styling
            )}
          >
            <div className="flex items-center gap-2.5 pl-0">
              <div className={cn(
                'w-1.5 h-1.5 rounded-full flex-shrink-0',
                model.id === value ? 'bg-violet-400' : 'bg-slate-700'
              )} />
              {model.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
