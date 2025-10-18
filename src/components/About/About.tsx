import { useTheme } from "../../contexts/ThemeContext";
import { AboutHeader } from "./sections/AboutHeader";
import { MissionSection } from "./sections/MissionSection";
import { MethodologySection } from "./sections/MethodologySection";
import { DataSourcesSection } from "./sections/DataSourcesSection";
import { TheDataSection } from "./sections/TheDataSection";
import { ResearchSection } from "./sections/ResearchSection";
import { LegalFrameworkSection } from "./sections/LegalFrameworkSection";
import { ContributingSection } from "./sections/ContributingSection";
import { AcknowledgmentsSection } from "./sections/AcknowledgmentsSection";
import { AttributionSection } from "./sections/AttributionSection";

/**
 * About/Methodology page explaining the project's purpose, data sources, and verification process
 * Establishes credibility and transparency for the Heritage Tracker project
 * Supports dark mode
 */
export function About() {
  const { isDark } = useTheme();

  return (
    <div className={`max-h-[80vh] overflow-y-auto ${isDark ? "bg-gray-800" : "bg-white"}`}>
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <AboutHeader />
        <MissionSection />
        <MethodologySection />
        <DataSourcesSection />
        <TheDataSection />
        <ResearchSection />
        <LegalFrameworkSection />
        <ContributingSection />
        <AcknowledgmentsSection />
        <AttributionSection />
      </div>
    </div>
  );
}
