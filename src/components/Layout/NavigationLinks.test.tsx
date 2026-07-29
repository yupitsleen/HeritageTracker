import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

/**
 * HIDE_IN_PROD is read at module load, so each case stubs import.meta.env and
 * re-imports fresh. The context modules must be re-imported too, otherwise the
 * providers come from a different module instance than the component consumes.
 */
async function renderNav(prod: boolean) {
  vi.stubEnv("PROD", prod);
  vi.resetModules();
  const { NavigationLinks } = await import("./NavigationLinks");
  const { ThemeProvider } = await import("../../contexts/ThemeContext");
  const { LocaleProvider } = await import("../../contexts/LocaleContext");

  render(
    <BrowserRouter>
      <ThemeProvider>
        <LocaleProvider>
          <NavigationLinks
            activePage="data"
            isMobileSize={false}
            onNavigate={vi.fn()}
            layout="desktop"
          />
        </LocaleProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

describe("NavigationLinks - production nav hiding", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("shows Dashboard and Resources in development builds", async () => {
    await renderNav(false);

    expect(screen.getByRole("button", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resources/i })).toBeInTheDocument();
  });

  it("hides Dashboard and Resources in production builds", async () => {
    await renderNav(true);

    expect(screen.queryByRole("button", { name: /dashboard/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /resources/i })).not.toBeInTheDocument();
    // Other nav items unaffected
    expect(screen.getByRole("button", { name: /timeline/i })).toBeInTheDocument();
  });
});
