"use client";

import Link from 'next/link';
import MolViewer from './MolViewer';
import { Vortex } from './ui/vortex';

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-88px)] overflow-hidden border-b border-slate-800 bg-slate-950">
      <Vortex
        backgroundColor="#020617"
        rangeY={650}
        particleCount={280}
        baseHue={165}
        className="grid min-h-[calc(100vh-88px)] grid-cols-1 items-center gap-10 px-6 py-16 md:px-10 lg:grid-cols-2 lg:px-12"
      >
        <div className="text-center lg:text-left relative z-10 w-full max-w-3xl mx-auto lg:mx-0">
          <p className="mb-4 inline-flex rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-200">
            AI-powered synthetic biology
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white mb-5">
            Design Synthetic Regulatory DNA With Diffusion Models
          </h1>
          <p className="text-sm md:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-7">
            Generate, analyze, and validate DNA sequences with molecular workflows built for research teams.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-colors duration-200 text-sm">
              Launch Dashboard
            </Link>
            <Link href="/dashboard/dna-generator" className="border border-slate-600 bg-slate-950/40 hover:bg-slate-900/80 text-slate-200 hover:text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 text-sm">
              Generate Sample Sequence
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
            {[
              ["2,847", "Sequences generated"],
              ["94.2%", "Model accuracy"],
              ["1,203", "Motifs detected"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-slate-700/70 bg-slate-950/45 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex justify-center items-center">
          <div className="w-full max-w-md aspect-square rounded-full border border-emerald-400/20 relative bg-slate-950/60 shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-emerald-500/10 backdrop-blur-sm">
            <MolViewer className="w-full h-full" pdbId="1BNA" />
          </div>
        </div>
      </Vortex>
    </section>
  );
}
