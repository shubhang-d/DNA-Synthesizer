"use client";

import { useState, useEffect } from "react";
import {
  Dna,
  Target,
  Search,
  TrendingUp
} from "lucide-react";

const analyticsData = [
  {
    title: "Generated Sequences",
    value: "2,847",
    change: "+12.5%",
    icon: Dna,
  },
  {
    title: "Model Accuracy",
    value: "94.2%",
    change: "+2.1%",
    icon: Target,
  },
  {
    title: "Regulatory Motifs Found",
    value: "1,203",
    change: "+8.7%",
    icon: Search,
  },
  {
    title: "Mean Expression Score",
    value: "87.6%",
    change: "+5.3%",
    icon: TrendingUp,
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

    // micro-fluctuations every 3 seconds after load to simulate real-time updates without frantic animations
    const liveTimer = setInterval(() => {
      setCounts(prevCounts => prevCounts.map((count, i) => {
         const item = analyticsData[i];
         const isPercentage = item.value.includes('%');
         const change = (Math.random() - 0.5) * (isPercentage ? 0.2 : 5);
         const target = parseFloat(item.value.replace(/[^0-9.]/g, ''));
         return Math.max(target * 0.98, Math.min(target * 1.02, count + change));
      }));
    }, 5000);

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
    <section className="py-16 px-8 relative bg-slate-900 border-b border-slate-800">
      <div className="text-center mb-12 relative z-10">
        <h2 className="text-3xl font-bold text-white mb-4">
          Platform Metrics
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Aggregate performance data from recent diffusion model training and sequence generation experiments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto relative z-10">
        {analyticsData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="relative bg-slate-800 border border-slate-700 rounded-xl p-6 transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-indigo-600/10 rounded-lg flex items-center justify-center text-indigo-400">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded">
                    {item.change}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-slate-400 text-sm font-medium mb-1">
                  {item.title}
                </h3>
                <p className="text-3xl font-semibold text-white">
                  {formatValue(counts[index] || 0, item.value)}
                </p>
              </div>

              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(parseFloat(item.value.replace(/[^0-9.]/g, '')) / (item.value.includes('%') ? 100 : 3000) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}