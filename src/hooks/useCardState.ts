import { useState, useEffect, useCallback } from 'react';
import type { Todo, TodoCardData, UseCardStateProps } from '../types';
import { getRandomColor } from '../constants/colors';
import { validateInput, isValidTitle, isValidContent } from '../utils/security';

export const useCardState = ({ initialData, onSave, isModal, onClose }: UseCardStateProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [backgroundColor, setBackgroundColor] = useState(
    initialData?.backgroundColor || getRandomColor()
  );
  const [todos, setTodos] = useState<Todo[]>(
    initialData?.todos || [
      { id: crypto.randomUUID(), task: '', completed: false },
    ]
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [shouldAutoSave, setShouldAutoSave] = useState(false);

  // Update internal state when initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setBackgroundColor(initialData.backgroundColor);
      setTodos(initialData.todos);
      setHasUnsavedChanges(false);
    }
  }, [initialData]);

  // Auto-save logic
  useEffect(() => {
    if (shouldAutoSave && !isModal && hasUnsavedChanges) {
      handleSave();
      setShouldAutoSave(false);
    }
  }, [shouldAutoSave, isModal, hasUnsavedChanges]);

  const handleSave = useCallback(() => {
    const cardData: TodoCardData = {
      id: initialData?.id || crypto.randomUUID(),
      title: title,
      todos: todos,
      updatedAt: new Date(),
      backgroundColor: backgroundColor,
    };
    onSave(cardData);
    setHasUnsavedChanges(false);
    if (isModal && onClose) {
      onClose();
    }
  }, [initialData, title, todos, backgroundColor, onSave, isModal, onClose]);

  const triggerAutoSave = () => {
    setShouldAutoSave(true);
  };

  const updateTitle = (newTitle: string) => {
    const sanitizedTitle = validateInput(newTitle, 100);
    if (isValidTitle(sanitizedTitle) || sanitizedTitle === '') {
      setTitle(sanitizedTitle);
      setHasUnsavedChanges(true);
    }
  };

  const updateBackgroundColor = (newColor: string) => {
    console.log('updateBackgroundColor called with:', newColor, 'current backgroundColor:', backgroundColor);
    setBackgroundColor(newColor);
    setHasUnsavedChanges(true);
  };

  const updateTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
    setHasUnsavedChanges(true);
  };

  const addTodo = () => {
    const newTodo = {
      id: crypto.randomUUID(),
      task: '',
      completed: false,
    };
    setTodos((prev) => [...prev, newTodo]);
    setHasUnsavedChanges(true);
  };

  const deleteTodo = (todoId: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== todoId));
    setHasUnsavedChanges(true);
  };

  const editTodo = (todoId: string, newTask: string) => {
    const sanitizedTask = validateInput(newTask, 1000);
    if (isValidContent(sanitizedTask) || sanitizedTask === '') {
      setTodos((prev) =>
        prev.map((t) => (t.id === todoId ? { ...t, task: sanitizedTask } : t))
      );
      setHasUnsavedChanges(true);
    }
  };

  const toggleTodo = (todoId: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === todoId ? { ...t, completed: !t.completed } : t
      )
    );
    setHasUnsavedChanges(true);
  };

  const reorderTodos = (fromIndex: number, toIndex: number) => {
    setTodos((prev) => {
      const newTodos = [...prev];
      const [draggedTodo] = newTodos.splice(fromIndex, 1);
      newTodos.splice(toIndex, 0, draggedTodo);
      return newTodos;
    });
    setHasUnsavedChanges(true);
  };

  return {
    // State
    title,
    backgroundColor,
    todos,
    hasUnsavedChanges,
    // Actions
    handleSave,
    triggerAutoSave,
    updateTitle,
    updateBackgroundColor,
    updateTodos,
    addTodo,
    deleteTodo,
    editTodo,
    toggleTodo,
    reorderTodos,
  };
};