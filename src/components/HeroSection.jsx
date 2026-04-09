"use client";

import { useEffect, useState } from 'react';
import MolViewer from './MolViewer';

export default function HeroSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 py-12 px-8 relative bg-slate-900 border-b border-slate-800">
      <div className="text-center lg:text-left relative z-10 w-full max-w-2xl mx-auto lg:mx-0">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white mb-4">
          Designing Synthetic Regulatory DNA Elements
        </h1>
        <p className="text-sm md:text-base text-indigo-400 uppercase tracking-widest font-semibold mb-4">
          Using DNA Diffusion Models
        </p>
        <p className="text-sm md:text-base text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-6">
          A computational framework leveraging deep generative models to design novel, highly specific genomic regulatory sequences. Advance synthetic biology with scalable in-silico generation.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-colors duration-200 text-sm">
            Access Dashboard
          </button>
          <button className="border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 text-sm">
            View Research Paper
          </button>
        </div>
      </div>

      <div className="hidden lg:flex justify-center items-center">
        <div className="w-full max-w-md aspect-square rounded-full border border-slate-700 relative bg-[#0F172A] shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-indigo-900/20">
          <MolViewer className="w-full h-full" pdbId="1BNA" />
        </div>
      </div>
    </section>
  );
}