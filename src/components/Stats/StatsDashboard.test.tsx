import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsDashboard } from "./StatsDashboard";
import type { GazaSite } from "../../types";

// Mock sites data for testing
const mockSites: GazaSite[] = [
  {
    id: "site-1",
    name: "Test Mosque",
    nameArabic: "مسجد الاختبار",
    type: "mosque",
    yearBuilt: "800 BCE",
    coordinates: [31.5, 34.5],
    status: "destroyed",
    dateDestroyed: "2023-10-15",
    description: "Test description",
    verifiedBy: ["UNESCO", "Heritage for Peace"],
    sources: [],
  },
  {
    id: "site-2",
    name: "Test Church",
    nameArabic: "كنيسة الاختبار",
    type: "church",
    yearBuilt: "400 CE",
    coordinates: [31.5, 34.5],
    status: "heavily-damaged",
    dateDestroyed: "2023-11-20",
    description: "Test description",
    verifiedBy: ["UNESCO", "Forensic Architecture"],
    sources: [],
  },
  {
    id: "site-3",
    name: "Test Archaeological Site",
    nameArabic: "موقع أثري الاختبار",
    type: "archaeological",
    yearBuilt: "2000 BCE",
    coordinates: [31.5, 34.5],
    status: "damaged",
    dateDestroyed: "2024-01-10",
    description: "Test description",
    verifiedBy: ["Heritage for Peace"],
    sources: [],
  },
];

describe("StatsDashboard", () => {
  it("renders without crashing", () => {
    render(<StatsDashboard sites={mockSites} />);
    expect(screen.getByText("The Scale of Destruction")).toBeInTheDocument();
  });

  it("displays hero statistic about years of history", () => {
    render(<StatsDashboard sites={mockSites} />);
    expect(screen.getByText("Years of Human History")).toBeInTheDocument();
    expect(screen.getByText(/From Bronze Age Egyptian settlements/)).toBeInTheDocument();
  });

  it("displays sites over 1000 years old", () => {
    render(<StatsDashboard sites={mockSites} />);
    expect(screen.getByText("Sites Over 1,000 Years Old")).toBeInTheDocument();
  });

  it("displays houses of worship destroyed", () => {
    render(<StatsDashboard sites={mockSites} />);
    expect(screen.getByText("Houses of Worship Destroyed")).toBeInTheDocument();
    expect(screen.getByText(/Active mosques and churches/)).toBeInTheDocument();
  });

  it("displays museums and cultural centers", () => {
    render(<StatsDashboard sites={mockSites} />);
    expect(screen.getByText("Museums & Cultural Centers")).toBeInTheDocument();
  });

  it('displays "What Humanity Has Lost" section', () => {
    render(<StatsDashboard sites={mockSites} />);
    expect(screen.getByText("What Humanity Has Lost")).toBeInTheDocument();
    expect(screen.getByText("Great Omari Mosque")).toBeInTheDocument();
    expect(screen.getByText("Byzantine Church of Jabaliya")).toBeInTheDocument();
  });

  it('displays "Lost Forever: Unsolved Mysteries" section', () => {
    render(<StatsDashboard sites={mockSites} />);
    expect(screen.getByText("Lost Forever: Unsolved Mysteries")).toBeInTheDocument();
    expect(screen.getByText(/Research that was underway/)).toBeInTheDocument();
    expect(screen.getByText(/Unfinished Excavation/)).toBeInTheDocument();
    expect(screen.getByText(/Mosaics Beneath Debris/)).toBeInTheDocument();
    // Should have multiple "Questions we'll never answer" entries (one per example)
    const questionElements = screen.getAllByText(/Questions we'll never answer/i);
    expect(questionElements.length).toBeGreaterThan(0);
  });

  it('displays "What Remains: Still at Risk" section', () => {
    render(<StatsDashboard sites={mockSites} />);
    expect(screen.getByText("What Remains: Still at Risk")).toBeInTheDocument();
    expect(screen.getByText(/damaged but still standing/)).toBeInTheDocument();
    expect(screen.getByText("Sites Still Standing")).toBeInTheDocument();
    expect(screen.getByText("Houses of Worship Remain")).toBeInTheDocument();
    expect(screen.getByText(/Church of St\. Porphyrius/)).toBeInTheDocument();
    expect(screen.getByText(/Why This Matters Now/)).toBeInTheDocument();
  });

  it('displays "Putting It in Perspective" section with city comparisons', () => {
    render(<StatsDashboard sites={mockSites} />);
    expect(screen.getByText("Putting It in Perspective")).toBeInTheDocument();
    expect(screen.getByText(/Destroying the Pantheon/)).toBeInTheDocument();
    expect(screen.getByText(/Demolishing the Western Wall/)).toBeInTheDocument();
    expect(screen.getByText(/Destroying the Parthenon/)).toBeInTheDocument();
  });

  it("displays legal framework section", () => {
    render(<StatsDashboard sites={mockSites} />);
    expect(screen.getByText("Legal Framework")).toBeInTheDocument();
    // Use getAllByText since "1954 Hague Convention" and "Rome Statute" appear in multiple sections
    const hagueElements = screen.getAllByText(/1954 Hague Convention/);
    expect(hagueElements.length).toBeGreaterThan(0);
    const romeElements = screen.getAllByText(/Rome Statute/);
    expect(romeElements.length).toBeGreaterThan(0);
  });

  it("is scrollable with proper styling", () => {
    const { container } = render(<StatsDashboard sites={mockSites} />);
    const scrollableDiv = container.querySelector(".max-h-\\[80vh\\]");
    expect(scrollableDiv).toBeInTheDocument();
    expect(scrollableDiv).toHaveClass("overflow-y-auto");
  });

  it("handles empty sites array gracefully", () => {
    render(<StatsDashboard sites={[]} />);
    expect(screen.getByText("The Scale of Destruction")).toBeInTheDocument();
    expect(screen.getByText("Years of Human History")).toBeInTheDocument();
  });
});
