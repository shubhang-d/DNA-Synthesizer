import React from 'react';

const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="group relative w-full max-w-sm p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/25 hover:-translate-y-1 transition-all duration-500 overflow-hidden cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="text-3xl mb-4 group-hover:animate-pulse">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-bold text-2xl">
            {icon || '✨'}
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
