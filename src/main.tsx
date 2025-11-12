import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'

/**
 * Note: Using adapter pattern for backend abstraction
 * Mock data is injected at the API layer via adapters (see src/api/adapters/)
 * Supports three modes: Mock API, Local Backend, and Supabase Cloud
 * Mode is controlled by environment variables (see .env files)
 */

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
