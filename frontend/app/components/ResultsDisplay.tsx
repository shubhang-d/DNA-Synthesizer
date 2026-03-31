'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';

// Scrambler component to show matrix random ACTG before settling
const ScrambleText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let iteration = 0;
    const chars = "ACTG";
    const duration = 600; // ms
    const fps = 30;
    const intervalTime = 1000 / fps;
    const maxIterations = duration / intervalTime;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < (iteration / maxIterations) * text.length) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text); // Ensure final matches perfectly
      }
      iteration += 1;
    }, intervalTime);

    return () => clearInterval(interval);
  }, [text]);

  const renderColoredSequence = (seq: string) => {
    return Array.from(seq).map((base, i) => {
      let colorClass = 'text-slate-500';
      if (base === 'A') colorClass = 'text-[#10b981] drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]'; 
      if (base === 'T') colorClass = 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]'; 
      if (base === 'C') colorClass = 'text-[#22d3ee] drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]'; 
      if (base === 'G') colorClass = 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]'; 
      
      return (
        <span key={i} className={`${colorClass} transition-colors hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,1)] cursor-default`}>
          {base}
        </span>
      );
    });
  };

  return <>{renderColoredSequence(displayText)}</>;
};

export default function ResultsDisplay({ sequences }: { sequences: string[] }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (seq: string, index: number) => {
    navigator.clipboard.writeText(seq);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-[#0a0a23]/70 rounded-sm p-6 shadow-[0_0_30px_rgba(255,255,255,0.1)] h-[600px] flex flex-col border border-[#ffffff] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 backdrop-blur-md relative z-10 w-full">
      <div className="flex items-center justify-between mb-4 border-b border-[#ffffff]/30 pb-4">
        <h2 className="text-xl font-semibold tracking-wide text-[#ffffff] flex items-center gap-3">
          <Terminal className="w-5 h-5 text-[#ffffff]" />
          Data Stream Matrix
        </h2>
        <span className="text-xs font-mono text-[#10b981] bg-[#10b981]/10 px-3 py-1.5 rounded-full border border-[#10b981]/30 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
          </span>
          {sequences.length} Blocks
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        <AnimatePresence>
          {sequences.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-[#10b981] space-y-4"
            >
              <Terminal className="w-12 h-12 opacity-30 text-[#f0f9ff]" />
              <p className="font-mono text-sm tracking-widest uppercase text-[#f0f9ff] flex items-center">
                AWAITING SUBSTRATE
                <motion.span 
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="ml-1 w-2 h-4 bg-[#a855f7] inline-block"
                />
              </p>
            </motion.div>
          ) : (
            <motion.div className="space-y-4">
              {sequences.map((seq, index) => (
                <motion.div
                  key={`${index}-${seq.substring(0, 5)}`}
                  layout
                  initial={{ opacity: 0, x: -50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 20, 
                    delay: index * 0.1 
                  }}
                  className="bg-[#000000] rounded-sm p-4 border border-[#ffffff]/30 relative group hover:border-[#ffffff]/80 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-mono text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                      BLOCK_{String(index + 1).padStart(3, '0')}
                    </span>
                    
                    <button
                      onClick={() => handleCopy(seq, index)}
                      className="text-[#10b981] hover:text-[#ffffff] transition-colors flex items-center gap-2 text-xs font-mono bg-[#0a0a23]/70 hover:bg-[#0a0a23]/100 px-3 py-1.5 rounded-sm border border-[#10b981]/40 hover:border-[#ffffff]/50"
                    >
                      {copiedIndex === index ? (
                        <span className="text-[#10b981] flex items-center gap-1"><Copy className="w-3 h-3"/> EXTRACTED</span>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> PIPETTE
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="font-mono text-sm leading-8 tracking-widest break-all p-4 bg-black/60 rounded-lg overflow-x-hidden border border-slate-800/50">
                    <ScrambleText text={seq} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
