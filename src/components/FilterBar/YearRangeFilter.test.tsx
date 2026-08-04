import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithTheme } from "../../test-utils/renderWithTheme";
import { YearRangeFilter } from "./YearRangeFilter";

const noop = () => {};

describe("YearRangeFilter", () => {
  it("prefills the inputs with the sites' year range", () => {
    renderWithTheme(
      <YearRangeFilter
        label=""
        onStartChange={noop}
        onEndChange={noop}
        startYearDefault="800"
        endYearDefault="1900"
        startEraDefault="BCE"
      />
    );

    expect(screen.getByPlaceholderText("From year")).toHaveValue(800);
    expect(screen.getByPlaceholderText("To year")).toHaveValue(1900);
    expect(screen.getByDisplayValue("BCE")).toBeInTheDocument();
  });

  it("uses the typed year instead of the prefill once the user edits", async () => {
    const user = userEvent.setup();
    const onStartChange = vi.fn();

    renderWithTheme(
      <YearRangeFilter
        label=""
        onStartChange={onStartChange}
        onEndChange={noop}
        startYearDefault="800"
        endYearDefault="1900"
        startEraDefault="CE"
      />
    );

    const startInput = screen.getByPlaceholderText("From year");
    await user.clear(startInput);
    await user.type(startInput, "1200");

    expect(startInput).toHaveValue(1200);
    expect(onStartChange).toHaveBeenLastCalledWith(1200);
  });

  it("reports BCE years as negative", async () => {
    const user = userEvent.setup();
    const onStartChange = vi.fn();

    renderWithTheme(
      <YearRangeFilter label="" onStartChange={onStartChange} onEndChange={noop} />
    );

    await user.type(screen.getByPlaceholderText("From year"), "500");
    await user.selectOptions(screen.getAllByRole("combobox")[0], "BCE");

    expect(onStartChange).toHaveBeenLastCalledWith(-500);
  });

  it("falls back to the prefill when the filter is cleared from outside", async () => {
    const user = userEvent.setup();

    // Controlled by the parent, as FilterBar drives it.
    const { rerender } = renderWithTheme(
      <YearRangeFilter
        label=""
        startYear={null}
        onStartChange={noop}
        onEndChange={noop}
        startYearDefault="800"
      />
    );

    const startInput = screen.getByPlaceholderText("From year");
    await user.clear(startInput);
    await user.type(startInput, "1200");
    expect(startInput).toHaveValue(1200);

    // The parent takes the typed value...
    rerender(
      <YearRangeFilter
        label=""
        startYear={1200}
        onStartChange={noop}
        onEndChange={noop}
        startYearDefault="800"
      />
    );
    expect(screen.getByPlaceholderText("From year")).toHaveValue(1200);

    // ...then "Clear all" resets the filter state without touching this component.
    rerender(
      <YearRangeFilter
        label=""
        startYear={null}
        onStartChange={noop}
        onEndChange={noop}
        startYearDefault="800"
      />
    );

    expect(screen.getByPlaceholderText("From year")).toHaveValue(800);
  });

  it("keeps the typed year while the parent agrees with it", async () => {
    const user = userEvent.setup();

    const { rerender } = renderWithTheme(
      <YearRangeFilter
        label=""
        startYear={null}
        onStartChange={noop}
        onEndChange={noop}
        startYearDefault="800"
      />
    );

    const startInput = screen.getByPlaceholderText("From year");
    await user.clear(startInput);
    await user.type(startInput, "1200");

    // The parent echoes the value back, as it does on every keystroke.
    rerender(
      <YearRangeFilter
        label=""
        startYear={1200}
        onStartChange={noop}
        onEndChange={noop}
        startYearDefault="800"
      />
    );

    expect(screen.getByPlaceholderText("From year")).toHaveValue(1200);
  });

  it("clears the filter when the input is emptied", async () => {
    const user = userEvent.setup();
    const onEndChange = vi.fn();

    renderWithTheme(
      <YearRangeFilter
        label=""
        onStartChange={noop}
        onEndChange={onEndChange}
        endYearDefault="1900"
      />
    );

    await user.clear(screen.getByPlaceholderText("To year"));

    expect(onEndChange).toHaveBeenLastCalledWith(null);
  });
});
