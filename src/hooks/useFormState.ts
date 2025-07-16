import { useState, useEffect, useCallback } from 'react';
import type { Todo, TodoCardData } from '../types';

interface UseFormStateProps {
  initialData?: TodoCardData;
  onSave: (cardData: TodoCardData) => void;
  isModal: boolean;
  onClose?: () => void;
}

export const useFormState = ({ initialData, onSave, isModal, onClose }: UseFormStateProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [todos, setTodos] = useState<Todo[]>(
    initialData?.todos || [
      { id: crypto.randomUUID(), task: '', completed: false },
    ]
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update internal state when initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setTodos(initialData.todos);
      setHasUnsavedChanges(false);
    }
  }, [initialData]);

  const handleSave = useCallback(() => {
    const cardData: TodoCardData = {
      id: initialData?.id || crypto.randomUUID(),
      title: title,
      todos: todos,
      priority: initialData?.priority || 'medium',
      updatedAt: new Date(),
    };
    onSave(cardData);
    setHasUnsavedChanges(false);
    if (isModal && onClose) {
      onClose();
    }
  }, [initialData, title, todos, onSave, isModal, onClose]);

  const updateTitle = (newTitle: string) => {
    setTitle(newTitle);
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
    setTodos((prev) =>
      prev.map((t) => (t.id === todoId ? { ...t, task: newTask } : t))
    );
    setHasUnsavedChanges(true);
  };

  const toggleTodo = (todoId: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === todoId ? { ...t, completed: !t.completed } : t
      )
    );
    setHasUnsavedChanges(true);
  };

  return {
    title,
    todos,
    hasUnsavedChanges,
    handleSave,
    updateTitle,
    updateTodos,
    addTodo,
    deleteTodo,
    editTodo,
    toggleTodo,
  };
};