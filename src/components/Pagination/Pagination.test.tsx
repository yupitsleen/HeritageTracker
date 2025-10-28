/**
 * Tests for Pagination Component
 *
 * Behavior-focused tests for pagination controls
 */

import { describe, it, expect, vi } from 'vitest';
import { renderWithTheme, screen } from '../../test-utils/renderWithTheme';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    totalItems: 500,
    onPageChange: vi.fn(),
  };

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithTheme(<Pagination {...defaultProps} />);
      expect(screen.getByText(/Showing page/)).toBeInTheDocument();
    });

    it('displays current page stats', () => {
      renderWithTheme(<Pagination {...defaultProps} />);
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'Showing page 1 of 10 (500 total sites)';
      })).toBeInTheDocument();
    });

    it('renders Previous and Next buttons', () => {
      renderWithTheme(<Pagination {...defaultProps} />);
      expect(screen.getByLabelText('Previous')).toBeInTheDocument();
      expect(screen.getByLabelText('Next')).toBeInTheDocument();
    });
  });

  describe('Button States', () => {
    it('disables Previous button on first page', () => {
      renderWithTheme(<Pagination {...defaultProps} currentPage={1} />);
      const prevButton = screen.getByLabelText('Previous');
      expect(prevButton).toBeDisabled();
    });

    it('disables Next button on last page', () => {
      renderWithTheme(<Pagination {...defaultProps} currentPage={10} totalPages={10} />);
      const nextButton = screen.getByLabelText('Next');
      expect(nextButton).toBeDisabled();
    });

    it('enables both buttons on middle pages', () => {
      renderWithTheme(<Pagination {...defaultProps} currentPage={5} />);
      const prevButton = screen.getByLabelText('Previous');
      const nextButton = screen.getByLabelText('Next');
      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });

    it('disables all buttons when loading', () => {
      renderWithTheme(<Pagination {...defaultProps} currentPage={5} isLoading={true} />);
      const prevButton = screen.getByLabelText('Previous');
      const nextButton = screen.getByLabelText('Next');
      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Page Number Display', () => {
    it('shows all page numbers when totalPages <= 7', () => {
      renderWithTheme(<Pagination {...defaultProps} totalPages={5} />);
      expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to page 5')).toBeInTheDocument();
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });

    it('shows ellipsis for many pages', () => {
      renderWithTheme(<Pagination {...defaultProps} currentPage={5} totalPages={20} />);
      const ellipses = screen.getAllByText('...');
      expect(ellipses.length).toBeGreaterThan(0);
    });

    it('always shows first and last page numbers', () => {
      renderWithTheme(<Pagination {...defaultProps} currentPage={10} totalPages={20} />);
      expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to page 20')).toBeInTheDocument();
    });

    it('highlights current page', () => {
      renderWithTheme(<Pagination {...defaultProps} currentPage={5} />);
      const currentPageButton = screen.getByLabelText('Go to page 5');
      expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('User Interactions', () => {
    it('calls onPageChange when Previous is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      renderWithTheme(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);

      const prevButton = screen.getByLabelText('Previous');
      await user.click(prevButton);

      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('calls onPageChange when Next is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      renderWithTheme(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);

      const nextButton = screen.getByLabelText('Next');
      await user.click(nextButton);

      expect(onPageChange).toHaveBeenCalledWith(6);
    });

    it('calls onPageChange when page number is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      renderWithTheme(<Pagination {...defaultProps} currentPage={5} totalPages={10} onPageChange={onPageChange} />);

      // Page 6 should be visible (current is 5, so 4,5,6,7 are shown)
      const page6Button = screen.getByLabelText('Go to page 6');
      await user.click(page6Button);

      expect(onPageChange).toHaveBeenCalledWith(6);
    });

    it('does not call onPageChange when current page is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      renderWithTheme(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);

      const currentPageButton = screen.getByLabelText('Go to page 5');
      await user.click(currentPageButton);

      // Should still call onPageChange, but with same page (5)
      expect(onPageChange).toHaveBeenCalledWith(5);
    });
  });

  describe('Edge Cases', () => {
    it('handles single page correctly', () => {
      renderWithTheme(<Pagination {...defaultProps} currentPage={1} totalPages={1} totalItems={10} />);

      const prevButton = screen.getByLabelText('Previous');
      const nextButton = screen.getByLabelText('Next');

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'Showing page 1 of 1 (10 total sites)';
      })).toBeInTheDocument();
    });

    it('handles zero items correctly', () => {
      renderWithTheme(<Pagination {...defaultProps} totalPages={0} totalItems={0} />);
      expect(screen.getByText(/0 total sites/)).toBeInTheDocument();
    });

    it('handles large page numbers', () => {
      renderWithTheme(<Pagination {...defaultProps} currentPage={999} totalPages={1000} totalItems={50000} />);
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'Showing page 999 of 1000 (50000 total sites)';
      })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has aria-label on all buttons', () => {
      renderWithTheme(<Pagination {...defaultProps} currentPage={5} />);

      expect(screen.getByLabelText('Previous')).toBeInTheDocument();
      expect(screen.getByLabelText('Next')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument();
    });

    it('uses aria-current for current page', () => {
      renderWithTheme(<Pagination {...defaultProps} currentPage={3} />);

      const currentPageButton = screen.getByLabelText('Go to page 3');
      expect(currentPageButton).toHaveAttribute('aria-current', 'page');

      const otherPageButton = screen.getByLabelText('Go to page 1');
      expect(otherPageButton).not.toHaveAttribute('aria-current');
    });
  });
});
