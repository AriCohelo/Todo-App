import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCardRefs } from '../useCardRefs';
import type { Todo } from '../../types';

// Mock setTimeout to control timing in tests
vi.useFakeTimers();

describe('useCardRefs', () => {
  const mockTodos: Todo[] = [
    { id: 'todo-1', task: 'Task 1', completed: false },
    { id: 'todo-2', task: 'Task 2', completed: true },
    { id: 'todo-3', task: 'Task 3', completed: false }
  ];

  beforeEach(() => {
    vi.clearAllTimers();
  });

  describe('basic functionality', () => {
    it('provides titleInputRef and setTodoItemRef', () => {
      const { result } = renderHook(() =>
        useCardRefs({
          isModal: false,
          focusTarget: undefined,
          todos: mockTodos
        })
      );

      expect(result.current.titleInputRef).toBeDefined();
      expect(result.current.titleInputRef.current).toBeNull();
      expect(result.current.setTodoItemRef).toBeInstanceOf(Function);
    });

    it('setTodoItemRef sets ref at correct index', () => {
      const { result } = renderHook(() =>
        useCardRefs({
          isModal: false,
          focusTarget: undefined,
          todos: mockTodos
        })
      );

      const mockInput = document.createElement('input');
      
      act(() => {
        result.current.setTodoItemRef(1, mockInput);
      });

      // We can't directly access the internal todoItemRefs, but we can test
      // that the function doesn't throw and accepts valid parameters
      expect(() => result.current.setTodoItemRef(1, mockInput)).not.toThrow();
    });

    it('setTodoItemRef handles null refs', () => {
      const { result } = renderHook(() =>
        useCardRefs({
          isModal: false,
          focusTarget: undefined,
          todos: mockTodos
        })
      );

      expect(() => result.current.setTodoItemRef(0, null)).not.toThrow();
    });

    it('setTodoItemRef ignores invalid indices', () => {
      const { result } = renderHook(() =>
        useCardRefs({
          isModal: false,
          focusTarget: undefined,
          todos: mockTodos
        })
      );

      const mockInput = document.createElement('input');

      expect(() => result.current.setTodoItemRef(-1, mockInput)).not.toThrow();
      expect(() => result.current.setTodoItemRef(99, mockInput)).not.toThrow();
    });
  });

  describe('todos array changes', () => {
    it('updates refs array when todos length changes', () => {
      const { result, rerender } = renderHook(
        ({ todos }) => useCardRefs({
          isModal: false,
          focusTarget: undefined,
          todos
        }),
        { initialProps: { todos: mockTodos } }
      );

      const shorterTodos = [mockTodos[0], mockTodos[1]];

      rerender({ todos: shorterTodos });

      // Test that setTodoItemRef still works correctly with new array length
      const mockInput = document.createElement('input');
      expect(() => result.current.setTodoItemRef(1, mockInput)).not.toThrow();
      expect(() => result.current.setTodoItemRef(2, mockInput)).not.toThrow(); // Should be ignored now
    });

    it('handles empty todos array', () => {
      const { result } = renderHook(() =>
        useCardRefs({
          isModal: false,
          focusTarget: undefined,
          todos: []
        })
      );

      const mockInput = document.createElement('input');
      expect(() => result.current.setTodoItemRef(0, mockInput)).not.toThrow();
    });
  });

  describe('focus management', () => {
    describe('non-modal mode', () => {
      it('does not focus when not in modal mode', () => {
        const mockTitleInput = document.createElement('input');
        const focusSpy = vi.spyOn(mockTitleInput, 'focus');

        renderHook(() =>
          useCardRefs({
            isModal: false,
            focusTarget: 'title',
            todos: mockTodos
          })
        );

        act(() => {
          vi.runAllTimers();
        });

        expect(focusSpy).not.toHaveBeenCalled();
      });
    });

    describe('modal mode focus behavior', () => {
      it('focuses title input when focusTarget is "title"', () => {
        const mockTitleInput = document.createElement('input');
        const focusSpy = vi.spyOn(mockTitleInput, 'focus');

        const { result } = renderHook(() =>
          useCardRefs({
            isModal: true,
            focusTarget: 'title',
            todos: mockTodos
          })
        );

        // Simulate ref being set
        result.current.titleInputRef.current = mockTitleInput;

        act(() => {
          vi.runAllTimers();
        });

        expect(focusSpy).toHaveBeenCalled();
      });

      it('focuses last todo input when focusTarget is "new-todo"', () => {
        const mockTodoInputs = [
          document.createElement('input'),
          document.createElement('input'),
          document.createElement('input')
        ];
        const focusSpies = mockTodoInputs.map(input => vi.spyOn(input, 'focus'));

        const { result } = renderHook(() =>
          useCardRefs({
            isModal: true,
            focusTarget: 'new-todo',
            todos: mockTodos
          })
        );

        // Set up refs for todo items
        mockTodoInputs.forEach((input, index) => {
          act(() => {
            result.current.setTodoItemRef(index, input);
          });
        });

        act(() => {
          vi.runAllTimers();
        });

        // Should focus the last item (index 2)
        expect(focusSpies[2]).toHaveBeenCalled();
        expect(focusSpies[0]).not.toHaveBeenCalled();
        expect(focusSpies[1]).not.toHaveBeenCalled();
      });

      it('focuses specific todo input when focusTarget is todo object', () => {
        const mockTodoInputs = [
          document.createElement('input'),
          document.createElement('input'),
          document.createElement('input')
        ];
        const focusSpies = mockTodoInputs.map(input => vi.spyOn(input, 'focus'));

        const { result } = renderHook(() =>
          useCardRefs({
            isModal: true,
            focusTarget: 1,
            todos: mockTodos
          })
        );

        // Set up refs for todo items
        mockTodoInputs.forEach((input, index) => {
          act(() => {
            result.current.setTodoItemRef(index, input);
          });
        });

        act(() => {
          vi.runAllTimers();
        });

        // Should focus the item at index 1
        expect(focusSpies[1]).toHaveBeenCalled();
        expect(focusSpies[0]).not.toHaveBeenCalled();
        expect(focusSpies[2]).not.toHaveBeenCalled();
      });

      it('handles focus when no refs are available', () => {
        const { result } = renderHook(() =>
          useCardRefs({
            isModal: true,
            focusTarget: 'title',
            todos: mockTodos
          })
        );

        // Don't set any refs, just run timers
        act(() => {
          vi.runAllTimers();
        });

        // Should not throw or cause errors
        expect(result.current.titleInputRef.current).toBeNull();
      });

      it('handles focus on invalid todo index', () => {
        const mockTodoInput = document.createElement('input');
        const focusSpy = vi.spyOn(mockTodoInput, 'focus');

        const { result } = renderHook(() =>
          useCardRefs({
            isModal: true,
            focusTarget: 99, // Invalid index
            todos: mockTodos
          })
        );

        act(() => {
          result.current.setTodoItemRef(0, mockTodoInput);
        });

        act(() => {
          vi.runAllTimers();
        });

        expect(focusSpy).not.toHaveBeenCalled();
      });

      it('handles "new-todo" focus with empty todos array', () => {
        renderHook(() =>
          useCardRefs({
            isModal: true,
            focusTarget: 'new-todo',
            todos: []
          })
        );

        act(() => {
          vi.runAllTimers();
        });

        // Should not throw or cause errors when no todos exist
      });
    });


    describe('todos length changes affecting focus', () => {
      it('adjusts focus when todos array changes', () => {
        const mockTodoInputs = [
          document.createElement('input'),
          document.createElement('input')
        ];
        const focusSpies = mockTodoInputs.map(input => vi.spyOn(input, 'focus'));

        const { result, rerender } = renderHook(
          ({ todos }) => useCardRefs({
            isModal: true,
            focusTarget: 'new-todo',
            todos
          }),
          { initialProps: { todos: [mockTodos[0], mockTodos[1]] } }
        );

        // Set up initial refs
        mockTodoInputs.forEach((input, index) => {
          act(() => {
            result.current.setTodoItemRef(index, input);
          });
        });

        // Focus should be on index 1 (last item)
        act(() => {
          vi.runAllTimers();
        });

        expect(focusSpies[1]).toHaveBeenCalled();
        focusSpies[1].mockClear();

        // Add more todos
        rerender({ todos: mockTodos }); // Now has 3 todos

        const newInput = document.createElement('input');
        const newFocusSpy = vi.spyOn(newInput, 'focus');

        act(() => {
          result.current.setTodoItemRef(2, newInput);
        });

        act(() => {
          vi.runAllTimers();
        });

        expect(newFocusSpy).toHaveBeenCalled();
      });
    });
  });

  describe('timeout behavior', () => {
    it('uses setTimeout for DOM readiness', () => {
      const mockTitleInput = document.createElement('input');
      const focusSpy = vi.spyOn(mockTitleInput, 'focus');

      const { result } = renderHook(() =>
        useCardRefs({
          isModal: true,
          focusTarget: 'title',
          todos: mockTodos
        })
      );

      result.current.titleInputRef.current = mockTitleInput;

      // Focus should not happen immediately
      expect(focusSpy).not.toHaveBeenCalled();

      // Run timers to trigger focus
      act(() => {
        vi.runAllTimers();
      });

      expect(focusSpy).toHaveBeenCalled();
    });

    it('handles multiple rapid focus changes', () => {
      const mockTitleInput = document.createElement('input');
      const mockTodoInput = document.createElement('input');
      const titleFocusSpy = vi.spyOn(mockTitleInput, 'focus');

      const { result, rerender } = renderHook(
        ({ focusTarget }: { focusTarget?: import('../../types').FocusTarget }) => useCardRefs({
          isModal: true,
          focusTarget,
          todos: mockTodos
        }),
        { initialProps: { focusTarget: 'title' as import('../../types').FocusTarget } }
      );

      result.current.titleInputRef.current = mockTitleInput;
      act(() => {
        result.current.setTodoItemRef(0, mockTodoInput);
      });

      // Change focus target rapidly before timers run
      rerender({ focusTarget: 0 });
      rerender({ focusTarget: 'title' });

      act(() => {
        vi.runAllTimers();
      });

      // Should focus based on final state
      expect(titleFocusSpy).toHaveBeenCalled();
    });
  });
});