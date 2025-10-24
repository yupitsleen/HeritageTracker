# Backend Integration Plan - Mock-First Approach

**Created:** October 24, 2025
**Status:** Planning
**Estimated Total Time:** 6-8 hours

---

## Overview

Prepare frontend for C#/.NET REST API integration using mock-first approach. This allows parallel frontend/backend development and establishes clear API contract.

---

## Phase 1: API Layer Foundation (2 hours)

### 1.1 Create API Client Structure
**Status:** ⬜ Not Started
**Time:** 30 min

**Tasks:**
- [ ] Create `src/api/` directory
- [ ] Create `src/api/client.ts` with base configuration
- [ ] Create `src/api/sites.ts` with site endpoints
- [ ] Create `src/api/types.ts` for API-specific types
- [ ] Add environment variables to `.env.development` and `.env.production`

**Files to Create:**
```
src/api/
  ├── client.ts          # Base HTTP client (fetch wrapper)
  ├── sites.ts           # Site-specific API calls
  └── types.ts           # API response types
```

**Environment Variables:**
```bash
# .env.development
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK_API=true

# .env.production
VITE_API_URL=https://api.heritagetracker.com/api
VITE_USE_MOCK_API=false
```

---

### 1.2 Create Data Fetching Hooks
**Status:** ⬜ Not Started
**Time:** 1 hour

**Tasks:**
- [ ] Create `src/hooks/useSites.ts` for fetching all sites
- [ ] Create `src/hooks/useSiteById.ts` for single site fetch
- [ ] Add loading, error, and retry logic
- [ ] Add TypeScript types for hook returns

**Files to Create:**
```
src/hooks/
  ├── useSites.ts        # Fetch all sites with loading/error states
  └── useSiteById.ts     # Fetch single site by ID
```

---

### 1.3 Create Loading & Error Components
**Status:** ⬜ Not Started
**Time:** 30 min

**Tasks:**
- [ ] Create `src/components/Loading/LoadingSpinner.tsx`
- [ ] Create `src/components/Loading/LoadingSkeleton.tsx` (optional)
- [ ] Create `src/components/Error/ErrorMessage.tsx`
- [ ] Add retry functionality to error component
- [ ] Style to match Palestinian flag theme

**Files to Create:**
```
src/components/Loading/
  ├── LoadingSpinner.tsx
  └── LoadingSkeleton.tsx (optional)

src/components/Error/
  └── ErrorMessage.tsx
```

---

## Phase 2: Mock Backend Setup (1-2 hours)

### 2.1 Install MSW (Mock Service Worker)
**Status:** ⬜ Not Started
**Time:** 15 min

**Tasks:**
- [ ] Install MSW: `npm install msw@latest --save-dev`
- [ ] Initialize MSW: `npx msw init public/ --save`
- [ ] Verify `public/mockServiceWorker.js` created

---

### 2.2 Create Mock API Handlers
**Status:** ⬜ Not Started
**Time:** 45 min

**Tasks:**
- [ ] Create `src/mocks/` directory
- [ ] Create `src/mocks/handlers.ts` with site endpoints
- [ ] Create `src/mocks/browser.ts` for browser setup
- [ ] Import existing `mockSites` data
- [ ] Add mock delay to simulate network latency

**Files to Create:**
```
src/mocks/
  ├── handlers.ts        # MSW request handlers
  ├── browser.ts         # MSW browser setup
  └── data.ts            # Mock response data (optional)
```

**Mock Endpoints to Implement:**
```typescript
GET  /api/sites              // Return all mockSites
GET  /api/sites/:id          // Return single site by ID
GET  /api/sites?type=...     // Filtered results (optional Phase 3)
```

---

### 2.3 Configure MSW in App
**Status:** ⬜ Not Started
**Time:** 30 min

**Tasks:**
- [ ] Update `src/main.tsx` to conditionally start MSW
- [ ] Add MSW only when `VITE_USE_MOCK_API=true`
- [ ] Test MSW intercepts API calls in browser DevTools
- [ ] Add MSW to test setup (optional)

---

## Phase 3: Update Components for Async Data (2-3 hours)

### 3.1 Update HomePage Component
**Status:** ⬜ Not Started
**Time:** 1 hour

**Tasks:**
- [ ] Replace `mockSites` import with `useSites()` hook
- [ ] Add loading state UI (LoadingSpinner)
- [ ] Add error state UI (ErrorMessage)
- [ ] Update `useFilteredSites` to accept async sites
- [ ] Test with mock API in browser

**Changes:**
```typescript
// Before
const sites = mockSites;

// After
const { sites, isLoading, error, refetch } = useSites();
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} onRetry={refetch} />;
```

---

### 3.2 Update SiteDetailPanel (if needed)
**Status:** ⬜ Not Started
**Time:** 30 min

**Tasks:**
- [ ] Check if SiteDetailPanel needs individual site fetch
- [ ] Add `useSiteById(id)` if fetching from modal
- [ ] Add loading state for single site fetch
- [ ] Test modal with mock API

---

### 3.3 Update Tests for Async Data
**Status:** ⬜ Not Started
**Time:** 1 hour

**Tasks:**
- [ ] Update tests to mock `useSites` hook
- [ ] Add tests for loading states
- [ ] Add tests for error states
- [ ] Ensure all 1473 tests still pass

---

## Phase 4: API Contract Documentation (30 min)

### 4.1 Document REST API Contract
**Status:** ⬜ Not Started
**Time:** 30 min

**Tasks:**
- [ ] Create `API_CONTRACT.md` file
- [ ] Document all endpoints (GET, POST, PUT, DELETE)
- [ ] Document request/response formats
- [ ] Document query parameters for filtering
- [ ] Document error response format
- [ ] Share with backend team

**File to Create:**
```
API_CONTRACT.md            # REST API specification for backend team
```

---

## Phase 5: Testing & Validation (1 hour)

### 5.1 Manual Testing
**Status:** ⬜ Not Started
**Time:** 30 min

**Tasks:**
- [ ] Test loading spinner appears on page load
- [ ] Test data renders after mock delay
- [ ] Test error state (temporarily break mock API)
- [ ] Test retry functionality works
- [ ] Test all filters still work with async data
- [ ] Test table sorting/pagination
- [ ] Test map markers render correctly

---

### 5.2 Automated Testing
**Status:** ⬜ Not Started
**Time:** 30 min

**Tasks:**
- [ ] Run full test suite: `npm test`
- [ ] Verify all 1473 tests still pass
- [ ] Run linter: `npm run lint`
- [ ] Run production build: `npm run build`
- [ ] Fix any breaking changes

---

## Phase 6: Backend Swap Preparation (Future)

### 6.1 Backend Integration Checklist
**Status:** ⬜ Not Started (Future Work)
**Time:** 1-2 hours when backend ready

**Tasks:**
- [ ] Backend provides API base URL
- [ ] Update `.env.production` with real API URL
- [ ] Set `VITE_USE_MOCK_API=false` for production
- [ ] Test against real backend in development
- [ ] Handle API contract differences (if any)
- [ ] Test pagination with 1000+ sites
- [ ] Test error handling with real API errors
- [ ] Deploy to staging environment

---

## Success Criteria

### Phase 1-5 Complete When:
- ✅ All API calls go through centralized client
- ✅ MSW intercepts all API calls in development
- ✅ Loading states show on data fetch
- ✅ Error states show and allow retry
- ✅ All 1473 tests passing
- ✅ Production build successful
- ✅ API contract documented and shared

### Ready for Backend When:
- ✅ Frontend works perfectly with mock API
- ✅ API contract is clear and documented
- ✅ Can swap mock for real API with 1 env variable change
- ✅ All edge cases tested (errors, empty data, slow responses)

---

## File Structure After Completion

```
src/
├── api/
│   ├── client.ts              # Base HTTP client
│   ├── sites.ts               # Site API endpoints
│   └── types.ts               # API response types
├── components/
│   ├── Loading/
│   │   ├── LoadingSpinner.tsx
│   │   └── LoadingSkeleton.tsx (optional)
│   └── Error/
│       └── ErrorMessage.tsx
├── hooks/
│   ├── useSites.ts            # Fetch all sites
│   └── useSiteById.ts         # Fetch single site
├── mocks/
│   ├── handlers.ts            # MSW handlers
│   ├── browser.ts             # MSW browser setup
│   └── data.ts                # Mock data (optional)
└── pages/
    └── HomePage.tsx           # Updated to use async data

API_CONTRACT.md                # API specification for backend team
```

---

## Notes

- **Current data in `mockSites`** will become the mock API responses
- **Existing `mockSites` file** can stay for backward compatibility initially
- **MSW only runs in development** when `VITE_USE_MOCK_API=true`
- **Production build** will use real API automatically
- **Tests can use MSW** or mock the hooks directly

---

## Risk Mitigation

**Risk:** Backend API structure differs from our mock
**Mitigation:** Document contract clearly, validate early with backend team

**Risk:** Tests break with async data
**Mitigation:** Mock hooks in tests, add loading/error test cases

**Risk:** Performance issues with 1000+ sites
**Mitigation:** VirtualizedTableBody already prepared, enable when needed

**Risk:** MSW conflicts with tests
**Mitigation:** MSW can be disabled in test environment if needed

---

## Next Steps After This Phase

1. **Backend Development** (Parallel) - C#/.NET team builds REST API
2. **Admin Features** - Add POST/PUT/DELETE for site management
3. **Authentication** - Add user login if needed
4. **Real-time Updates** - WebSockets for live data (optional)
5. **Caching Layer** - React Query or SWR for better UX (optional)

---

**Last Updated:** October 24, 2025
**Branch:** feat/mockBackendIntegration (to be created after PR)
