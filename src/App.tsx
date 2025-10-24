import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { mockSites } from "./data/mockSites";
import { CalendarProvider } from "./contexts/CalendarContext";
import { AnimationProvider } from "./contexts/AnimationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocaleProvider } from "./contexts/LocaleContext";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import { HomePage } from "./pages/HomePage";
import { AdvancedAnimation } from "./pages/AdvancedAnimation";
import { BREAKPOINTS } from "./constants/layout";

/**
 * Router component with routes
 */
function AppRouter({ isMobile }: { isMobile: boolean }) {
  return (
    <Routes>
      <Route path="/" element={<HomePage isMobile={isMobile} />} />
      <Route path="/advanced-animation" element={<AdvancedAnimation />} />
    </Routes>
  );
}

/**
 * App wrapper with providers
 * ErrorBoundary wraps AnimationProvider to gracefully handle timeline errors
 * AnimationProvider only active on desktop (where timeline is shown)
 */
function App() {
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

  return (
    <BrowserRouter basename="/HeritageTracker">
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

export default App;
