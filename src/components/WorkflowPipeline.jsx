"use client";

import {
  Database,
  Code,
  Cpu,
  Wifi,
  Box,
  Activity
} from "lucide-react";

const steps = [
  { name: "DNA Dataset Input", icon: Database },
  { name: "Sequence Tokenization", icon: Code },
  { name: "Diffusion Model Training", icon: Cpu },
  { name: "Regulatory Pattern Learning", icon: Wifi },
  { name: "Synthetic DNA Generation", icon: Box },
  { name: "Expression Prediction", icon: Activity }
];

export default function WorkflowPipeline() {
  return (
    <section className="py-20 px-8 relative">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
          How the DNA Diffusion Model Works
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Track the end-to-end pipeline from raw genomic data to predictive
          regulatory insights.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-8 overflow-x-auto">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.name}
              className="relative flex-shrink-0 w-52 h-40 flex flex-col items-center justify-center text-center bg-[#111827]/70 backdrop-blur-lg rounded-3xl border border-transparent group hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 transform hover:scale-105"
            >
              {/* gradient border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 bg-clip-border opacity-0 group-hover:opacity-100 animate-border-glow"></div>
              <Icon className="w-8 h-8 text-cyan-300 mb-3 group-hover:text-white transition-colors duration-300" />
              <span className="text-gray-200 font-semibold text-sm">
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* connectors */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="connectorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ffff" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          {steps.map((_, i) => {
            if (i === steps.length - 1) return null;
            return (
              <line
                key={`line-${i}`}
                x1={`${(i + 0.5) * (100 / steps.length)}%`}
                y1="50%"
                x2={`${(i + 1) * (100 / steps.length)}%`}
                y2="50%"
                stroke="url(#connectorGrad)"
                strokeWidth="4"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            );
          })}
        </svg>
      </div>
    </section>
  );
}