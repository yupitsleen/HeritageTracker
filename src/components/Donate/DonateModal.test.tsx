import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DonateModal } from "./DonateModal";

describe("DonateModal", () => {
  it("renders without crashing", () => {
    render(<DonateModal />);
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
  });

  it("displays donation organizations", () => {
    render(<DonateModal />);
    const donateButtons = screen.getAllByRole("link");
    expect(donateButtons.length).toBeGreaterThan(0);
  });

  it("all donate links open in new tab with security attributes", () => {
    render(<DonateModal />);
    const donateLinks = screen.getAllByRole("link");

    donateLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
