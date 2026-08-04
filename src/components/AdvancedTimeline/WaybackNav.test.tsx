import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { WaybackNav } from "./WaybackNav";

const renderNav = (props: Partial<React.ComponentProps<typeof WaybackNav>> = {}) =>
  render(
    <ThemeProvider>
      <WaybackNav
        variant="before"
        index={2}
        releaseCount={5}
        onIndexChange={vi.fn()}
        {...props}
      />
    </ThemeProvider>
  );

describe("WaybackNav", () => {
  it("steps forward one release", () => {
    const onIndexChange = vi.fn();
    renderNav({ variant: "after", index: 3, onIndexChange });

    fireEvent.click(screen.getByTestId("wayback-after-next"));

    expect(onIndexChange).toHaveBeenCalledWith(4);
  });

  it("steps back one release", () => {
    const onIndexChange = vi.fn();
    renderNav({ index: 2, onIndexChange });

    fireEvent.click(screen.getByTestId("wayback-before-prev"));

    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("disables Previous at the first release", () => {
    const onIndexChange = vi.fn();
    renderNav({ index: 0, onIndexChange });

    const prev = screen.getByTestId("wayback-before-prev");
    expect(prev).toBeDisabled();

    fireEvent.click(prev);
    expect(onIndexChange).not.toHaveBeenCalled();
  });

  it("disables Next at the last release", () => {
    renderNav({ index: 4, releaseCount: 5 });

    expect(screen.getByTestId("wayback-before-next")).toBeDisabled();
  });
});
