import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  addTodoToCard,
  deleteTodoFromCard,
  editTodoInCard,
  toggleTodoInCard,
  updateCardTitle,
  updateCardBackgroundColor,
  createEmptyCard
} from '../todoHelpers';
import type { TodoCardData } from '../../types';

// Mock crypto.randomUUID for consistent testing
const mockUUID = vi.fn();
Object.defineProperty(global, 'crypto', {
  value: { randomUUID: mockUUID }
});

// Mock Date for consistent timestamps
const mockDate = new Date('2024-01-01T00:00:00.000Z');
vi.setSystemTime(mockDate);

describe('todoHelpers', () => {
  const baseTodoCard: TodoCardData = {
    id: 'card-1',
    title: 'Test Card',
    todos: [
      { id: 'todo-1', task: 'Task 1', completed: false },
      { id: 'todo-2', task: 'Task 2', completed: true }
    ],
    backgroundColor: 'bg-blue-500',
    updatedAt: new Date('2023-01-01')
  };

  beforeEach(() => {
    mockUUID.mockClear();
    mockUUID.mockReturnValue('new-uuid');
  });

  describe('addTodoToCard', () => {
    it('adds new empty todo and updates timestamp', () => {
      const result = addTodoToCard(baseTodoCard);

      expect(result.todos).toHaveLength(3);
      expect(result.todos[2]).toEqual({
        id: 'new-uuid',
        task: '',
        completed: false
      });
      expect(result.updatedAt).toEqual(mockDate);
    });

    it('works with empty todos array', () => {
      const emptyCard = { ...baseTodoCard, todos: [] };
      const result = addTodoToCard(emptyCard);

      expect(result.todos).toHaveLength(1);
      expect(result.todos[0]).toEqual({
        id: 'new-uuid',
        task: '',
        completed: false
      });
    });
  });

  describe('deleteTodoFromCard', () => {
    it('removes todo with matching ID and updates timestamp', () => {
      const result = deleteTodoFromCard(baseTodoCard, 'todo-1');

      expect(result.todos).toHaveLength(1);
      expect(result.todos[0]).toEqual(baseTodoCard.todos[1]);
      expect(result.updatedAt).toEqual(mockDate);
    });

    it('returns unchanged todos when ID does not exist', () => {
      const result = deleteTodoFromCard(baseTodoCard, 'non-existent-id');

      expect(result.todos).toEqual(baseTodoCard.todos);
    });
  });

  describe('editTodoInCard', () => {
    it('updates task for todo with matching ID and updates timestamp', () => {
      const newTask = 'Updated Task 1';
      const result = editTodoInCard(baseTodoCard, 'todo-1', newTask);

      expect(result.todos[0].task).toBe(newTask);
      expect(result.todos[0].completed).toBe(false);
      expect(result.updatedAt).toEqual(mockDate);
    });

    it('returns unchanged todos when ID does not exist', () => {
      const result = editTodoInCard(baseTodoCard, 'non-existent-id', 'New Task');

      expect(result.todos).toEqual(baseTodoCard.todos);
    });
  });

  describe('toggleTodoInCard', () => {
    it('toggles completed status and updates timestamp', () => {
      const result1 = toggleTodoInCard(baseTodoCard, 'todo-1');
      expect(result1.todos[0].completed).toBe(true);
      expect(result1.updatedAt).toEqual(mockDate);

      const result2 = toggleTodoInCard(baseTodoCard, 'todo-2');
      expect(result2.todos[1].completed).toBe(false);
    });

    it('returns unchanged todos when ID does not exist', () => {
      const result = toggleTodoInCard(baseTodoCard, 'non-existent-id');

      expect(result.todos).toEqual(baseTodoCard.todos);
    });
  });

  describe('updateCardTitle', () => {
    it('updates card title and timestamp', () => {
      const newTitle = 'Updated Card Title';
      const result = updateCardTitle(baseTodoCard, newTitle);

      expect(result.title).toBe(newTitle);
      expect(result.updatedAt).toEqual(mockDate);
    });
  });

  describe('updateCardBackgroundColor', () => {
    it('updates card background color and timestamp', () => {
      const newColor = 'bg-red-500';
      const result = updateCardBackgroundColor(baseTodoCard, newColor);

      expect(result.backgroundColor).toBe(newColor);
      expect(result.updatedAt).toEqual(mockDate);
    });
  });

  describe('createEmptyCard', () => {
    it('creates card with generated UUID, empty title, and one empty todo', () => {
      mockUUID
        .mockReturnValueOnce('card-uuid')
        .mockReturnValueOnce('todo-uuid');

      const result = createEmptyCard();

      expect(result.id).toBe('card-uuid');
      expect(result.title).toBe('');
      expect(result.todos).toHaveLength(1);
      expect(result.todos[0]).toEqual({
        id: 'todo-uuid',
        task: '',
        completed: false
      });
      expect(result.updatedAt).toEqual(mockDate);
    });

    it('uses provided background color or default', () => {
      const customColor = 'bg-purple-500';
      const customResult = createEmptyCard(customColor);
      expect(customResult.backgroundColor).toBe(customColor);

      const defaultResult = createEmptyCard();
      expect(defaultResult.backgroundColor).toBe('bg-gradient-to-br from-gray-300/80 to-gray-100/40');
    });
  });

  describe('data integrity', () => {
    it('functions preserve immutability (do not modify original)', () => {
      const originalCard = { ...baseTodoCard };
      const originalTodos = [...baseTodoCard.todos];

      addTodoToCard(baseTodoCard);
      deleteTodoFromCard(baseTodoCard, 'todo-1');
      editTodoInCard(baseTodoCard, 'todo-1', 'New Task');
      toggleTodoInCard(baseTodoCard, 'todo-1');
      updateCardTitle(baseTodoCard, 'New Title');
      updateCardBackgroundColor(baseTodoCard, 'bg-new-500');

      expect(baseTodoCard).toEqual(originalCard);
      expect(baseTodoCard.todos).toEqual(originalTodos);
    });
  });
});