import LandingHeader from "../src/components/LandingHeader";
import HeroSection from "../src/components/HeroSection";
import WorkflowPipeline from "../src/components/WorkflowPipeline";
import FeatureCards from "../src/components/FeatureCards";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0f19] relative">
      <LandingHeader />
      <HeroSection />
      <FeatureCards />
      <WorkflowPipeline />
    </div>
  );
}
