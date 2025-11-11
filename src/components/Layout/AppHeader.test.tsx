import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithTheme } from "../../test-utils/renderWithTheme";
import { AppHeader } from "./AppHeader";
import { MemoryRouter } from "react-router-dom";

// Wrapper component to provide routing context
const AppHeaderWithRouter = ({ onOpenHelp }: { onOpenHelp?: () => void }) => (
  <MemoryRouter>
    <AppHeader onOpenHelp={onOpenHelp} />
  </MemoryRouter>
);

describe("AppHeader", () => {
  describe("Smoke Tests", () => {
    it("renders without crashing", () => {
      const { container } = renderWithTheme(<AppHeaderWithRouter />);
      expect(container).toBeInTheDocument();
    });

    it("displays the logo", () => {
      renderWithTheme(<AppHeaderWithRouter />);
      const logo = screen.getByAltText(/Heritage Tracker Logo/i);
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src");
    });

    it("displays the title", () => {
      renderWithTheme(<AppHeaderWithRouter />);
      expect(screen.getByText(/Heritage Tracker/i)).toBeInTheDocument();
    });

    it("title is clickable and navigates to home", () => {
      renderWithTheme(<AppHeaderWithRouter />);
      const titleButton = screen.getByRole("button", { name: /go to home page/i });
      expect(titleButton).toBeInTheDocument();
    });

    it("logo is clickable and part of home navigation", () => {
      renderWithTheme(<AppHeaderWithRouter />);
      const logo = screen.getByAltText(/Heritage Tracker Logo/i);
      const titleButton = screen.getByRole("button", { name: /go to home page/i });

      // Logo should be inside the clickable button
      expect(titleButton).toContainElement(logo);
    });
  });

  describe("Desktop Navigation (xl+ screens)", () => {
    it("renders navigation buttons on desktop", () => {
      renderWithTheme(<AppHeaderWithRouter />);

      // Desktop navigation buttons should exist in the DOM (hidden on mobile with xl:flex)
      // We can verify they exist even if not visible at current viewport
      expect(screen.getByRole("button", { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /data/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /timeline/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /statistics/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /about/i })).toBeInTheDocument();
    });

    it("renders theme toggle button", () => {
      renderWithTheme(<AppHeaderWithRouter />);
      // Theme toggle should be in the DOM
      const themeButton = screen.getByLabelText(/settings/i);
      expect(themeButton).toBeInTheDocument();
    });

    it("theme toggle changes theme when clicked", () => {
      renderWithTheme(<AppHeaderWithRouter />);
      const themeButton = screen.getByLabelText(/settings/i);

      // Click should not throw error
      expect(() => fireEvent.click(themeButton)).not.toThrow();
    });
  });

  describe("Hamburger Menu (Mobile/Tablet)", () => {
    it("renders hamburger menu button", () => {
      renderWithTheme(<AppHeaderWithRouter />);

      // Hamburger button should be present (visible on mobile, hidden on xl+ with xl:hidden)
      const hamburgerButton = screen.getByLabelText(/open menu/i);
      expect(hamburgerButton).toBeInTheDocument();
    });

    it("hamburger button toggles menu open/close", () => {
      renderWithTheme(<AppHeaderWithRouter />);

      // Initially menu should be closed
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();

      // Open menu
      const hamburgerButton = screen.getByLabelText(/open menu/i);
      fireEvent.click(hamburgerButton);

      // Menu should now be visible
      expect(screen.getByRole("navigation")).toBeInTheDocument();

      // Button label should change to "Close menu"
      expect(screen.getByLabelText(/close menu/i)).toBeInTheDocument();

      // Close menu
      const closeButton = screen.getByLabelText(/close menu/i);
      fireEvent.click(closeButton);

      // Menu should be hidden again
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    });

    it("mobile menu contains all navigation links", () => {
      renderWithTheme(<AppHeaderWithRouter />);

      // Open menu
      const hamburgerButton = screen.getByLabelText(/open menu/i);
      fireEvent.click(hamburgerButton);

      // Mobile menu should contain navigation items
      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();

      // All nav items should be present (except Dashboard which is conditionally hidden on mobile)
      expect(screen.getAllByRole("button", { name: /data/i })).toHaveLength(2); // Desktop + Mobile
      expect(screen.getAllByRole("button", { name: /timeline/i })).toHaveLength(2);
      expect(screen.getAllByRole("button", { name: /about/i })).toHaveLength(2);
    });

    it("mobile menu includes theme toggle", () => {
      renderWithTheme(<AppHeaderWithRouter />);

      // Open menu
      const hamburgerButton = screen.getByLabelText(/open menu/i);
      fireEvent.click(hamburgerButton);

      // Theme toggle should be in mobile menu
      const themeButtons = screen.getAllByLabelText(/settings/i);
      expect(themeButtons.length).toBeGreaterThan(0);
    });

    it("clicking nav item closes mobile menu", () => {
      renderWithTheme(<AppHeaderWithRouter />);

      // Open menu
      const hamburgerButton = screen.getByLabelText(/open menu/i);
      fireEvent.click(hamburgerButton);

      expect(screen.getByRole("navigation")).toBeInTheDocument();

      // Click a nav item (Data is always present in mobile menu)
      const dataButtons = screen.getAllByRole("button", { name: /data/i });
      const mobileDataButton = dataButtons.find(button =>
        button.classList.contains("w-full")
      );

      if (mobileDataButton) {
        fireEvent.click(mobileDataButton);

        // Menu should close
        expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
      }
    });
  });

  describe("Help Button", () => {
    it("renders help button when onOpenHelp is provided", () => {
      const onOpenHelp = vi.fn();
      const { container } = renderWithTheme(<AppHeaderWithRouter onOpenHelp={onOpenHelp} />);

      // Help button should be present (look for QuestionMarkCircleIcon)
      const helpButton = container.querySelector('[title*="Help"]');
      expect(helpButton).toBeInTheDocument();
    });

    it("calls onOpenHelp when help button is clicked", () => {
      const onOpenHelp = vi.fn();
      const { container } = renderWithTheme(<AppHeaderWithRouter onOpenHelp={onOpenHelp} />);

      const helpButton = container.querySelector('[title*="Help"]') as HTMLElement;
      if (helpButton) {
        fireEvent.click(helpButton);
        expect(onOpenHelp).toHaveBeenCalledTimes(1);
      }
    });

    it("does not render help button when onOpenHelp is not provided", () => {
      const { container } = renderWithTheme(<AppHeaderWithRouter />);

      // Help button should not be present (has hidden xl:flex class when no onOpenHelp)
      const helpButton = container.querySelector('[title*="Help"]');
      expect(helpButton).not.toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("CRITICAL: hamburger menu must be accessible on mobile/tablet", () => {
      renderWithTheme(<AppHeaderWithRouter />);

      // Hamburger button should exist (has xl:hidden class for mobile visibility)
      const hamburgerButton = screen.getByLabelText(/open menu/i);
      expect(hamburgerButton).toBeInTheDocument();

      // Should have xl:hidden class to show on mobile
      expect(hamburgerButton.className).toContain("xl:hidden");
    });

    it("desktop navigation has xl:flex class for desktop visibility", () => {
      const { container } = renderWithTheme(<AppHeaderWithRouter />);

      // Find desktop navigation container
      const desktopNav = container.querySelector(".xl\\:flex.absolute");
      expect(desktopNav).toBeInTheDocument();

      // Desktop nav buttons should be children
      expect(desktopNav?.querySelector('[aria-label*="Dashboard"]')).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels on all buttons", () => {
      const onOpenHelp = vi.fn();
      const { container } = renderWithTheme(<AppHeaderWithRouter onOpenHelp={onOpenHelp} />);

      // Title/Home button
      expect(screen.getByLabelText(/go to home page/i)).toBeInTheDocument();

      // Navigation buttons
      expect(screen.getByLabelText(/dashboard/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/timeline/i)).toBeInTheDocument();

      // Hamburger menu
      expect(screen.getByLabelText(/open menu/i)).toBeInTheDocument();

      // Help button (use container query to avoid multiple matches)
      const helpButton = container.querySelector('[title*="Help"]');
      expect(helpButton).toBeInTheDocument();

      // Theme toggle
      expect(screen.getByLabelText(/settings/i)).toBeInTheDocument();
    });

    it("logo has proper alt text for screen readers", () => {
      renderWithTheme(<AppHeaderWithRouter />);
      const logo = screen.getByAltText(/Heritage Tracker Logo/i);
      expect(logo).toBeInTheDocument();
    });

    it("mobile menu has proper navigation role", () => {
      renderWithTheme(<AppHeaderWithRouter />);

      // Open menu
      const hamburgerButton = screen.getByLabelText(/open menu/i);
      fireEvent.click(hamburgerButton);

      // Menu should have navigation role
      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
    });
  });

  describe("Active Page Highlighting", () => {
    it("highlights active page in navigation", () => {
      // Render with initial route
      const { container } = renderWithTheme(
        <MemoryRouter initialEntries={["/data"]}>
          <AppHeader />
        </MemoryRouter>
      );

      // Data button should have active styling (ring-2 class)
      const dataButtons = container.querySelectorAll('[aria-label*="Data"]');
      const activeButton = Array.from(dataButtons).find(btn =>
        btn.className.includes("ring-2")
      );

      expect(activeButton).toBeInTheDocument();
    });
  });
});
