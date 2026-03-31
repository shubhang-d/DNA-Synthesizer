'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, SlidersHorizontal, Settings2, Play } from 'lucide-react';

const CELL_TYPES = [
  { id: 0, name: 'K562 (Erythroleukemia)' },
  { id: 1, name: 'HepG2 (Hepatocellular Carcinoma)' },
  { id: 2, name: 'GM12878 (Lymphoblastoid)' },
  { id: 3, name: 'hESCT0 (Embryonic Stem Cell)' },
];

export default function ControlPanel({ 
  onGenerate, 
  isGenerating 
}: { 
  onGenerate: (type: number, count: number) => void;
  isGenerating: boolean;
}) {
  const [selectedType, setSelectedType] = useState(0);
  const [sequenceCount, setSequenceCount] = useState(5);

  return (
    <div className="bg-[#0a0a23]/70 rounded-sm p-6 shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-[#ffffff] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 backdrop-blur-md h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-6 border-b border-[#ffffff]/30 pb-4">
          <Settings2 className="w-5 h-5 text-[#ffffff]" />
          <h2 className="text-xl font-semibold tracking-wide text-[#ffffff]">Synthesis Parameters</h2>
        </div>

        <div className="space-y-6">
          {/* Cell Type Selector */}
          <div>
            <label className="flex items-center gap-2 text-sm text-[#94a3b8] mb-2">
              <Dna className="w-4 h-4 text-[#10b981]" /> Target Cell Line
            </label>
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(Number(e.target.value))}
                className="w-full bg-[#000000] border border-[#ffffff] text-[#ffffff] rounded-sm px-4 py-3 appearance-none focus:outline-none focus:border-[#ffffff] focus:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]"
              >
                {CELL_TYPES.map((ct) => (
                  <option key={ct.id} value={ct.id}>
                    {ct.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#ffffff]">
                ▼
              </div>
            </div>
          </div>

          {/* Sequence Count Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="flex items-center gap-2 text-sm text-[#94a3b8]">
                <SlidersHorizontal className="w-4 h-4 text-[#10b981]" /> Batch Size
              </label>
              <span className="text-[#ffffff] font-mono text-sm bg-[#ffffff]/10 px-2 py-1 rounded border border-[#ffffff]/30">
                {sequenceCount}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={sequenceCount}
              onChange={(e) => setSequenceCount(Number(e.target.value))}
              className="w-full h-1 bg-[#0a0a23]/70 border border-[#ffffff] rounded-none appearance-none cursor-pointer accent-[#ffffff] disabled:opacity-50 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-shadow"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        {/* Step 3: Polish Generate Button */}
        <motion.button
          whileHover={!isGenerating ? { scale: 1.05, boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.4)" } : {}}
          whileTap={!isGenerating ? { scale: 0.95 } : {}}
          onClick={() => onGenerate(selectedType, sequenceCount)}
          disabled={isGenerating}
          className={`w-full relative overflow-hidden flex items-center justify-center gap-3 py-4 rounded-sm font-bold tracking-widest text-sm uppercase transition-all duration-300 border border-[#ffffff]
            ${isGenerating 
              ? 'bg-[#0a0a23]/70 text-slate-500 cursor-wait' 
              : 'bg-[#ffffff] text-[#000000] shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]'
            }`}
        >
          <AnimatePresence mode="popLayout">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex items-center gap-2"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                  <Settings2 className="w-5 h-5 text-slate-400" />
                </motion.div>
                <span>SYNTHESIZING...</span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                <span>GENERATE SEQUENCE</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse Glow Overlay */}
          {!isGenerating && (
             <motion.div
               className="absolute inset-0 bg-white"
               animate={{ opacity: [0, 0.2, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
             />
          )}
        </motion.button>
      </div>
    </div>
  );
}
