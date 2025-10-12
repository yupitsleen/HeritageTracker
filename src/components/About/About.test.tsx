import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "./About";

describe("About", () => {
  it("renders without crashing", () => {
    render(<About />);
    expect(screen.getByText("About Heritage Tracker")).toBeInTheDocument();
  });

  it("displays major content sections", () => {
    render(<About />);
    // Check that page has substantive content
    const bodyText = document.body.textContent || "";
    expect(bodyText.length).toBeGreaterThan(500); // Has meaningful content
    expect(bodyText).toContain("Heritage Tracker"); // Title/branding present
  });

  it("displays data source organizations", () => {
    render(<About />);
    expect(screen.getByText("UNESCO")).toBeInTheDocument();
    expect(screen.getByText("Forensic Architecture")).toBeInTheDocument();
    expect(screen.getByText("Heritage for Peace")).toBeInTheDocument();
  });

  it("displays statistics", () => {
    render(<About />);
    // Check that statistics are present (numbers will change as data grows)
    const bodyText = document.body.textContent || "";
    const hasNumbers = /\d+/.test(bodyText);
    expect(hasNumbers).toBe(true);
  });

  it("includes external links to data sources", () => {
    render(<About />);
    const unescoLink = screen.getByText("View UNESCO Gaza Assessment →");
    expect(unescoLink).toHaveAttribute("href", "https://www.unesco.org/en/gaza/assessment");
    expect(unescoLink).toHaveAttribute("target", "_blank");
    expect(unescoLink).toHaveAttribute("rel", "noopener noreferrer");

    const forensicLink = screen.getByText("View Living Archaeology Investigation →");
    expect(forensicLink).toHaveAttribute(
      "href",
      "https://forensic-architecture.org/investigation/living-archaeology-in-gaza"
    );
  });

  it("includes GitHub repository link", () => {
    render(<About />);
    const githubLink = screen.getByText("GitHub Repository");
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/yupitsleen/HeritageTracker"
    );
    expect(githubLink).toHaveAttribute("target", "_blank");
  });

  it("displays disclaimer", () => {
    render(<About />);
    expect(screen.getByText(/Disclaimer:/)).toBeInTheDocument();
    expect(
      screen.getByText(/Heritage Tracker is an independent documentation project/)
    ).toBeInTheDocument();
  });

  it("is scrollable", () => {
    const { container } = render(<About />);
    // Check that content is in a scrollable container
    const scrollableDiv = container.querySelector('[class*="overflow"]');
    expect(scrollableDiv).toBeInTheDocument();
  });
});
