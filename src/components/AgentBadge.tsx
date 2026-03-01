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
    search: { icon: Search, color: 'bg-[#2E6F40]/10 text-[#2E6F40] border-[#2E6F40]/20', label: 'Search' },
    code: { icon: Code, color: 'bg-emerald-100 text-[#2E6F40] border-emerald-200', label: 'Code' },
    summarize: { icon: FileText, color: 'bg-emerald-50 text-emerald-800 border-emerald-100', label: 'Summarize' },
  };

  const { icon: Icon, color, label } = config[agent];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium ${color} ${isSm ? 'text-[10px] px-1.5' : ''}`}>
      <Icon size={isSm ? 10 : 12} />
      {label}
    </span>
  );
};
