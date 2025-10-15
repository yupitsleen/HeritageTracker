import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DonateModal } from "./DonateModal";

describe("DonateModal", () => {
  it("renders without crashing", () => {
    const { container } = render(<DonateModal />);
    expect(container).toBeInTheDocument();
  });

  it("displays content", () => {
    render(<DonateModal />);
    const bodyText = document.body.textContent || "";
    expect(bodyText.length).toBeGreaterThan(50);
  });
});
