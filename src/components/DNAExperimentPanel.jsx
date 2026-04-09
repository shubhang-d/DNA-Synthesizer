"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Loader2, Play } from "lucide-react";

export default function DNAExperimentPanel() {
  const [sequence, setSequence] = useState("");
  const [generatedSequence, setGeneratedSequence] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [heatmapColors, setHeatmapColors] = useState([]);

  useEffect(() => {
    // Initial random heatmap
    const colors = Array.from({ length: 120 }, () =>
      `rgba(59,130,246,${Math.random() * 0.2})`
    );
    setHeatmapColors(colors);
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

    // Simulate progress
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
    
    // Animate typing of sequence
    let currentText = "";
    let i = 0;
    const typeTimer = setInterval(() => {
      currentText += mockResult[i];
      setGeneratedSequence(currentText);
      i++;
      if (i === mockResult.length) {
        clearInterval(typeTimer);
        setLoading(false);
        // generate a highly active heatmap
        const colors = Array.from({ length: 120 }, () => {
           const isHot = Math.random() > 0.8;
           return isHot ? `rgba(244,114,182,${0.5 + Math.random() * 0.5})` : `rgba(0,212,255,${0.2 + Math.random() * 0.5})`;
        });
        setHeatmapColors(colors);
      }
    }, 20);
  };

  return (
    <section className="py-20 px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent pointer-events-none"></div>
      
      <div className="text-center mb-12 relative z-10">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 drop-shadow-lg">
          Diffusion Experiment Panel
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Input a base sequence or upload your data to generate optimized synthetic regulatory variants with our AI pipeline.
        </p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col space-y-8 bg-slate-900/40 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-xl relative z-10 shadow-[0_0_40px_rgba(0,212,255,0.05)] border-t-cyan-500/20">
        <div className="relative group">
          <label className="text-sm text-cyan-400 font-semibold mb-2 block uppercase tracking-wider transition-all group-focus-within:text-cyan-300">Input Sequence</label>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition duration-500 blur"></div>
          <textarea
            className="w-full p-4 bg-[#0b0f19]/80 text-gray-200 rounded-xl border border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all duration-300 font-mono text-sm leading-relaxed resize-none shadow-inner relative z-10"
            rows={4}
            placeholder="Enter FASTA/GenBank sequence here..."
            value={sequence}
            onChange={(e) => setSequence(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className={`self-end inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg ${loading ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600' : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,212,255,0.2)] border border-transparent hover:border-cyan-400/50'}`}
        >
          {loading ? (
             <>
               <Loader2 className="w-5 h-5 animate-spin" />
               Processing...
             </>
          ) : (
             <>
               <Play className="w-5 h-5 fill-current" />
               Generate Synthetic Variant
             </>
          )}
        </button>

        {loading && progress < 100 && (
          <div className="w-full animate-[pulse-glow_2s_ease-in-out_infinite]">
            <div className="flex justify-between text-xs text-cyan-400 mb-2 font-mono">
              <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin"/> INITIALIZING DIFFUSION MODEL</span>
              <span>{Math.floor(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner p-[1px] border border-slate-700">
               <div className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 transition-all duration-300 relative rounded-full" style={{width: `${progress}%`}}>
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[flow_1s_linear_infinite]"></div>
               </div>
            </div>
          </div>
        )}

        {(generatedSequence || score !== null) && (
          <div className="mt-8 pt-8 border-t border-slate-700/50 animate-[float_3s_ease-in-out_infinite] [animation-iteration-count:1]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div>
                  <label className="text-sm text-purple-400 font-semibold mb-2 block uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span> Generated Output
                  </label>
                  <div className="p-4 bg-[#0b0f19] rounded-xl border border-purple-500/30 font-mono text-sm text-gray-300 break-all min-h-[120px] shadow-[inset_0_0_20px_rgba(139,92,246,0.1)] relative group">
                     {generatedSequence}
                     {loading && <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse"></span>}
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-purple-500/10 pointer-events-none rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
               </div>

               <div>
                 <p className="text-sm text-pink-400 font-semibold mb-2 uppercase tracking-wider">Predicted Expression Score</p>
                 <div className="flex items-end gap-4 mb-4">
                    <span className="text-5xl font-bold bg-gradient-to-tr from-pink-400 to-cyan-400 text-transparent bg-clip-text animate-[neon-glow_2s_infinite]">
                      {score || "0.0"}
                    </span>
                    <span className="text-gray-400 pb-1">/ 100</span>
                 </div>
                 
                 <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden shadow-inner mb-6 relative">
                   <div
                     className="h-full bg-gradient-to-r from-pink-500 to-cyan-500 transition-all duration-1000 shadow-[0_0_10px_rgba(244,114,182,0.5)]"
                     style={{ width: `${score || 0}%` }}
                   ></div>
                 </div>

                 <p className="text-sm text-cyan-400 font-semibold mb-2 uppercase tracking-wider flex justify-between">
                    <span>Binding Site Heatmap</span>
                 </p>
                 <div className="w-full h-24 bg-[#0b0f19] rounded-lg border border-slate-700/80 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px] z-10 pointer-events-none"></div>
                   
                   <div className="absolute inset-0 grid grid-cols-20 grid-rows-6 transition-all duration-1000">
                     {heatmapColors.map((color, i) => (
                       <div
                         key={i}
                         className="w-full h-full transition-colors duration-1000 border-r border-b border-transparent hover:bg-white/20"
                         style={{ backgroundColor: color }}
                       />
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}