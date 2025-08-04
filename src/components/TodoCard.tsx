import { TodoItem } from './TodoItem';
import { CardToolbar } from './CardToolbar';
import { useCardRefs } from '../hooks/useCardRefs';
import { useKeyboardEvents } from '../hooks/useKeyboardEvents';
import { useTodoContext } from '../context/TodoContext';
import { validateInput, isValidTitle, isValidContent } from '../utils/security';
import { 
  addTodoToCard, 
  deleteTodoFromCard, 
  editTodoInCard, 
  toggleTodoInCard, 
  updateCardTitle, 
  updateCardBackgroundColor,
  createEmptyCard 
} from '../utils/todoHelpers';
import type { TodoCardProps, TodoCardData } from '../types';
import { useState, useEffect } from 'react';
import { getRandomColor } from '../constants/colors';

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
  const { upsertCard } = useTodoContext();
  
  // ColorPicker state for z-index elevation
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  // Working state - used for modal mode and board mode without initialData
  const [workingCard, setWorkingCard] = useState<TodoCardData>(() => 
    initialData || createEmptyCard(getRandomColor())
  );

  // Update working card when initialData changes (edit mode)
  useEffect(() => {
    if (initialData) {
      setWorkingCard(initialData);
    }
  }, [initialData]);

  // Get current card data based on mode
  const currentCard: TodoCardData = isModal ? workingCard : (initialData || workingCard);

  // Track if modal has unsaved changes
  const hasUnsavedChanges = isModal && (
    !initialData ? 
      // Create mode: has changes if title has content OR todos were modified (added/removed/edited)
      workingCard.title.trim() !== '' || 
      workingCard.todos.some(todo => todo.task.trim() !== '') ||
      workingCard.todos.length > 1 : // More than the default 1 empty todo means user added todos
      // Edit mode: compare with original
      JSON.stringify(workingCard) !== JSON.stringify(initialData)
  );

  const cardRefs = useCardRefs({
    isModal,
    focusTarget,
    todos: currentCard.todos,
  });
  useKeyboardEvents({ isModal, onClose });

  // Simplified save function using Context directly
  const handleSave = () => {
    if (isModal && onSave) {
      onSave(workingCard);
      // Reset working card to saved state for create mode
      if (!initialData) {
        setWorkingCard(createEmptyCard(getRandomColor()));
      }
    }
    if (isModal && onClose) {
      onClose();
    }
  };

  const handleTitleChange = (newTitle: string) => {
    const sanitizedTitle = validateInput(newTitle, 100, false);
    if (isValidTitle(sanitizedTitle.trim()) || sanitizedTitle === '') {
      const updatedCard = updateCardTitle(currentCard, sanitizedTitle);
      if (isModal || !initialData) {
        // Modal or board without initialData: update working state
        setWorkingCard(updatedCard);
        if (!isModal) {
          // Board without initialData: also sync to Context
          upsertCard(updatedCard);
        }
      } else {
        // Board with initialData: update Context immediately
        upsertCard(updatedCard);
      }
    }
  };

  const handleColorChange = (newColor: string) => {
    const updatedCard = updateCardBackgroundColor(currentCard, newColor);
    if (isModal || !initialData) {
      // Modal or board without initialData: update working state
      setWorkingCard(updatedCard);
      if (!isModal) {
        // Board without initialData: also sync to Context
        upsertCard(updatedCard);
      }
    } else {
      // Board with initialData: update Context immediately
      upsertCard(updatedCard);
    }
  };

  const handleAddTodo = () => {
    const updatedCard = addTodoToCard(currentCard);
    if (isModal || !initialData) {
      // Modal or board without initialData: update working state
      setWorkingCard(updatedCard);
      if (!isModal) {
        // Board without initialData: also sync to Context
        upsertCard(updatedCard);
      }
    } else {
      // Board with initialData: update Context immediately
      upsertCard(updatedCard);
    }
  };

  const handleDeleteTodo = (todoId: string) => {
    const updatedCard = deleteTodoFromCard(currentCard, todoId);
    if (isModal || !initialData) {
      // Modal or board without initialData: update working state
      setWorkingCard(updatedCard);
      if (!isModal) {
        // Board without initialData: also sync to Context
        upsertCard(updatedCard);
      }
    } else {
      // Board with initialData: update Context immediately
      upsertCard(updatedCard);
    }
  };

  const handleEditTodo = (todoId: string, newTask: string) => {
    const sanitizedTask = validateInput(newTask, 1000, false);
    if (isValidContent(sanitizedTask) || sanitizedTask === '') {
      const updatedCard = editTodoInCard(currentCard, todoId, sanitizedTask);
      if (isModal || !initialData) {
        // Modal or board without initialData: update working state
        setWorkingCard(updatedCard);
        if (!isModal) {
          // Board without initialData: also sync to Context
          upsertCard(updatedCard);
        }
      } else {
        // Board with initialData: update Context immediately
        upsertCard(updatedCard);
      }
    }
  };

  const handleToggleTodo = (todoId: string) => {
    const updatedCard = toggleTodoInCard(currentCard, todoId);
    if (isModal || !initialData) {
      // Modal or board without initialData: update working state
      setWorkingCard(updatedCard);
      if (!isModal) {
        // Board without initialData: also sync to Context
        upsertCard(updatedCard);
      }
    } else {
      // Board with initialData: update Context immediately
      upsertCard(updatedCard);
    }
  };


  const cardContent = (
    <div
      data-testid="todoCard"
      className={`group p-6 rounded-3xl flex flex-col relative min-h-0 opacity-75 
                   shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),inset_-12px_-12px_15px_0px_rgba(55,65,81,0.24),inset_12px_12px_16px_0px_rgba(55,65,81,0.24)] ${
                     isBeingEdited ? '' : 'transition-all'
                   } cursor-pointer w-full border-6 border-[#B7B7B7]
                  ${currentCard.backgroundColor || 'bg-gradient-to-br from-gray-300/80 to-gray-100/40'} ${isBeingEdited ? 'invisible' : ''} ${
        isColorPickerOpen ? 'z-[10000]' : ''
      }`}
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
        ref={cardRefs.titleInputRef}
        type="text"
        placeholder="Enter a title..."
        value={currentCard.title}
        onChange={
          isBeingEdited
            ? undefined
            : (e) => handleTitleChange(e.target.value)
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
        {currentCard.todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            inputRef={(ref: HTMLInputElement | null) => {
              cardRefs.setTodoItemRef(index, ref);
            }}
            onClick={() => {
              if (!isModal && onCardClick && initialData) {
                onCardClick(initialData, { type: 'todo', index });
              }
            }}
            onDelete={handleDeleteTodo}
            onEdit={handleEditTodo}
            onToggle={handleToggleTodo}
            isBeingEdited={isBeingEdited}
            autoSave={undefined}
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
        isBeingEdited={isBeingEdited}
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

  if (isModal) {
    return (
      <div
        data-testid="todoTrigger-modal"
        className="fixed inset-0 bg-gray-800/80 flex items-center justify-center p-4"
        onClick={() => 
          hasUnsavedChanges ? handleSave() : onClose?.()
        }
      >
        <div
          className="rounded-3xl shadow-lg w-full max-w-md app-background "
          onClick={(e) => e.stopPropagation()}
        >
          {cardContent}
        </div>
      </div>
    );
  }

  return cardContent;
};
