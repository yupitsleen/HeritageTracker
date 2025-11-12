import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { LocaleProvider } from "../../contexts/LocaleContext";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { OrganizationsPage } from "./OrganizationsPage";
import { ResearchPage } from "./ResearchPage";
import { MediaPage } from "./MediaPage";
import { EducationPage } from "./EducationPage";
import { LegalPage } from "./LegalPage";
import { TrackersPage } from "./TrackersPage";

/**
 * Wrapper component for resource page tests
 */
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <LocaleProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </LocaleProvider>
    </BrowserRouter>
  );
}

describe("ResourcePages", () => {
  describe("OrganizationsPage", () => {
    it("renders without crashing", () => {
      render(
        <TestWrapper>
          <OrganizationsPage />
        </TestWrapper>
      );

      expect(screen.getByText("Organizations")).toBeInTheDocument();
    });

    it("displays heritage section", () => {
      render(
        <TestWrapper>
          <OrganizationsPage />
        </TestWrapper>
      );

      expect(screen.getByText(/Heritage & Documentation/i)).toBeInTheDocument();
    });

    it("displays human rights section", () => {
      render(
        <TestWrapper>
          <OrganizationsPage />
        </TestWrapper>
      );

      expect(screen.getByText(/Human Rights Organizations/i)).toBeInTheDocument();
    });

    it("renders external links with proper attributes", () => {
      render(
        <TestWrapper>
          <OrganizationsPage />
        </TestWrapper>
      );

      // Find resource links (they open in new tabs)
      const links = screen.getAllByRole("link").filter(link =>
        link.getAttribute("target") === "_blank"
      );
      expect(links.length).toBeGreaterThan(0);

      // Check first resource link has proper security attributes
      expect(links[0]).toHaveAttribute("target", "_blank");
      expect(links[0]).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("ResearchPage", () => {
    it("renders without crashing", () => {
      render(
        <TestWrapper>
          <ResearchPage />
        </TestWrapper>
      );

      expect(screen.getByText("Research & Reports")).toBeInTheDocument();
    });

    it("displays official reports section", () => {
      render(
        <TestWrapper>
          <ResearchPage />
        </TestWrapper>
      );

      const sections = screen.getAllByText(/Official Reports/i);
      expect(sections.length).toBeGreaterThan(0);
    });

    it("displays documentation section", () => {
      render(
        <TestWrapper>
          <ResearchPage />
        </TestWrapper>
      );

      const sections = screen.getAllByText(/Documentation Projects/i);
      expect(sections.length).toBeGreaterThan(0);
    });
  });

  describe("MediaPage", () => {
    it("renders without crashing", () => {
      render(
        <TestWrapper>
          <MediaPage />
        </TestWrapper>
      );

      const titles = screen.getAllByText("Media & Documentation");
      expect(titles.length).toBeGreaterThan(0);
    });

    it("displays photo archives section", () => {
      render(
        <TestWrapper>
          <MediaPage />
        </TestWrapper>
      );

      const sections = screen.getAllByText(/Photo/i);
      expect(sections.length).toBeGreaterThan(0);
    });

    it("displays news outlets section", () => {
      render(
        <TestWrapper>
          <MediaPage />
        </TestWrapper>
      );

      const sections = screen.getAllByText(/News/i);
      expect(sections.length).toBeGreaterThan(0);
    });
  });

  describe("EducationPage", () => {
    it("renders without crashing", () => {
      render(
        <TestWrapper>
          <EducationPage />
        </TestWrapper>
      );

      const titles = screen.getAllByText("Educational Resources");
      expect(titles.length).toBeGreaterThan(0);
    });

    it("displays teaching resources section", () => {
      render(
        <TestWrapper>
          <EducationPage />
        </TestWrapper>
      );

      const sections = screen.getAllByText(/Teaching Resources/i);
      expect(sections.length).toBeGreaterThan(0);
    });

    it("displays books section", () => {
      render(
        <TestWrapper>
          <EducationPage />
        </TestWrapper>
      );

      const sections = screen.getAllByText(/Books/i);
      expect(sections.length).toBeGreaterThan(0);
    });
  });

  describe("LegalPage", () => {
    it("renders without crashing", () => {
      render(
        <TestWrapper>
          <LegalPage />
        </TestWrapper>
      );

      const titles = screen.getAllByText("Legal & Advocacy");
      expect(titles.length).toBeGreaterThan(0);
    });

    it("displays international courts section", () => {
      render(
        <TestWrapper>
          <LegalPage />
        </TestWrapper>
      );

      expect(screen.getByText(/International Courts/i)).toBeInTheDocument();
    });

    it("displays advocacy campaigns section", () => {
      render(
        <TestWrapper>
          <LegalPage />
        </TestWrapper>
      );

      const sections = screen.getAllByText(/Advocacy Campaigns/i);
      expect(sections.length).toBeGreaterThan(0);
    });
  });

  describe("TrackersPage", () => {
    it("renders without crashing", () => {
      render(
        <TestWrapper>
          <TrackersPage />
        </TestWrapper>
      );

      expect(screen.getByText("Other Heritage Trackers")).toBeInTheDocument();
    });

    it("displays Palestine section", () => {
      render(
        <TestWrapper>
          <TrackersPage />
        </TestWrapper>
      );

      expect(screen.getByText(/Palestine-Specific Trackers/i)).toBeInTheDocument();
    });

    it("displays Syria section", () => {
      render(
        <TestWrapper>
          <TrackersPage />
        </TestWrapper>
      );

      expect(screen.getByText(/Syria Heritage Trackers/i)).toBeInTheDocument();
    });

    it("displays global section", () => {
      render(
        <TestWrapper>
          <TrackersPage />
        </TestWrapper>
      );

      expect(screen.getByText(/Global Heritage/i)).toBeInTheDocument();
    });
  });
});
