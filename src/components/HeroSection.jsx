"use client";

import { useEffect, useState } from 'react';
import DNAHelixSpline from './DNAHelixSpline';


export default function HeroSection() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // generate random particle data on client only
    const arr = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 2}s`
    }));
    setParticles(arr);
  }, []);
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 py-12 px-6 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-[65vh]">
      {/* Clean gradient background - no blur effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
      
      {/* Glowing grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
      </div>
      
      {/* Subtle particle stars */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="text-center lg:text-left relative z-10">
        <h1 className="text-3xl md:text-4xl lg:text-4xl font-semibold leading-tight tracking-tight max-w-lg bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          AI-Driven Synthetic Regulatory DNA Design
        </h1>
        <p className="text-sm md:text-base text-gray-300 max-w-md mx-auto lg:mx-0 leading-relaxed mt-4 mb-6">
          A machine learning system that generates synthetic regulatory DNA sequences using diffusion models to optimize gene expression.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <button className="group relative bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 text-white font-bold px-10 py-5 rounded-2xl shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <span className="relative z-10">Start Generating DNA</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            <div className="absolute inset-0 border-2 border-cyan-300 rounded-2xl opacity-0 group-hover:opacity-100 animate-border-glow"></div>
          </button>
          <button className="group border-2 border-gray-600 hover:border-cyan-400 text-gray-300 hover:text-white font-semibold px-10 py-5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm bg-gray-800/50">
            <span className="group-hover:text-cyan-300 transition-colors duration-300">View Documentation</span>
          </button>
        </div>
      </div>

      <DNAHelixSpline />
    </section>
  );
}