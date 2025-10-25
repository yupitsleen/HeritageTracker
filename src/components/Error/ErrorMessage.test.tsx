/**
 * Tests for ErrorMessage Component
 *
 * Focus: User interaction, retry functionality, accessibility
 * Avoids: Styling specifics, implementation details
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  const mockError = new Error('Test error message');

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<ErrorMessage error={mockError} />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('displays error message', () => {
      render(<ErrorMessage error={mockError} />);
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('displays default title', () => {
      render(<ErrorMessage error={mockError} />);
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('displays custom title when provided', () => {
      render(<ErrorMessage error={mockError} title="Custom Error Title" />);
      expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
    });

    it('displays fallback message for error without message', () => {
      const emptyError = new Error();
      render(<ErrorMessage error={emptyError} />);
      expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has role="alert" for screen readers', () => {
      render(<ErrorMessage error={mockError} />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('has aria-live="assertive" for immediate announcements', () => {
      render(<ErrorMessage error={mockError} />);
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveAttribute('aria-live', 'assertive');
    });

    it('retry button has proper button role', () => {
      const onRetry = vi.fn();
      render(<ErrorMessage error={mockError} onRetry={onRetry} />);
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });
  });

  describe('Retry Functionality', () => {
    it('shows retry button when onRetry is provided', () => {
      const onRetry = vi.fn();
      render(<ErrorMessage error={mockError} onRetry={onRetry} />);
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('hides retry button when onRetry is not provided', () => {
      render(<ErrorMessage error={mockError} />);
      expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();

      render(<ErrorMessage error={mockError} onRetry={onRetry} />);

      const retryButton = screen.getByRole('button', { name: /try again/i });
      await user.click(retryButton);

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('calls onRetry only once per click', async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();

      render(<ErrorMessage error={mockError} onRetry={onRetry} />);

      const retryButton = screen.getByRole('button', { name: /try again/i });
      await user.click(retryButton);

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('allows multiple retry attempts', async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();

      render(<ErrorMessage error={mockError} onRetry={onRetry} />);

      const retryButton = screen.getByRole('button', { name: /try again/i });
      await user.click(retryButton);
      await user.click(retryButton);
      await user.click(retryButton);

      expect(onRetry).toHaveBeenCalledTimes(3);
    });
  });

  describe('Full Screen Mode', () => {
    it('renders in regular mode by default', () => {
      render(<ErrorMessage error={mockError} />);
      const container = screen.getByRole('alert');
      expect(container).not.toHaveClass('fixed');
    });

    it('renders in full screen mode when enabled', () => {
      render(<ErrorMessage error={mockError} fullScreen />);
      const container = screen.getByRole('alert');
      expect(container).toHaveClass('fixed');
    });

    it('renders with retry button in full screen', () => {
      const onRetry = vi.fn();
      render(<ErrorMessage error={mockError} onRetry={onRetry} fullScreen />);

      expect(screen.getByRole('alert')).toHaveClass('fixed');
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });
  });

  describe('Error Message Variations', () => {
    it('handles error with long message', () => {
      const longError = new Error('This is a very long error message that should still be displayed properly without breaking the layout or causing any visual issues in the component.');
      render(<ErrorMessage error={longError} />);
      expect(screen.getByText(longError.message)).toBeInTheDocument();
    });

    it('handles error with special characters', () => {
      const specialError = new Error('Error: Failed to fetch data from API endpoint "/sites"');
      render(<ErrorMessage error={specialError} />);
      expect(screen.getByText(specialError.message)).toBeInTheDocument();
    });
  });

  describe('Combined Props', () => {
    it('handles all props together', async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();
      const customError = new Error('Custom error');

      render(
        <ErrorMessage
          error={customError}
          onRetry={onRetry}
          fullScreen
          title="Custom Title"
        />
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom error')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveClass('fixed');

      const retryButton = screen.getByRole('button', { name: /try again/i });
      await user.click(retryButton);

      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('Help Text', () => {
    it('displays help text for contacting support', () => {
      render(<ErrorMessage error={mockError} />);
      expect(screen.getByText(/If this problem persists/)).toBeInTheDocument();
    });
  });
});
