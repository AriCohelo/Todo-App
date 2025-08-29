import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  addTodoItem,
  deleteTodoItem,
  editTodoItem,
  toggleTodoItem,
  updateCardTitle,
  updateCardBackgroundColor,
  createEmptyCard
} from '../todoHelpers';
import type { TodoCardData } from '../../types';

// Mock Math.random for consistent UUID generation
const mockMathRandom = vi.fn();
Object.defineProperty(Math, 'random', {
  value: mockMathRandom
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
    mockMathRandom.mockClear();
    mockMathRandom.mockReturnValue(0);
  });

  describe('addTodoItem', () => {
    it('adds new empty todo and updates timestamp', () => {
      const result = addTodoItem(baseTodoCard);

      expect(result.todos).toHaveLength(3);
      expect(result.todos[2]).toEqual({
        id: '00000000-0000-4000-8000-000000000000',
        task: '',
        completed: false
      });
      expect(result.updatedAt).toEqual(mockDate);
    });

    it('works with empty todos array', () => {
      const emptyCard = { ...baseTodoCard, todos: [] };
      const result = addTodoItem(emptyCard);

      expect(result.todos).toHaveLength(1);
      expect(result.todos[0]).toEqual({
        id: '00000000-0000-4000-8000-000000000000',
        task: '',
        completed: false
      });
    });
  });

  describe('deleteTodoItem', () => {
    it('removes todo with matching ID and updates timestamp', () => {
      const result = deleteTodoItem(baseTodoCard, 'todo-1');

      expect(result.todos).toHaveLength(1);
      expect(result.todos[0]).toEqual(baseTodoCard.todos[1]);
      expect(result.updatedAt).toEqual(mockDate);
    });

    it('returns unchanged todos when ID does not exist', () => {
      const result = deleteTodoItem(baseTodoCard, 'non-existent-id');

      expect(result.todos).toEqual(baseTodoCard.todos);
    });
  });

  describe('editTodoItem', () => {
    it('updates task for todo with matching ID and updates timestamp', () => {
      const newTask = 'Updated Task 1';
      const result = editTodoItem(baseTodoCard, 'todo-1', newTask);

      expect(result.todos[0].task).toBe(newTask);
      expect(result.todos[0].completed).toBe(false);
      expect(result.updatedAt).toEqual(mockDate);
    });

    it('returns unchanged todos when ID does not exist', () => {
      const result = editTodoItem(baseTodoCard, 'non-existent-id', 'New Task');

      expect(result.todos).toEqual(baseTodoCard.todos);
    });
  });

  describe('toggleTodoItem', () => {
    it('toggles completed status and updates timestamp', () => {
      const result1 = toggleTodoItem(baseTodoCard, 'todo-1');
      expect(result1.todos[0].completed).toBe(true);
      expect(result1.updatedAt).toEqual(mockDate);

      const result2 = toggleTodoItem(baseTodoCard, 'todo-2');
      expect(result2.todos[1].completed).toBe(false);
    });

    it('returns unchanged todos when ID does not exist', () => {
      const result = toggleTodoItem(baseTodoCard, 'non-existent-id');

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
      const result = createEmptyCard('bg-test-color');

      expect(result.id).toBe('00000000-0000-4000-8000-000000000000');
      expect(result.title).toBe('');
      expect(result.todos).toHaveLength(1);
      expect(result.todos[0]).toEqual({
        id: '00000000-0000-4000-8000-000000000000',
        task: '',
        completed: false
      });
      expect(result.updatedAt).toEqual(mockDate);
    });

    it('uses provided background color', () => {
      const customColor = 'bg-purple-500';
      const result = createEmptyCard(customColor);
      expect(result.backgroundColor).toBe(customColor);
    });
  });

  describe('data integrity', () => {
    it('functions preserve immutability (do not modify original)', () => {
      const originalCard = { ...baseTodoCard };
      const originalTodos = [...baseTodoCard.todos];

      addTodoItem(baseTodoCard);
      deleteTodoItem(baseTodoCard, 'todo-1');
      editTodoItem(baseTodoCard, 'todo-1', 'New Task');
      toggleTodoItem(baseTodoCard, 'todo-1');
      updateCardTitle(baseTodoCard, 'New Title');
      updateCardBackgroundColor(baseTodoCard, 'bg-new-500');

      expect(baseTodoCard).toEqual(originalCard);
      expect(baseTodoCard.todos).toEqual(originalTodos);
    });
  });
});