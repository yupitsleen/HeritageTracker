# Map Sync Implementation - Todo List

## Overview
Implement dynamic satellite imagery synchronization with timeline scrubber playback. When "Sync Map" toggle is enabled, the SiteDetailView satellite imagery automatically switches between historical periods (2014 → Aug 2023 → Current) as the timeline progresses.

## Requirements Summary

### Core Behavior
- **Default state**: Sync Map toggle OFF
- **When enabled**: Satellite imagery periods switch based on timeline position
- **Dynamic thresholds**: Use `HISTORICAL_IMAGERY` dates dynamically (extensible for future periods)
- **Initial pause**: When play starts with sync ON, pause at 2014 imagery for 1 second before playing
- **User override**: Manual TimeToggle clicks disable sync for current playback session only
- **Reset behavior**: Timeline reset re-enables sync if toggle is still ON

### View Behavior
- **No site selected**: Show Gaza overview (respect user zoom/pan after manual adjustment)
- **Site selected**: Zoom to site (respect user zoom/pan after manual adjustment)
- **TimeToggle buttons**: Update to reflect current active period when synced

### UX Enhancements
- **Button tooltip**: Clarify sync functionality
- **Status indication**: Consider visual feedback when auto-switching occurs (future)

---

## Implementation Tasks

### Phase 1: Core Sync Logic

- [ ] **Update AnimationContext**
  - Add `syncMapEnabled` state (boolean)
  - Add `syncActive` state (boolean, tracks if sync is temporarily disabled)
  - Add `setSyncMapEnabled(enabled: boolean)` action
  - Add `setSyncActive(active: boolean)` action
  - Logic: `syncActive` resets to `syncMapEnabled` value on timeline reset

- [ ] **Update TimelineScrubber**
  - Remove local `syncMap` state (move to AnimationContext)
  - Remove `onSyncMapChange` prop (no longer needed)
  - Use `syncMapEnabled` and `setSyncMapEnabled` from context
  - Keep Sync Map button UI (update to use context state)
  - Improve button tooltip: "When enabled, satellite imagery switches to match timeline date (2014 → Aug 2023 → Current)"

- [ ] **Update SiteDetailView**
  - Remove `syncMapToTimeline` prop (use context instead)
  - Use `syncActive` from AnimationContext (not `syncMapEnabled`)
  - Keep existing `useEffect` that switches imagery based on `currentTimestamp`
  - Add manual override: When user clicks TimeToggle, call `setSyncActive(false)`

- [ ] **Dynamic Period Calculation**
  - Create utility function `getImageryPeriodForDate(date: Date): TimePeriod`
  - Use Object.entries() to iterate through `HISTORICAL_IMAGERY`
  - Sort periods by date ascending
  - Return the latest period whose date <= current timeline date
  - Handle edge cases (date before 2014, date after all periods)

### Phase 2: Play Behavior & Initial Pause

- [ ] **Add 1-second pause at start**
  - In AnimationContext `play()` function, detect if at start position AND sync enabled
  - If true, set timestamp to earliest HISTORICAL_IMAGERY date (2014-02-20)
  - Pause for 1000ms before starting animation loop
  - Use setTimeout (store ref for cleanup)

- [ ] **Reset Behavior**
  - In `reset()` function, restore `syncActive` to match `syncMapEnabled`
  - Logic: `setSyncActive(syncMapEnabled)` after resetting timestamp

### Phase 3: TimeToggle Integration

- [ ] **Update TimeToggle Component**
  - Import `useAnimation` hook
  - Get `syncActive` and `setSyncActive` from context
  - On button click, call `setSyncActive(false)` before `onPeriodChange()`
  - Add visual indicator if period is auto-selected (optional: dimmed button style)

- [ ] **Highlight Active Period**
  - Ensure TimeToggle buttons show correct active state when synced
  - Current green highlight (#009639) should reflect `selectedPeriod`

### Phase 4: Testing

- [ ] **Unit Tests - AnimationContext**
  - Test `syncMapEnabled` and `syncActive` state management
  - Test reset restores `syncActive` to `syncMapEnabled` value
  - Test manual override (TimeToggle click) disables `syncActive`

- [ ] **Unit Tests - SiteDetailView**
  - Test imagery switches at correct timeline dates
  - Test manual TimeToggle click disables sync temporarily
  - Test sync re-enables after reset

- [ ] **Unit Tests - Dynamic Period Calculation**
  - Test `getImageryPeriodForDate()` with dates before 2014
  - Test dates between 2014-2023 → BASELINE_2014
  - Test dates between Aug 2023 - Oct 2023 → PRE_CONFLICT_2023
  - Test dates after Oct 2023 → CURRENT
  - Test extensibility with mock additional periods

- [ ] **Integration Tests**
  - Test full workflow: Enable sync → Play → Auto-switch imagery → Manual override → Reset → Sync resumes
  - Test 1-second pause at start when sync enabled
  - Test sync respects user zoom/pan on SiteDetailView

- [ ] **Manual Testing**
  - Visual verification of smooth imagery transitions
  - Verify tooltip clarity on Sync Map button
  - Test with site selected vs. Gaza overview
  - Test keyboard controls (Space, Home, End) with sync enabled

### Phase 5: Documentation & Polish

- [ ] **Update CLAUDE.md**
  - Document Sync Map feature in Timeline section
  - Add usage instructions and behavior notes
  - Update testing section with new test files

- [ ] **Add JSDoc Comments**
  - Document `syncMapEnabled` and `syncActive` in AnimationContext
  - Document `getImageryPeriodForDate()` utility function
  - Add comments explaining override behavior in TimeToggle

- [ ] **Consider UX Enhancements (Future)**
  - Status message/toast when imagery auto-switches
  - Animation/fade transition between imagery periods
  - Progress indicator showing upcoming period switch

---

## Technical Notes

### Key Files to Modify
- `src/contexts/AnimationContext.tsx` - Add sync state management
- `src/components/Timeline/TimelineScrubber.tsx` - Remove local state, use context
- `src/components/Map/SiteDetailView.tsx` - Add manual override logic
- `src/components/Map/TimeToggle.tsx` - Add sync disable on click
- `src/utils/imageryPeriods.ts` - NEW: Dynamic period calculation utility
- `src/constants/map.ts` - No changes needed (already extensible)

### State Flow
```
User clicks "Sync Map"
  → setSyncMapEnabled(true) in AnimationContext
  → syncActive also becomes true

User clicks Play
  → If syncActive && at start:
    1. Temporarily show 2014 imagery for 1 second (visual preview)
    2. Reset to actual timeline startDate (earliest destruction date)
    3. Start playing from startDate
  → Animation plays, currentTimestamp advances from startDate
  → SiteDetailView useEffect watches currentTimestamp + syncActive
  → When threshold crossed: setSelectedPeriod(newPeriod)
  → TimeToggle buttons update to show active period

User clicks TimeToggle button
  → setSyncActive(false) - temporary disable
  → onPeriodChange(period) - manual selection
  → Sync won't auto-switch until reset

User clicks Reset
  → Timeline returns to start
  → setSyncActive(syncMapEnabled) - restore sync if toggle still ON
```

### Edge Cases to Handle
- Sync enabled mid-playback (should start syncing immediately)
- User manually drags scrubber while sync enabled (should sync to new position)
- Multiple rapid period switches (debounce/throttle if needed)
- Timeline filter changes date range (ensure sync still works)
- Mobile view (no timeline shown, sync button hidden)

---

## Success Criteria
- [x] Sync Map toggle works as expected (default OFF, visual feedback when ON)
- [x] Satellite imagery auto-switches at correct timeline dates
- [x] Manual TimeToggle click disables sync temporarily
- [x] Reset re-enables sync if toggle still ON
- [x] 1-second pause at start when playing with sync enabled
  - **Fixed**: Timeline starts from actual startDate (earliest destruction), not 2014
  - 2014 imagery shown as 1-second preview, then reset to startDate before playing
- [x] All existing tests pass (307 tests, up from 292)
- [x] New tests added for sync functionality (15 new tests)
- [x] No console errors or warnings
- [x] Smooth UX with clear user feedback
- [x] Lint clean, build succeeds
- [x] Documentation updated in CLAUDE.md and MAP_SYNC.md

---

**Status**: ✅ Complete
**Actual time**: ~2.5 hours
**Priority**: High (user-requested feature)
**Branch**: feat/mapSync (all features implemented, all tests passing)
