import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { mockSites } from "./data/mockSites";
import { CalendarProvider } from "./contexts/CalendarContext";
import { AnimationProvider } from "./contexts/AnimationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocaleProvider } from "./contexts/LocaleContext";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { ScrollToTop } from "./components/ScrollToTop";
import { DashboardPage } from "./pages/DashboardPage";
import { Timeline } from "./pages/Timeline";
import { AboutPage } from "./pages/AboutPage";
import { StatsPage } from "./pages/StatsPage";
import { DonatePage } from "./pages/DonatePage";
import { DataPage } from "./pages/DataPage";
import { OrganizationsPage, ResearchPage, MediaPage, EducationPage, LegalPage, TrackersPage } from "./pages/resources";
import { BREAKPOINTS } from "./constants/layout";

/**
 * Router component with routes
 */
function AppRouter({ isMobile }: { isMobile: boolean }) {
  return (
    <Routes>
      {/* On mobile, show DataPage instead of DashboardPage (no AnimationProvider needed) */}
      <Route path="/" element={isMobile ? <DataPage /> : <DashboardPage />} />
      <Route path="/data" element={<DataPage />} />
      <Route path="/timeline" element={<Timeline />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/stats" element={<StatsPage />} />

      {/* Legacy donate route - redirect to resources/donate */}
      <Route path="/donate" element={<DonatePage />} />

      {/* Resources routes */}
      <Route path="/resources/donate" element={<DonatePage />} />
      <Route path="/resources/organizations" element={<OrganizationsPage />} />
      <Route path="/resources/research" element={<ResearchPage />} />
      <Route path="/resources/media" element={<MediaPage />} />
      <Route path="/resources/education" element={<EducationPage />} />
      <Route path="/resources/legal" element={<LegalPage />} />
      <Route path="/resources/trackers" element={<TrackersPage />} />
    </Routes>
  );
}

/**
 * App wrapper with providers
 * ErrorBoundary wraps AnimationProvider to gracefully handle timeline errors
 * AnimationProvider only active on desktop (where timeline is shown)
 */
export function App() {
  // Check if we're on mobile - initialize immediately from window.innerWidth
  const [isMobile, setIsMobile] = useState(() => {
    // Check during initial render (works in browser, defaults to false in SSR)
    return typeof window !== 'undefined' && window.innerWidth < BREAKPOINTS.MOBILE;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE);
    };

    // Recheck on mount (in case window was resized before mount)
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determine basename - should match Vite's base config
  // Production (GitHub Pages): /HeritageTracker/
  // Development/E2E: /
  const basename = import.meta.env.PROD ? '/HeritageTracker' : '';

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <LocaleProvider>
        <ThemeProvider>
          <CalendarProvider>
            <ErrorBoundary>
              {isMobile ? (
                // Mobile: No AnimationProvider (timeline not shown)
                <AppRouter isMobile={true} />
              ) : (
                // Desktop: AnimationProvider for timeline features
                <AnimationProvider sites={mockSites}>
                  <AppRouter isMobile={false} />
                </AnimationProvider>
              )}
            </ErrorBoundary>
          </CalendarProvider>
        </ThemeProvider>
      </LocaleProvider>
    </BrowserRouter>
  );
}
