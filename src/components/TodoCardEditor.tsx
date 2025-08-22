import { useState, useEffect, useRef } from 'react';
import { TodoItem } from './TodoItem';
import { Icon } from './Icon';
import { ColorPicker } from './ColorPicker';
import { useCardContext } from '../context/CardContext';
import { useModal } from '../context/ModalContext';
import { validateInput, isValidTitle, isValidContent } from '../utils/security';
import {
  addTodoItem,
  deleteTodoItem,
  editTodoItem,
  toggleTodoItem,
  updateCardTitle,
  updateCardBackgroundColor,
  createEmptyCard,
} from '../utils/todoHelpers';
import { getRandomColor } from '../constants/colors';
import type { TodoCardData, FocusTarget } from '../types';

interface TodoCardEditorProps {
  cardId: string;
  onClose?: () => void;
  focusTarget?: FocusTarget;
}

export const TodoCardEditor = ({ cardId, onClose, focusTarget }: TodoCardEditorProps) => {
  const { upsertCard, deleteCard, todoCards } = useCardContext();
  const { closeEdit } = useModal();
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const todoInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const contextCard = todoCards.find(card => card.id === cardId) || createEmptyCard(getRandomColor());
  const [draftCard, setDraftCard] = useState<TodoCardData>(contextCard);

  useEffect(() => {
    setDraftCard(contextCard);
  }, [contextCard]);

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

  useEffect(() => {
    if (focusTarget !== undefined) {
      if (focusTarget === 'title' && titleInputRef.current) {
        titleInputRef.current.focus();
      } else if (typeof focusTarget === 'number' && todoInputRefs.current[focusTarget]) {
        todoInputRefs.current[focusTarget]?.focus();
      }
    }
  }, [focusTarget]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
        setIsColorPickerOpen(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColorPicker]);

  const handleClose = () => {
    upsertCard(draftCard);
    if (onClose) onClose();
    if (closeEdit) closeEdit();
  };

  const handleSave = () => {
    upsertCard(draftCard);
    if (onClose) onClose();
  };

  const handleTitleChange = (newTitle: string) => {
    const sanitizedTitle = validateInput(newTitle, 100);
    if (isValidTitle(sanitizedTitle) || sanitizedTitle === '') {
      setDraftCard(updateCardTitle(draftCard, sanitizedTitle));
    }
  };

  const handleColorChange = (newColor: string) => {
    setDraftCard(updateCardBackgroundColor(draftCard, newColor));
  };

  const handleAddTodo = () => {
    setDraftCard(addTodoItem(draftCard));
  };

  const handleDeleteTodo = (todoId: string) => {
    setDraftCard(deleteTodoItem(draftCard, todoId));
  };

  const handleEditTodo = (todoId: string, newTask: string) => {
    const sanitizedTask = validateInput(newTask, 1000, false);
    if (isValidContent(sanitizedTask) || sanitizedTask === '') {
      setDraftCard(editTodoItem(draftCard, todoId, sanitizedTask));
    }
  };

  const handleToggleTodo = (todoId: string) => {
    setDraftCard(toggleTodoItem(draftCard, todoId));
  };

  const handleDeleteCard = (cardIdToDelete: string) => {
    deleteCard(cardIdToDelete);
    if (onClose) onClose();
  };

  const handleClick = (action: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    action();
  };

  const hasUnsavedChanges = JSON.stringify(draftCard) !== JSON.stringify(contextCard);

  const handleBackdropClick = () => {
    upsertCard(draftCard);
    handleClose();
  };

  return (
    <div
      data-testid="todoCardEditor-modal"
      className="fixed inset-0 bg-gray-800/80 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="rounded-3xl shadow-lg w-full max-w-md app-background"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          data-testid="todoCardEditor"
          className={`group p-6 rounded-3xl flex flex-col relative min-h-0 opacity-100
          shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),inset_-12px_-12px_15px_0px_rgba(55,65,81,0.24),inset_12px_12px_16px_0px_rgba(55,65,81,0.24)] 
          cursor-pointer w-full border-6 border-[#B7B7B7] ${
            draftCard.backgroundColor || 'bg-gradient-to-br from-gray-300/80 to-gray-100/40'
          } ${isColorPickerOpen ? 'z-[10000]' : ''}`}
        >
          <input
            ref={titleInputRef}
            type="text"
            placeholder="Enter a title..."
            value={draftCard.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full bg-transparent border-none outline-none font-semibold text-2xl tracking-widest text-gray-700 placeholder-gray-700/60 mb-2"
            data-testid="todoCardEditor-title-input"
          />

          <div data-testid="todoItem-list" className="space-y-1 flex-1">
            {draftCard.todos.map((todo, index) => (
              <div key={todo.id}>
                <TodoItem
                  todo={todo}
                  inputRef={(ref: HTMLInputElement | null) => {
                    todoInputRefs.current[index] = ref;
                  }}
                  onDelete={handleDeleteTodo}
                  onEdit={handleEditTodo}
                  onToggle={handleToggleTodo}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 text-xs tracking-wide text-gray-700 w-full text-right">
            <span>
              Edited{' '}
              {new Date(draftCard.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          <div
            className="mt-1 grid grid-cols-9"
            role="toolbar"
          >
            <button
              onClick={handleClick(() => handleAddTodo())}
              className="text-gray-700 hover:text-gray-700/80 justify-self-start cursor-pointer col-start-1"
              title="Add task"
              aria-label="add toDo"
            >
              <Icon
                name="add-todoitem"
                className="w-8 h-8 hover:opacity-80"
                alt="Add task"
              />
            </button>

            <button
              onClick={handleClick(() => {
                const newState = !showColorPicker;
                setShowColorPicker(newState);
                setIsColorPickerOpen(newState);
              })}
              className="text-gray-700 hover:text-gray-700/80 justify-self-end cursor-pointer relative col-start-6"
              title="Color palette"
            >
              <Icon
                name="palette"
                className="w-4 h-4 hover:opacity-80"
                alt="Color palette"
              />
              {showColorPicker && (
                <ColorPicker
                  ref={colorPickerRef}
                  selectedColor={draftCard.backgroundColor}
                  onColorSelect={handleColorChange}
                  onClose={() => {
                    setShowColorPicker(false);
                    setIsColorPickerOpen(false);
                  }}
                />
              )}
            </button>

            <button
              onClick={handleClick(() => {
                handleDeleteCard(draftCard.id);
                if (onClose) onClose();
              })}
              className="text-gray-700 hover:text-red-600 justify-self-end cursor-pointer col-start-7"
              title="Delete card"
            >
              <Icon
                name="trash"
                className="w-4 h-4 hover:opacity-80"
                alt="Delete card"
              />
            </button>

            <button
              onClick={hasUnsavedChanges ? handleClick(() => handleSave()) : undefined}
              className="text-gray-700 hover:text-gray-700/80 text-lg tracking-widest font-medium justify-self-end cursor-pointer col-start-8 col-span-2"
              title="Save changes"
              disabled={!hasUnsavedChanges}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};