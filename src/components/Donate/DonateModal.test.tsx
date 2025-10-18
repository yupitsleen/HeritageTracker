import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DonateModal } from "./DonateModal";
import { ThemeProvider } from "../../contexts/ThemeContext";

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

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
