import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../test-utils/renderWithTheme";
import { AppHeader } from "./AppHeader";
import { MemoryRouter } from "react-router-dom";

const AppHeaderWithRouter = () => (
  <MemoryRouter>
    <AppHeader />
  </MemoryRouter>
);

describe("AppHeader", () => {
  it("renders the logo inside the home button", () => {
    renderWithTheme(<AppHeaderWithRouter />);
    const logo = screen.getByAltText(/Now & Then Logo/i);
    expect(screen.getByRole("button", { name: /go to home page/i })).toContainElement(logo);
  });

  it("displays the title", () => {
    renderWithTheme(<AppHeaderWithRouter />);
    expect(screen.getByRole("heading", { name: /Now & Then/i })).toBeInTheDocument();
  });

  it("renders nothing but the home button", () => {
    renderWithTheme(<AppHeaderWithRouter />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
