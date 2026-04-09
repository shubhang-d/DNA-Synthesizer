import React from 'react';
import FeatureCard from './FeatureCard';

const features = [
  {
    title: 'DNA Dataset Input',
    description: 'Upload FASTA/GenBank datasets with automated quality validation and metadata extraction for training.',
    icon: '📊'
  },
  {
    title: 'Sequence Tokenization',
    description: 'Specialized BPE tokenizer optimized for DNA sequences and regulatory motif preservation.',
    icon: '🔗'
  },
  {
    title: 'Diffusion Model Training',
    description: 'DDPM architecture trained on 100k+ promoter sequences with advanced noise scheduling.',
    icon: '🧠'
  },
  {
    title: 'Regulatory Pattern Learning',
    description: 'Attention-based motif discovery for transcription factor binding site prediction.',
    icon: '🔬'
  },
  {
    title: 'Synthetic DNA Generation',
    description: 'Generate novel regulatory sequences with precise control over expression strength.',
    icon: '🧬'
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 md:px-8 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-slate-800/50">
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-grid-cyan/10" />
      </div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight mb-6">
            Platform Features
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Complete end-to-end pipeline for AI-driven synthetic regulatory DNA design
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
