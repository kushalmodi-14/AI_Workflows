'use client';

import React from 'react';
import { GEMINI_MODELS, GeminiModelId } from '@/types';
import { Box } from 'lucide-react';

interface ModelSelectorProps {
  value: GeminiModelId;
  onChange: (id: GeminiModelId) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="relative inline-flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-2xl px-3 py-1.5 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
      <Box size={14} className="text-zinc-500" />
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value as GeminiModelId)}
        className="bg-transparent text-sm text-zinc-300 font-medium outline-none cursor-pointer pr-2 appearance-none"
      >
        {GEMINI_MODELS.map((model) => (
          <option key={model.id} value={model.id} className="bg-zinc-950 text-white">
            {model.label}
          </option>
        ))}
      </select>
    </div>
  );
};
