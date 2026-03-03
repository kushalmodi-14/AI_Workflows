'use client';

import React from 'react';
import { 
  Undo2, Redo2, Bold, Italic, Underline, 
  Heading1, Heading2, Quote, List, ListOrdered 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const ToolbarButton = ({ 
  icon: Icon, 
  label, 
  onClick, 
  className,
  iconClassName 
}: { 
  icon: any; 
  label: string; 
  onClick?: () => void;
  className?: string;
  iconClassName?: string;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClick}
        className={cn(
          "h-9 w-9 rounded-lg transition-all duration-200 group active:scale-95",
          "hover:bg-white hover:shadow-md hover:ring-1 hover:ring-black/5",
          className
        )}
      >
        <Icon className={cn("h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110", iconClassName)} />
      </Button>
    </TooltipTrigger>
    <TooltipContent side="bottom" className="text-[10px] font-medium py-1 px-2">
      {label}
    </TooltipContent>
  </Tooltip>
);

export function Toolbar() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1.5 px-3 py-2 bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-black/[0.03] rounded-2xl w-fit">
        <ToolbarButton icon={Undo2} label="Undo" iconClassName="text-slate-500" />
        <ToolbarButton icon={Redo2} label="Redo" iconClassName="text-slate-500" />
        
        <Separator orientation="vertical" className="h-6 mx-1 opacity-50" />
        
        <ToolbarButton icon={Bold} label="Bold" iconClassName="text-vibrant-indigo" className="hover:text-indigo-600" />
        <ToolbarButton icon={Italic} label="Italic" iconClassName="text-vibrant-pink" className="hover:text-pink-600" />
        <ToolbarButton icon={Underline} label="Underline" iconClassName="text-vibrant-orange" className="hover:text-orange-600" />
        
        <Separator orientation="vertical" className="h-6 mx-1 opacity-50" />
        
        <ToolbarButton icon={Heading1} label="Heading 1" iconClassName="text-vibrant-cyan" className="hover:text-cyan-600" />
        <ToolbarButton icon={Heading2} label="Heading 2" iconClassName="text-vibrant-violet" className="hover:text-violet-600" />
        <ToolbarButton icon={Quote} label="Quote" iconClassName="text-slate-500" />
        
        <Separator orientation="vertical" className="h-6 mx-1 opacity-50" />
        
        <ToolbarButton icon={List} label="Bullet List" iconClassName="text-vibrant-indigo" />
        <ToolbarButton icon={ListOrdered} label="Numbered List" iconClassName="text-vibrant-indigo" />
      </div>
    </TooltipProvider>
  );
}
