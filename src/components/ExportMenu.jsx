"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Clipboard, ChevronDown, Check } from "lucide-react";

function toFasta(entries) {
  return entries
    .map((e) => `>${e.id} | ${e.cellType} | ${new Date(e.generatedAt).toISOString()}\n${e.sequence}`)
    .join("\n");
}

function toCsv(entries) {
  const header = "id,cell_type,generated_at,sequence";
  const rows = entries.map(
    (e) => `${e.id},${e.cellType},${e.generatedAt},${e.sequence}`
  );
  return [header, ...rows].join("\n");
}

function triggerDownload(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function ExportMenu({ entries, label = "Export" }) {
  const [open,    setOpen]    = useState(false);
  const [copied,  setCopied]  = useState(false);
  const ref = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!entries?.length) return null;

  const timestamp = new Date().toISOString().slice(0, 16).replace("T", "_").replace(":", "-");

  const handleFasta = () => {
    triggerDownload(toFasta(entries), `dna_sequences_${timestamp}.fasta`, "text/plain");
    setOpen(false);
  };

  const handleCsv = () => {
    triggerDownload(toCsv(entries), `dna_sequences_${timestamp}.csv`, "text/csv");
    setOpen(false);
  };

  const handleClipboard = async () => {
    await navigator.clipboard.writeText(toFasta(entries));
    setCopied(true);
    setOpen(false);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 text-sm border border-slate-700 hover:border-indigo-500/60 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg px-4 py-2 transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
        {copied ? "Copied!" : label}
        {!copied && <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-800">
            <p className="text-xs text-slate-500 uppercase tracking-widest">
              {entries.length} sequence{entries.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={handleFasta}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
          >
            <Download className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <div>
              <p className="font-medium">Download FASTA</p>
              <p className="text-xs text-slate-500">.fasta — standard bioinformatics format</p>
            </div>
          </button>

          <button
            onClick={handleCsv}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
          >
            <Download className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div>
              <p className="font-medium">Download CSV</p>
              <p className="text-xs text-slate-500">.csv — ID, cell type, timestamp, sequence</p>
            </div>
          </button>

          <button
            onClick={handleClipboard}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left border-t border-slate-800"
          >
            <Clipboard className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-medium">Copy as FASTA</p>
              <p className="text-xs text-slate-500">paste into any sequence tool</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
