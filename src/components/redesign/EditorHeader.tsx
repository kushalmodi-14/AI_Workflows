'use client';

import React from 'react';
import { ChevronDown, BookOpen, Save, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function EditorHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 w-full max-w-6xl mx-auto">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 group cursor-pointer px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
            <span className="text-xs font-bold text-slate-500 group-hover:text-primary transition-colors">🕒</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-700">Version 28</span>
              <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="rounded-xl border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:shadow transition-all gap-2 px-4 h-9">
          <BookOpen size={15} className="text-vibrant-indigo" />
          <span className="text-xs font-semibold text-slate-600">References</span>
          <Badge variant="secondary" className="bg-slate-100 text-slate-500 rounded-lg px-1.5 h-5 min-w-[20px] flex items-center justify-center text-[10px] font-bold">13</Badge>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-xl border-slate-200 bg-white hover:bg-slate-50 transition-all gap-2 px-4 h-9 group active:scale-95"
        >
          <Save size={15} className="text-vibrant-cyan group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-700">Save</span>
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="rounded-xl bg-slate-900 border-none hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all gap-2 px-4 h-9 group active:scale-95"
        >
          <Mic size={15} className="text-white group-hover:animate-pulse" />
          <span className="text-xs font-bold text-white">Voice</span>
        </Button>
      </div>
    </header>
  );
}
