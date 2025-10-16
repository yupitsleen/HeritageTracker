import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

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
