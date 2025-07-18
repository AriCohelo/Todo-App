import { TodoItem } from './TodoItem';
import { Icon } from './Icon';
import { useFormState } from '../hooks/useFormState';
import { useFocusManagement } from '../hooks/useFocusManagement';
import { useKeyboardEvents } from '../hooks/useKeyboardEvents';
import { useAutoSave } from '../hooks/useAutoSave';
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
  // Use custom hooks to manage component logic
  const {
    title,
    todos,
    hasUnsavedChanges,
    handleSave,
    updateTitle,
    addTodo,
    deleteTodo,
    editTodo,
    toggleTodo,
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


  const handleBackdropClick = () => {
    if (hasUnsavedChanges) {
      handleSave();
    } else {
      if (onClose) onClose();
    }
  };


  const cardContent = (
    <div
      className={`p-[6px] rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.25)] opacity-[0.77] hover:opacity-90 transition-all cursor-pointer w-full ${isBeingEdited ? 'invisible' : ''}`}
      style={{
        background:
          'linear-gradient(135deg, rgba(255, 255, 255, 1.0) 0%, rgba(255, 255, 255, 1.0) 77.404%, rgba(102, 102, 102, 1.0) 100%)',
      }}
      onClick={isBeingEdited ? undefined : () => {
        // General click handler - defaults to title focus
        if (!isModal && onCardClick && initialData) {
          onCardClick(initialData, 'title');
        }
      }}
    >
      <div
        data-testid="todoCard"
        className="p-8 rounded-[14px] backdrop-blur-[30px] flex flex-col relative min-h-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(255, 95, 95, 0.4) 0%, rgba(255, 95, 95, 0.1) 100%)',
        }}
      >
        <input
          ref={titleInputRef}
          type="text"
          placeholder="Enter a title..."
          value={title}
          onChange={isBeingEdited ? undefined : (e) => updateTitle(e.target.value)}
          onClick={isBeingEdited ? undefined : (e) => {
            if (!isModal && onCardClick && initialData) {
              e.stopPropagation();
              onCardClick(initialData, 'title');
            }
          }}
          className="w-full bg-transparent border-none outline-none font-semibold text-[23px] tracking-[3px] text-[#3D3D3D] placeholder-[#3D3D3D]/60 mb-2"
          data-testid="todoCard-title-input"
          readOnly={isBeingEdited}
        />
        <div data-testid="todoItem-list" className="space-y-1 flex-1">
          {todos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              inputRef={(ref: HTMLInputElement | null) => {
                setTodoItemRef(index, ref);
              }}
              onClick={isBeingEdited ? undefined : () => {
                if (!isModal && onCardClick && initialData) {
                  onCardClick(initialData, { type: 'todo', index });
                }
              }}
              onDelete={isBeingEdited ? () => {} : (todoId) => {
                deleteTodo(todoId);
                // Trigger auto-save when not in modal mode
                if (!isModal) {
                  triggerAutoSave();
                }
              }}
              onEdit={isBeingEdited ? () => {} : (todoId, newTask) => {
                editTodo(todoId, newTask);
                // Trigger auto-save when not in modal mode
                if (!isModal) {
                  triggerAutoSave();
                }
              }}
              onToggle={isBeingEdited ? () => {} : (todoId) => {
                toggleTodo(todoId);
                // Trigger auto-save when not in modal mode
                if (!isModal) {
                  triggerAutoSave();
                }
              }}
            />
          ))}
        </div>

        {/* Add todo button */}
        <button
          onClick={isBeingEdited ? undefined : (e) => {
            e.stopPropagation();
            addTodo();
            // Trigger auto-save when not in modal mode
            if (!isModal) {
              triggerAutoSave();
            }
          }}
          className="flex items-center gap-1 text-[#3D3D3D] hover:text-[#3D3D3D]/80 text-[18px] tracking-[3px] transition-colors mt-2 w-full justify-center py-1 rounded hover:bg-white/10"
          title="Add task"
          aria-label="add toDo"
          disabled={isBeingEdited}
        >
          <Icon name="plus" className="w-4 h-4" alt="Add task" />
          <span>Add task</span>
        </button>

        <div className="mt-3 grid grid-cols-9 gap-2" role="toolbar">
          {/* Empty spaces (columns 1-6) */}
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>

          {/* Palette icon (column 7) */}
          <button
            onClick={isBeingEdited ? undefined : (e) => {
              e.stopPropagation();
              // Add palette functionality here
            }}
            className="text-[#3D3D3D] hover:text-[#3D3D3D]/80 transition-colors justify-self-center"
            title="Color palette"
            disabled={isBeingEdited}
          >
            <Icon name="palette" className="w-4 h-4" alt="Color palette" />
          </button>

          {/* Trashcan icon (column 8) */}
          <button
            onClick={isBeingEdited ? undefined : (e) => {
              e.stopPropagation();
              onDelete(initialData?.id || '');
            }}
            className="text-[#3D3D3D] hover:text-red-600 transition-colors justify-self-center"
            title="Delete card"
            disabled={isBeingEdited}
          >
            <Icon name="trash" className="w-4 h-4" alt="Delete card" />
          </button>

          {/* Close/Save button (column 9) */}
          <button
            onClick={isBeingEdited ? undefined : (e) => {
              e.stopPropagation();
              if (isModal) {
                handleSave();
              }
              // In non-modal mode, this acts as a close/save action
              if (!isModal && hasUnsavedChanges) {
                handleSave();
              }
            }}
            className="text-[#3D3D3D] hover:text-[#3D3D3D]/80 text-[18px] tracking-[3px] font-medium transition-colors justify-self-center"
            title={isModal ? 'Save changes' : 'Close'}
            disabled={isBeingEdited || (isModal && !hasUnsavedChanges)}
          >
            {isModal ? 'Save' : 'Close'}
          </button>

          {/* Second row - empty spaces for alignment */}
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>

          {/* Date modified text (column 9, row 2) */}
          <div className="text-[8px] tracking-[2px] text-[#3D3D3D] justify-self-center">
            Edited{' '}
            {initialData?.updatedAt
              ? new Date(initialData.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : 'Jul 17'}
          </div>
        </div>
      </div>
    </div>
  );

  // If in modal mode, wrap with modal backdrop
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

  // Otherwise, return just the card content
  return cardContent;
};
