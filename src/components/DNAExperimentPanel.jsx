"use client";

import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { FlaskConical, Search } from "lucide-react";

const MOTIFS = [
  { name: "TATA",   seq: "TATA",   color: "#f59e0b", desc: "TATA box (promoter)" },
  { name: "CAAT",   seq: "CAAT",   color: "#10b981", desc: "CAAT box (promoter)" },
  { name: "GCG",    seq: "GCG",    color: "#6366f1", desc: "CpG-like site" },
  { name: "ATG",    seq: "ATG",    color: "#ec4899", desc: "Start codon" },
  { name: "AATAAA", seq: "AATAAA", color: "#22d3ee", desc: "Poly-A signal" },
  { name: "CCAAT",  seq: "CCAAT",  color: "#f97316", desc: "CCAAT box" },
];

const BASE_COLORS = { A: "#10b981", T: "#ef4444", C: "#22d3ee", G: "#f59e0b" };

function cleanSeq(raw) {
  return raw.replace(/^>.*$/gm, "").replace(/\s+/g, "").toUpperCase().replace(/[^ATGC]/g, "");
}

function analyze(seq) {
  if (!seq.length) return null;
  const counts = { A: 0, T: 0, G: 0, C: 0 };
  for (const b of seq) if (b in counts) counts[b]++;
  const gc = ((counts.G + counts.C) / seq.length) * 100;
  const cpg = (seq.match(/CG/g) || []).length;

  const motifHits = MOTIFS.map((m) => {
    let count = 0, idx = 0;
    while ((idx = seq.indexOf(m.seq, idx)) !== -1) { count++; idx++; }
    return { ...m, count };
  }).filter((m) => m.count > 0);

  return { counts, gc, cpg, motifHits, length: seq.length };
}

export default function DNAExperimentPanel() {
  const [raw, setRaw] = useState("");
  const seq    = useMemo(() => cleanSeq(raw), [raw]);
  const result = useMemo(() => analyze(seq), [seq]);

  const baseChartData = result
    ? Object.entries(result.counts).map(([b, v]) => ({ base: b, count: v, pct: ((v / result.length) * 100).toFixed(1) }))
    : [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-md bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
          <FlaskConical className="w-4 h-4 text-indigo-300" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Sequence Analyzer</h3>
          <p className="text-xs text-slate-500">Paste any DNA sequence or FASTA block for instant local analysis</p>
        </div>
      </div>

      <textarea
        rows={4}
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder={">My sequence\nATGCGTACGTAGCTAGCTAGCTGATCGATCG..."}
        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 font-mono text-xs outline-none focus:border-indigo-500 resize-none"
      />

      {!result && (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-4 justify-center">
          <Search className="w-4 h-4" />
          Paste a sequence above to see results
        </div>
      )}

      {result && (
        <div className="space-y-5">
          {/* Key metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Length",      value: `${result.length} bp` },
              { label: "GC Content",  value: `${result.gc.toFixed(1)}%` },
              { label: "CpG Sites",   value: result.cpg },
              { label: "Motifs Found", value: result.motifHits.length },
            ].map((s) => (
              <div key={s.label} className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                <p className="text-xl font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Base composition chart */}
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Base Composition</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={baseChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="base" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "rgba(99,102,241,0.08)" }}
                  contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }}
                  formatter={(v, _, { payload }) => [`${payload.count} (${payload.pct}%)`, payload.base]}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {baseChartData.map((d) => (
                    <Cell key={d.base} fill={BASE_COLORS[d.base]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Motif hits */}
          {result.motifHits.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Regulatory Motifs Detected</p>
              <div className="flex flex-wrap gap-2">
                {result.motifHits.map((m) => (
                  <div
                    key={m.name}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs"
                    style={{ borderColor: m.color + "40", background: m.color + "10", color: m.color }}
                  >
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: m.color }} />
                    <span className="font-mono font-semibold">{m.name}</span>
                    <span className="text-slate-400">×{m.count}</span>
                    <span className="text-slate-500">— {m.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.motifHits.length === 0 && (
            <p className="text-xs text-slate-500 italic">No known regulatory motifs found in this sequence.</p>
          )}
        </div>
      )}
    </div>
  );
}
