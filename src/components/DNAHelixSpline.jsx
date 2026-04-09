export default function DNAHelixSpline() {
  return (
    <div className="p-6 bg-slate-900/40 rounded-3xl shadow-[0_0_60px_rgba(0,255,255,0.1)] hover:shadow-[0_0_80px_rgba(0,255,255,0.2)] transition-all duration-500">
      <div className="w-[440px] h-[300px] rounded-2xl overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30">
        <iframe 
          src="https://my.spline.design/trails-sYdxgk5qMfE9Af8aeYfQPFAC/" 
          frameBorder="0" 
          className="w-full h-full rounded-2xl"
          allow="fullscreen"
          loading="lazy"
        />
      </div>
    </div>
  );
}
