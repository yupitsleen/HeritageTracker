import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithTheme, screen } from "../../test-utils/renderWithTheme";
import { ReleaseDatePicker } from "./ReleaseDatePicker";
import type { WaybackRelease } from "../../services/waybackService";

const releases: WaybackRelease[] = [
  { releaseNumber: 1, releaseDate: "2019-06-05", tileUrl: "a", maxZoom: 19 },
  { releaseNumber: 2, releaseDate: "2019-06-20", tileUrl: "b", maxZoom: 19 },
  { releaseNumber: 3, releaseDate: "2024-01-17", tileUrl: "c", maxZoom: 19 },
];

function setup(disabled = false) {
  const onBeforeChange = vi.fn();
  const onAfterChange = vi.fn();
  renderWithTheme(
    <ReleaseDatePicker
      releases={releases}
      beforeIndex={0}
      onBeforeChange={onBeforeChange}
      afterIndex={2}
      onAfterChange={onAfterChange}
      disabled={disabled}
    />
  );
  return { onBeforeChange, onAfterChange };
}

describe("ReleaseDatePicker", () => {
  it("shows the release date of each slider position", () => {
    setup();

    expect(screen.getByRole("button", { name: /before imagery/i })).toHaveTextContent(
      "2019-06-05"
    );
    expect(screen.getByRole("button", { name: /after imagery/i })).toHaveTextContent(
      "2024-01-17"
    );
  });

  it("disables both fields when the map version is synced", () => {
    setup(true);

    expect(screen.getByRole("button", { name: /before imagery/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /after imagery/i })).toBeDisabled();
  });

  it("only enables days that have a Wayback release", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: /before imagery/i }));

    expect(screen.getByRole("button", { name: /june 5th, 2019/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /june 6th, 2019/i })).toBeDisabled();
  });

  it("selects the release for the clicked day", async () => {
    const user = userEvent.setup();
    const { onBeforeChange } = setup();

    await user.click(screen.getByRole("button", { name: /before imagery/i }));
    await user.click(screen.getByRole("button", { name: /june 20th, 2019/i }));

    expect(onBeforeChange).toHaveBeenCalledWith(1);
  });
});
