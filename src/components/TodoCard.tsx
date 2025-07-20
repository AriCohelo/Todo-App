import { TodoItem } from './TodoItem';
import { Icon } from './Icon';
import { ColorPicker } from './ColorPicker';
import { useFormState } from '../hooks/useFormState';
import { useFocusManagement } from '../hooks/useFocusManagement';
import { useKeyboardEvents } from '../hooks/useKeyboardEvents';
import { useAutoSave } from '../hooks/useAutoSave';
import { useState, useEffect, useRef } from 'react';
import type { TodoCardProps } from '../types';

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
  const {
    title,
    backgroundColor,
    todos,
    hasUnsavedChanges,
    handleSave,
    updateTitle,
    updateBackgroundColor,
    addTodo,
    deleteTodo,
    editTodo,
    toggleTodo,
    reorderTodos,
  } = useFormState({ initialData, onSave, isModal, onClose });

  const { titleInputRef, setTodoItemRef } = useFocusManagement({
    isModal,
    focusTarget,
    todos,
  });

  useKeyboardEvents({ isModal, onClose });

  const { triggerAutoSave } = useAutoSave({
    isModal,
    hasUnsavedChanges,
    handleSave,
  });

  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker]);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getBackgroundStyle = () => {
    const bgColor = backgroundColor || initialData?.backgroundColor || '#f87171';
    return {
      background: `linear-gradient(135deg, ${hexToRgba(bgColor, 0.4)} 0%, ${hexToRgba(bgColor, 0.1)} 100%) padding-box, linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 77%, #4b5563 100%) border-box`,
      border: '6px solid transparent',
    };
  };

  const handleColorSelect = (color: string) => {
    updateBackgroundColor(color);
    if (!isModal) {
      triggerAutoSave();
    }
  };

  const handleBackdropClick = () => {
    if (hasUnsavedChanges) {
      handleSave();
    } else {
      if (onClose) onClose();
    }
  };

  const cardContent = (
    <div
      data-testid="todoCard"
      className={`p-6 rounded-3xl backdrop-blur-2xl flex flex-col relative min-h-0 shadow-xl opacity-75 hover:opacity-90 transition-all cursor-pointer w-full ${
        isBeingEdited ? 'invisible' : ''
      }`}
      style={getBackgroundStyle()}
      onClick={
        isBeingEdited
          ? undefined
          : () => {
              if (!isModal && onCardClick && initialData) {
                onCardClick(initialData, 'title');
              }
            }
      }
    >
      <input
        ref={titleInputRef}
        type="text"
        placeholder="Enter a title..."
        value={title}
        onChange={
          isBeingEdited ? undefined : (e) => updateTitle(e.target.value)
        }
        onClick={
          isBeingEdited
            ? undefined
            : (e) => {
                if (!isModal && onCardClick && initialData) {
                  e.stopPropagation();
                  onCardClick(initialData, 'title');
                }
              }
        }
        className="w-full bg-transparent border-none outline-none font-semibold text-2xl tracking-widest text-gray-700 placeholder-gray-700/60 mb-2"
        data-testid="todoCard-title-input"
        readOnly={isBeingEdited}
      />
      <div data-testid="todoItem-list" className="space-y-1 flex-1">
        {todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            index={index}
            inputRef={(ref: HTMLInputElement | null) => {
              setTodoItemRef(index, ref);
            }}
            onClick={
              isBeingEdited
                ? undefined
                : () => {
                    if (!isModal && onCardClick && initialData) {
                      onCardClick(initialData, { type: 'todo', index });
                    }
                  }
            }
            onDelete={
              isBeingEdited
                ? () => {}
                : (todoId) => {
                    deleteTodo(todoId);
                    if (!isModal) {
                      triggerAutoSave();
                    }
                  }
            }
            onEdit={
              isBeingEdited
                ? () => {}
                : (todoId, newTask) => {
                    editTodo(todoId, newTask);
                    if (!isModal) {
                      triggerAutoSave();
                    }
                  }
            }
            onToggle={
              isBeingEdited
                ? () => {}
                : (todoId) => {
                    toggleTodo(todoId);
                    if (!isModal) {
                      triggerAutoSave();
                    }
                  }
            }
            onReorder={
              isBeingEdited
                ? undefined
                : (fromIndex, toIndex) => {
                    reorderTodos(fromIndex, toIndex);
                    if (!isModal) {
                      triggerAutoSave();
                    }
                  }
            }
          />
        ))}
      </div>

      <button
        onClick={
          isBeingEdited
            ? undefined
            : (e) => {
                e.stopPropagation();
                addTodo();
                if (!isModal) {
                  triggerAutoSave();
                }
              }
        }
        className="text-gray-700 hover:text-gray-700/80 transition-colors ml-3.5 my-2 w-8 h-8 rounded hover:bg-white/10 cursor-pointer self-start"
        title="Add task"
        aria-label="add toDo"
        disabled={isBeingEdited}
      >
        <Icon name="add-todoitem" className="w-8 h-8 hover:opacity-80 transition-all" alt="Add task" />
      </button>
      <div className="text-xs tracking-wide text-gray-700 w-full text-right">
        <span>
          Edited{' '}
          {initialData?.updatedAt
            ? new Date(initialData.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
        </span>
      </div>
      <div className="mt-1 grid grid-cols-9" role="toolbar">
        <button
          onClick={
            isBeingEdited
              ? undefined
              : (e) => {
                  e.stopPropagation();
                  setShowColorPicker(!showColorPicker);
                }
          }
          className={`text-gray-700 hover:text-gray-700/80 transition-colors justify-self-end cursor-pointer relative ${
            isModal ? 'col-start-6' : 'col-start-8'
          }`}
          title="Color palette"
          disabled={isBeingEdited}
        >
          <Icon name="palette" className="w-4 h-4 hover:opacity-80 transition-all" alt="Color palette" />
          {showColorPicker && (
            <ColorPicker
              ref={colorPickerRef}
              selectedColor={backgroundColor || initialData?.backgroundColor}
              onColorSelect={handleColorSelect}
              onClose={() => setShowColorPicker(false)}
            />
          )}
        </button>

        <button
          onClick={
            isBeingEdited
              ? undefined
              : (e) => {
                  e.stopPropagation();
                  if (isModal) {
                    if (initialData) {
                      // EDIT MODE: Delete the actual card and close modal
                      onDelete(initialData.id);
                      if (onClose) onClose();
                    } else {
                      // CREATE MODE: Just close modal (discard all changes, don't create card)
                      if (onClose) onClose();
                    }
                  } else {
                    // BOARD VIEW: Delete card (unchanged behavior)
                    onDelete(initialData?.id || '');
                  }
                }
          }
          className={`text-gray-700 hover:text-red-600 transition-colors justify-self-end cursor-pointer ${
            isModal ? 'col-start-7' : 'col-start-9'
          }`}
          title={
            isModal 
              ? (initialData ? "Delete card" : "Discard changes and close")
              : "Delete card"
          }
          disabled={isBeingEdited}
        >
          <Icon name="trash" className="w-4 h-4 hover:opacity-80 transition-all" alt="Delete card" />
        </button>

        {isModal && (
          <button
            onClick={
              isBeingEdited
                ? undefined
                : (e) => {
                    e.stopPropagation();
                    handleSave();
                  }
            }
            className="text-gray-700 hover:text-gray-700/80 text-lg tracking-widest font-medium transition-colors justify-self-end cursor-pointer col-start-8 col-span-2"
            title="Save changes"
            disabled={isBeingEdited || !hasUnsavedChanges}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div
        data-testid="todoTrigger-modal"
        className="fixed inset-0 bg-indigo-900/30 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div
          className="rounded-3xl shadow-lg w-full max-w-md bg-indigo-700"
          onClick={(e) => e.stopPropagation()}
        >
          {cardContent}
        </div>
      </div>
    );
  }
  3;

  return cardContent;
};
