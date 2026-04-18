"use client";

import { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine,
  ResponsiveContainer, Cell,
} from "recharts";
import { Dna, Library, Activity } from "lucide-react";
import ExportMenu from "./ExportMenu";

// ─── motif definitions ────────────────────────────────────────────────────────
const MOTIFS = [
  { name: "TATA",   seq: "TATA",   color: "#f59e0b" },
  { name: "CAAT",   seq: "CAAT",   color: "#10b981" },
  { name: "GCG",    seq: "GCG",    color: "#6366f1" },
  { name: "ATG",    seq: "ATG",    color: "#ec4899" },
  { name: "AATAAA", seq: "AATAAA", color: "#22d3ee" },
  { name: "CCAAT",  seq: "CCAAT",  color: "#f97316" },
];

const BASE_COLORS = { A: "#10b981", T: "#ef4444", C: "#22d3ee", G: "#f59e0b" };

function findMotifs(sequence) {
  const hits = [];
  for (const motif of MOTIFS) {
    let idx = 0;
    while ((idx = sequence.indexOf(motif.seq, idx)) !== -1) {
      hits.push({ ...motif, start: idx, end: idx + motif.seq.length });
      idx++;
    }
  }
  return hits;
}

// ─── Motif map (SVG track view) ───────────────────────────────────────────────
function MotifMap({ entries }) {
  const SEQ_LEN = entries[0]?.sequence.length || 200;
  const SEQ_W   = 560;
  const ROW_H   = 18;
  const GAP     = 8;
  const LABEL_W = 88;
  const rows    = entries.slice(0, 12);
  const totalH  = rows.length * (ROW_H + GAP) + 50;

  return (
    <div className="overflow-x-auto">
      <svg width={LABEL_W + SEQ_W + 20} height={totalH} className="block">
        {/* grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const x = LABEL_W + frac * SEQ_W;
          return (
            <g key={frac}>
              <line x1={x} y1={0} x2={x} y2={totalH - 30} stroke="#1e293b" strokeWidth={1} />
              <text x={x} y={totalH - 12} fontSize={9} fill="#475569" textAnchor="middle">
                {Math.round(frac * SEQ_LEN)}
              </text>
            </g>
          );
        })}

        {rows.map((entry, i) => {
          const y    = i * (ROW_H + GAP);
          const hits = findMotifs(entry.sequence);
          return (
            <g key={entry.id}>
              <text x={LABEL_W - 6} y={y + ROW_H / 2 + 4} fontSize={9} fill="#94a3b8" textAnchor="end">
                {entry.id.slice(-8)}
              </text>
              {/* track background */}
              <rect x={LABEL_W} y={y} width={SEQ_W} height={ROW_H} fill="#0f172a" rx={2} />
              {/* motif hits */}
              {hits.map((hit, j) => (
                <rect
                  key={j}
                  x={LABEL_W + (hit.start / SEQ_LEN) * SEQ_W}
                  y={y + 2}
                  width={Math.max(((hit.end - hit.start) / SEQ_LEN) * SEQ_W, 5)}
                  height={ROW_H - 4}
                  fill={hit.color}
                  rx={2}
                  opacity={0.85}
                >
                  <title>{hit.name} @ {hit.start}–{hit.end}</title>
                </rect>
              ))}
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap gap-3 mt-4">
        {MOTIFS.map((m) => (
          <div key={m.name} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: m.color }} />
            {m.name}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Consensus / base-composition logo (SVG) ─────────────────────────────────
function ConsensusLogo({ entries }) {
  const WINDOW = 60;
  const COL_W  = 9;
  const COL_H  = 72;

  const cols = useMemo(() => {
    const result = Array.from({ length: WINDOW }, () => ({ A: 0, C: 0, G: 0, T: 0, total: 0 }));
    for (const { sequence } of entries) {
      for (let i = 0; i < Math.min(WINDOW, sequence.length); i++) {
        const b = sequence[i];
        if (b in result[i]) { result[i][b]++; result[i].total++; }
      }
    }
    return result;
  }, [entries]);

  return (
    <div className="overflow-x-auto">
      <svg width={WINDOW * COL_W + 20} height={COL_H + 30} className="block">
        {cols.map((col, i) => {
          if (!col.total) return null;
          const bases = ["A", "C", "G", "T"]
            .map((b) => ({ b, h: (col[b] / col.total) * COL_H }))
            .sort((a, z) => a.h - z.h);

          let y = COL_H;
          return (
            <g key={i}>
              {bases.map(({ b, h }) => {
                y -= h;
                return (
                  <rect key={b} x={i * COL_W + 1} y={y} width={COL_W - 2} height={h}
                    fill={BASE_COLORS[b]} opacity={0.9}>
                    <title>{b}: {((col[b] / col.total) * 100).toFixed(1)}%</title>
                  </rect>
                );
              })}
              {i % 10 === 0 && (
                <text x={i * COL_W + COL_W / 2} y={COL_H + 20}
                  fontSize={9} fill="#475569" textAnchor="middle">{i}</text>
              )}
            </g>
          );
        })}
        <line x1={0} y1={COL_H} x2={WINDOW * COL_W} y2={COL_H} stroke="#1e293b" />
      </svg>

      <div className="flex flex-wrap gap-3 mt-3">
        {Object.entries(BASE_COLORS).map(([b, c]) => (
          <div key={b} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: c }} />
            {b}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GC content bar chart (Recharts) ─────────────────────────────────────────
function GCChart({ entries }) {
  const data = useMemo(
    () =>
      entries.map((e, idx) => ({
        name: `S${idx + 1}`,
        gc: Math.round(((e.sequence.match(/[GC]/g)?.length || 0) / e.sequence.length) * 1000) / 10,
        cellType: e.cellType,
        id: e.id,
      })),
    [entries]
  );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 4 }}>
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false}
          tickFormatter={(v) => `${v}%`} width={36} />
        <Tooltip
          cursor={{ fill: "rgba(99,102,241,0.08)" }}
          contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }}
          formatter={(v, _, { payload }) => [`${v}% GC`, payload.id]}
        />
        <ReferenceLine y={50} stroke="#475569" strokeDasharray="4 3" label={{ value: "50%", position: "right", fontSize: 9, fill: "#475569" }} />
        <Bar dataKey="gc" radius={[3, 3, 0, 0]} maxBarSize={32}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.gc >= 50 ? "#6366f1" : "#22d3ee"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Summary stat pill ────────────────────────────────────────────────────────
function Stat({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-md flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function SyntheticDNAAnalytics() {
  const [allEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dna_library") ?? "[]"); }
    catch { return []; }
  });

  const [activeTab, setActiveTab]     = useState("motif");
  const [selectedBatch, setSelectedBatch] = useState(0);

  // group entries into generation batches by same-second timestamp
  const batches = useMemo(() => {
    const map = {};
    for (const e of allEntries) {
      const key = (e.generatedAt ?? "unknown").slice(0, 19);
      (map[key] ??= []).push(e);
    }
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
  }, [allEntries]);

  const batchEntries = batches[selectedBatch]?.[1] ?? allEntries;

  // summary stats for selected batch
  const stats = useMemo(() => {
    if (!batchEntries.length) return null;
    const totalMotifs = batchEntries.reduce((sum, e) => sum + findMotifs(e.sequence).length, 0);
    const avgGC = (
      batchEntries.reduce((sum, e) => sum + (e.sequence.match(/[GC]/g)?.length || 0) / e.sequence.length, 0)
      / batchEntries.length * 100
    ).toFixed(1);
    return { count: batchEntries.length, motifs: totalMotifs, avgGC, cellType: batchEntries[0]?.cellType };
  }, [batchEntries]);

  const tabs = [
    { id: "motif", label: "Motif Map" },
    { id: "logo",  label: "Consensus Logo" },
    { id: "gc",    label: "GC Distribution" },
  ];

  if (!allEntries.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 gap-3">
        <Library className="w-10 h-10 opacity-30" />
        <p className="text-sm">No sequences yet — generate some from the DNA Sequence Generator first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Batch selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Compare generation batches</p>
        <div className="flex flex-wrap gap-2">
          {batches.map(([ts, seqs], idx) => (
            <button
              key={ts}
              onClick={() => setSelectedBatch(idx)}
              className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                selectedBatch === idx
                  ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300"
                  : "border-slate-700 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              &nbsp;·&nbsp;{seqs.length} seqs
              &nbsp;·&nbsp;{seqs[0]?.cellType}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Sequences"     value={stats.count}    icon={Dna}      color="bg-indigo-600/30" />
          <Stat label="Cell Type"     value={stats.cellType} icon={Library}  color="bg-cyan-600/30" />
          <Stat label="Avg GC Content" value={`${stats.avgGC}%`} icon={Activity} color="bg-emerald-600/30" />
          <Stat label="Motifs Found"  value={stats.motifs}   icon={Activity} color="bg-pink-600/30" />
        </div>
      )}

      {/* Tab bar + export */}
      <div className="flex items-center justify-between border-b border-slate-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t.id
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
        <div className="flex gap-1" />
        <ExportMenu entries={batchEntries} label="Export Batch" />
      </div>

      {/* Chart panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        {activeTab === "motif" && (
          <>
            <h3 className="text-sm font-semibold text-white mb-1">Motif Track Map</h3>
            <p className="text-xs text-slate-400 mb-5">
              Each row is one sequence. Coloured blocks mark where regulatory motifs occur — hover for position details.
            </p>
            <MotifMap entries={batchEntries} />
          </>
        )}

        {activeTab === "logo" && (
          <>
            <h3 className="text-sm font-semibold text-white mb-1">Base Composition — First 60 bp</h3>
            <p className="text-xs text-slate-400 mb-5">
              Stacked bars show A/T/C/G frequency per position across all sequences in this batch.
              Taller single-colour columns = high consensus; mixed = diverse.
            </p>
            <ConsensusLogo entries={batchEntries} />
          </>
        )}

        {activeTab === "gc" && (
          <>
            <h3 className="text-sm font-semibold text-white mb-1">GC Content per Sequence</h3>
            <p className="text-xs text-slate-400 mb-5">
              Dashed line = 50% reference. Purple bars are GC-rich (&gt;50%), cyan bars are AT-rich.
              Hover each bar for the exact value and sequence ID.
            </p>
            <GCChart entries={batchEntries} />
          </>
        )}
      </div>
    </div>
  );
}
