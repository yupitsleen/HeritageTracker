import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Mock matchMedia for useMediaQuery hook
// matchMedia is not available in JSDOM test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

// Mock ResizeObserver for D3/TimelineScrubber
// ResizeObserver is not available in JSDOM test environment
global.ResizeObserver = class ResizeObserver {
  observe() {
    // Mock implementation - do nothing
  }
  unobserve() {
    // Mock implementation - do nothing
  }
  disconnect() {
    // Mock implementation - do nothing
  }
};

// Mock IntersectionObserver for LazySection
// IntersectionObserver is not available in JSDOM test environment
global.IntersectionObserver = class IntersectionObserver {
  constructor(private callback: IntersectionObserverCallback) {
    // Immediately trigger callback with isIntersecting = true for testing
    // This ensures lazy-loaded content renders immediately in tests
    setTimeout(() => {
      this.callback(
        [
          {
            isIntersecting: true,
            target: {} as Element,
            intersectionRatio: 1,
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            time: Date.now(),
          },
        ],
        this as unknown as IntersectionObserver
      );
    }, 0);
  }
  observe() {
    // Mock implementation - do nothing
  }
  unobserve() {
    // Mock implementation - do nothing
  }
  disconnect() {
    // Mock implementation - do nothing
  }
};

// Mock HTMLCanvasElement for leaflet.heat
// The heat map library requires canvas context, which isn't available in JSDOM
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(HTMLCanvasElement.prototype.getContext as any) = function () {
  return {
    fillRect: () => {},
    clearRect: () => {},
    getImageData: () => ({
      data: new Array(4),
    }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({
      width: 0,
    }),
    transform: () => {},
    rect: () => {},
    clip: () => {},
    createLinearGradient: () => ({
      addColorStop: () => {},
    }),
    createRadialGradient: () => ({
      addColorStop: () => {},
    }),
    // Properties needed by leaflet.heat
    canvas: {
      width: 300,
      height: 150,
    },
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    shadowColor: 'rgba(0, 0, 0, 0)',
    globalAlpha: 1,
  };
};

// Cleanup after each test
afterEach(() => {
  cleanup();
});
