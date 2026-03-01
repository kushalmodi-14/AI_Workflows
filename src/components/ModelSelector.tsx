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
import { Cpu } from 'lucide-react';

interface ModelSelectorProps {
  value: GeminiModelId;
  onChange: (id: GeminiModelId) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as GeminiModelId)}>
      <SelectTrigger className="w-full h-auto py-2.5 px-3 rounded-xl border-border bg-muted/50 hover:bg-muted focus:ring-2 focus:ring-ring/40 focus:border-ring transition-all">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Cpu size={13} className="text-primary-foreground" />
          </div>
          <div className="flex flex-col items-start min-w-0">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Model</span>
            <SelectValue placeholder="Select model" className="text-xs font-bold text-foreground truncate" />
          </div>
        </div>
      </SelectTrigger>
      <SelectContent className="rounded-xl border-border shadow-xl">
        {GEMINI_MODELS.map((model) => (
          <SelectItem
            key={model.id}
            value={model.id}
            className="text-sm font-medium rounded-lg cursor-pointer focus:bg-accent focus:text-accent-foreground"
          >
            {model.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
