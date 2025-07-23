import { TodoItem } from './TodoItem';
import { Icon } from './Icon';
import { CardToolbar } from './CardToolbar';
import { useCardState } from '../hooks/useCardState';
import { useCardRefs } from '../hooks/useCardRefs';
import { useKeyboardEvents } from '../hooks/useKeyboardEvents';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { getCardStyling } from '../utils/cardStyling';
import type { TodoCardProps } from '../types';
import { useState } from 'react';

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
  const cardState = useCardState({ initialData, onSave, isModal, onClose });
  const cardRefs = useCardRefs({
    isModal,
    focusTarget,
    todos: cardState.todos,
  });
  useKeyboardEvents({ isModal, onClose });

  // Drag and drop functionality
  const {
    draggedItemIndex,
    dropTargetIndex,
    handleDragLeave,
    createDragStartHandler,
    createDragOverHandler,
    createDropEventHandler,
    createReorderHandler,
    createDragEndHandler,
  } = useDragAndDrop();

  // ColorPicker state for z-index elevation
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleReorder = createReorderHandler((fromIndex: number, toIndex: number) => {
    cardState.reorderTodos(fromIndex, toIndex);
    if (!isModal) {
      cardState.triggerAutoSave();
    }
  });

  const cardContent = (
    <div
      data-testid="todoCard"
      className={`group p-6 rounded-3xl flex flex-col relative min-h-0 shadow-xl opacity-75 ${
        isBeingEdited ? '' : 'transition-all'
      } cursor-pointer w-full ${getCardStyling(
        cardState.backgroundColor || initialData?.backgroundColor
      )} ${isBeingEdited ? 'invisible' : ''} ${
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
        value={cardState.title}
        onChange={
          isBeingEdited
            ? undefined
            : (e) => cardState.updateTitle(e.target.value)
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
        {cardState.todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            index={index}
            inputRef={(ref: HTMLInputElement | null) => {
              cardRefs.setTodoItemRef(index, ref);
            }}
            onClick={() => {
              if (!isModal && onCardClick && initialData) {
                onCardClick(initialData, { type: 'todo', index });
              }
            }}
            onDelete={cardState.deleteTodo}
            onEdit={cardState.editTodo}
            onToggle={cardState.toggleTodo}
            onReorder={handleReorder}
            onDragStart={createDragStartHandler(index)}
            onDragOver={createDragOverHandler(index)}
            onDragLeave={handleDragLeave}
            onDrop={createDropEventHandler(index, handleReorder, !isModal ? cardState.triggerAutoSave : undefined, isBeingEdited)}
            onDragEnd={createDragEndHandler()}
            isBeingDragged={draggedItemIndex === index}
            isDropTarget={
              dropTargetIndex === index && draggedItemIndex !== index
            }
            draggedItemIndex={draggedItemIndex}
            isBeingEdited={isBeingEdited}
            autoSave={!isModal ? cardState.triggerAutoSave : undefined}
          />
        ))}
      </div>

      <button
        onClick={
          isBeingEdited
            ? undefined
            : (e) => {
                e.stopPropagation();
                cardState.addTodo();
                if (!isModal) {
                  cardState.triggerAutoSave();
                }
              }
        }
        className={`text-gray-700 hover:text-gray-700/80 transition-colors ml-3.5 my-2 w-8 h-8 rounded hover:bg-white/10 cursor-pointer self-start ${
          isModal ? '' : 'opacity-0 group-hover:opacity-100 transition-opacity'
        }`}
        title="Add task"
        aria-label="add toDo"
        disabled={isBeingEdited}
      >
        <Icon
          name="add-todoitem"
          className="w-8 h-8 hover:opacity-80 transition-all"
          alt="Add task"
        />
      </button>
      <div
        className={`text-xs tracking-wide text-gray-700 w-full text-right ${
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
        backgroundColor={cardState.backgroundColor}
        hasUnsavedChanges={cardState.hasUnsavedChanges}
        onColorSelect={(color: string) => {
          cardState.updateBackgroundColor(color);
          if (!isModal) cardState.triggerAutoSave();
        }}
        onDelete={onDelete}
        onClose={onClose}
        onSave={cardState.handleSave}
        onColorPickerToggle={setIsColorPickerOpen}
      />
    </div>
  );

  if (isModal) {
    return (
      <div
        data-testid="todoTrigger-modal"
        className="fixed inset-0 bg-gray-800/30 flex items-center justify-center p-4"
        onClick={() =>
          cardState.hasUnsavedChanges ? cardState.handleSave() : onClose?.()
        }
      >
        <div
          className="rounded-3xl shadow-lg w-full max-w-md bg-gray-700 "
          onClick={(e) => e.stopPropagation()}
        >
          {cardContent}
        </div>
      </div>
    );
  }

  return cardContent;
};
