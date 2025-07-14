import { useState, useEffect, useCallback, useRef } from 'react';
import { TodoItem } from './TodoItem';
import type { TodoCardProps, TodoCardData } from '../types';

export const TodoCard = ({
  initialData,
  onSave,
  onDelete,
  isModal = false,
  onClose,
  focusTarget,
  onCardClick,
}: TodoCardProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [todos, setTodos] = useState(
    initialData?.todos || [
      { id: crypto.randomUUID(), task: '', completed: false },
    ]
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [shouldAutoSave, setShouldAutoSave] = useState(false);
  
  // Refs for focus management
  const titleInputRef = useRef<HTMLInputElement>(null);
  const todoItemRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update internal state when initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setTodos(initialData.todos);
      setHasUnsavedChanges(false);
    }
  }, [initialData]);

  // Update refs array when todos change
  useEffect(() => {
    todoItemRefs.current = todoItemRefs.current.slice(0, todos.length);
  }, [todos.length]);

  // Auto-save when shouldAutoSave is true and todos state has updated
  useEffect(() => {
    if (shouldAutoSave && !isModal && hasUnsavedChanges) {
      handleSave();
      setShouldAutoSave(false);
    }
  }, [shouldAutoSave, todos, isModal, hasUnsavedChanges]);

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

  const handleEscKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (onClose) onClose();
    }
  }, [onClose]);

  // Handle ESC key if in modal mode
  useEffect(() => {
    if (isModal) {
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [isModal, handleEscKey]);

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
        } else if (typeof focusTarget === 'object' && focusTarget.type === 'todo') {
          // Focus on specific todo item
          todoItemRefs.current[focusTarget.index]?.focus();
        }
      }, 0);
    }
  }, [isModal, focusTarget, todos.length]);

  const cardContent = (
    <div 
      data-testid="todoCard"
      onClick={() => {
        // General click handler - defaults to title focus
        if (!isModal && onCardClick && initialData) {
          onCardClick(initialData, 'title');
        }
      }}
    >
      <input
        ref={titleInputRef}
        type="text"
        placeholder="Enter a title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setHasUnsavedChanges(true);
        }}
        onClick={(e) => {
          if (!isModal && onCardClick && initialData) {
            e.stopPropagation();
            onCardClick(initialData, 'title');
          }
        }}
        data-testid="todoCard-title-input"
      />
      <div data-testid="todoItem-list">
        {todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            showCheckbox={isModal}
            inputRef={(ref: HTMLInputElement | null) => {
              todoItemRefs.current[index] = ref;
            }}
            onClick={() => {
              if (!isModal && onCardClick && initialData) {
                onCardClick(initialData, { type: 'todo', index });
              }
            }}
            onDelete={(todoId) => {
              setTodos((prev) => prev.filter((t) => t.id !== todoId));
              setHasUnsavedChanges(true);
              // Trigger auto-save when not in modal mode
              if (!isModal) {
                setShouldAutoSave(true);
              }
            }}
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
          const newTodo = { id: crypto.randomUUID(), task: '', completed: false };
          setTodos((prev) => [...prev, newTodo]);
          setHasUnsavedChanges(true);
          
          // If not in modal and we have a click handler, open modal focused on new todo
          if (!isModal && onCardClick && initialData) {
            onCardClick(initialData, 'new-todo');
          }
        }}
      >
        +
      </button>
      <div role="toolbar">
        <button onClick={handleSave} disabled={!hasUnsavedChanges}>
          Save
        </button>
        <button onClick={(e) => {
          e.stopPropagation();
          onDelete(initialData?.id || '');
        }}>Delete</button>
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
