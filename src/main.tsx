import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * Note: Using direct mock adapter instead of MSW Service Workers
 * Mock data is injected at the API layer (see src/api/mockAdapter.ts)
 * This avoids Service Worker registration issues while maintaining
 * the same mock-first development approach
 */

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
