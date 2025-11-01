/**
 * Tests for ErrorMessage Component
 *
 * Focus: User interaction, retry functionality, accessibility
 */

import { describe, it, expect, vi } from 'vitest';
import { renderWithTheme, screen } from '../../test-utils/renderWithTheme';
import userEvent from '@testing-library/user-event';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  const mockError = new Error('Test error message');

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithTheme(<ErrorMessage error={mockError} />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('displays error message', () => {
      renderWithTheme(<ErrorMessage error={mockError} />);
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('displays custom title when provided', () => {
      renderWithTheme(<ErrorMessage error={mockError} title="Custom Error Title" />);
      expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has role="alert" for screen readers', () => {
      renderWithTheme(<ErrorMessage error={mockError} />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('has aria-live="assertive" for immediate announcements', () => {
      renderWithTheme(<ErrorMessage error={mockError} />);
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveAttribute('aria-live', 'assertive');
    });
  });

  describe('Retry Functionality', () => {
    it('shows retry button when onRetry is provided', () => {
      const onRetry = vi.fn();
      renderWithTheme(<ErrorMessage error={mockError} onRetry={onRetry} />);
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('hides retry button when onRetry is not provided', () => {
      renderWithTheme(<ErrorMessage error={mockError} />);
      expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();

      renderWithTheme(<ErrorMessage error={mockError} onRetry={onRetry} />);

      const retryButton = screen.getByRole('button', { name: /try again/i });
      await user.click(retryButton);

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('allows multiple retry attempts', async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();

      renderWithTheme(<ErrorMessage error={mockError} onRetry={onRetry} />);

      const retryButton = screen.getByRole('button', { name: /try again/i });
      await user.click(retryButton);
      await user.click(retryButton);

      expect(onRetry).toHaveBeenCalledTimes(2);
    });
  });

  describe('Full Screen Mode', () => {
    it('renders in full screen mode when enabled', () => {
      renderWithTheme(<ErrorMessage error={mockError} fullScreen />);
      const container = screen.getByRole('alert');
      expect(container).toHaveClass('fixed');
    });
  });
});
