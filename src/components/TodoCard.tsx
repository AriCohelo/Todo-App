import { TodoItem } from './TodoItem';
import { CardToolbar } from './CardToolbar';
import { useCardRefs } from '../hooks/useCardRefs';
import { useKeyboardEvents } from '../hooks/useKeyboardEvents';
import { useTodoContext } from '../context/TodoContext';
import { useTodoCardSave } from '../hooks/useTodoCardSave';
import { validateInput, isValidTitle, isValidContent } from '../utils/security';
import {
  addTodoItem,
  deleteTodoItem,
  editTodoItem,
  toggleTodoItem,
  updateCardTitle,
  updateCardBackgroundColor,
} from '../utils/todoHelpers';
import type { TodoCardProps } from '../types';
import { useState, useEffect } from 'react';

export const TodoCard = ({
  initialData,
  onSave,
  onDelete,
  isModal = false,
  onClose,
  onBackdropClick,
  focusTarget: externalFocusTarget,
  onCardClick,
}: TodoCardProps) => {
  const { upsertCard } = useTodoContext();

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const { currentCard, hasUnsavedChanges, updateCard, saveChanges } =
    useTodoCardSave({
      isModal,
      initialData,
      upsertCard,
    });

  const cardRefs = useCardRefs({
    isModal,
    focusTarget: externalFocusTarget,
    todos: currentCard.todos,
  });

  useKeyboardEvents({
    isModal,
    onClose,
  });

  // Update parent ref with current card state for backdrop click auto-save
  useEffect(() => {
    if (onBackdropClick) {
      onBackdropClick(currentCard);
    }
  }, [currentCard, onBackdropClick]);

  const handleSave = () => {
    if (onSave) {
      saveChanges(onSave);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleTitleChange = (newTitle: string) => {
    const sanitizedTitle = validateInput(newTitle, 100);
    if (isValidTitle(sanitizedTitle) || sanitizedTitle === '') {
      updateCard(updateCardTitle(currentCard, sanitizedTitle));
    }
  };

  const handleColorChange = (newColor: string) => {
    updateCard(updateCardBackgroundColor(currentCard, newColor));
  };

  const handleAddTodo = () => {
    updateCard(addTodoItem(currentCard));
  };

  const handleDeleteTodo = (todoId: string) => {
    updateCard(deleteTodoItem(currentCard, todoId));
  };

  const handleEditTodo = (todoId: string, newTask: string) => {
    const sanitizedTask = validateInput(newTask, 1000, false); // Look at it when impmlementing indentation
    if (isValidContent(sanitizedTask) || sanitizedTask === '') {
      updateCard(editTodoItem(currentCard, todoId, sanitizedTask));
    }
  };

  const handleToggleTodo = (todoId: string) => {
    updateCard(toggleTodoItem(currentCard, todoId));
  };

  const cardContent = (
    <div
      data-testid="todoCard"
      className={`group p-6 rounded-3xl flex flex-col relative min-h-0 ${
        isModal ? 'opacity-100' : 'opacity-75'
      }
                   shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),inset_-12px_-12px_15px_0px_rgba(55,65,81,0.24),inset_12px_12px_16px_0px_rgba(55,65,81,0.24)] 
                   transition-all cursor-pointer w-full border-6 border-[#B7B7B7]
                  ${
                    currentCard.backgroundColor ||
                    'bg-gradient-to-br from-gray-300/80 to-gray-100/40'
                  } ${isColorPickerOpen ? 'z-[10000]' : ''}`}
      onClick={() => {
        if (!isModal && onCardClick) {
          onCardClick('title');
        }
      }}
    >
      <input
        ref={cardRefs.titleInputRef}
        type="text"
        placeholder="Enter a title..."
        value={currentCard.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        onClick={(e) => {
          if (!isModal && onCardClick) {
            e.stopPropagation();
            onCardClick('title');
          }
        }}
        className="w-full bg-transparent border-none outline-none font-semibold text-2xl tracking-widest text-gray-700 placeholder-gray-700/60 mb-2"
        data-testid="todoCard-title-input"
      />
      <div data-testid="todoItem-list" className="space-y-1 flex-1">
        {currentCard.todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            inputRef={(ref: HTMLInputElement | null) => {
              cardRefs.setTodoItemRef(index, ref);
            }}
            onClick={() => {
              if (!isModal && onCardClick) {
                onCardClick({ type: 'todo', index });
              }
            }}
            onDelete={handleDeleteTodo}
            onEdit={handleEditTodo}
            onToggle={handleToggleTodo}
          />
        ))}
      </div>

      <div
        className={`mt-8 text-xs tracking-wide text-gray-700 w-full text-right ${
          isModal ? '' : 'opacity-0 group-hover:opacity-100 transition-opacity'
        }`}
      >
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
      <CardToolbar
        isModal={isModal}
        isBeingEdited={false}
        initialData={initialData}
        backgroundColor={currentCard.backgroundColor}
        hasUnsavedChanges={hasUnsavedChanges || false}
        onColorSelect={handleColorChange}
        onDelete={onDelete}
        onClose={onClose}
        onSave={handleSave}
        onColorPickerToggle={setIsColorPickerOpen}
        onAddTodo={handleAddTodo}
      />
    </div>
  );

  return cardContent;
};
