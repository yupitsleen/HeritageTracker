import { describe, it, expect, vi } from "vitest";
import { renderWithTheme, screen } from "../../test-utils/renderWithTheme";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders without crashing when open", () => {
    const mockOnClose = vi.fn();

    renderWithTheme(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Test content</div>
      </Modal>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
    expect(screen.getByLabelText("Close modal")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    const mockOnClose = vi.fn();

    const { container } = renderWithTheme(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Test content</div>
      </Modal>
    );

    expect(container.firstChild).toBeNull();
  });
});
