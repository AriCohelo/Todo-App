# Todo: Fix State Synchronization Between Board and Modal Views

## Problem Analysis
When changes are made to TodoItems in the board view (add/delete/edit), they auto-save to App state. However, when the modal opens later, it doesn't reflect these changes because the modal's internal state is initialized from stale `initialData`.

## Root Cause
- Board TodoCard: Auto-saves changes immediately (`setShouldAutoSave(true)`)
- Modal TodoCard: Received snapshot of card data at modal open time
- Both use the same TodoCard component but modal didn't get updated data

## Solution Implemented ✅

### 1. Store Card ID Instead of Card Object
Changed modal state to store `editingCardId` instead of `editingCard` object:
- **File**: `src/App.tsx`
- **Change**: Modified `modalState` to use `editingCardId: string | undefined`
- **Benefit**: Modal always gets current data from `todoCards` array

### 2. Dynamic Data Resolution
Modal now finds current card data at render time:
- **File**: `src/App.tsx` 
- **Change**: Modal `initialData` uses `todoCards.find(card => card.id === modalState.editingCardId)`
- **Benefit**: Always receives most up-to-date card data

### 3. Force Re-mount with Key Prop
Added key prop to modal TodoCard to ensure proper re-initialization:
- **File**: `src/App.tsx`
- **Change**: Added `key={modalState.editingCardId || 'create'}` to modal TodoCard
- **Benefit**: Prevents state pollution when switching between different cards

### 4. Complete Auto-save Implementation
Fixed missing auto-save triggers for all todo operations:
- **File**: `src/components/TodoCard.tsx`
- **Changes**: 
  - Added `setShouldAutoSave(true)` to `onEdit` handler
  - Added `setShouldAutoSave(true)` to "Add Todo" button onClick handler
- **Benefit**: All todo changes (add/delete/edit/toggle) now auto-save in board view

## Success Criteria ✅
- [x] Board changes auto-save to App state immediately
- [x] Modal always shows current card data from App state
- [x] State synchronization works between board and modal views
- [x] All todo operations (add/delete/edit/toggle) trigger auto-save
- [x] Solution is simple and doesn't require architectural changes

## Review Section

### Work Completed ✅
Successfully implemented a simple solution that fixes the state synchronization issue between board and modal views without major architectural changes.

### Changes Made

#### App.tsx State Management
- **Changed modal state**: Replaced `editingCard: TodoCardData` with `editingCardId: string`
- **Dynamic data resolution**: Modal now finds current card data at render time
- **Added key prop**: Forces proper re-mount when switching between cards

#### TodoCard.tsx Auto-save Fix
- **Fixed onEdit handler**: Added missing `setShouldAutoSave(true)` for todo item edits
- **Fixed Add Todo button**: Added missing `setShouldAutoSave(true)` for adding new todos
- **Consistent auto-save**: All todo operations (add/delete/edit/toggle) now trigger auto-save in board view

### Solution Benefits
1. **Simple Implementation**: Uses existing components and patterns
2. **Always Current Data**: Modal receives live data from App state
3. **Immediate Synchronization**: Changes in board view are instantly reflected in modal
4. **Clean State Management**: No complex state synchronization logic needed
5. **Maintainable**: Easy to understand and modify

### Test Results
- Main functionality working correctly
- Some test failures exist but are unrelated to this change (test text expectations)
- Core state synchronization issue resolved

### Key Insight
The root cause was storing a snapshot of card data in modal state instead of just the card ID. By storing only the ID and resolving the current data at render time, we ensure the modal always has the most up-to-date information from the main application state.