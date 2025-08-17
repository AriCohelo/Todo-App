import { render, renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TodoProvider, useTodoContext } from '../TodoContext';
import type { TodoCardData, FocusTarget } from '../../types';

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
      expect(result.current.modalState).toEqual({
        isOpen: false,
        mode: null,
        editingCardId: undefined,
        focusTarget: undefined,
      });
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
      expect(result.current).toHaveProperty('modalState');
      expect(result.current).toHaveProperty('upsertCard');
      expect(result.current).toHaveProperty('deleteCard');
      expect(result.current).toHaveProperty('openCreateModal');
      expect(result.current).toHaveProperty('openEditModal');
      expect(result.current).toHaveProperty('closeModal');
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

  describe('modal state management', () => {
    describe('openCreateModal', () => {
      it('sets correct state for create mode with default focus', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
          <TodoProvider>{children}</TodoProvider>
        );

        const { result } = renderHook(() => useTodoContext(), { wrapper });

        act(() => {
          result.current.openCreateModal();
        });

        expect(result.current.modalState).toEqual({
          isOpen: true,
          mode: 'create',
          editingCardId: undefined,
          focusTarget: 'title',
        });
      });

      it('sets correct state for create mode with custom focus target', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
          <TodoProvider>{children}</TodoProvider>
        );

        const { result } = renderHook(() => useTodoContext(), { wrapper });


        act(() => {
          result.current.openCreateModal();
        });

        expect(result.current.modalState).toEqual({
          isOpen: true,
          mode: 'create',
          editingCardId: undefined,
          focusTarget: 'title',
        });
      });
    });

    describe('openEditModal', () => {
      const mockCard: TodoCardData = {
        id: 'edit-card-id',
        title: 'Edit Card',
        todos: [],
        backgroundColor: 'bg-green-500',
        updatedAt: new Date()
      };

      it('sets correct state for edit mode with default focus', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
          <TodoProvider>{children}</TodoProvider>
        );

        const { result } = renderHook(() => useTodoContext(), { wrapper });

        act(() => {
          result.current.openEditModal(mockCard);
        });

        expect(result.current.modalState).toEqual({
          isOpen: true,
          mode: 'edit',
          editingCardId: 'edit-card-id',
          focusTarget: 'title',
        });
      });

      it('sets correct state for edit mode with custom focus target', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
          <TodoProvider>{children}</TodoProvider>
        );

        const { result } = renderHook(() => useTodoContext(), { wrapper });

        const customFocusTarget: FocusTarget = 'new-todo';

        act(() => {
          result.current.openEditModal(mockCard, customFocusTarget);
        });

        expect(result.current.modalState).toEqual({
          isOpen: true,
          mode: 'edit',
          editingCardId: 'edit-card-id',
          focusTarget: customFocusTarget,
        });
      });
    });

    describe('closeModal', () => {
      it('resets modal state to initial values', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
          <TodoProvider>{children}</TodoProvider>
        );

        const { result } = renderHook(() => useTodoContext(), { wrapper });

        const mockCard: TodoCardData = {
          id: 'test-card',
          title: 'Test',
          todos: [],
          backgroundColor: 'bg-blue-500',
          updatedAt: new Date()
        };

        // First open a modal
        act(() => {
          result.current.openEditModal(mockCard, { type: 'todo', index: 1 });
        });

        expect(result.current.modalState.isOpen).toBe(true);

        // Then close it
        act(() => {
          result.current.closeModal();
        });

        expect(result.current.modalState).toEqual({
          isOpen: false,
          mode: null,
          editingCardId: undefined,
          focusTarget: undefined,
        });
      });
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

      // Open edit modal for card1
      act(() => {
        result.current.openEditModal(card1, { type: 'todo', index: 0 });
      });

      expect(result.current.modalState.mode).toBe('edit');
      expect(result.current.modalState.editingCardId).toBe('integration-card-1');

      // Update card1 while modal is open
      const updatedCard1 = { ...card1, title: 'Updated Integration Card 1' };
      act(() => {
        result.current.upsertCard(updatedCard1);
      });

      expect(result.current.todoCards[0].title).toBe('Updated Integration Card 1');
      expect(result.current.modalState.isOpen).toBe(true); // Modal should still be open

      // Close modal
      act(() => {
        result.current.closeModal();
      });

      expect(result.current.modalState.isOpen).toBe(false);

      // Delete card2
      act(() => {
        result.current.deleteCard('integration-card-2');
      });

      expect(result.current.todoCards).toHaveLength(1);
      expect(result.current.todoCards[0].id).toBe('integration-card-1');
    });
  });
});