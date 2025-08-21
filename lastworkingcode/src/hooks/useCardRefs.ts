import { useRef, useEffect, useCallback } from 'react';
import type { UseCardRefsProps } from '../types';

const FOCUS_DELAY = 0;

export const useCardRefs = ({
  isModal,
  focusTarget,
  todos,
}: UseCardRefsProps) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const todoItemRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFocus = (): void => {
    if (!focusTarget) return;

    if (focusTarget === 'title') {
      titleInputRef.current?.focus();
    } else if (focusTarget === 'new-todo') {
      const lastIndex = todos.length - 1;
      todoItemRefs.current[lastIndex]?.focus();
    } else if (typeof focusTarget === 'number') {
      todoItemRefs.current[focusTarget]?.focus();
    }
  };

  useEffect(() => {
    todoItemRefs.current = todoItemRefs.current.slice(0, todos.length);
  }, [todos.length]);

  useEffect(() => {
    if (isModal && focusTarget) {
      setTimeout(handleFocus, FOCUS_DELAY);
    }
  }, [isModal, focusTarget, todos.length]);

  const setTodoItemRef = useCallback((index: number, ref: HTMLInputElement | null) => {
    todoItemRefs.current[index] = ref;
  }, []);

  return {
    titleInputRef,
    setTodoItemRef,
  };
};
