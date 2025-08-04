# Proposed Context API Simplification

## Current Problems:
1. Hybrid state management (Context + local state)
2. Too many granular Context methods (5 todo operations)
3. Validation logic scattered in Context
4. Repetitive "find and update card" patterns
5. Complex TodoCard with dual behavior modes

## Simplified Solution:

### 1. Single Context Method for Card Updates
Instead of 5 methods, use 1:
```typescript
const updateCard = (cardId: string, updates: Partial<TodoCardData>) => {
  setTodoCards(prev => 
    prev.map(card => 
      card.id === cardId 
        ? { ...card, ...updates, updatedAt: new Date() }
        : card
    )
  );
};
```

### 2. Move Validation to Components
- Context stays simple and pure
- Components handle validation before calling Context
- Clearer separation of concerns

### 3. Eliminate Dual State Management
- All cards (modal and board) use Context directly
- No local state in TodoCard
- Modal behavior handled by UI, not state

### 4. Simplified TodoCard
- Remove all local state
- Remove dual behavior logic  
- Direct Context updates for everything
- Much cleaner and simpler

### 5. Helper Functions in Utils
Move todo manipulation logic to utils:
```typescript
// utils/todoHelpers.ts
export const addTodoToCard = (card: TodoCardData): TodoCardData => ({
  ...card,
  todos: [...card.todos, { id: crypto.randomUUID(), task: '', completed: false }]
});

export const deleteTodoFromCard = (card: TodoCardData, todoId: string): TodoCardData => ({
  ...card,
  todos: card.todos.filter(todo => todo.id !== todoId)
});
```

## Benefits:
- **50% less Context code**
- **Clearer separation of concerns**
- **Single state management approach**
- **No complex dual behavior**
- **Easier to test and maintain**
- **More predictable state updates**