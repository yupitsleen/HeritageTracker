import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { FilterBar } from "./FilterBar";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { LocaleProvider } from "../../contexts/LocaleContext";
import { CalendarProvider } from "../../contexts/CalendarContext";
import { SITE_TYPES } from "../../constants/filters";
import { createEmptyFilterState } from "../../types/filters";
import type { Site } from "../../types";

/**
 * Baseline (characterization) tests for FilterBar.
 *
 * These lock the CURRENT observable behavior so the upcoming desktop/mobile
 * de-duplication refactor can be proven behavior-preserving. Driven by
 * role/label/text, not DOM structure, so they survive the later visual redesign.
 *
 * Scope note: Headless UI's Popover renders its panel reliably in jsdom but does
 * NOT deliver click/change events to React inside it, and its Dialog re-commits on
 * open (detaching captured nodes). So control→callback wiring for popover/drawer
 * filters (type/status/year/date) is characterized end-to-end in e2e/filters.spec.ts
 * (a real browser, where these widgets work). Here we lock everything that IS
 * reliably testable at the component level: the non-widget callbacks, and that each
 * popover renders its expected content. jsdom applies no Tailwind stylesheet, so the
 * responsive `hidden`/`md:hidden` classes have no effect — both surfaces are present.
 */

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <LocaleProvider>
    <ThemeProvider>
      <CalendarProvider>{children}</CalendarProvider>
    </ThemeProvider>
  </LocaleProvider>
);

function makeSite(overrides: Partial<Site>): Site {
  return {
    id: "1",
    name: "Test Site",
    type: "mosque",
    yearBuilt: "1900",
    coordinates: [31.5, 34.5],
    status: "destroyed",
    dateDestroyed: "2023-10-15",
    lastUpdated: "2024-01-01",
    description: "d",
    historicalSignificance: "h",
    culturalValue: "c",
    verifiedBy: [],
    sources: [],
    ...overrides,
  };
}

function setup(overrides?: Partial<React.ComponentProps<typeof FilterBar>>) {
  const onFilterChange = vi.fn();
  const onClearAll = vi.fn();
  const props = {
    filters: createEmptyFilterState(),
    onFilterChange,
    onClearAll,
    ...overrides,
  };
  const user = userEvent.setup();
  render(<FilterBar {...props} />, { wrapper: Wrapper });
  return { onFilterChange, onClearAll, user };
}

describe("FilterBar — baseline behavior", () => {
  it("renders the search box and the four desktop filter buttons", () => {
    setup();
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /select types/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /select status/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /destruction date range/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /year built range/i })).toBeInTheDocument();
  });

  it("the type filter offers a checkbox for every site type", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /select types/i }));
    const checkboxes = await screen.findAllByRole("checkbox");
    expect(checkboxes).toHaveLength(SITE_TYPES.length);
  });

  it("the status filter offers only statuses present in the data (0-count hidden)", async () => {
    // Two "destroyed" sites and nothing else → only "destroyed" is offered.
    const sites = [makeSite({ status: "destroyed" }), makeSite({ id: "2", status: "destroyed" })];
    setup({ sites });
    fireEvent.click(screen.getByRole("button", { name: /select status/i }));
    const checkboxes = await screen.findAllByRole("checkbox");
    expect(checkboxes).toHaveLength(1);
  });

  it("typing in search fires a debounced onFilterChange with searchTerm", async () => {
    const { onFilterChange, user } = setup();
    await user.type(screen.getByPlaceholderText("Search..."), "mosque");
    await waitFor(() => expect(onFilterChange).toHaveBeenCalledWith({ searchTerm: "mosque" }));
  });

  it("the clear-search button empties the search input", async () => {
    const { user } = setup();
    const search = screen.getByPlaceholderText("Search...");
    await user.type(search, "mosque");
    await user.click(screen.getByRole("button", { name: /clear search/i }));
    expect(search).toHaveValue("");
  });

  it("toggling show-unknown-dates fires onFilterChange", async () => {
    const { onFilterChange, user } = setup(); // createEmptyFilterState starts it at true
    await user.click(screen.getByRole("button", { name: /show unknown dates/i }));
    expect(onFilterChange).toHaveBeenCalledWith({ showUnknownDates: false });
  });

  it("Clear All fires onClearAll when filters are active", async () => {
    const { onClearAll, user } = setup({
      filters: { ...createEmptyFilterState(), selectedTypes: ["mosque"] },
      showActions: true,
    });
    await user.click(screen.getByRole("button", { name: /clear all/i }));
    expect(onClearAll).toHaveBeenCalled();
  });

  it("the mobile Filters button opens the filters drawer", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /open filters menu/i }));
    expect(await screen.findByRole("dialog")).toBeTruthy();
  });
});

describe("FilterBar — sidebar variant", () => {
  // In the sidebar, facets render inline (no Headless UI popover/dialog), so
  // control→callback interaction works reliably at the component level.
  function facet(name: RegExp): HTMLElement {
    return screen.getByRole("heading", { name }).closest("section") as HTMLElement;
  }

  it("renders all four facets inline (nothing to open)", () => {
    setup({ variant: "sidebar" });
    expect(screen.getByRole("heading", { name: /^type$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^status$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^destruction date$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^year built$/i })).toBeInTheDocument();
  });

  it("checking a type fires onFilterChange with selectedTypes", async () => {
    const { onFilterChange, user } = setup({ variant: "sidebar" });
    await user.click(within(facet(/^type$/i)).getAllByRole("checkbox")[0]);
    expect(onFilterChange).toHaveBeenCalledWith({ selectedTypes: [SITE_TYPES[0]] });
  });

  it("offers only statuses present in the data (0-count hidden)", () => {
    const sites = [makeSite({ status: "destroyed" }), makeSite({ id: "2", status: "destroyed" })];
    setup({ variant: "sidebar", sites });
    expect(within(facet(/^status$/i)).getAllByRole("checkbox")).toHaveLength(1);
  });

  it("shows the result count and Clear All when filters are active", async () => {
    const { onClearAll, user } = setup({
      variant: "sidebar",
      filters: { ...createEmptyFilterState(), selectedTypes: ["mosque"] },
      showActions: true,
      totalSites: 118,
      filteredSites: 12,
    });
    expect(screen.getByText(/showing 12 of 118 sites/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /clear all/i }));
    expect(onClearAll).toHaveBeenCalled();
  });

  it("toggling show-unknown-dates fires onFilterChange", async () => {
    const { onFilterChange, user } = setup({ variant: "sidebar" });
    await user.click(screen.getByRole("checkbox", { name: /show unknown dates/i }));
    expect(onFilterChange).toHaveBeenCalledWith({ showUnknownDates: false });
  });

  it("can be collapsed to a rail and re-expanded", async () => {
    const { user } = setup({ variant: "sidebar" });
    expect(screen.getByRole("heading", { name: /^type$/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /hide filters/i }));
    // Collapsed: facets gone, only the re-open control remains.
    expect(screen.queryByRole("heading", { name: /^type$/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /show filters/i }));
    expect(screen.getByRole("heading", { name: /^type$/i })).toBeInTheDocument();
  });

  it("starts collapsed when sidebarDefaultCollapsed is set", () => {
    setup({ variant: "sidebar", sidebarDefaultCollapsed: true });
    expect(screen.queryByRole("heading", { name: /^type$/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show filters/i })).toBeInTheDocument();
  });
});

describe("FilterBar — layout toggle", () => {
  it("bar variant: the switch-to-sidebar control fires onVariantToggle", async () => {
    const onVariantToggle = vi.fn();
    const { user } = setup({ variant: "bar", onVariantToggle });
    await user.click(screen.getByRole("button", { name: /switch to sidebar/i }));
    expect(onVariantToggle).toHaveBeenCalled();
  });

  it("sidebar variant: the switch-to-top-bar control fires onVariantToggle", async () => {
    const onVariantToggle = vi.fn();
    const { user } = setup({ variant: "sidebar", onVariantToggle });
    await user.click(screen.getByRole("button", { name: /switch to top bar/i }));
    expect(onVariantToggle).toHaveBeenCalled();
  });

  it("shows no layout-toggle control when onVariantToggle is absent", () => {
    setup({ variant: "sidebar" });
    expect(
      screen.queryByRole("button", { name: /switch to (sidebar|top bar)/i })
    ).not.toBeInTheDocument();
  });
});
