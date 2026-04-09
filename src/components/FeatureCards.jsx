"use client";

export default function FeatureCards() {
  const features = [
    {
      title: "DNA Dataset Input",
      desc: "Upload and preprocess FASTA/GenBank datasets with quality validation and metadata extraction.",
      color: "cyan",
      icon: "📤"
    },
    {
      title: "Sequence Tokenization",
      desc: "Byte-pair encoding tokenizer trained on regulatory DNA sequences for diffusion model input.",
      color: "blue",
      icon: "🔢"
    },
    {
      title: "Diffusion Model Training",
      desc: "DDPM architecture trained on 100k+ promoter sequences with noise scheduling optimization.",
      color: "purple",
      icon: "🧠"
    },
    {
      title: "Regulatory Pattern Learning",
      desc: "Attention-based motif discovery and positional encoding for transcription factor binding.",
      color: "pink",
      icon: "🎯"
    },
    {
      title: "Synthetic DNA Generation",
      desc: "Generate novel regulatory sequences with controlled strength and tissue-specific expression.",
      color: "emerald",
      icon: "🧬"
    }
  ];

  return (
    <section className="py-24 px-8 relative overflow-hidden bg-gradient-to-br from-slate-900/50 via-[#0b0f19]/50 to-slate-900/50 border-t border-gray-800/50 backdrop-blur-xl">
      {/* Futuristic grid background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[linear-gradient(90deg,rgba(103,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(103,255,255,0.08)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight mb-6">
            Platform Features
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full shadow-glow"></div>
        </div>

        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-20 leading-relaxed opacity-90">
          Complete AI-powered pipeline for synthetic regulatory DNA design using diffusion models.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`group p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 hover:border-${feature.color}-400/50 hover:shadow-2xl hover:shadow-${feature.color}-500/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden glass cyber-glow animate-float`}
              style={{ '--glow-color': `rgba(var(--color-${feature.color === 'cyan' ? 'neon-cyan' : feature.color === 'blue' ? 'accent-blue' : feature.color === 'purple' ? 'neon-purple' : feature.color === 'pink' ? 'neon-pink' : 'emerald'}), 0.5)` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-[var(--color-accent-${feature.color === 'cyan' ? 'cyan' : feature.color === 'blue' ? 'blue' : feature.color === 'purple' ? 'purple' : feature.color === 'pink' ? 'pink' : 'emerald'})]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4 group-hover:animate-bounce">
                  <span className={`bg-gradient-to-r from-[var(--color-accent-${feature.color === 'cyan' ? 'cyan' : feature.color === 'blue' ? 'blue' : feature.color === 'purple' ? 'purple' : feature.color === 'pink' ? 'pink' : 'emerald'})] to-transparent bg-clip-text text-transparent p-2 rounded-xl shadow-lg shadow-[var(--color-accent-${feature.color === 'cyan' ? 'cyan' : feature.color === 'blue' ? 'blue' : feature.color === 'purple' ? 'purple' : feature.color === 'pink' ? 'pink' : 'emerald'})]/30`}>
                    {feature.icon}
                  </span>
                </div>
                <h3 className={`text-2xl font-bold text-white mb-4 group-hover:text-[var(--color-accent-${feature.color === 'cyan' ? 'cyan' : feature.color === 'blue' ? 'blue' : feature.color === 'purple' ? 'purple' : feature.color === 'pink' ? 'pink' : 'emerald'})]-300 transition-colors duration-300 relative z-10`}>{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed relative z-10">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
