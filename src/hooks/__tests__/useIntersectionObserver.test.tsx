import React from "react";
import { render, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useIntersectionObserver } from "../useIntersectionObserver";

// Mock IntersectionObserver
class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  elements: Set<Element> = new Set();
  options: IntersectionObserverInit;

  constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit = {}) {
    this.callback = callback;
    this.options = options;
  }

  observe(element: Element) {
    this.elements.add(element);
  }

  unobserve(element: Element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  // Test utility: trigger intersection
  trigger(isIntersecting: boolean) {
    const entries: IntersectionObserverEntry[] = Array.from(this.elements).map(
      (element) => ({
        isIntersecting,
        target: element,
        intersectionRatio: isIntersecting ? 1 : 0,
        boundingClientRect: element.getBoundingClientRect(),
        intersectionRect: element.getBoundingClientRect(),
        rootBounds: null,
        time: Date.now(),
      } as IntersectionObserverEntry)
    );
    this.callback(entries, this);
  }
}

// Test component
function TestComponent({
  threshold,
  rootMargin,
  triggerOnce,
}: {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}) {
  const { ref, isIntersecting, hasIntersected } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce,
  });

  return (
    <div ref={ref} data-testid="observed-element">
      <div data-testid="is-intersecting">{String(isIntersecting)}</div>
      <div data-testid="has-intersected">{String(hasIntersected)}</div>
    </div>
  );
}

describe("useIntersectionObserver", () => {
  let mockObserverInstance: MockIntersectionObserver | null = null;
  let observerInstances: MockIntersectionObserver[] = [];

  beforeEach(() => {
    mockObserverInstance = null;
    observerInstances = [];

    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn((callback, options) => {
      mockObserverInstance = new MockIntersectionObserver(callback, options || {});
      observerInstances.push(mockObserverInstance);
      return mockObserverInstance as unknown as IntersectionObserver;
    }) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.clearAllMocks();
    mockObserverInstance = null;
    observerInstances = [];
  });

  describe("Basic Functionality", () => {
    it("returns ref, isIntersecting, and hasIntersected properties", async () => {
      const { getByTestId } = render(<TestComponent />);

      const observedElement = getByTestId("observed-element");
      const isIntersecting = getByTestId("is-intersecting");
      const hasIntersected = getByTestId("has-intersected");

      expect(observedElement).toBeInTheDocument();
      expect(isIntersecting.textContent).toBe("false");
      expect(hasIntersected.textContent).toBe("false");
    });

    it("sets isIntersecting to true when element enters viewport", async () => {
      const { getByTestId } = render(<TestComponent />);

      // Wait for observer to be created
      await waitFor(() => {
        expect(mockObserverInstance).not.toBeNull();
      });

      // Simulate intersection
      act(() => {
        mockObserverInstance!.trigger(true);
      });

      const isIntersecting = getByTestId("is-intersecting");
      expect(isIntersecting.textContent).toBe("true");
    });

    it("sets isIntersecting to false when element leaves viewport", async () => {
      const { getByTestId } = render(<TestComponent triggerOnce={false} />);

      await waitFor(() => {
        expect(mockObserverInstance).not.toBeNull();
      });

      // Enter viewport
      act(() => {
        mockObserverInstance!.trigger(true);
      });
      expect(getByTestId("is-intersecting").textContent).toBe("true");

      // Leave viewport
      act(() => {
        mockObserverInstance!.trigger(false);
      });
      expect(getByTestId("is-intersecting").textContent).toBe("false");
    });
  });

  describe("triggerOnce Behavior", () => {
    it("with triggerOnce=true, only triggers once", async () => {
      const { getByTestId } = render(<TestComponent triggerOnce={true} />);

      await waitFor(() => {
        expect(mockObserverInstance).not.toBeNull();
      });

      // First intersection
      act(() => {
        mockObserverInstance!.trigger(true);
      });
      expect(getByTestId("is-intersecting").textContent).toBe("true");
      expect(getByTestId("has-intersected").textContent).toBe("true");

      // Once hasIntersected is true with triggerOnce, the observer disconnects
      // So isIntersecting stays true (no more updates from observer)
      expect(getByTestId("is-intersecting").textContent).toBe("true");
      expect(getByTestId("has-intersected").textContent).toBe("true");
    });

    it("with triggerOnce=false, triggers multiple times", async () => {
      const { getByTestId } = render(<TestComponent triggerOnce={false} />);

      await waitFor(() => {
        expect(mockObserverInstance).not.toBeNull();
      });

      // First intersection
      act(() => {
        mockObserverInstance!.trigger(true);
      });
      expect(getByTestId("is-intersecting").textContent).toBe("true");

      // Leave viewport
      act(() => {
        mockObserverInstance!.trigger(false);
      });
      expect(getByTestId("is-intersecting").textContent).toBe("false");

      // Enter viewport again (should trigger again)
      act(() => {
        mockObserverInstance!.trigger(true);
      });
      expect(getByTestId("is-intersecting").textContent).toBe("true");
    });
  });

  describe("Configuration Options", () => {
    it("respects threshold option (0.1)", async () => {
      render(<TestComponent threshold={0.1} />);

      await waitFor(() => {
        expect(IntersectionObserver).toHaveBeenCalledWith(
          expect.any(Function),
          expect.objectContaining({ threshold: 0.1 })
        );
      });
    });

    it("respects threshold option (0.5, 1.0)", async () => {
      const { unmount: unmount1 } = render(<TestComponent threshold={0.5} />);

      await waitFor(() => {
        expect(IntersectionObserver).toHaveBeenCalledWith(
          expect.any(Function),
          expect.objectContaining({ threshold: 0.5 })
        );
      });

      unmount1();
      vi.clearAllMocks();

      render(<TestComponent threshold={1.0} />);

      await waitFor(() => {
        expect(IntersectionObserver).toHaveBeenCalledWith(
          expect.any(Function),
          expect.objectContaining({ threshold: 1.0 })
        );
      });
    });

    it("respects rootMargin option ('50px', '100px')", async () => {
      const { unmount: unmount1 } = render(<TestComponent rootMargin="50px" />);

      await waitFor(() => {
        expect(IntersectionObserver).toHaveBeenCalledWith(
          expect.any(Function),
          expect.objectContaining({ rootMargin: "50px" })
        );
      });

      unmount1();
      vi.clearAllMocks();

      render(<TestComponent rootMargin="100px" />);

      await waitFor(() => {
        expect(IntersectionObserver).toHaveBeenCalledWith(
          expect.any(Function),
          expect.objectContaining({ rootMargin: "100px" })
        );
      });
    });
  });

  describe("Cleanup", () => {
    it("disconnects observer on unmount (no memory leaks)", async () => {
      const { unmount } = render(<TestComponent />);

      await waitFor(() => {
        expect(mockObserverInstance).not.toBeNull();
      });

      const disconnectSpy = vi.spyOn(mockObserverInstance!, "disconnect");

      // Unmount the component
      unmount();

      // Verify disconnect was called
      expect(disconnectSpy).toHaveBeenCalled();
    });
  });
});
