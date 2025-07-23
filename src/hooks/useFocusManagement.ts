import { useRef, useEffect } from 'react';
import type { UseFocusManagementProps } from '../types';

export const useFocusManagement = ({ isModal, focusTarget, todos }: UseFocusManagementProps) => {
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
          if (lastIndex >= 0 && todoItemRefs.current[lastIndex]) {
            todoItemRefs.current[lastIndex]?.focus();
          }
        } else if (
          typeof focusTarget === 'object' &&
          focusTarget.type === 'todo'
        ) {
          // Focus on specific todo item
          const index = focusTarget.index;
          if (index >= 0 && index < todoItemRefs.current.length && todoItemRefs.current[index]) {
            todoItemRefs.current[index]?.focus();
          }
        }
      }, 0);
    }
  }, [isModal, focusTarget, todos.length]);

  const setTodoItemRef = (index: number, ref: HTMLInputElement | null) => {
    if (index >= 0 && index < todos.length) {
      todoItemRefs.current[index] = ref;
    }
  };

  return {
    titleInputRef,
    setTodoItemRef,
  };
};