import { render, renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TodoProvider, useTodoContext } from '../TodoContext';
import type { TodoCardData } from '../../types';

// Mock crypto.randomUUID for consistent testing
const mockUUID = vi.fn();
Object.defineProperty(global, 'crypto', {
  value: { randomUUID: mockUUID }
});

// Mock Date for consistent timestamps
const mockDate = new Date('2024-01-01T00:00:00.000Z');
vi.setSystemTime(mockDate);

describe('TodoContext', () => {
  beforeEach(() => {
    mockUUID.mockReturnValue('test-uuid');
  });

  describe('TodoProvider', () => {
    it('renders children without crashing', () => {
      const TestChild = () => <div>Test Child</div>;
      
      render(
        <TodoProvider>
          <TestChild />
        </TodoProvider>
      );
    });

    it('provides initial state correctly', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TodoProvider>{children}</TodoProvider>
      );

      const { result } = renderHook(() => useTodoContext(), { wrapper });

      expect(result.current.todoCards).toEqual([]);
    });
  });

  describe('useTodoContext', () => {
    it('throws error when used outside TodoProvider', () => {
      expect(() => {
        renderHook(() => useTodoContext());
      }).toThrow('useTodoContext must be used within a TodoProvider');
    });

    it('returns context value when used within TodoProvider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TodoProvider>{children}</TodoProvider>
      );

      const { result } = renderHook(() => useTodoContext(), { wrapper });

      expect(result.current).toHaveProperty('todoCards');
      expect(result.current).toHaveProperty('upsertCard');
      expect(result.current).toHaveProperty('deleteCard');
    });
  });

  describe('upsertCard', () => {
    const mockCard: TodoCardData = {
      id: 'test-card-id',
      title: 'Test Card',
      todos: [{ id: 'test-todo-id', task: 'Test Task', completed: false }],
      backgroundColor: 'bg-blue-500',
      updatedAt: new Date('2023-01-01')
    };

    it('adds new card when card does not exist', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TodoProvider>{children}</TodoProvider>
      );

      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.upsertCard(mockCard);
      });

      expect(result.current.todoCards).toHaveLength(1);
      expect(result.current.todoCards[0]).toEqual({
        ...mockCard,
        updatedAt: mockDate
      });
    });

    it('updates existing card when card exists', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TodoProvider>{children}</TodoProvider>
      );

      const { result } = renderHook(() => useTodoContext(), { wrapper });

      const newCard = { ...mockCard };
      const updatedCard = { ...mockCard, title: 'Updated Title' };

      act(() => {
        result.current.upsertCard(newCard);
      });

      act(() => {
        result.current.upsertCard(updatedCard);
      });

      expect(result.current.todoCards).toHaveLength(1);
      expect(result.current.todoCards[0].title).toBe('Updated Title');
      expect(result.current.todoCards[0].updatedAt).toEqual(mockDate);
    });

    it('preserves other cards when updating existing card', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TodoProvider>{children}</TodoProvider>
      );

      const { result } = renderHook(() => useTodoContext(), { wrapper });

      const card1 = { ...mockCard, id: 'card-1' };
      const card2 = { ...mockCard, id: 'card-2' };
      const updatedCard1 = { ...card1, title: 'Updated Card 1' };

      act(() => {
        result.current.upsertCard(card1);
        result.current.upsertCard(card2);
      });

      act(() => {
        result.current.upsertCard(updatedCard1);
      });

      expect(result.current.todoCards).toHaveLength(2);
      expect(result.current.todoCards.find(card => card.id === 'card-1')?.title).toBe('Updated Card 1');
      expect(result.current.todoCards.find(card => card.id === 'card-2')?.title).toBe('Test Card');
    });
  });

  describe('deleteCard', () => {
    const mockCard1: TodoCardData = {
      id: 'card-1',
      title: 'Card 1',
      todos: [],
      backgroundColor: 'bg-blue-500',
      updatedAt: new Date()
    };

    const mockCard2: TodoCardData = {
      id: 'card-2',
      title: 'Card 2',
      todos: [],
      backgroundColor: 'bg-red-500',
      updatedAt: new Date()
    };

    it('removes card with matching ID', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TodoProvider>{children}</TodoProvider>
      );

      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.upsertCard(mockCard1);
        result.current.upsertCard(mockCard2);
      });

      expect(result.current.todoCards).toHaveLength(2);

      act(() => {
        result.current.deleteCard('card-1');
      });

      expect(result.current.todoCards).toHaveLength(1);
      expect(result.current.todoCards[0].id).toBe('card-2');
    });

    it('does nothing when card ID does not exist', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TodoProvider>{children}</TodoProvider>
      );

      const { result } = renderHook(() => useTodoContext(), { wrapper });

      act(() => {
        result.current.upsertCard(mockCard1);
      });

      expect(result.current.todoCards).toHaveLength(1);

      act(() => {
        result.current.deleteCard('non-existent-id');
      });

      expect(result.current.todoCards).toHaveLength(1);
      expect(result.current.todoCards[0].id).toBe('card-1');
    });
  });


  describe('integration scenarios', () => {
    it('handles complex sequence of operations correctly', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TodoProvider>{children}</TodoProvider>
      );

      const { result } = renderHook(() => useTodoContext(), { wrapper });

      const card1: TodoCardData = {
        id: 'integration-card-1',
        title: 'Integration Card 1',
        todos: [{ id: 'todo-1', task: 'Task 1', completed: false }],
        backgroundColor: 'bg-blue-500',
        updatedAt: new Date('2023-01-01')
      };

      const card2: TodoCardData = {
        id: 'integration-card-2',
        title: 'Integration Card 2',
        todos: [],
        backgroundColor: 'bg-red-500',
        updatedAt: new Date('2023-01-02')
      };

      // Add cards
      act(() => {
        result.current.upsertCard(card1);
        result.current.upsertCard(card2);
      });

      expect(result.current.todoCards).toHaveLength(2);

      // Update card1
      const updatedCard1 = { ...card1, title: 'Updated Integration Card 1' };
      act(() => {
        result.current.upsertCard(updatedCard1);
      });

      expect(result.current.todoCards[0].title).toBe('Updated Integration Card 1');

      // Delete card2
      act(() => {
        result.current.deleteCard('integration-card-2');
      });

      expect(result.current.todoCards).toHaveLength(1);
      expect(result.current.todoCards[0].id).toBe('integration-card-1');
    });
  });
});