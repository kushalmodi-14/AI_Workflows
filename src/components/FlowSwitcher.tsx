'use client';

import React from 'react';
import { FlowMode } from '@/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers3, BrainCircuit } from 'lucide-react';

interface FlowSwitcherProps {
  mode: FlowMode;
  onChange: (mode: FlowMode) => void;
}

export const FlowSwitcher: React.FC<FlowSwitcherProps> = ({ mode, onChange }) => {
  return (
    <Tabs value={mode} onValueChange={(v) => onChange(v as FlowMode)} className="w-full">
      <TabsList className="w-full h-auto p-1 bg-muted rounded-xl grid grid-cols-2 gap-1">
        <TabsTrigger
          value="sequential"
          className="flex flex-col items-center gap-1 py-2.5 px-3 h-auto rounded-lg text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
        >
          <Layers3 size={15} />
          <span className="font-semibold">Sequential</span>
        </TabsTrigger>
        <TabsTrigger
          value="supervisor"
          className="flex flex-col items-center gap-1 py-2.5 px-3 h-auto rounded-lg text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
        >
          <BrainCircuit size={15} />
          <span className="font-semibold">Supervisor</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
