"use client";

import { useState, useEffect } from "react";
import { Loader2, Play } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from "recharts";

export default function DNAExperimentPanel() {
  const [sequence, setSequence] = useState("");
  const [generatedSequence, setGeneratedSequence] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const initData = Array.from({ length: 50 }, (_, i) => ({ index: i, score: Math.random() * 5 }));
    setChartData(initData);
  }, []);

  const generate = () => {
    if (!sequence.trim() && !loading) {
       setSequence("ATGCGTACGTAGCTAGCTAGCTGATCGATCGTAGCTAGCTAGCTAGCTAG");
    }
    setLoading(true);
    setScore(null);
    setProgress(0);
    setGeneratedSequence("");

    const mockResult = "ATGC" + Array.from({length: 46}, () => ["A", "T", "G", "C"][Math.floor(Math.random() * 4)]).join("");
    const targetScore = (70 + Math.random() * 28).toFixed(1);

    const timer = setInterval(() => {
      setProgress((old) => {
        const next = old + Math.random() * 15;
        if (next >= 100) {
          clearInterval(timer);
          finishGeneration(mockResult, targetScore);
          return 100;
        }
        return next;
      });
    }, 300);
  };

  const finishGeneration = (mockResult, targetScore) => {
    setScore(targetScore);
    
    // Generate data matching sequence length
    const data = Array.from({ length: mockResult.length }, (_, i) => {
      const isHot = Math.random() > 0.85;
      let baseScore = Math.random() * 20 + 10;
      if (isHot) baseScore += Math.random() * 50 + 30; // peak
      return { index: i, score: baseScore };
    });

    let currentText = "";
    let i = 0;
    const typeTimer = setInterval(() => {
      currentText += mockResult[i];
      setGeneratedSequence(currentText);
      i++;
      if (i === mockResult.length) {
        clearInterval(typeTimer);
        setLoading(false);
        setChartData(data);
      }
    }, 30);
  };

  const renderAnnotatedSequence = () => {
    return generatedSequence.split("").map((char, index) => {
      let colorClass = "text-slate-400";
      if (char === "A" || char === "T") colorClass = "text-indigo-300";
      if (char === "G" || char === "C") colorClass = "text-emerald-300";

      const dataPoint = chartData[index];
      const isHot = dataPoint && dataPoint.score > 60;
      const highlight = isHot && !loading ? "bg-indigo-500/20 shadow-[0_2px_0_0_#4f46e5] font-bold" : "";

      return (
        <span key={index} className={`inline-block w-3 text-center ${colorClass} ${highlight} transition-all duration-300`}>
          {char}
        </span>
      );
    });
  };

  return (
    <section className="py-20 px-4 md:px-8 relative bg-slate-900 border-b border-slate-800">
      <div className="text-center mb-12 relative z-10">
        <h2 className="text-3xl font-bold text-white mb-4">
          In-Silico Evaluation Panel
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Input a base sequence or upload your data to generate optimized synthetic regulatory variants via the fine-tuned diffusion model.
        </p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col space-y-6 bg-slate-800/80 p-6 md:p-8 rounded-xl border border-slate-700 shadow-sm relative z-10">
        <div className="relative group">
          <label className="text-xs text-slate-400 font-semibold mb-2 block uppercase tracking-wider">Input Sequence (FASTA Format)</label>
          <textarea
            className="w-full p-4 bg-slate-900 text-slate-200 rounded-lg border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all duration-200 font-mono text-sm leading-relaxed resize-none shadow-inner"
            rows={3}
            placeholder="Enter FASTA/GenBank sequence here..."
            value={sequence}
            onChange={(e) => setSequence(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className={`self-end inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${loading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'}`}
        >
          {loading ? (
             <>
               <Loader2 className="w-4 h-4 animate-spin" />
               Processing...
             </>
          ) : (
             <>
               <Play className="w-4 h-4 fill-current" />
               Run Diffusion Protocol
             </>
          )}
        </button>

        {loading && progress < 100 && (
          <div className="w-full mt-4">
            <div className="flex justify-between text-xs text-indigo-400 mb-2 font-mono">
              <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin"/> INITIALIZING...</span>
              <span>{Math.floor(progress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden shrink-0">
               <div className="h-full bg-indigo-500 transition-all duration-300 relative rounded-full" style={{width: `${progress}%`}}>
               </div>
            </div>
          </div>
        )}

        {(generatedSequence || score !== null) && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div>
                  <label className="text-xs text-slate-400 font-semibold mb-2 flex justify-between uppercase tracking-wider">
                    <span>Generated Output Sequence</span>
                    {!loading && <span className="text-indigo-400 lowercase tracking-normal font-mono text-[10px]">Motifs Annotated</span>}
                  </label>
                  <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 font-mono text-sm text-slate-300 break-all min-h-[140px] shadow-inner relative leading-loose tracking-widest">
                     {renderAnnotatedSequence()}
                     {loading && <span className="inline-block w-2 h-4 ml-1 bg-indigo-400 animate-pulse"></span>}
                  </div>
               </div>

               <div>
                 <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">Predicted Expression Strength</p>
                 <div className="flex items-end gap-3 mb-3">
                    <span className="text-4xl font-bold text-white">
                      {score || "0.0"}
                    </span>
                    <span className="text-slate-500 pb-1 font-mono">/ 100</span>
                 </div>
                 
                 <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mb-6">
                   <div
                     className="h-full bg-emerald-500 transition-all duration-1000"
                     style={{ width: `${score || 0}%` }}
                   ></div>
                 </div>

                 <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">Attention Score Distribution</p>
                 <div className="w-full h-24 bg-slate-900 rounded-lg border border-slate-700 relative overflow-hidden pt-2 pl-[-10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <YAxis domain={['dataMin', 'dataMax + 20']} hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', color: '#c7d2fe', fontSize: '12px' }}
                          itemStyle={{ color: '#818cf8' }}
                          labelStyle={{ display: 'none' }}
                          cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area type="monotone" dataKey="score" stroke="#6366f1" fillOpacity={1} fill="url(#colorScore)" isAnimationActive={!loading} />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}