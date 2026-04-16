"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Brain,
  CheckCircle2,
  Dna,
  Download,
  FileUp,
  FlaskConical,
  Library,
  Play,
  Save,
  Search,
  Settings,
  SlidersHorizontal,
  Upload
} from "lucide-react";
import AnalyticsCards from "./AnalyticsCards";
import DNAExperimentPanel from "./DNAExperimentPanel";

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
  experiments: {
    title: "Experiment Results",
    description: "Review completed experiment runs and export summarized outcomes.",
    icon: FlaskConical,
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

const savedSequences = [
  { id: "REG-1042", sequence: "ATGCGTACGTAGCTAGCTA", score: 94, status: "Validated" },
  { id: "ENH-2217", sequence: "CGTATGCCGATATTCGCAA", score: 88, status: "Queued" },
  { id: "PROM-0631", sequence: "TTGACATGACTAGCGATAC", score: 81, status: "Review" },
];

const experimentRows = [
  { run: "EXP-410", model: "DNA v2.0", score: "94.2%", time: "12 min", result: "Passed" },
  { run: "EXP-409", model: "DNA v1.8", score: "89.7%", time: "18 min", result: "Passed" },
  { run: "EXP-408", model: "MotifScan Beta", score: "76.4%", time: "9 min", result: "Needs Review" },
];

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

function OverviewContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickCard title="Active Sequences" value="2,847" detail="+12.5%" icon={Dna} />
        <QuickCard title="Training Jobs" value="6" detail="2 running" icon={Brain} />
        <QuickCard title="Validated Motifs" value="1,203" detail="+8.7%" icon={CheckCircle2} />
      </div>
      <DNAExperimentPanel />
    </div>
  );
}

function TrainingContent() {
  const [epochs, setEpochs] = useState(40);
  const [rate, setRate] = useState("0.0003");
  const [progress, setProgress] = useState(62);

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
  const rows = savedSequences.filter((item) => `${item.id} ${item.sequence} ${item.status}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter library..." className="w-full mb-5 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-indigo-500" />
      <div className="space-y-3">
        {rows.map((item) => (
          <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-white font-semibold">{item.id}</span>
            <span className="text-slate-400 font-mono text-sm md:col-span-2">{item.sequence}</span>
            <span className="text-emerald-300">{item.score}% - {item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperimentsContent() {
  const [exported, setExported] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <button onClick={() => setExported(true)} className="mb-5 inline-flex items-center gap-2 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-lg px-4 py-2">
        <Download className="w-4 h-4" />
        {exported ? "Results Exported" : "Export Results"}
      </button>
      {exported && <span className="ml-3 text-sm text-emerald-300">CSV package prepared for the current run set.</span>}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3">Run</th>
              <th>Model</th>
              <th>Score</th>
              <th>Time</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {experimentRows.map((row) => (
              <tr key={row.run} className="border-b border-slate-800/70">
                <td className="py-4 text-white font-semibold">{row.run}</td>
                <td className="text-slate-300">{row.model}</td>
                <td className="text-emerald-300">{row.score}</td>
                <td className="text-slate-400">{row.time}</td>
                <td className="text-slate-300">{row.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  if (slug === "experiments") return <ExperimentsContent />;
  if (slug === "upload") return <UploadContent />;
  if (slug === "analytics") return <AnalyticsCards />;
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
