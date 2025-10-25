/**
 * Tests for useDebounce Hook
 *
 * Behavior-focused tests for debounced value updates
 */

import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('delays updating value until delay has passed', async () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 50 }, // Use shorter delay for testing
    });

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 50 });

    // Should still be initial (delay hasn't passed)
    expect(result.current).toBe('initial');

    // Wait for debounce to complete
    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 200 }
    );
  });

  it('works with numbers', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 50), {
      initialProps: { value: 0 },
    });

    expect(result.current).toBe(0);

    rerender({ value: 42 });

    await waitFor(
      () => {
        expect(result.current).toBe(42);
      },
      { timeout: 200 }
    );
  });

  it('works with objects', async () => {
    const initialObj = { name: 'initial' };
    const updatedObj = { name: 'updated' };

    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 50), {
      initialProps: { value: initialObj },
    });

    expect(result.current).toBe(initialObj);

    rerender({ value: updatedObj });

    await waitFor(
      () => {
        expect(result.current).toBe(updatedObj);
      },
      { timeout: 200 }
    );
  });

  it('uses default delay when not specified', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'updated' });

    // Should eventually update (using default 300ms delay)
    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 500 }
    );
  });
});
