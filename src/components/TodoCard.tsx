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
  isBeingEdited = false,
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

  // Auto-save when shouldAutoSave is true and todos state has updated
  useEffect(() => {
    if (shouldAutoSave && !isModal && hasUnsavedChanges) {
      handleSave();
      setShouldAutoSave(false);
    }
  }, [shouldAutoSave, todos, isModal, hasUnsavedChanges, handleSave]);

  const getCardBackgroundColor = () => {
    const priority = initialData?.priority || 'medium';
    switch (priority) {
      case 'high':
        return 'bg-green-700 text-white';
      case 'medium':
        return 'bg-zinc-800 text-zinc-300';
      case 'low':
        return 'bg-yellow-700 text-white';
      default:
        return 'bg-zinc-800 text-zinc-300';
    }
  };

  const handleBackdropClick = () => {
    if (hasUnsavedChanges) {
      handleSave();
    } else {
      if (onClose) onClose();
    }
  };

  const handleEscKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onClose) onClose();
      }
    },
    [onClose]
  );

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

  // If being edited, render invisible placeholder
  if (isBeingEdited) {
    return (
      <div
        data-testid="todoCard"
        className={`${getCardBackgroundColor()} p-4 rounded-lg shadow-md invisible`}
      >
        <input
          type="text"
          placeholder="Enter a title"
          value={title}
          className="w-full bg-transparent border-none outline-none font-medium text-lg placeholder-opacity-60 mb-2"
          readOnly
        />
        <div className="space-y-1">
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-center gap-2 w-full">
              <input type="checkbox" className="flex-shrink-0 w-4 h-4" readOnly />
              <input
                type="text"
                value={todo.task}
                className="flex-1 bg-transparent border-none outline-none text-sm min-w-0"
                readOnly
              />
            </div>
          ))}
        </div>
        <button className="flex items-center gap-1 text-zinc-400 text-sm transition-colors mt-2 w-full justify-center py-1 rounded">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>add toDo</span>
        </button>
        <div className="mt-3 flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-zinc-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <button className="text-zinc-400 p-1 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cardContent = (
    <div
      data-testid="todoCard"
      className={`${getCardBackgroundColor()} p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-zinc-600`}
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
        className="w-full bg-transparent border-none outline-none font-medium text-lg placeholder-opacity-60 mb-2"
        data-testid="todoCard-title-input"
      />
      <div data-testid="todoItem-list" className="space-y-1">
        {todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
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
              // Trigger auto-save when not in modal mode
              if (!isModal) {
                setShouldAutoSave(true);
              }
            }}
            onToggle={(todoId) => {
              setTodos((prev) =>
                prev.map((t) =>
                  t.id === todoId ? { ...t, completed: !t.completed } : t
                )
              );
              setHasUnsavedChanges(true);
              // Trigger auto-save when not in modal mode
              if (!isModal) {
                setShouldAutoSave(true);
              }
            }}
          />
        ))}
      </div>

      {/* Add todo button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          const newTodo = {
            id: crypto.randomUUID(),
            task: '',
            completed: false,
          };
          setTodos((prev) => [...prev, newTodo]);
          setHasUnsavedChanges(true);
          // Trigger auto-save when not in modal mode
          if (!isModal) {
            setShouldAutoSave(true);
          }
        }}
        className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 text-sm transition-colors mt-2 w-full justify-center py-1 rounded hover:bg-zinc-700/50"
        title="Add todo item"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span>add toDo</span>
      </button>

      <div className="mt-3 flex items-center justify-between" role="toolbar">
        <div></div>

        <div className="flex items-center gap-2">
          {/* Date tooltip */}
          <div
            className="text-xs text-zinc-500 cursor-help"
            title={`Created: ${
              initialData?.updatedAt
                ? new Date(initialData.updatedAt).toLocaleDateString()
                : 'Unknown'
            }\nLast modified: ${
              initialData?.updatedAt
                ? new Date(initialData.updatedAt).toLocaleString()
                : 'Unknown'
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(initialData?.id || '');
            }}
            className="text-zinc-400 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-900/20"
            title="Delete card"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>

          {/* Save button (only in modal) */}
          {isModal && (
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
              title="Save changes"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Save
            </button>
          )}
        </div>
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
          className="rounded-lg shadow-lg"
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
