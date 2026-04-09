import HeroSection from "../src/components/HeroSection";
import WorkflowPipeline from "../src/components/WorkflowPipeline";
import AnalyticsCards from "../src/components/AnalyticsCards";
import DNAExperimentPanel from "../src/components/DNAExperimentPanel";
import FeatureCards from "../src/components/FeatureCards";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f19] to-[#111827] grid-pattern relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
      <HeroSection />
      <FeatureCards />

      <WorkflowPipeline />
      <AnalyticsCards />
      <DNAExperimentPanel />
    </div>
  );
}
