"use client";

import { useState, useEffect } from "react";
import {
  Dna,
  Target,
  Search,
  TrendingUp,
  FlaskConical
} from "lucide-react";

const analyticsData = [
  {
    title: "Generated DNA Sequences",
    value: "2,847",
    change: "+12.5%",
    icon: Dna,
    color: "from-cyan-500 to-blue-500"
  },
  {
    title: "Model Accuracy",
    value: "94.2%",
    change: "+2.1%",
    icon: Target,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Regulatory Motifs Found",
    value: "1,203",
    change: "+8.7%",
    icon: Search,
    color: "from-teal-500 to-cyan-500"
  },
  {
    title: "Expression Score",
    value: "87.6%",
    change: "+5.3%",
    icon: TrendingUp,
    color: "from-blue-500 to-indigo-500"
  }
];

export default function AnalyticsCards() {
  const [counts, setCounts] = useState(analyticsData.map(() => 0));

  useEffect(() => {
    const animationDuration = 2000;
    const frames = 60;
    const stepTime = animationDuration / frames;

    let currentFrame = 0;
    const timer = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / frames;
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      setCounts(
        analyticsData.map((item) => {
          const finalVal = parseFloat(item.value.replace(/[^0-9.]/g, ''));
          return finalVal * easeProgress;
        })
      );

      if (currentFrame >= frames) {
        clearInterval(timer);
      }
    }, stepTime);

    // micro-fluctuations every 3 seconds after load to simulate live data
    const liveTimer = setInterval(() => {
      setCounts(prevCounts => prevCounts.map((count, i) => {
         const item = analyticsData[i];
         const isPercentage = item.value.includes('%');
         const change = (Math.random() - 0.5) * (isPercentage ? 0.2 : 5);
         const target = parseFloat(item.value.replace(/[^0-9.]/g, ''));
         // stay near target
         return Math.max(target * 0.98, Math.min(target * 1.02, count + change));
      }));
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(liveTimer);
    };
  }, []);

  const formatValue = (num, originalString) => {
    if (originalString.includes('%')) {
      return num.toFixed(1) + '%';
    }
    return Math.floor(num).toLocaleString();
  };

  return (
    <section className="py-16 px-8 relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
      <div className="absolute top-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="text-center mb-12 relative z-10">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-pulse">
          Dashboard Analytics
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Real-time metrics and insights from your DNA diffusion model experiments and synthetic sequence generation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto relative z-10">
        {analyticsData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group relative bg-[#111827]/80 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-400/80 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 transform hover:scale-105 animate-float overflow-hidden"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Animated neon border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-border-glow"></div>

              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all duration-300 animate-pulse group-hover:animate-neon-glow`}>
                    <Icon className="w-7 h-7 text-white drop-shadow-lg" />
                  </div>
                  <div className="text-right">
                    <span className="text-green-400 text-sm font-semibold bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                      {item.change}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-gray-300 text-sm font-medium mb-2 group-hover:text-white transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-300">
                    {formatValue(counts[index] || 0, item.value)}
                  </p>
                </div>

                <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-gray-600/30">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 shadow-lg shadow-cyan-500/30 animate-pulse`}
                    style={{
                      width: `${Math.min(parseFloat(item.value.replace(/[^0-9.]/g, '')) / 3000 * 100, 100)}%`,
                      animationDelay: `${index * 0.3}s`
                    }}
                  ></div>
                </div>
              </div>

              {/* Floating accent elements */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-ping" style={{ animationDelay: `${index * 0.8}s` }}></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-ping" style={{ animationDelay: `${index * 1.2}s` }}></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}