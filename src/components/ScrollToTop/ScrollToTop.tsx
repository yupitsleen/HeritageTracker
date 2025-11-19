import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component - scrolls window to top on route change
 *
 * Solves the issue where navigating between pages maintains
 * the scroll position from the previous page.
 *
 * Usage: Place inside BrowserRouter, wraps all routes
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
