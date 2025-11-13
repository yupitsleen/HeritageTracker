import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { LocaleProvider } from "../../contexts/LocaleContext";

/**
 * Baseline tests for AppHeader responsive behavior
 *
 * These tests verify the CURRENT behavior works correctly.
 * They serve as regression tests during refactoring.
 *
 * Focus: Test USER-VISIBLE behavior, not implementation details
 */

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider>
      <LocaleProvider>
        {children}
      </LocaleProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe("AppHeader - Baseline Behavior", () => {
  describe("Basic Rendering", () => {
    it("renders title", () => {
      render(<AppHeader />, { wrapper: Wrapper });
      expect(screen.getByText(/heritage tracker/i)).toBeInTheDocument();
    });

    it("renders hamburger menu button", () => {
      render(<AppHeader />, { wrapper: Wrapper });
      expect(screen.getByRole("button", { name: /open menu/i })).toBeInTheDocument();
    });

    it("renders desktop navigation buttons", () => {
      render(<AppHeader />, { wrapper: Wrapper });

      // All main navigation should exist in DOM
      expect(screen.getAllByRole("button", { name: /dashboard/i })).toHaveLength(1);
      expect(screen.getAllByRole("button", { name: /data/i })).toHaveLength(1);
      expect(screen.getAllByRole("button", { name: /timeline/i })).toHaveLength(1);
    });
  });

  describe("Hamburger Menu Interaction", () => {
    it("opens mobile menu when hamburger clicked", async () => {
      const user = userEvent.setup();
      render(<AppHeader />, { wrapper: Wrapper });

      const hamburger = screen.getByRole("button", { name: /open menu/i });
      await user.click(hamburger);

      // Mobile navigation should appear
      const navigation = screen.getByRole("navigation");
      expect(navigation).toBeInTheDocument();
    });

    it("shows close icon after opening menu", async () => {
      const user = userEvent.setup();
      render(<AppHeader />, { wrapper: Wrapper });

      await user.click(screen.getByRole("button", { name: /open menu/i }));

      // Button text should change to "Close menu"
      expect(screen.getByRole("button", { name: /close menu/i })).toBeInTheDocument();
    });

    it("closes menu when close button clicked", async () => {
      const user = userEvent.setup();
      render(<AppHeader />, { wrapper: Wrapper });

      // Open menu
      await user.click(screen.getByRole("button", { name: /open menu/i }));
      expect(screen.getByRole("navigation")).toBeInTheDocument();

      // Close menu
      await user.click(screen.getByRole("button", { name: /close menu/i }));
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    });

    it("mobile menu contains navigation items", async () => {
      const user = userEvent.setup();
      render(<AppHeader />, { wrapper: Wrapper });

      await user.click(screen.getByRole("button", { name: /open menu/i }));

      const navigation = screen.getByRole("navigation");

      // Should have at least Data and Timeline buttons
      expect(navigation).toHaveTextContent(/data/i);
      expect(navigation).toHaveTextContent(/timeline/i);
    });

    it("mobile menu contains utility controls (language, theme)", async () => {
      const user = userEvent.setup();
      render(<AppHeader />, { wrapper: Wrapper });

      await user.click(screen.getByRole("button", { name: /open menu/i }));

      const navigation = screen.getByRole("navigation");

      // Should have language and theme labels
      expect(navigation).toHaveTextContent(/language/i);
      expect(navigation).toHaveTextContent(/theme/i);
    });
  });

  describe("Flag Line Decoration", () => {
    it("renders Palestinian flag colored line", () => {
      const { container } = render(<AppHeader />, { wrapper: Wrapper });

      // Flag line has 4 colored sections
      const flagLine = container.querySelector(".flex.h-1");
      expect(flagLine).toBeInTheDocument();
      expect(flagLine?.children).toHaveLength(4);
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels on hamburger button", () => {
      render(<AppHeader />, { wrapper: Wrapper });

      const hamburger = screen.getByRole("button", { name: /open menu/i });
      expect(hamburger).toHaveAccessibleName();
    });

    it("hamburger button has tooltip wrapper", () => {
      render(<AppHeader />, { wrapper: Wrapper });

      const hamburger = screen.getByRole("button", { name: /open menu/i });
      // Button now wrapped in Tooltip component instead of having title attribute
      expect(hamburger).toBeInTheDocument();
      expect(hamburger).toHaveAttribute("aria-label");
    });
  });
});
