'use client';

import React from 'react';
import { Toolbar } from '@/components/redesign/Toolbar';
import { EditorHeader } from '@/components/redesign/EditorHeader';
import { Document } from '@/components/redesign/Document';

export default function RedesignPage() {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col items-center overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-100/40 blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-cyan-100/30 blur-[100px]" />
        <div className="absolute top-[20%] left-[10%] w-[20%] h-[20%] rounded-full bg-pink-100/20 blur-[80px]" />
      </div>

      <div className="w-full sticky top-0 z-50 bg-white/60 backdrop-blur-md border-b border-white/40">
        <EditorHeader />
      </div>

      <main className="flex-1 w-full flex flex-col items-center py-12 px-6">      
         <div className="sticky top-24 z-40 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <Toolbar />
        </div>

        <div className="w-full relative px-2 md:px-0">
          <Document />
        </div>

        <footer className="mt-12 mb-20 text-slate-400 text-[10px] font-medium tracking-widest uppercase">
          Cloud Synchronized · Premium Editor Experience
        </footer>
      </main>
    </div>
  );
}
