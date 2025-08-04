import { TodoItem } from './TodoItem';
import { CardToolbar } from './CardToolbar';
import { useCardState } from '../hooks/useCardState';
import { useCardRefs } from '../hooks/useCardRefs';
import { useKeyboardEvents } from '../hooks/useKeyboardEvents';
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


  // ColorPicker state for z-index elevation
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);


  const cardContent = (
    <div
      data-testid="todoCard"
      className={`group p-6 rounded-3xl flex flex-col relative min-h-0 opacity-75 
                   shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),inset_-12px_-12px_15px_0px_rgba(55,65,81,0.24),inset_12px_12px_16px_0px_rgba(55,65,81,0.24)] ${
                     isBeingEdited ? '' : 'transition-all'
                   } cursor-pointer w-full border-6 border-[#B7B7B7]
                  ${getCardStyling(
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
            isBeingEdited={isBeingEdited}
            autoSave={!isModal ? cardState.triggerAutoSave : undefined}
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
        onAddTodo={() => {
          cardState.addTodo();
          if (!isModal) {
            cardState.triggerAutoSave();
          }
        }}
      />
    </div>
  );

  if (isModal) {
    return (
      <div
        data-testid="todoTrigger-modal"
        className="fixed inset-0 bg-gray-800/80 flex items-center justify-center p-4"
        onClick={() =>
          cardState.hasUnsavedChanges ? cardState.handleSave() : onClose?.()
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
