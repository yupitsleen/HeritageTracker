import { lazy, Suspense } from "react";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { AboutHeader } from "./sections/AboutHeader";

// Lazy load sections for better performance
const MissionSection = lazy(() => import("./sections/MissionSection").then(m => ({ default: m.MissionSection })));
const MethodologySection = lazy(() => import("./sections/MethodologySection").then(m => ({ default: m.MethodologySection })));
const DataSourcesSection = lazy(() => import("./sections/DataSourcesSection").then(m => ({ default: m.DataSourcesSection })));
const TheDataSection = lazy(() => import("./sections/TheDataSection").then(m => ({ default: m.TheDataSection })));
const ResearchSection = lazy(() => import("./sections/ResearchSection").then(m => ({ default: m.ResearchSection })));
const LegalFrameworkSection = lazy(() => import("./sections/LegalFrameworkSection").then(m => ({ default: m.LegalFrameworkSection })));
const ContributingSection = lazy(() => import("./sections/ContributingSection").then(m => ({ default: m.ContributingSection })));
const AcknowledgmentsSection = lazy(() => import("./sections/AcknowledgmentsSection").then(m => ({ default: m.AcknowledgmentsSection })));
const AttributionSection = lazy(() => import("./sections/AttributionSection").then(m => ({ default: m.AttributionSection })));

/**
 * About/Methodology page explaining the project's purpose, data sources, and verification process
 * Establishes credibility and transparency for the Heritage Tracker project
 * Supports dark mode
 */
export function About() {
  const t = useThemeClasses();

  // Loading skeleton for sections
  const SectionLoader = () => (
    <div className={`animate-pulse my-4 ${t.bg.tertiary} rounded-lg h-20`} />
  );

  return (
    <div className={`max-h-[80vh] overflow-y-auto ${t.bg.primary}`}>
      <div className="p-3 md:p-6 max-w-4xl mx-auto">
        {/* Header loads immediately */}
        <AboutHeader />

        {/* Lazy-loaded sections with loading states */}
        <Suspense fallback={<SectionLoader />}>
          <MissionSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <MethodologySection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <DataSourcesSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <TheDataSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ResearchSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <LegalFrameworkSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ContributingSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <AcknowledgmentsSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <AttributionSection />
        </Suspense>
      </div>
    </div>
  );
}
