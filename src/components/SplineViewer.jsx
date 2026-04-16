"use client";

export default function SplineViewer() {
  return (
  <div className="w-full h-[420px] md:h-[500px] rounded-3xl overflow-hidden flex items-center justify-center bg-slate-900/80 backdrop-blur-xl border-2 border-transparent shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-400/40 transition-all duration-500 relative group hover:scale-[1.01]">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl blur"></div>
      <iframe
        src="https://my.spline.design/dnahelix-3dmodel/scene.splinecode"
        className="w-[95%] h-[95%] rounded-2xl"
        frameBorder="0"
        allow="fullscreen"
        loading="lazy"
      ></iframe>
      {/* Hide "Built with Spline" watermark */}
      <div className="absolute bottom-2 right-2 w-32 h-10 bg-slate-900/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50 pointer-events-none z-20"></div>
      <div className="absolute bottom-1 right-1 w-28 h-6 bg-slate-900/80 backdrop-blur rounded pointer-events-none"></div>
    </div>
  );
}
