"use client";

export default function SplineViewer() {
  return (
    <div className="w-full h-[420px] md:h-[500px] rounded-3xl overflow-hidden flex items-center justify-center bg-slate-900/80 backdrop-blur-xl border-2 border-cyan-500/30 hover:border-cyan-400/80 shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_40px_rgba(0,255,255,0.4),0_0_80px_rgba(139,92,246,0.2)] transition-all duration-500 relative group hover:scale-[1.01] animate-border-glow">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl blur-xl"></div>
      
      <iframe
        src="https://my.spline.design/dnahelix-3dmodel/scene.splinecode"
        className="w-full h-full object-cover relative z-10"
        frameBorder="0"
        allow="fullscreen"
        loading="lazy"
      ></iframe>

      {/* Persistent mask for "Built with Spline" watermark */}
      <div className="absolute bottom-0 right-0 w-44 h-14 bg-slate-900 z-20 pointer-events-none rounded-tl-xl border-t border-l border-slate-800/50 flex items-center justify-center">
         <div className="w-24 h-1 bg-slate-800 rounded-full opacity-50 blur-sm"></div>
      </div>
      
      {/* Additional ambient lighting overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#0b0f19_100%)] pointer-events-none z-10 opacity-60"></div>
    </div>
  );
}
