import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { LocaleProvider } from "../../contexts/LocaleContext";

// Helper to render with theme
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <LocaleProvider>{ui}</LocaleProvider>
    </ThemeProvider>
  );
};

describe("EmptyState", () => {
  describe("Smoke Tests", () => {
    it("renders without crashing", () => {
      renderWithProviders(<EmptyState title="No data" />);
      expect(screen.getByText("No data")).toBeInTheDocument();
    });

    it("renders with title only", () => {
      renderWithProviders(<EmptyState title="No results found" />);
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByText("No results found")).toBeInTheDocument();
    });
  });

  describe("Content Display", () => {
    it("renders title correctly", () => {
      renderWithProviders(<EmptyState title="Test Title" />);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent("Test Title");
    });

    it("renders description when provided", () => {
      renderWithProviders(
        <EmptyState
          title="No data"
          description="Try adjusting your filters"
        />
      );
      expect(screen.getByText("Try adjusting your filters")).toBeInTheDocument();
    });

    it("does not render description when not provided", () => {
      renderWithProviders(<EmptyState title="No data" />);
      expect(screen.queryByText(/Try adjusting/)).not.toBeInTheDocument();
    });

    it("renders custom icon when provided", () => {
      const CustomIcon = () => <svg data-testid="custom-icon">Custom</svg>;
      renderWithProviders(
        <EmptyState title="No data" icon={<CustomIcon />} />
      );
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("renders default icon when no icon provided", () => {
      const { container } = renderWithProviders(<EmptyState title="No data" />);
      // Default icon should be ExclamationCircleIcon from Heroicons
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("renders no icon when icon is explicitly null", () => {
      const { container } = renderWithProviders(
        <EmptyState title="No data" icon={null} />
      );
      const icon = container.querySelector("svg");
      expect(icon).not.toBeInTheDocument();
    });

    it("renders action button when provided", () => {
      const handleClick = vi.fn();
      renderWithProviders(
        <EmptyState
          title="No data"
          action={
            <button onClick={handleClick} data-testid="action-button">
              Clear Filters
            </button>
          }
        />
      );
      expect(screen.getByTestId("action-button")).toBeInTheDocument();
    });

    it("does not render action when not provided", () => {
      renderWithProviders(<EmptyState title="No data" />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("Size Variants", () => {
    it("renders small size variant", () => {
      renderWithProviders(<EmptyState title="No data" size="sm" />);
      const container = screen.getByRole("status");
      expect(container).toHaveClass("p-4");
    });

    it("renders medium size variant (default)", () => {
      renderWithProviders(<EmptyState title="No data" />);
      const container = screen.getByRole("status");
      expect(container).toHaveClass("p-8");
    });

    it("renders large size variant", () => {
      renderWithProviders(<EmptyState title="No data" size="lg" />);
      const container = screen.getByRole("status");
      expect(container).toHaveClass("p-12");
    });
  });

  describe("Accessibility", () => {
    it("has role='status' for screen readers", () => {
      renderWithProviders(<EmptyState title="No data" />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("has aria-live='polite' for screen reader announcements", () => {
      renderWithProviders(<EmptyState title="No data" />);
      const container = screen.getByRole("status");
      expect(container).toHaveAttribute("aria-live", "polite");
    });

    it("icon has aria-hidden='true'", () => {
      const { container } = renderWithProviders(<EmptyState title="No data" />);
      const icon = container.querySelector("svg");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string title", () => {
      renderWithProviders(<EmptyState title="" />);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("");
    });

    it("handles long title text", () => {
      const longTitle =
        "This is a very long title that might cause layout issues if not handled properly";
      renderWithProviders(<EmptyState title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("handles long description text", () => {
      const longDescription =
        "This is a very long description with multiple sentences. ".repeat(5);
      renderWithProviders(
        <EmptyState title="No data" description={longDescription} />
      );
      // Use regex to match normalized text (whitespace may be trimmed)
      expect(screen.getByText(/This is a very long description with multiple sentences/)).toBeInTheDocument();
    });

    it("handles multiple action buttons", () => {
      renderWithProviders(
        <EmptyState
          title="No data"
          action={
            <div>
              <button data-testid="action-1">Action 1</button>
              <button data-testid="action-2">Action 2</button>
            </div>
          }
        />
      );
      expect(screen.getByTestId("action-1")).toBeInTheDocument();
      expect(screen.getByTestId("action-2")).toBeInTheDocument();
    });
  });
});
