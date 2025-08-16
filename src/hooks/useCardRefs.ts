import { useRef, useEffect } from 'react';
import type { UseCardRefsProps } from '../types';

export const useCardRefs = ({
  isModal,
  focusTarget,
  todos,
}: UseCardRefsProps) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const todoItemRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    todoItemRefs.current = todoItemRefs.current.slice(0, todos.length);
  }, [todos.length]);

  useEffect(() => {
    if (isModal && focusTarget) {
      setTimeout(() => {
        if (focusTarget === 'title') {
          titleInputRef.current?.focus();
        } else if (focusTarget === 'new-todo') {
          const lastIndex = todos.length - 1;
          if (lastIndex >= 0 && todoItemRefs.current[lastIndex]) {
            todoItemRefs.current[lastIndex]?.focus();
          }
        } else if (
          typeof focusTarget === 'object' &&
          focusTarget.type === 'todo'
        ) {
          const index = focusTarget.index;
          if (
            index >= 0 &&
            index < todoItemRefs.current.length &&
            todoItemRefs.current[index]
          ) {
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
