'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function Document() {
  return (
    <article className="w-full max-w-4xl mx-auto bg-white min-h-[1100px] shadow-2xl shadow-black/[0.04] rounded-2xl border border-slate-100 p-16 md:p-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight mb-8">
          Course Of Treatment, Services Rendered, And The Progress Made By The Patient During Stay
        </h1>
      </header>

      <div className="space-y-8 text-lg text-slate-700 leading-relaxed font-normal">
        <p>
          The patient was admitted to residential treatment care for stabilization of mood and management of 
          <span className="font-semibold text-slate-900"> Disruptive Mood Dysregulation Disorder</span> and 
          <span className="font-semibold text-slate-900"> Generalized Anxiety Disorder (GAD)</span>. 
          The treatment plan included medication adjustments, therapy sessions targeting emotional regulation skills, 
          coping mechanisms, trauma processing, and family dynamics improvement.
        </p>

        <p>
          The patient was provided with home treatment recommendations for continued recovery.
        </p>

        <div className="py-2 px-6 border-l-4 border-vibrant-indigo bg-indigo-50/30 rounded-r-xl">
          <p className="italic">
            Initially prescribed Lexapro 10mg QAM for depression [T264072], the dosage was progressively 
            increased to 15mg QAM [T264073] and later to 20mg QAM [T264079]. Lamictal was introduced at 
            25mg QAM with a titration schedule up to therapeutic dosing of 200mg QAM and additional evening 
            doses reaching up to 150mg QHS [T264084]. Hydroxyzine PRN at a dose of 50mg BID was added for 
            breakthrough worry/acute agitation/sleep maintenance [T264075].
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-vibrant-indigo" />
            Throughout her stay:
          </h2>
          <ul className="space-y-4 ml-2">
            {[
              "The patient's progress included relative improvements in anxiety symptoms (\"my anxiety is not so strong\" - T264081)",
              "Better identification of emotions (\"I can catch it quicker\" - T264081)",
              "Reduced frequency of panic attacks during clinical observation.",
              "Increased engagement in collaborative treatment planning."
            ].map((item, i) => (
              <li key={i} className="flex gap-4 items-start group">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-vibrant-pink flex-shrink-0 transition-transform group-hover:scale-150 group-hover:bg-vibrant-orange animate-pulse" />
                <span className="group-hover:text-slate-950 transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
