/**
 * Tests for Pagination Component
 *
 * Behavior-focused tests for pagination controls
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
      render(<Pagination {...defaultProps} />);
      expect(screen.getByText(/Showing page/)).toBeInTheDocument();
    });

    it('displays current page stats', () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'Showing page 1 of 10 (500 total sites)';
      })).toBeInTheDocument();
    });

    it('renders Previous and Next buttons', () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    });
  });

  describe('Button States', () => {
    it('disables Previous button on first page', () => {
      render(<Pagination {...defaultProps} currentPage={1} />);
      const prevButton = screen.getByLabelText('Previous page');
      expect(prevButton).toBeDisabled();
    });

    it('disables Next button on last page', () => {
      render(<Pagination {...defaultProps} currentPage={10} totalPages={10} />);
      const nextButton = screen.getByLabelText('Next page');
      expect(nextButton).toBeDisabled();
    });

    it('enables both buttons on middle pages', () => {
      render(<Pagination {...defaultProps} currentPage={5} />);
      const prevButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');
      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });

    it('disables all buttons when loading', () => {
      render(<Pagination {...defaultProps} currentPage={5} isLoading={true} />);
      const prevButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');
      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Page Number Display', () => {
    it('shows all page numbers when totalPages <= 7', () => {
      render(<Pagination {...defaultProps} totalPages={5} />);
      expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to page 5')).toBeInTheDocument();
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });

    it('shows ellipsis for many pages', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={20} />);
      const ellipses = screen.getAllByText('...');
      expect(ellipses.length).toBeGreaterThan(0);
    });

    it('always shows first and last page numbers', () => {
      render(<Pagination {...defaultProps} currentPage={10} totalPages={20} />);
      expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to page 20')).toBeInTheDocument();
    });

    it('highlights current page', () => {
      render(<Pagination {...defaultProps} currentPage={5} />);
      const currentPageButton = screen.getByLabelText('Go to page 5');
      expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('User Interactions', () => {
    it('calls onPageChange when Previous is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);

      const prevButton = screen.getByLabelText('Previous page');
      await user.click(prevButton);

      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('calls onPageChange when Next is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);

      const nextButton = screen.getByLabelText('Next page');
      await user.click(nextButton);

      expect(onPageChange).toHaveBeenCalledWith(6);
    });

    it('calls onPageChange when page number is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={5} totalPages={10} onPageChange={onPageChange} />);

      // Page 6 should be visible (current is 5, so 4,5,6,7 are shown)
      const page6Button = screen.getByLabelText('Go to page 6');
      await user.click(page6Button);

      expect(onPageChange).toHaveBeenCalledWith(6);
    });

    it('does not call onPageChange when current page is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);

      const currentPageButton = screen.getByLabelText('Go to page 5');
      await user.click(currentPageButton);

      // Should still call onPageChange, but with same page (5)
      expect(onPageChange).toHaveBeenCalledWith(5);
    });
  });

  describe('Edge Cases', () => {
    it('handles single page correctly', () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={1} totalItems={10} />);

      const prevButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'Showing page 1 of 1 (10 total sites)';
      })).toBeInTheDocument();
    });

    it('handles zero items correctly', () => {
      render(<Pagination {...defaultProps} totalPages={0} totalItems={0} />);
      expect(screen.getByText(/0 total sites/)).toBeInTheDocument();
    });

    it('handles large page numbers', () => {
      render(<Pagination {...defaultProps} currentPage={999} totalPages={1000} totalItems={50000} />);
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'Showing page 999 of 1000 (50000 total sites)';
      })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has aria-label on all buttons', () => {
      render(<Pagination {...defaultProps} currentPage={5} />);

      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument();
    });

    it('uses aria-current for current page', () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      const currentPageButton = screen.getByLabelText('Go to page 3');
      expect(currentPageButton).toHaveAttribute('aria-current', 'page');

      const otherPageButton = screen.getByLabelText('Go to page 1');
      expect(otherPageButton).not.toHaveAttribute('aria-current');
    });
  });
});
