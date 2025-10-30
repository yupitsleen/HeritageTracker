import { memo } from "react";
import { AboutHeader } from "./sections/AboutHeader";
import { MissionSection } from "./sections/MissionSection";
import { ResponsibilitySection } from "./sections/ResponsibilitySection";
import { MethodologySection } from "./sections/MethodologySection";
import { DataSourcesSection } from "./sections/DataSourcesSection";
import { TheDataSection } from "./sections/TheDataSection";
import { ResearchSection } from "./sections/ResearchSection";
import { LegalFrameworkSection } from "./sections/LegalFrameworkSection";
import { ContributingSection } from "./sections/ContributingSection";
import { AcknowledgmentsSection } from "./sections/AcknowledgmentsSection";
import { AttributionSection } from "./sections/AttributionSection";
import type { GazaSite } from "../../types";

interface AboutProps {
  sites: GazaSite[];
}

/**
 * About/Methodology page explaining the project's purpose, data sources, and verification process
 * Establishes credibility and transparency for the Heritage Tracker project
 * Supports dark mode
 *
 * Performance optimizations:
 * - Removed lazy loading (sections are small, overhead > benefit)
 * - Added CSS containment for better scroll performance
 * - Memoized component to prevent unnecessary re-renders
 */
export const About = memo(function About({ sites }: AboutProps) {
  return (
    <div style={{ contain: 'layout style paint' }}>
      <div className="p-3 md:p-6">
        <AboutHeader />
        <MissionSection />
        <ResponsibilitySection />
        <MethodologySection />
        <DataSourcesSection />
        <TheDataSection sites={sites} />
        <ResearchSection />
        <LegalFrameworkSection />
        <ContributingSection />
        <AcknowledgmentsSection />
        <AttributionSection />
      </div>
    </div>
  );
});
