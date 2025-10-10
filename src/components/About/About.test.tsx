import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "./About";

describe("About", () => {
  it("renders without crashing", () => {
    render(<About />);
    expect(screen.getByText("About Heritage Tracker")).toBeInTheDocument();
  });

  it("displays all major section headings", () => {
    render(<About />);
    expect(screen.getByText("Mission")).toBeInTheDocument();
    expect(screen.getByText("Methodology")).toBeInTheDocument();
    expect(screen.getByText("Data Sources")).toBeInTheDocument();
    expect(screen.getByText("The Data")).toBeInTheDocument();
    expect(screen.getByText("Legal & Ethical Framework")).toBeInTheDocument();
    expect(screen.getByText("How to Contribute")).toBeInTheDocument();
    expect(screen.getByText("Acknowledgments")).toBeInTheDocument();
  });

  it("displays data source organizations", () => {
    render(<About />);
    expect(screen.getByText("UNESCO")).toBeInTheDocument();
    expect(screen.getByText("Forensic Architecture")).toBeInTheDocument();
    expect(screen.getByText("Heritage for Peace")).toBeInTheDocument();
  });

  it("displays statistics", () => {
    render(<About />);
    expect(screen.getByText("18")).toBeInTheDocument(); // Sites Documented
    expect(screen.getByText("10")).toBeInTheDocument(); // Completely Destroyed
    expect(screen.getByText("8")).toBeInTheDocument(); // Damaged
    expect(screen.getByText("1,700+")).toBeInTheDocument(); // Years of History
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

  it("is scrollable with proper styling", () => {
    const { container } = render(<About />);
    const scrollableDiv = container.querySelector(".max-h-\\[80vh\\]");
    expect(scrollableDiv).toBeInTheDocument();
    expect(scrollableDiv).toHaveClass("overflow-y-auto");
  });
});
