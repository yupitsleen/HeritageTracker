import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Modal } from "./Modal";
import { ThemeProvider } from "../../contexts/ThemeContext";

describe("Modal", () => {
  it("renders without crashing when open", () => {
    const mockOnClose = vi.fn();

    render(
      <ThemeProvider>
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Test content</div>
        </Modal>
      </ThemeProvider>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    const mockOnClose = vi.fn();

    const { container } = render(
      <ThemeProvider>
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <div>Test content</div>
        </Modal>
      </ThemeProvider>
    );

    expect(container.firstChild).toBeNull();
  });
});
