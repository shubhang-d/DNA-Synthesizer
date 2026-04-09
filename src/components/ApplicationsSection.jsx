 "use client";

import SplineViewer from './SplineViewer';

export default function ApplicationsSection() {
  return (
    <section className="py-24 px-8 relative overflow-hidden bg-gradient-to-br from-slate-900/50 via-[#0b0f19]/50 to-slate-900/50 border-t border-gray-800/50 backdrop-blur-xl">
      {/* Futuristic grid background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[linear-gradient(90deg,rgba(103,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(103,255,255,0.08)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>
      
      {/* Subtle glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5"></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Title */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight mb-6">
            Applications of AI-Designed Regulatory DNA
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full shadow-glow"></div>
        </div>

        {/* Description */}
        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-20 leading-relaxed opacity-90">
          AI-generated regulatory DNA sequences enable precise <span className="text-cyan-400 font-semibold">gene expression optimization</span>, advanced <span className="text-purple-400 font-semibold">synthetic biology circuits</span>, and revolutionary <span className="text-pink-400 font-semibold">bioinformatics applications</span>. 
          Our diffusion models create novel promoter architectures for metabolic engineering, gene therapy, and cellular reprogramming.
        </p>

        {/* Centered Spline Carousel */}
        <div className="max-w-4xl mx-auto w-full h-[500px] md:h-[600px] lg:h-[700px] relative">
          <SplineViewer />
        </div>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="group p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-2xl font-bold text-white mb-4 relative z-10 group-hover:text-cyan-300">Gene Therapy</h3>
            <p className="text-gray-400 leading-relaxed relative z-10">Precise promoter control for viral vector design and therapeutic transgene expression.</p>
          </div>
          <div className="group p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-2xl font-bold text-white mb-4 relative z-10 group-hover:text-purple-300">Metabolic Engineering</h3>
            <p className="text-gray-400 leading-relaxed relative z-10">Optimize biosynthetic pathways with tunable regulatory strength across cell types.</p>
          </div>
          <div className="group p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 hover:border-pink-400/50 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className="text-2xl font-bold text-white mb-4 relative z-10 group-hover:text-pink-300">CRISPR Circuits</h3>
            <p className="text-gray-400 leading-relaxed relative z-10">Synthetic promoters for logic gates and feedback control in gene editing workflows.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

