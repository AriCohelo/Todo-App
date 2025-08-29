import { useState, useEffect, useRef } from 'react';
import { TodoItem } from './TodoItem';
import { Icon } from './Icon';
import { ColorPicker } from './ColorPicker';
import { useCardBoardContext } from '../context/CardBoardContext';
import { useCardEditorContext } from '../context/CardEditorContext';
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
import type { TodoCardData } from '../types';

interface CardEditorProps {
  cardId: string;
}

export const CardEditor = ({ cardId }: CardEditorProps) => {
  const { upsertCard, deleteCard, todoCards } = useCardBoardContext();
  const { finishEdit, editingCardId } = useCardEditorContext();
  const focusTarget = editingCardId?.focusTarget;
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const todoItemRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const contextCard =
    todoCards.find((card) => card.id === cardId) ||
    createEmptyCard(getRandomColor());
  const [draftCard, setDraftCard] = useState<TodoCardData>(contextCard);
  const hasUnsavedChanges =
    JSON.stringify(draftCard) !== JSON.stringify(contextCard);

  useEffect(() => {
    setDraftCard(contextCard);
  }, [contextCard]);

  useEffect(() => {
    if (focusTarget !== undefined) {
      if (focusTarget === 'title' && titleInputRef.current) {
        titleInputRef.current.focus();
      } else if (
        typeof focusTarget === 'number' &&
        focusTarget < draftCard.todos.length &&
        todoItemRefs.current[focusTarget]
      ) {
        todoItemRefs.current[focusTarget]?.focus();
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
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColorPicker]);

  useEffect(() => {
    if (!window.visualViewport) return;
    
    const handleViewportChange = () => {
      if (!window.visualViewport) return;
      const height = window.innerHeight - window.visualViewport.height;
      setKeyboardHeight(height > 50 ? height : 0);
    };
    
    window.visualViewport.addEventListener('resize', handleViewportChange);
    handleViewportChange();
    
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
    };
  }, []);

  const handleSave = () => {
    upsertCard(draftCard);
    finishEdit();
  };

  const handleDiscard = () => {
    finishEdit();
  };

  const handleBackdropClick = () => {
    if (hasUnsavedChanges) {
      handleSave();
    } else {
      finishEdit();
    }
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

  const handleDeleteCard = (cardId: string) => {
    deleteCard(cardId);
    finishEdit();
  };

  const handleClick = (action: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      data-testid="todoCardEditor-modal"
      className="fixed inset-0 bg-gray-800/80 flex md:items-center md:justify-center md:p-4"
      onClick={handleBackdropClick}
      onKeyDown={(e) => e.key === 'Escape' && handleDiscard()}
      tabIndex={-1}
    >
      <div
        className="w-full h-full flex flex-col md:rounded-3xl md:shadow-lg md:w-full md:max-w-md md:h-auto app-background"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          data-testid="todoCardEditor"
          className={`group p-4 md:p-6 flex flex-col relative h-full opacity-100
          md:rounded-3xl md:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),inset_-12px_-12px_15px_0px_rgba(55,65,81,0.24),inset_12px_12px_16px_0px_rgba(55,65,81,0.24)] 
          cursor-pointer w-full md:border-6 md:border-[#B7B7B7] ${
            draftCard.backgroundColor
          } 
          ${showColorPicker ? 'z-[10000]' : ''}`}
        >
          <input
            ref={titleInputRef}
            type="text"
            placeholder="Enter a title..."
            value={draftCard.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full bg-transparent border-none outline-none font-semibold text-xl md:text-2xl tracking-wide md:tracking-widest text-gray-700 placeholder-gray-700/60 mb-2"
            data-testid="todoCardEditor-title-input"
          />

          <div data-testid="todoItem-list" className="space-y-1 flex-1 overflow-y-auto pb-32 md:pb-0">
            {draftCard.todos.map((todo, index) => (
              <div key={todo.id}>
                <TodoItem
                  todo={todo}
                  inputRef={(ref: HTMLInputElement | null) => {
                    todoItemRefs.current[index] = ref;
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
            className="fixed left-0 right-0 p-4 grid grid-cols-9 md:relative md:mt-1 md:p-0" 
            role="toolbar"
            style={{ bottom: keyboardHeight + 'px' }}
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

            <div
              onClick={handleClick(() => {
                const newState = !showColorPicker;
                setShowColorPicker(newState);
              })}
              className="text-gray-700 hover:text-gray-700/80 justify-self-end cursor-pointer relative col-start-6 flex items-center justify-center"
              title="Color palette"
            >
              <Icon
                name="palette"
                className="w-6 h-6 hover:opacity-80"
                alt="Color palette"
              />
              {showColorPicker && (
                <ColorPicker
                  ref={colorPickerRef}
                  selectedColor={draftCard.backgroundColor}
                  onColorSelect={handleColorChange}
                  onClose={() => {
                    setShowColorPicker(false);
                  }}
                />
              )}
            </div>

            <button
              onClick={handleClick(() => {
                handleDeleteCard(draftCard.id);
                finishEdit();
              })}
              className="text-gray-700 hover:text-red-600 justify-self-end cursor-pointer col-start-7"
              title="Delete card"
            >
              <Icon
                name="trash"
                className="w-6 h-6 hover:opacity-80"
                alt="Delete card"
              />
            </button>

            <button
              onClick={handleClick(() => handleSave())}
              className="text-gray-700 hover:text-gray-700/80 text-xl tracking-widest font-medium justify-self-end cursor-pointer col-start-8 col-span-2"
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
