"use client";

import { Database, Code, Cpu, LineChart, Dna } from "lucide-react";

export default function FeatureCards() {
  const features = [
    {
      title: "Genomic Dataset Processing",
      desc: "Robust preprocessing of FASTA/GenBank formats with stringent quality controls.",
      icon: Database
    },
    {
      title: "Regulatory Tokenization",
      desc: "Byte-pair encoding (BPE) specifically trained on promoter and enhancer sequences.",
      icon: Code
    },
    {
      title: "Diffusion Architecture",
      desc: "Denoising diffusion probabilistic models (DDPMs) tuned with biological constraints.",
      icon: Cpu
    },
    {
      title: "Motif Analysis",
      desc: "Attention-based discovery of active transcription factor binding sites.",
      icon: LineChart
    },
    {
      title: "In-Silico Validation",
      desc: "Predicting expression profiles and regulatory strength of synthesized elements.",
      icon: Dna
    }
  ];

  return (
    <section className="py-24 px-8 relative bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Pipeline Architecture
          </h2>
          <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="p-8 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-500 transition-colors duration-300 text-left"
              >
                <div className="mb-6 inline-flex p-3 rounded-lg bg-indigo-600/10 text-indigo-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
