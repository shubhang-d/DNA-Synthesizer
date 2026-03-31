'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Activity } from 'lucide-react';

import ControlPanel from './components/ControlPanel';
import ResultsDisplay from './components/ResultsDisplay';
import dynamic from 'next/dynamic';

const DNAViewer = dynamic(() => import('./components/DNAViewer'), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 w-full h-full -z-10 bg-[#000000]" />
});

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sequences, setSequences] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Layout Tilt 3D Variables
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 150 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-3, 3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleGenerate = async (cellType: number, count: number) => {
    setIsGenerating(true);
    setError(null);
    setSequences([]);

    try {
      try {
        await axios.get('http://127.0.0.1:5000/', { timeout: 2000 });
      } catch (networkErr: any) {
        console.warn("Health check failed, backend might be down or missing CORS on /", networkErr);
      }

      const response = await axios.post('http://127.0.0.1:5000/generate', {
        cell_type: cellType,
        count: count,
      });
      
      if (response.data && response.data.sequences) {
        setSequences(response.data.sequences);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error(error);
      setError(
        error.response?.data?.error || 
        error.message || 
        "Failed to connect to synthesizer backend. Ensure the Python API is running on 127.0.0.1:5000 and CORS is enabled."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#000000] text-[#ffffff] relative overflow-hidden font-sans" style={{ zIndex: 1 }}>
      
      {/* Dynamic 3D Element & Custom Scanline Overlays */}
      <DNAViewer isGenerating={isGenerating} />
      <div className="scanlines absolute inset-0 z-0 pointer-events-none" />
      <div className="bg-grid absolute inset-0 z-0 opacity-40 pointer-events-none" />

      {/* Tiltable Glassmorphism Canvas */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col pt-12"
        style={{ perspective: 2000 }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-2 text-[#ffffff]">
              DNA-SYNTHESIZER
            </h1>
            <p className="text-[#94a3b8] font-mono text-sm tracking-widest uppercase ml-1">
              Deep Generative Epigenetic Engine
            </p>
          </div>

          <div className="bg-[#0a0a23]/70 backdrop-blur-md px-6 py-3 rounded-sm flex items-center gap-3 border border-[#ffffff]/40 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffffff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ffffff] shadow-[0_0_10px_#ffffff]"></span>
            </div>
            <span className="text-[#94a3b8] font-mono text-sm">
              <span className="text-[#ffffff] mr-2">MODEL:</span>
              DNA-Diffusion-v1
            </span>
            <Activity className="w-4 h-4 text-[#ffffff] ml-2" />
          </div>
        </motion.div>

        {error && (
          <div className="mb-8 p-4 bg-[#0a0a23]/70 border border-red-500/50 text-red-400 rounded-sm font-mono text-sm shadow-[0_0_15px_rgba(239,68,68,0.3)]">
             ⚠️ {error}
          </div>
        )}

        <motion.div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start will-change-transform drop-shadow-2xl"
        >
          <div className="lg:col-span-4 h-full pointer-events-auto">
            <ControlPanel onGenerate={handleGenerate} isGenerating={isGenerating} />
          </div>

          <div className="lg:col-span-8 h-full pointer-events-auto">
            <ResultsDisplay sequences={sequences} />
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
