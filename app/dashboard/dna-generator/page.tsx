'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getJSON, setJSON } from '../../../src/lib/userStorage';
import dynamic from 'next/dynamic';

import SynthesizerControlPanel from '../../../src/components/SynthesizerControlPanel';
import SynthesizerResultsDisplay from '../../../src/components/SynthesizerResultsDisplay';

const SynthesizerDNAViewer = dynamic(
  () => import('../../../src/components/SynthesizerDNAViewer'),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 w-full h-full -z-10 bg-black" />,
  }
);

export default function DNAGeneratorPage() {
  const { data: session } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [sequences, setSequences] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 3D tilt motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 150 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-3, 3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
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
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:5000';

      try {
        await axios.get(`${apiBase}/`, { timeout: 2000 });
      } catch (networkErr) {
        console.warn('Health check failed — backend may be down or missing CORS on /', networkErr);
      }

      const response = await axios.post(`${apiBase}/api/generate`, {
        cell_type: cellType,
        count,
      });

      if (response.data?.sequences) {
        const generated: string[] = response.data.sequences;
        setSequences(generated);

        const cellTypeNames: Record<number, string> = { 0: 'K562', 1: 'HepG2', 2: 'GM12878', 3: 'hESCT0' };
        const existing = getJSON(session, 'dna_library', []);
        const newEntries = generated.map((seq: string, i: number) => ({
          id: `SEQ-${Date.now()}-${i}`,
          sequence: seq,
          cellType: cellTypeNames[cellType] ?? `Type ${cellType}`,
          generatedAt: new Date().toISOString(),
        }));
        setJSON(session, 'dna_library', [...newEntries, ...existing]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error(err);
      const axiosErr = axios.isAxiosError(err) ? err : null;
      setError(
        axiosErr?.response?.data?.error ??
        (err instanceof Error ? err.message : null) ??
        'Failed to connect to synthesizer backend. Ensure the Python API is running on 127.0.0.1:5000 and CORS is enabled.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main
      className="min-h-screen bg-black text-white relative font-sans"
    >
      {/* 3D DNA background */}
      <SynthesizerDNAViewer isGenerating={isGenerating} />

      {/* Scanline & grid overlays */}
      <div className="synth-scanlines absolute inset-0 z-0 pointer-events-none" />
      <div className="synth-bg-grid absolute inset-0 z-0 opacity-40 pointer-events-none" />

      <motion.div
        className="relative z-10 container mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col pt-12"
        style={{ perspective: 2000 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-2 text-white">
              DNA-SYNTHESIZER
            </h1>
            <p className="text-slate-400 font-mono text-sm tracking-widest uppercase ml-1">
              Deep Generative Epigenetic Engine
            </p>
          </div>

          <div className="bg-[#0a0a23]/70 backdrop-blur-md px-6 py-3 rounded-sm flex items-center gap-3 border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white shadow-[0_0_10px_#fff]" />
            </div>
            <span className="text-slate-400 font-mono text-sm">
              <span className="text-white mr-2">MODEL:</span>
              DNA-Diffusion-v1
            </span>
            <Activity className="w-4 h-4 text-white ml-2" />
          </div>
        </motion.div>

        {/* Error banner */}
        {error && (
          <div className="mb-8 p-4 bg-[#0a0a23]/70 border border-red-500/50 text-red-400 rounded-sm font-mono text-sm shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            ⚠️ {error}
          </div>
        )}

        {/* Tiltable glassmorphism canvas */}
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start will-change-transform drop-shadow-2xl"
        >
          <div className="lg:col-span-4 h-full pointer-events-auto">
            <SynthesizerControlPanel onGenerate={handleGenerate} isGenerating={isGenerating} />
          </div>

          <div className="lg:col-span-8 h-full pointer-events-auto">
            <SynthesizerResultsDisplay sequences={sequences} />
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
