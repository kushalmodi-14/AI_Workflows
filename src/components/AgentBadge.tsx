import React from 'react';
import { AgentType } from '@/types';
import { Search, Code, FileText, Bot } from 'lucide-react';

interface AgentBadgeProps {
  agent: AgentType;
  size?: 'sm' | 'md';
}

export const AgentBadge: React.FC<AgentBadgeProps> = ({ agent, size = 'md' }) => {
  const isSm = size === 'sm';
  
  const config = {
    search: { icon: Search, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Search' },
    code: { icon: Code, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', label: 'Code' },
    summarize: { icon: FileText, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Summarize' },
  };

  const { icon: Icon, color, label } = config[agent];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${color} ${isSm ? 'text-[10px] px-1.5' : ''}`}>
      <Icon size={isSm ? 10 : 12} />
      {label}
    </span>
  );
};
