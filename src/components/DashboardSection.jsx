"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Brain,
  CheckCircle2,
  Dna,
  FlaskConical,
  GitCompare,
  Library,
  Save,
  Search,
  Settings,
  SlidersHorizontal,
  Trash2,
  Copy,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DNAExperimentPanel from "./DNAExperimentPanel";
import SyntheticDNAAnalytics from "./SyntheticDNAAnalytics";
import ExportMenu from "./ExportMenu";

const sections = {
  overview: {
    title: "Research Dashboard",
    description: "Track live model performance, sequence throughput, experiments, and compute health.",
    icon: Activity,
  },
  "dna-generator": {
    title: "DNA Sequence Generator",
    description: "Generate, score, and annotate synthetic regulatory DNA candidates.",
    icon: Dna,
  },
  "synthetic-vs-real": {
    title: "Synthetic vs Real Comparison",
    description: "Compare AI-generated regulatory sequences against real ENCODE/JASPAR reference distributions for GC%, CpG density, motif content, and predicted activity.",
    icon: GitCompare,
  },
  "mutation-playground": {
    title: "Mutation Playground",
    description: "Click bases to edit them, insert known motifs, and watch analysis scores update live.",
    icon: FlaskConical,
  },
  analyzer: {
    title: "Regulatory Motif Analyzer",
    description: "Scan DNA input for regulatory motifs, GC balance, and candidate hotspots.",
    icon: Search,
  },
  library: {
    title: "Synthetic DNA Library",
    description: "Filter saved generated sequences and inspect their latest expression scores.",
    icon: Library,
  },
  analytics: {
    title: "Analytics & Insights",
    description: "Compare sequence generation, motif discovery, and expression strength trends.",
    icon: BarChart3,
  },
  settings: {
    title: "Settings",
    description: "Control lab profile preferences, notifications, and runtime defaults.",
    icon: Settings,
  },
};


function cleanSequence(value) {
  return value.toUpperCase().replace(/[^ATGC]/g, "");
}

function SectionHeader({ section }) {
  const Icon = section.icon;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-lg bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{section.title}</h1>
        </div>
        <p className="text-slate-400 max-w-3xl">{section.description}</p>
      </div>
      <div className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2">
        Live workspace
      </div>
    </div>
  );
}

function QuickCard({ title, value, detail, icon: Icon }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-5 h-5 text-indigo-300" />
        <span className="text-xs text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded-md">{detail}</span>
      </div>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}

const MOTIF_SEQS = ["TATA", "CAAT", "GCG", "ATG", "AATAAA", "CCAAT"];

function countMotifs(seq) {
  return MOTIF_SEQS.reduce((n, m) => {
    let idx = 0, c = 0;
    while ((idx = seq.indexOf(m, idx)) !== -1) { c++; idx++; }
    return n + c;
  }, 0);
}

function OverviewContent() {
  const library = useState(() => {
    try { return JSON.parse(localStorage.getItem("dna_library") ?? "[]"); }
    catch { return []; }
  })[0];

  const stats = useMemo(() => {
    const total    = library.length;
    const types    = new Set(library.map((e) => e.cellType)).size;
    const motifs   = library.reduce((n, e) => n + countMotifs(e.sequence), 0);
    const lastBatch = library[0]
      ? new Date(library[0].generatedAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
      : "—";
    return { total, types, motifs, lastBatch };
  }, [library]);

  // last 5 sequences for the recent activity feed
  const recent = library.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <QuickCard title="Sequences in Library" value={stats.total || "—"}   detail={stats.total ? "from localStorage" : "none yet"} icon={Dna} />
        <QuickCard title="Cell Types Explored"  value={stats.types || "—"}   detail="unique"                                          icon={Brain} />
        <QuickCard title="Regulatory Motifs"    value={stats.motifs || "—"}  detail="across all seqs"                                  icon={CheckCircle2} />
        <QuickCard title="Last Generation"      value={stats.lastBatch}      detail="most recent batch"                                icon={Activity} />
      </div>

      {recent.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Recent sequences</p>
          <div className="space-y-2">
            {recent.map((e) => (
              <div key={e.id} className="flex items-center gap-4 py-2 border-b border-slate-800 last:border-0">
                <span className="text-xs font-mono text-indigo-300 w-32 shrink-0">{e.id.slice(-10)}</span>
                <span className="text-xs text-slate-500 w-16 shrink-0">{e.cellType}</span>
                <span className="text-xs font-mono text-slate-400 truncate flex-1">{e.sequence.slice(0, 60)}…</span>
                <span className="text-xs text-slate-600 shrink-0">{new Date(e.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {library.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center text-slate-500 text-sm">
          No sequences yet — go to <span className="text-indigo-400">DNA Sequence Generator</span> to generate your first batch.
        </div>
      )}

      <DNAExperimentPanel />
    </div>
  );
}

// ─── Reference ranges from DNA-Diffusion, ENCODE, and Polygraph (2023) ───────────
// GC: human regulatory regions (enhancers 45–60%, promoters 55–65%) → global band 40–72%, mean 52%
// CpG: promoters ~10–14, enhancers ~4–8 per 200 bp → global band 3–18, mean 9
// Motifs: DNA-Diffusion reports 8–15 per sequence → band 3–25, mean 12
// TF presence frequencies per cell type from DNA-Diffusion supplementary data
const REAL_REF = {
  gc:     { mean: 52,  min: 40,  max: 72  },
  cpg:    { mean: 9,   min: 3,   max: 18  },
  motifs: { mean: 12,  min: 2,   max: 25  },
};

// Cell-type TF presence frequencies (fraction of real sequences containing ≥1 hit)
// Source: DNA-Diffusion Fig 4 — IRF1 47% GM12878, GATA1-TAL1 31% K562, HNF4A K562/HepG2
const TF_PRESENCE = {
  K562:    { "GATA family": [0.30, 0.60], "ETS family": [0.25, 0.55], "AP-1": [0.20, 0.50], "CTCF": [0.10, 0.30] },
  GM12878: { "IRF family":  [0.35, 0.55], "ETS family": [0.25, 0.50], "AP-1": [0.20, 0.45], "CTCF": [0.15, 0.35] },
  HepG2:   { "HNF4 family": [0.30, 0.60], "ETS family": [0.20, 0.45], "AP-1": [0.15, 0.40], "CTCF": [0.10, 0.25] },
  HEK293:  { "SP1/GC-box":  [0.25, 0.55], "ETS family": [0.20, 0.45], "AP-1": [0.15, 0.40], "CTCF": [0.10, 0.25] },
};

// TF motifs used for per-sequence counting (consensus core sequences)
const TF_MOTIFS = [
  { name: "GATA",  seq: "TGATAG" },
  { name: "ETS",   seq: "GGAAG"  },
  { name: "AP-1",  seq: "TGACTCA" },
  { name: "CTCF",  seq: "CCGCG"  },
  { name: "IRF",   seq: "GAAA"   },
  { name: "HNF4",  seq: "AGGTCA" },
  { name: "SP1",   seq: "GCGCGC" },
  { name: "TATA",  seq: "TATAAA" },
];

function countMotifHits(seq, motifs) {
  return motifs.map((m) => {
    let i = 0, c = 0;
    while ((i = seq.indexOf(m.seq, i)) !== -1) { c++; i++; }
    return { name: m.name, count: c };
  });
}

function seqMetrics(seq) {
  const s = cleanSequence(seq);
  if (!s.length) return null;
  const gc = Math.round((s.match(/[GC]/g)?.length ?? 0) / s.length * 1000) / 10;
  const cpg = (s.match(/CG/g)?.length ?? 0);
  const motifHits = countMotifHits(s, TF_MOTIFS);
  const totalMotifs = motifHits.reduce((n, m) => n + m.count, 0);
  // Heuristic activity: GC proximity to 50% + motif density bonus
  const gcBonus = Math.max(0, 1 - Math.abs(gc - 50) / 30);
  const activity = Math.round((gcBonus * 0.5 + Math.min(totalMotifs / 20, 1) * 0.5) * 100) / 100;
  return { gc, cpg, totalMotifs, activity, motifHits };
}

// Range-based verdict: criteria from DNA-Diffusion / Polygraph / ENCODE
// "Within real range" = all 3 metrics inside published bands
// "Partially real-like" = 2 of 3 inside bands
// "Out-of-distribution" = fewer than 2 inside bands
function verdict(metrics) {
  const gcOk  = metrics.gc >= REAL_REF.gc.min  && metrics.gc <= REAL_REF.gc.max;
  const cpgOk = metrics.cpg >= REAL_REF.cpg.min && metrics.cpg <= REAL_REF.cpg.max;
  const motOk = metrics.totalMotifs >= REAL_REF.motifs.min && metrics.totalMotifs <= REAL_REF.motifs.max;
  const passing = [gcOk, cpgOk, motOk].filter(Boolean).length;
  if (passing === 3) return { label: "Within real range",    cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", passing };
  if (passing === 2) return { label: "Partially real-like",  cls: "text-amber-400 bg-amber-500/10 border-amber-500/30",       passing };
  return               { label: "Out-of-distribution",      cls: "text-rose-400 bg-rose-500/10 border-rose-500/30",          passing };
}

// GC histogram: synthetic counts vs uniform density across real reference band
function buildGcBins(values) {
  const bins = [];
  for (let lo = 25; lo < 85; lo += 5) {
    const hi = lo + 5;
    const synth = values.filter((v) => v >= lo && v < hi).length;
    // Real reference: uniform across 40–65% band, 0 outside
    const inBand = lo >= REAL_REF.gc.min && hi <= REAL_REF.gc.max + 5;
    const bandWidth = REAL_REF.gc.max - REAL_REF.gc.min; // 25 percentage points = 5 bins
    const real = inBand ? parseFloat((values.length / (bandWidth / 5)).toFixed(1)) : 0;
    bins.push({ range: `${lo}–${hi}`, synth, real });
  }
  return bins;
}

const TOOLTIP_STYLE = { contentStyle: { background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }, labelStyle: { color: "#94a3b8" } };

function SyntheticVsRealContent() {
  const [cellType, setCellType] = useState("HEK293");

  const library = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("dna_library") ?? "[]"); } catch { return []; }
  }, []);

  const analyzed = useMemo(() =>
    library.map((entry) => {
      const m = seqMetrics(entry.sequence);
      if (!m) return null;
      return { ...entry, metrics: m, verdict: verdict(m) };
    }).filter(Boolean),
  [library]);

  const synthMeans = useMemo(() => {
    if (!analyzed.length) return null;
    const gc  = analyzed.reduce((s, e) => s + e.metrics.gc, 0) / analyzed.length;
    const cpg = analyzed.reduce((s, e) => s + e.metrics.cpg, 0) / analyzed.length;
    const mot = analyzed.reduce((s, e) => s + e.metrics.totalMotifs, 0) / analyzed.length;
    const act = analyzed.reduce((s, e) => s + e.metrics.activity, 0) / analyzed.length;
    return { gc: gc.toFixed(1), cpg: cpg.toFixed(1), motifs: mot.toFixed(1), activity: act.toFixed(2) };
  }, [analyzed]);

  const gcBins = useMemo(() =>
    analyzed.length ? buildGcBins(analyzed.map((e) => e.metrics.gc)) : [],
  [analyzed]);

  // TF motif chart: synthetic mean hits vs cell-type presence frequency range midpoint
  const tfData = useMemo(() => {
    if (!analyzed.length) return [];
    const presence = TF_PRESENCE[cellType];
    return TF_MOTIFS.map((m) => {
      const synthMean = analyzed.reduce((s, e) => {
        const hit = e.metrics.motifHits.find((h) => h.name === m.name);
        return s + (hit?.count ?? 0);
      }, 0) / analyzed.length;
      // Match TF name to presence family (partial match)
      const presenceKey = Object.keys(presence).find((k) => k.toLowerCase().includes(m.name.toLowerCase().slice(0, 3)));
      const [lo, hi] = presenceKey ? presence[presenceKey] : [0.15, 0.40];
      const realMidFreq = (lo + hi) / 2; // fraction of seqs with ≥1 hit → scale to mean hits
      return { tf: m.name, Synthetic: parseFloat(synthMean.toFixed(2)), "Real (freq×2)": parseFloat((realMidFreq * 2).toFixed(2)) };
    });
  }, [analyzed, cellType]);

  // Summary counts for verdict badges
  const verdictCounts = useMemo(() => {
    const counts = { "Within real range": 0, "Partially real-like": 0, "Out-of-distribution": 0 };
    analyzed.forEach((e) => { counts[e.verdict.label] = (counts[e.verdict.label] ?? 0) + 1; });
    return counts;
  }, [analyzed]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-300">
          Cell type (TF reference):
          <select
            value={cellType}
            onChange={(e) => setCellType(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 text-sm"
          >
            {Object.keys(TF_PRESENCE).map((ct) => <option key={ct}>{ct}</option>)}
          </select>
        </label>
        <span className="text-xs text-slate-500">
          {analyzed.length} sequences · GC band 40–72% · CpG band 3–18 · Motifs band 2–25
          <span className="ml-1 text-slate-600">(DNA-Diffusion / ENCODE / Polygraph)</span>
        </span>
      </div>

      {analyzed.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center text-slate-500 text-sm">
          No sequences in library yet — generate some from the{" "}
          <span className="text-indigo-400">DNA Sequence Generator</span> first.
        </div>
      ) : (
        <>
          {/* Verdict summary badges */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Within real range",   cls: "border-emerald-700 bg-emerald-500/5 text-emerald-300" },
              { label: "Partially real-like", cls: "border-amber-700 bg-amber-500/5 text-amber-300" },
              { label: "Out-of-distribution", cls: "border-rose-700 bg-rose-500/5 text-rose-300" },
            ].map(({ label, cls }) => (
              <div key={label} className={`border rounded-lg p-4 text-center ${cls}`}>
                <p className="text-3xl font-bold">{verdictCounts[label] ?? 0}</p>
                <p className="text-xs mt-1 opacity-80">{label}</p>
                <p className="text-xs opacity-50 mt-0.5">
                  {analyzed.length ? Math.round(((verdictCounts[label] ?? 0) / analyzed.length) * 100) : 0}%
                </p>
              </div>
            ))}
          </div>

          {/* Aggregate metrics table */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
              <p className="text-xs text-slate-500 uppercase tracking-widest">
                Aggregate metrics — synthetic vs ENCODE reference ranges
              </p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-6 py-3 text-xs text-slate-500 font-medium">Metric</th>
                  <th className="px-6 py-3 text-xs text-indigo-400 font-medium text-right">Synthetic (mean)</th>
                  <th className="px-6 py-3 text-xs text-emerald-400 font-medium text-right">Real reference band</th>
                  <th className="px-6 py-3 text-xs text-slate-500 font-medium text-right">In band?</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "GC content (%)",     synth: synthMeans.gc,     ref: REAL_REF.gc,     unit: "%" },
                  { label: "CpG sites per seq",  synth: synthMeans.cpg,    ref: REAL_REF.cpg,    unit: "" },
                  { label: "Motifs per sequence",synth: synthMeans.motifs,  ref: REAL_REF.motifs, unit: "" },
                ].map(({ label, synth, ref: r, unit }) => {
                  const val = parseFloat(synth);
                  const inBand = val >= r.min && val <= r.max;
                  return (
                    <tr key={label} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="px-6 py-3 text-slate-300">{label}</td>
                      <td className="px-6 py-3 text-indigo-300 font-mono text-right">{synth}{unit}</td>
                      <td className="px-6 py-3 text-emerald-300 font-mono text-right">{r.min}–{r.max}{unit} (mean {r.mean}{unit})</td>
                      <td className="px-6 py-3 text-right">
                        <span className={`px-2 py-0.5 rounded border text-xs ${inBand ? "text-emerald-400 border-emerald-700 bg-emerald-500/10" : "text-rose-400 border-rose-700 bg-rose-500/10"}`}>
                          {inBand ? "✓ Yes" : "✗ No"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GC% histogram */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">GC content distribution</p>
              <p className="text-xs text-slate-600 mb-4">Real band = uniform across 40–72%</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={gcBins} barGap={2}>
                  <XAxis dataKey="range" tick={{ fontSize: 9, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} allowDecimals={false} />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  <Bar dataKey="synth" name="Synthetic" fill="#6366f1" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="real"  name="Real (expected)" fill="#10b981" radius={[3, 3, 0, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* TF motif chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">TF motif hits per sequence</p>
              <p className="text-xs text-slate-600 mb-4">Real = midpoint of {cellType} presence frequency × 2 (DNA-Diffusion)</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={tfData} layout="vertical" barGap={2}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis type="category" dataKey="tf" tick={{ fontSize: 10, fill: "#94a3b8" }} width={48} />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  <Bar dataKey="Synthetic"     fill="#6366f1" radius={[0, 3, 3, 0]} />
                  <Bar dataKey="Real (freq×2)" fill="#10b981" radius={[0, 3, 3, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Per-sequence table */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
              <p className="text-xs text-slate-500 uppercase tracking-widest">Per-sequence breakdown</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">ID</th>
                    <th className="px-4 py-3 text-slate-500 font-medium text-right">GC% <span className="text-slate-700">[40–72]</span></th>
                    <th className="px-4 py-3 text-slate-500 font-medium text-right">CpG <span className="text-slate-700">[3–18]</span></th>
                    <th className="px-4 py-3 text-slate-500 font-medium text-right">Motifs <span className="text-slate-700">[2–25]</span></th>
                    <th className="px-4 py-3 text-slate-500 font-medium text-right">Activity</th>
                    <th className="px-4 py-3 text-slate-500 font-medium text-right">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {analyzed.slice(0, 25).map((entry) => {
                    const gcOk  = entry.metrics.gc >= 40 && entry.metrics.gc <= 72;
                    const cpgOk = entry.metrics.cpg >= 3 && entry.metrics.cpg <= 18;
                    const motOk = entry.metrics.totalMotifs >= 2 && entry.metrics.totalMotifs <= 25;
                    return (
                      <tr key={entry.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="px-4 py-2.5 font-mono text-indigo-300">{entry.id}</td>
                        <td className={`px-4 py-2.5 text-right font-mono ${gcOk ? "text-slate-300" : "text-rose-400"}`}>{entry.metrics.gc}%</td>
                        <td className={`px-4 py-2.5 text-right font-mono ${cpgOk ? "text-slate-300" : "text-rose-400"}`}>{entry.metrics.cpg}</td>
                        <td className={`px-4 py-2.5 text-right font-mono ${motOk ? "text-slate-300" : "text-rose-400"}`}>{entry.metrics.totalMotifs}</td>
                        <td className="px-4 py-2.5 text-right text-slate-300">{entry.metrics.activity.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-right">
                          <span className={`px-2 py-0.5 rounded border text-xs ${entry.verdict.cls}`}>
                            {entry.verdict.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AnalyzerContent() {
  const [sequence, setSequence] = useState("ATGCGTACGTAGCTAGCTAGCTGATCGATCG");
  const cleaned = cleanSequence(sequence);
  const gc = cleaned.length ? Math.round((cleaned.match(/[GC]/g)?.length || 0) / cleaned.length * 100) : 0;
  const motifs = ["TATA", "CGTA", "GCG"].filter((motif) => cleaned.includes(motif));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-6">
        <label className="text-sm text-slate-300">Sequence input</label>
        <textarea value={sequence} onChange={(e) => setSequence(e.target.value)} rows={7} className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 font-mono outline-none focus:border-indigo-500" />
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <QuickCard title="Sequence Length" value={cleaned.length} detail="bases" icon={Dna} />
        <QuickCard title="GC Content" value={`${gc}%`} detail="live" icon={SlidersHorizontal} />
        <div>
          <p className="text-sm text-slate-400 mb-2">Detected motifs</p>
          <div className="flex flex-wrap gap-2">
            {(motifs.length ? motifs : ["No motifs yet"]).map((motif) => (
              <span key={motif} className="px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-200 border border-indigo-500/20 text-sm">{motif}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LibraryContent() {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dna_library") ?? "[]"); }
    catch { return []; }
  });
  const [copiedId, setCopiedId] = useState(null);

  const filtered = entries.filter((item) =>
    `${item.id} ${item.sequence} ${item.cellType}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleCopy = (seq, id) => {
    navigator.clipboard.writeText(seq);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem("dna_library", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setEntries([]);
    localStorage.removeItem("dna_library");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <div className="flex gap-3 mb-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by sequence, cell type, or ID..."
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-indigo-500"
        />
        {entries.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-2 border border-red-800 hover:bg-red-900/30 text-red-400 rounded-lg px-4 py-2 text-sm"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        )}
        <ExportMenu entries={filtered} label="Export" />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <Library className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">
            {entries.length === 0
              ? "No sequences yet — generate some from the DNA Sequence Generator."
              : "No matches for your filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center gap-3"
            >
              <div className="flex-shrink-0 space-y-1 min-w-[140px]">
                <p className="text-white font-semibold text-sm font-mono">{item.id}</p>
                <p className="text-xs text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded w-fit">{item.cellType}</p>
                <p className="text-xs text-slate-500">{new Date(item.generatedAt).toLocaleString()}</p>
              </div>
              <p className="flex-1 text-slate-300 font-mono text-xs break-all leading-6">{item.sequence}</p>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleCopy(item.sequence, item.id)}
                  className="inline-flex items-center gap-1 text-xs border border-slate-700 hover:bg-slate-800 text-slate-300 rounded px-3 py-1.5"
                >
                  <Copy className="w-3 h-3" />
                  {copiedId === item.id ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="inline-flex items-center gap-1 text-xs border border-red-900 hover:bg-red-900/30 text-red-400 rounded px-3 py-1.5"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


const SETTINGS_KEY = "user_settings";
const DEFAULTS = { lab: "Lab 04", emailAlerts: true, autoDeploy: false, notifyGeneration: true, notifyMotifs: false, notifyModel: true };

function Toggle({ label, description, checked, onChange }) {
  return (
    <label className="flex items-center justify-between p-4 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors cursor-pointer">
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div
        onClick={onChange}
        className={`relative w-10 h-6 rounded-full transition-colors ${checked ? "bg-indigo-600" : "bg-slate-700"}`}
      >
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`} />
      </div>
    </label>
  );
}

function SettingsContent() {
  const [settings, setSettings] = useState(() => {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "{}") }; }
    catch { return DEFAULTS; }
  });
  const [saved, setSaved] = useState(false);

  const update = (key) => (value) => {
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const libraryCount = (() => { try { return JSON.parse(localStorage.getItem("dna_library") ?? "[]").length; } catch { return 0; } })();

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Lab info */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Lab Profile</h3>
        <label className="block">
          <span className="text-xs text-slate-400 mb-1.5 block">Lab name</span>
          <input
            value={settings.lab}
            onChange={(e) => update("lab")(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors"
          />
        </label>
      </div>

      {/* Notifications */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-1">Notifications</h3>
        <Toggle
          label="Generation complete"
          description="Alert when a sequence batch finishes generating"
          checked={settings.notifyGeneration}
          onChange={() => update("notifyGeneration")(!settings.notifyGeneration)}
        />
        <Toggle
          label="Motif detection alerts"
          description="Notify when rare regulatory motifs are found"
          checked={settings.notifyMotifs}
          onChange={() => update("notifyMotifs")(!settings.notifyMotifs)}
        />
        <Toggle
          label="Model update alerts"
          description="Notify when a new model version is available"
          checked={settings.notifyModel}
          onChange={() => update("notifyModel")(!settings.notifyModel)}
        />
        <Toggle
          label="Email alerts"
          description="Send summary emails for completed runs"
          checked={settings.emailAlerts}
          onChange={() => update("emailAlerts")(!settings.emailAlerts)}
        />
      </div>

      {/* Advanced */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-1">Advanced</h3>
        <Toggle
          label="Auto-deploy validated models"
          description="Push validated checkpoints automatically"
          checked={settings.autoDeploy}
          onChange={() => update("autoDeploy")(!settings.autoDeploy)}
        />
      </div>

      {/* Data */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-1">Local Data</h3>
        <div className="flex items-center justify-between p-4 border border-slate-800 rounded-lg">
          <div>
            <p className="text-sm font-medium text-slate-200">Sequence Library</p>
            <p className="text-xs text-slate-500 mt-0.5">{libraryCount} sequences stored locally</p>
          </div>
          <button
            onClick={() => { if (confirm("Clear all stored sequences? This cannot be undone.")) { localStorage.removeItem("dna_library"); window.location.reload(); } }}
            className="text-xs text-red-400 hover:text-red-300 border border-red-900 hover:bg-red-900/20 px-3 py-1.5 rounded transition-colors"
          >
            Clear Library
          </button>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all ${saved ? "bg-emerald-600 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"}`}
      >
        <Save className="w-4 h-4" />
        {saved ? "Settings saved!" : "Save Settings"}
      </button>
    </div>
  );
}

const PLAYGROUND_MOTIFS = [
  { name: "TATA box",   seq: "TATAAA", color: "indigo" },
  { name: "CAAT box",   seq: "CCAAT",  color: "violet" },
  { name: "GC box",     seq: "GCGCGC", color: "cyan"   },
  { name: "Kozak",      seq: "ACCATG", color: "emerald" },
  { name: "Poly-A",     seq: "AATAAA", color: "amber"  },
  { name: "Start codon",seq: "ATG",    color: "rose"   },
];

const MOTIF_COLOR = {
  indigo:  { span: "bg-indigo-500/20 border-indigo-500/40 text-indigo-200",  btn: "border-indigo-700 text-indigo-300 hover:bg-indigo-900/40" },
  violet:  { span: "bg-violet-500/20 border-violet-500/40 text-violet-200",  btn: "border-violet-700 text-violet-300 hover:bg-violet-900/40" },
  cyan:    { span: "bg-cyan-500/20 border-cyan-500/40 text-cyan-200",        btn: "border-cyan-700 text-cyan-300 hover:bg-cyan-900/40" },
  emerald: { span: "bg-emerald-500/20 border-emerald-500/40 text-emerald-200",btn:"border-emerald-700 text-emerald-300 hover:bg-emerald-900/40"},
  amber:   { span: "bg-amber-500/20 border-amber-500/40 text-amber-200",     btn: "border-amber-700 text-amber-300 hover:bg-amber-900/40" },
  rose:    { span: "bg-rose-500/20 border-rose-500/40 text-rose-200",        btn: "border-rose-700 text-rose-300 hover:bg-rose-900/40" },
};

function scoreSequence(seq) {
  if (!seq.length) return { gc: 0, motifCount: 0, expressionScore: 0, complexity: 0 };
  const gc = (seq.match(/[GC]/g)?.length || 0) / seq.length;
  const motifCount = PLAYGROUND_MOTIFS.reduce((n, m) => {
    let i = 0, c = 0;
    while ((i = seq.indexOf(m.seq, i)) !== -1) { c++; i++; }
    return n + c;
  }, 0);
  // Complexity: ratio of unique 3-mers to possible
  const trimers = new Set();
  for (let i = 0; i <= seq.length - 3; i++) trimers.add(seq.slice(i, i + 3));
  const complexity = Math.min(trimers.size / 32, 1);
  // Expression score: heuristic weighted sum
  const gcBonus = gc >= 0.4 && gc <= 0.6 ? 1 : 1 - Math.abs(gc - 0.5) * 2;
  const expressionScore = Math.round(Math.max(0, Math.min(100, gcBonus * 40 + motifCount * 12 + complexity * 30)));
  return { gc: Math.round(gc * 100), motifCount, expressionScore, complexity: Math.round(complexity * 100) };
}

function getBaseColor(base) {
  return { A: "text-emerald-400", T: "text-rose-400", G: "text-amber-400", C: "text-cyan-400" }[base] ?? "text-slate-400";
}

function ScoreBar({ label, value, max = 100, color = "indigo" }) {
  const pct = Math.round((value / max) * 100);
  const barColor = { indigo: "bg-indigo-500", emerald: "bg-emerald-500", amber: "bg-amber-500", rose: "bg-rose-500" }[color];
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs font-mono text-white">{value}{max !== 100 ? `/${max}` : "%"}</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} transition-all duration-200 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MutationPlaygroundContent() {
  const [bases, setBases] = useState(() =>
    "ATGCGTACGTATATAACGCAATGCGTAGCTAGCTGATCGATCG".split("")
  );
  const [selected, setSelected] = useState(null);
  const [insertPos, setInsertPos] = useState(null);

  const seq = bases.join("");
  const scores = scoreSequence(seq);

  // Highlight ranges where known motifs appear
  const motifRanges = useMemo(() => {
    const ranges = [];
    PLAYGROUND_MOTIFS.forEach((m) => {
      let i = 0;
      while ((i = seq.indexOf(m.seq, i)) !== -1) {
        ranges.push({ start: i, end: i + m.seq.length - 1, color: m.color, name: m.name });
        i++;
      }
    });
    return ranges;
  }, [seq]);

  function colorForIndex(i) {
    for (const r of motifRanges) {
      if (i >= r.start && i <= r.end) return r.color;
    }
    return null;
  }

  function cycleBase(i) {
    const order = ["A", "T", "G", "C"];
    setBases((b) => { const n = [...b]; n[i] = order[(order.indexOf(n[i]) + 1) % 4]; return n; });
    setSelected(i);
    setInsertPos(null);
  }

  function deleteBase(i) {
    setBases((b) => b.filter((_, j) => j !== i));
    setSelected(null);
  }

  function insertMotif(motifSeq) {
    const pos = insertPos ?? bases.length;
    setBases((b) => [...b.slice(0, pos), ...motifSeq.split(""), ...b.slice(pos)]);
    setInsertPos(pos + motifSeq.length);
  }

  function reset() {
    setBases("ATGCGTACGTATATAACGCAATGCGTAGCTAGCTGATCGATCG".split(""));
    setSelected(null);
    setInsertPos(null);
  }

  function saveToLibrary() {
    const lib = (() => { try { return JSON.parse(localStorage.getItem("dna_library") ?? "[]"); } catch { return []; } })();
    lib.unshift({ id: `PLY-${Date.now().toString(36).toUpperCase()}`, sequence: seq, cellType: "playground", generatedAt: new Date().toISOString() });
    localStorage.setItem("dna_library", JSON.stringify(lib));
  }

  return (
    <div className="space-y-6">
      {/* Motif palette */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Insert motif</p>
          <span className="text-xs text-slate-600">
            {insertPos != null ? `at position ${insertPos}` : "at end — click a base to set position"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PLAYGROUND_MOTIFS.map((m) => (
            <button
              key={m.name}
              onClick={() => insertMotif(m.seq)}
              className={`inline-flex items-center gap-1.5 text-xs border rounded-md px-3 py-1.5 font-mono transition-colors ${MOTIF_COLOR[m.color].btn}`}
            >
              <span className="font-sans text-slate-400 not-italic">{m.name}</span>
              {m.seq}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sequence editor */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 uppercase tracking-widest">
              Sequence editor — <span className="text-slate-400 normal-case">click to cycle base · right-click to delete · click to set insert position</span>
            </p>
            <div className="flex gap-2">
              <button onClick={reset} className="text-xs text-slate-500 hover:text-slate-300 border border-slate-700 rounded px-3 py-1">Reset</button>
              <button onClick={saveToLibrary} className="inline-flex items-center gap-1 text-xs border border-emerald-700 text-emerald-300 hover:bg-emerald-900/30 rounded px-3 py-1">
                <Save className="w-3 h-3" /> Save
              </button>
            </div>
          </div>

          <div className="font-mono text-sm leading-8 break-all select-none">
            {bases.map((base, i) => {
              const motifColor = colorForIndex(i);
              const isSelected = selected === i;
              const isInsertPos = insertPos === i;
              return (
                <span key={i} className="relative inline-block">
                  {isInsertPos && (
                    <span className="absolute -left-px top-0 bottom-0 w-0.5 bg-indigo-400 animate-pulse" />
                  )}
                  <span
                    onClick={() => { cycleBase(i); setInsertPos(i); }}
                    onContextMenu={(e) => { e.preventDefault(); deleteBase(i); }}
                    title={`Position ${i + 1} · click to cycle · right-click to delete`}
                    className={[
                      "cursor-pointer rounded px-px transition-all",
                      getBaseColor(base),
                      isSelected ? "bg-white/10 ring-1 ring-white/30" : "hover:bg-white/5",
                      motifColor ? `underline decoration-2 decoration-${motifColor}-400/60` : "",
                    ].join(" ")}
                  >
                    {base}
                  </span>
                </span>
              );
            })}
          </div>

          {/* Motif legend */}
          {motifRanges.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
              {[...new Map(motifRanges.map((r) => [r.name, r])).values()].map((r) => (
                <span key={r.name} className={`text-xs px-2 py-0.5 rounded border ${MOTIF_COLOR[r.color].span}`}>
                  {r.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Live scores */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-5">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Live analysis</p>

          <div className="text-center py-3">
            <p className="text-xs text-slate-500 mb-1">Expression score</p>
            <p className={`text-5xl font-bold tabular-nums ${scores.expressionScore >= 70 ? "text-emerald-400" : scores.expressionScore >= 40 ? "text-amber-400" : "text-rose-400"}`}>
              {scores.expressionScore}
            </p>
            <p className="text-xs text-slate-600 mt-1">/ 100</p>
          </div>

          <div className="space-y-4">
            <ScoreBar label="GC Content" value={scores.gc} color={scores.gc >= 40 && scores.gc <= 60 ? "emerald" : "amber"} />
            <ScoreBar label="Sequence Complexity" value={scores.complexity} color="indigo" />
            <ScoreBar label="Motif Hits" value={scores.motifCount} max={10} color="rose" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <div className="bg-slate-950 rounded p-3 text-center">
              <p className="text-xs text-slate-500">Length</p>
              <p className="text-lg font-bold text-white">{bases.length}</p>
              <p className="text-xs text-slate-600">bp</p>
            </div>
            <div className="bg-slate-950 rounded p-3 text-center">
              <p className="text-xs text-slate-500">Motif hits</p>
              <p className="text-lg font-bold text-white">{scores.motifCount}</p>
              <p className="text-xs text-slate-600">detected</p>
            </div>
          </div>

          <div className="flex gap-1 pt-1 text-xs text-slate-600 justify-center flex-wrap">
            {[["A","text-emerald-400"],["T","text-rose-400"],["G","text-amber-400"],["C","text-cyan-400"]].map(([b, cls]) => (
              <span key={b} className="flex items-center gap-1">
                <span className={`font-mono font-bold ${cls}`}>{b}</span>
                <span>{seq.split("").filter((x) => x === b).length}</span>
                <span className="mr-1">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionContent({ slug }) {
  if (slug === "overview") return <OverviewContent />;
  if (slug === "dna-generator") return <DNAExperimentPanel />;
  if (slug === "synthetic-vs-real") return <SyntheticVsRealContent />;
  if (slug === "mutation-playground") return <MutationPlaygroundContent />;
  if (slug === "analyzer") return <AnalyzerContent />;
  if (slug === "library") return <LibraryContent />;
  if (slug === "analytics") return <SyntheticDNAAnalytics />;
  if (slug === "settings") return <SettingsContent />;
  return <OverviewContent />;
}

export default function DashboardSection({ slug = "overview" }) {
  const currentSlug = sections[slug] ? slug : "overview";
  const section = useMemo(() => sections[currentSlug], [currentSlug]);

  return (
    <div className="space-y-8">
      <SectionHeader section={section} />
      <SectionContent slug={currentSlug} />
    </div>
  );
}
