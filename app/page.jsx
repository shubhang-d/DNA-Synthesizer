import LandingHeader from "../src/components/LandingHeader";
import HeroSection from "../src/components/HeroSection";
import WorkflowPipeline from "../src/components/WorkflowPipeline";
import AnalyticsCards from "../src/components/AnalyticsCards";
import DNAExperimentPanel from "../src/components/DNAExperimentPanel";
import FeaturesSection from "../src/components/FeaturesSection";
import PrivacyConsentCard from "../src/components/PrivacyConsentCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f19] to-[#111827] grid-pattern relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />


      <WorkflowPipeline />
      <AnalyticsCards />
      <DNAExperimentPanel />
      <PrivacyConsentCard />
    </div>
  );
}
