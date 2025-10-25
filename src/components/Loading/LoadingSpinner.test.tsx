/**
 * Tests for LoadingSpinner Component
 *
 * Focus: Accessibility, size variants, full-screen behavior
 * Avoids: Implementation details, CSS specifics
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<LoadingSpinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('displays default loading message', () => {
      render(<LoadingSpinner />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('displays custom message when provided', () => {
      render(<LoadingSpinner message="Loading heritage sites..." />);
      expect(screen.getByText('Loading heritage sites...')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has role="status" for screen readers', () => {
      render(<LoadingSpinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has aria-live="polite" for announcements', () => {
      render(<LoadingSpinner />);
      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveAttribute('aria-live', 'polite');
    });

    it('includes screen reader text', () => {
      render(<LoadingSpinner />);
      expect(screen.getByText('Loading content, please wait...')).toBeInTheDocument();
    });

    it('has sr-only class on screen reader text', () => {
      render(<LoadingSpinner />);
      const srText = screen.getByText('Loading content, please wait...');
      expect(srText).toHaveClass('sr-only');
    });
  });

  describe('Size Variants', () => {
    it('renders with small size', () => {
      render(<LoadingSpinner size="sm" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders with medium size (default)', () => {
      render(<LoadingSpinner size="md" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders with large size', () => {
      render(<LoadingSpinner size="lg" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Full Screen Mode', () => {
    it('renders in regular mode by default', () => {
      render(<LoadingSpinner />);
      const container = screen.getByRole('status');
      expect(container).not.toHaveClass('fixed');
    });

    it('renders in full screen mode when enabled', () => {
      render(<LoadingSpinner fullScreen />);
      const container = screen.getByRole('status');
      expect(container).toHaveClass('fixed');
    });

    it('renders with custom message in full screen', () => {
      render(<LoadingSpinner fullScreen message="Initializing..." />);
      expect(screen.getByText('Initializing...')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveClass('fixed');
    });
  });

  describe('Combined Props', () => {
    it('handles all props together', () => {
      render(
        <LoadingSpinner
          size="lg"
          message="Loading data..."
          fullScreen
        />
      );

      expect(screen.getByText('Loading data...')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveClass('fixed');
    });
  });

  describe('Message Display', () => {
    it('hides message when empty string provided', () => {
      render(<LoadingSpinner message="" />);
      // Default message should not be shown
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('displays message for each size variant', () => {
      const { rerender } = render(<LoadingSpinner size="sm" message="Small loading" />);
      expect(screen.getByText('Small loading')).toBeInTheDocument();

      rerender(<LoadingSpinner size="md" message="Medium loading" />);
      expect(screen.getByText('Medium loading')).toBeInTheDocument();

      rerender(<LoadingSpinner size="lg" message="Large loading" />);
      expect(screen.getByText('Large loading')).toBeInTheDocument();
    });
  });
});
