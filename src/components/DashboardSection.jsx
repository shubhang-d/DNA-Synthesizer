"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Brain,
  CheckCircle2,
  Dna,
  FileUp,
  Library,
  Play,
  Save,
  Search,
  Settings,
  SlidersHorizontal,
  Trash2,
  Upload,
  Copy,
} from "lucide-react";
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
  "model-training": {
    title: "Diffusion Model Training",
    description: "Tune training parameters and launch a simulated model training run.",
    icon: Brain,
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
  upload: {
    title: "Model Upload",
    description: "Attach a model checkpoint and validate it before deployment.",
    icon: Upload,
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

function TrainingContent() {
  const [epochs, setEpochs] = useState(40);
  const [rate, setRate] = useState("0.0003");
  const [progress, setProgress] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5">
        <label className="block">
          <span className="text-sm text-slate-300">Epochs</span>
          <input value={epochs} onChange={(e) => setEpochs(e.target.value)} type="number" className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-indigo-500" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Learning rate</span>
          <input value={rate} onChange={(e) => setRate(e.target.value)} className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-indigo-500" />
        </label>
        <button onClick={() => setProgress((old) => Math.min(old + 12, 100))} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-5 py-3">
          <Play className="w-4 h-4" />
          Run Training Step
        </button>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <p className="text-sm text-slate-400 mb-2">Training progress</p>
        <p className="text-4xl font-bold text-white mb-6">{progress}%</p>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-slate-500 mt-4">Current config: {epochs || 0} epochs at {rate || "0"} learning rate.</p>
      </div>
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

function UploadContent() {
  const [file, setFile] = useState("");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <label className="flex flex-col items-center justify-center min-h-64 border border-dashed border-slate-700 rounded-lg bg-slate-950 text-center cursor-pointer hover:border-indigo-500 transition-colors">
        <FileUp className="w-10 h-10 text-indigo-300 mb-3" />
        <span className="text-white font-semibold">{file || "Choose model checkpoint"}</span>
        <span className="text-sm text-slate-500 mt-1">.pt, .ckpt, .safetensors</span>
        <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0]?.name || "")} />
      </label>
      {file && <p className="mt-4 text-emerald-300">Ready to validate {file}</p>}
    </div>
  );
}

function SettingsContent() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoDeploy, setAutoDeploy] = useState(false);
  const [lab, setLab] = useState("Lab 04");
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5">
      <label className="block">
        <span className="text-sm text-slate-300">Lab name</span>
        <input value={lab} onChange={(e) => { setLab(e.target.value); setSaved(false); }} className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-indigo-500" />
      </label>
      <label className="flex items-center justify-between border border-slate-800 rounded-lg p-4">
        <span className="text-slate-300">Email training alerts</span>
        <input type="checkbox" checked={emailAlerts} onChange={(e) => { setEmailAlerts(e.target.checked); setSaved(false); }} className="h-5 w-5 accent-indigo-500" />
      </label>
      <label className="flex items-center justify-between border border-slate-800 rounded-lg p-4">
        <span className="text-slate-300">Auto-deploy validated models</span>
        <input type="checkbox" checked={autoDeploy} onChange={(e) => { setAutoDeploy(e.target.checked); setSaved(false); }} className="h-5 w-5 accent-indigo-500" />
      </label>
      <button onClick={() => setSaved(true)} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-5 py-3">
        <Save className="w-4 h-4" />
        {saved ? "Settings Saved" : "Save Settings"}
      </button>
      {saved && <p className="text-sm text-emerald-300">Preferences saved for {lab || "this lab"}.</p>}
    </div>
  );
}

function SectionContent({ slug }) {
  if (slug === "overview") return <OverviewContent />;
  if (slug === "dna-generator") return <DNAExperimentPanel />;
  if (slug === "model-training") return <TrainingContent />;
  if (slug === "analyzer") return <AnalyzerContent />;
  if (slug === "library") return <LibraryContent />;
  if (slug === "upload") return <UploadContent />;
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
