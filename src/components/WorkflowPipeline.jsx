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
    <section className="py-20 px-4 md:px-8 relative bg-slate-900 border-b border-slate-800">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-white mb-4">
          Experimental Workflow
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          End-to-end pipeline from raw genomic data ingestion to predictive in-silico validation of generated sequences.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center gap-y-10 gap-x-6 pb-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="flex items-center">
                <div
                  className="relative flex-shrink-0 w-44 h-36 flex flex-col items-center justify-center text-center bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors shadow-sm"
                >
                  <Icon className="w-8 h-8 text-indigo-400 mb-3" />
                  <span className="text-slate-300 font-medium text-sm px-2">
                    {step.name}
                  </span>
                </div>
                {/* Only show connector if not the last item, hidden on smaller screens where wrapping occurs */}
                {idx < steps.length - 1 && (
                  <div className="w-6 h-0.5 bg-slate-700 hidden lg:block ml-6"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}