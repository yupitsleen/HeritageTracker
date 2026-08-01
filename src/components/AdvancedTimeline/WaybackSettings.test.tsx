import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithTheme, screen } from "../../test-utils/renderWithTheme";
import { WaybackSettings } from "./WaybackSettings";

function setup(syncMapVersion: boolean) {
  const onSyncMapVersionToggle = vi.fn();
  renderWithTheme(
    <WaybackSettings
      comparisonMode={true}
      onComparisonModeToggle={vi.fn()}
      comparisonInterval="1_month"
      onIntervalChange={vi.fn()}
      syncMapVersion={syncMapVersion}
      onSyncMapVersionToggle={onSyncMapVersionToggle}
    />
  );
  return {
    onSyncMapVersionToggle,
    sync: screen.getByLabelText(/sync map version/i),
    manual: screen.getByLabelText(/manual map version range/i),
  };
}

describe("WaybackSettings", () => {
  it("offers map-version mode as one exclusive choice", () => {
    setup(true);

    const modes = screen.getAllByRole("radio");
    expect(modes).toHaveLength(2);
    expect(modes.filter((mode) => (mode as HTMLInputElement).checked)).toHaveLength(1);
  });

  it("shows Manual Map Version Range as the opposite of Sync Map Version", () => {
    const { sync, manual } = setup(true);

    expect(sync).toBeChecked();
    expect(manual).not.toBeChecked();
  });

  it("shows Sync Map Version off when manual is on", () => {
    const { sync, manual } = setup(false);

    expect(sync).not.toBeChecked();
    expect(manual).toBeChecked();
  });

  it("toggles sync off when manual is checked", async () => {
    const user = userEvent.setup();
    const { manual, onSyncMapVersionToggle } = setup(true);

    await user.click(manual);

    expect(onSyncMapVersionToggle).toHaveBeenCalledTimes(1);
  });

  it("toggles sync on when sync is checked", async () => {
    const user = userEvent.setup();
    const { sync, onSyncMapVersionToggle } = setup(false);

    await user.click(sync);

    expect(onSyncMapVersionToggle).toHaveBeenCalledTimes(1);
  });
});
