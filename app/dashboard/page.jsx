import AnalyticsCards from "../../src/components/AnalyticsCards";
import DNAExperimentPanel from "../../src/components/DNAExperimentPanel";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">DNA Sequence Generator</h1>
        <p className="text-slate-400 mt-2">Manage your active models, monitor compute usage, and configure diffusion architectures.</p>
      </div>
      
      <AnalyticsCards />
      
      <div className="mt-8 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
         <DNAExperimentPanel />
      </div>
    </div>
  );
}
