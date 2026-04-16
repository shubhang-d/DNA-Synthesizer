"use client";

import { useState } from "react";
import { Cookie, ShieldCheck, X } from "lucide-react";

export default function PrivacyConsentCard() {
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[calc(100%-2.5rem)] max-w-sm rounded-lg border border-slate-700/70 bg-slate-950/90 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="relative flex flex-col px-6 pb-5 pt-8">
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="absolute right-3 top-3 rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200"
          aria-label="Close privacy notice"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="absolute left-6 top-0 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 shadow-lg shadow-emerald-950/30">
          <Cookie className="h-6 w-6" />
        </span>

        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-cyan-300" />
          <h5 className="text-sm font-semibold text-slate-100">
            Your privacy is important to us
          </h5>
        </div>

        <p className="text-sm leading-relaxed text-slate-400">
          We use privacy-safe analytics to improve DNA workflow previews, model
          demos, and platform performance.
          {expanded && (
            <>
              {" "}You can continue with essential cookies only, or allow
              research experience improvements for a more personalized demo.
            </>
          )}
        </p>

        <a className="mt-2 w-max cursor-pointer text-sm font-semibold text-emerald-300 underline underline-offset-4 transition-colors hover:text-emerald-200">
          Privacy Policy
        </a>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="text-sm font-semibold text-slate-400 transition-colors hover:text-slate-100"
          >
            {expanded ? "Less Options" : "More Options"}
          </button>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="rounded-lg bg-emerald-400 px-6 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
