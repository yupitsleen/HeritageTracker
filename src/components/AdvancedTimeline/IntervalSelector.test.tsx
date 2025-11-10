import { describe, it, expect, vi } from "vitest";
import { renderWithTheme, screen } from "../../test-utils/renderWithTheme";
import { IntervalSelector } from "./IntervalSelector";
import userEvent from "@testing-library/user-event";

describe("IntervalSelector", () => {
  describe("Smoke Tests", () => {
    it("renders without crashing when enabled", () => {
      const onChange = vi.fn();
      renderWithTheme(
        <IntervalSelector
          value="1_month"
          onChange={onChange}
          comparisonModeEnabled={true}
        />
      );

      expect(screen.getByLabelText(/interval/i)).toBeInTheDocument();
    });

    it("renders without crashing when disabled", () => {
      const onChange = vi.fn();
      renderWithTheme(
        <IntervalSelector
          value="1_month"
          onChange={onChange}
          comparisonModeEnabled={false}
        />
      );

      expect(screen.getByLabelText(/interval/i)).toBeInTheDocument();
    });
  });

  describe("Rendering", () => {
    it("renders the label", () => {
      const onChange = vi.fn();
      renderWithTheme(
        <IntervalSelector
          value="1_month"
          onChange={onChange}
          comparisonModeEnabled={true}
        />
      );

      expect(screen.getByText(/interval:/i)).toBeInTheDocument();
    });

    it("renders all interval options", () => {
      const onChange = vi.fn();
      renderWithTheme(
        <IntervalSelector
          value="1_month"
          onChange={onChange}
          comparisonModeEnabled={true}
        />
      );

      const select = screen.getByLabelText(/interval/i) as HTMLSelectElement;
      const options = Array.from(select.options).map((opt) => opt.value);

      expect(options).toContain("as_large_as_possible");
      expect(options).toContain("as_small_as_possible");
      expect(options).toContain("1_month");
      expect(options).toContain("1_year");
      expect(options).toContain("5_years");
    });

    it("displays the selected value", () => {
      const onChange = vi.fn();
      renderWithTheme(
        <IntervalSelector
          value="1_year"
          onChange={onChange}
          comparisonModeEnabled={true}
        />
      );

      const select = screen.getByLabelText(/interval/i) as HTMLSelectElement;
      expect(select.value).toBe("1_year");
    });
  });

  describe("Interaction Tests", () => {
    it("calls onChange when selection changes", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderWithTheme(
        <IntervalSelector
          value="1_month"
          onChange={onChange}
          comparisonModeEnabled={true}
        />
      );

      const select = screen.getByLabelText(/interval/i) as HTMLSelectElement;
      await user.selectOptions(select, "1_year");

      expect(onChange).toHaveBeenCalledWith("1_year");
    });

    it("does not call onChange when disabled", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderWithTheme(
        <IntervalSelector
          value="1_month"
          onChange={onChange}
          comparisonModeEnabled={false}
        />
      );

      const select = screen.getByLabelText(/interval/i) as HTMLSelectElement;

      // Attempt to change selection (should be disabled)
      try {
        await user.selectOptions(select, "1_year");
      } catch {
        // Expected to fail because select is disabled
      }

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has proper aria-label", () => {
      const onChange = vi.fn();
      renderWithTheme(
        <IntervalSelector
          value="1_month"
          onChange={onChange}
          comparisonModeEnabled={true}
        />
      );

      expect(screen.getByLabelText(/interval/i)).toBeInTheDocument();
    });

    it("is disabled when comparison mode is disabled", () => {
      const onChange = vi.fn();
      renderWithTheme(
        <IntervalSelector
          value="1_month"
          onChange={onChange}
          comparisonModeEnabled={false}
        />
      );

      const select = screen.getByLabelText(/interval/i) as HTMLSelectElement;
      expect(select).toBeDisabled();
    });

    it("is enabled when comparison mode is enabled", () => {
      const onChange = vi.fn();
      renderWithTheme(
        <IntervalSelector
          value="1_month"
          onChange={onChange}
          comparisonModeEnabled={true}
        />
      );

      const select = screen.getByLabelText(/interval/i) as HTMLSelectElement;
      expect(select).toBeEnabled();
    });
  });

  describe("Edge Cases", () => {
    it("handles 'as_large_as_possible' interval", () => {
      const onChange = vi.fn();
      renderWithTheme(
        <IntervalSelector
          value="as_large_as_possible"
          onChange={onChange}
          comparisonModeEnabled={true}
        />
      );

      const select = screen.getByRole("combobox") as HTMLSelectElement;
      expect(select.value).toBe("as_large_as_possible");
    });

    it("handles 'as_small_as_possible' interval", () => {
      const onChange = vi.fn();
      renderWithTheme(
        <IntervalSelector
          value="as_small_as_possible"
          onChange={onChange}
          comparisonModeEnabled={true}
        />
      );

      const select = screen.getByRole("combobox") as HTMLSelectElement;
      expect(select.value).toBe("as_small_as_possible");
    });

    it("handles '1_month' interval", () => {
      const onChange = vi.fn();
      renderWithTheme(
        <IntervalSelector
          value="1_month"
          onChange={onChange}
          comparisonModeEnabled={true}
        />
      );

      const select = screen.getByRole("combobox") as HTMLSelectElement;
      expect(select.value).toBe("1_month");
    });

    it("handles '1_year' interval", () => {
      const onChange = vi.fn();
      renderWithTheme(
        <IntervalSelector
          value="1_year"
          onChange={onChange}
          comparisonModeEnabled={true}
        />
      );

      const select = screen.getByRole("combobox") as HTMLSelectElement;
      expect(select.value).toBe("1_year");
    });

    it("handles '5_years' interval", () => {
      const onChange = vi.fn();
      renderWithTheme(
        <IntervalSelector
          value="5_years"
          onChange={onChange}
          comparisonModeEnabled={true}
        />
      );

      const select = screen.getByRole("combobox") as HTMLSelectElement;
      expect(select.value).toBe("5_years");
    });
  });
});
