import { useRef, useEffect } from 'react';
import type { Todo, FocusTarget } from '../types';

interface UseCardRefsProps {
  isModal: boolean;
  focusTarget?: FocusTarget;
  todos: Todo[];
}

export const useCardRefs = ({ isModal, focusTarget, todos }: UseCardRefsProps) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const todoItemRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update refs array when todos change
  useEffect(() => {
    todoItemRefs.current = todoItemRefs.current.slice(0, todos.length);
  }, [todos.length]);

  // Focus management for modal
  useEffect(() => {
    if (isModal && focusTarget) {
      // Use setTimeout to ensure the DOM is ready
      setTimeout(() => {
        if (focusTarget === 'title') {
          titleInputRef.current?.focus();
        } else if (focusTarget === 'new-todo') {
          // Focus on the last todo item (the new one)
          const lastIndex = todos.length - 1;
          todoItemRefs.current[lastIndex]?.focus();
        } else if (
          typeof focusTarget === 'object' &&
          focusTarget.type === 'todo'
        ) {
          // Focus on specific todo item
          todoItemRefs.current[focusTarget.index]?.focus();
        }
      }, 0);
    }
  }, [isModal, focusTarget, todos.length]);

  const setTodoItemRef = (index: number, ref: HTMLInputElement | null) => {
    todoItemRefs.current[index] = ref;
  };

  return {
    titleInputRef,
    setTodoItemRef,
  };
};