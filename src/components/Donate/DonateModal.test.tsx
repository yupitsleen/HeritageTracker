import { describe, it, expect } from "vitest";
import { renderWithTheme } from "../../test-utils/renderWithTheme";
import { DonateModal } from "./DonateModal";

describe("DonateModal", () => {
  it("renders without crashing", () => {
    const { container } = renderWithTheme(<DonateModal />);
    expect(container).toBeInTheDocument();
  });

  it("displays content", () => {
    renderWithTheme(<DonateModal />);
    const bodyText = document.body.textContent || "";
    expect(bodyText.length).toBeGreaterThan(50);
  });
});
