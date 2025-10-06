import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders without crashing when open", () => {
    const mockOnClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Test content</div>
      </Modal>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    const mockOnClose = vi.fn();

    const { container } = render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <div>Test content</div>
      </Modal>
    );

    expect(container.firstChild).toBeNull();
  });
});
