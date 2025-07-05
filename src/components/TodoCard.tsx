import { useState, useEffect } from 'react';
import { TodoItem } from './TodoItem';
import type { TodoCardProps, TodoCardData } from '../types';

export const TodoCard = ({
  initialData,
  onSave,
  onDelete,
  onAddTodo,
  isModal = false,
  onClose,
}: TodoCardProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [todos, setTodos] = useState(
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

  const handleSave = () => {
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
  };

  const handleBackdropClick = () => {
    if (hasUnsavedChanges) {
      handleSave();
    } else {
      if (onClose) onClose();
    }
  };

  const handleEscKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (onClose) onClose();
    }
  };

  // Handle ESC key if in modal mode
  useEffect(() => {
    if (isModal) {
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [isModal]);

  const cardContent = (
    <div data-testid="todoCard">
      <input
        type="text"
        placeholder="Enter a title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setHasUnsavedChanges(true);
        }}
        data-testid="todoCard-title-input"
      />
      <div data-testid="todoItem-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={() => {}}
            onEdit={(todoId, newTask) => {
              setTodos((prev) =>
                prev.map((t) => (t.id === todoId ? { ...t, task: newTask } : t))
              );
              setHasUnsavedChanges(true);
            }}
            onToggle={(todoId) => {
              setTodos((prev) =>
                prev.map((t) =>
                  t.id === todoId ? { ...t, completed: !t.completed } : t
                )
              );
              setHasUnsavedChanges(true);
            }}
          />
        ))}
      </div>
      <button
        onClick={() => {
          onAddTodo(initialData?.id || '');
          setHasUnsavedChanges(true);
        }}
      >
        +
      </button>
      <div role="toolbar">
        <button onClick={handleSave} disabled={!hasUnsavedChanges}>
          Save
        </button>
        <button onClick={() => onDelete(initialData?.id || '')}>Delete</button>
      </div>
    </div>
  );

  // If in modal mode, wrap with modal backdrop
  if (isModal) {
    return (
      <div
        data-testid="todoTrigger-modal"
        className="fixed inset-0 bg-indigo-900/30 flex items-center justify-center"
        onClick={handleBackdropClick}
      >
        <div
          className="bg-white p-6 rounded-lg shadow-lg border border-indigo-200"
          onClick={(e) => e.stopPropagation()}
        >
          {cardContent}
        </div>
      </div>
    );
  }

  // Otherwise, return just the card content
  return cardContent;
};
