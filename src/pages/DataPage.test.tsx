import { describe, it, expect } from 'vitest';
import { renderWithTheme } from '../test-utils/renderWithTheme';
import { BrowserRouter } from 'react-router-dom';
import { DataPage } from './DataPage';

/**
 * DataPage Unit Tests
 *
 * Purpose: Verify DataPage component renders without crashing
 * Replaces E2E test: "Data page loads successfully"
 */
describe('DataPage', () => {
  it('renders without crashing', () => {
    const { container } = renderWithTheme(
      <BrowserRouter>
        <DataPage />
      </BrowserRouter>
    );
    expect(container).toBeInTheDocument();
  });
});
