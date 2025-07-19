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
      className={`p-[6px] rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.25)] opacity-[0.77] hover:opacity-90 transition-all cursor-pointer w-full ${
        isBeingEdited ? 'invisible' : ''
      }`}
      style={{
        background:
          'linear-gradient(135deg, rgba(255, 255, 255, 1.0) 0%, rgba(255, 255, 255, 1.0) 77.404%, rgba(102, 102, 102, 1.0) 100%)',
      }}
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
          className="text-[#3D3D3D] hover:text-[#3D3D3D]/80 transition-colors mt-2 w-8 h-8 rounded hover:bg-white/10 cursor-pointer self-start"
          title="Add task"
          aria-label="add toDo"
          disabled={isBeingEdited}
        >
          <Icon name="add-todoitem" className="w-8 h-8" alt="Add task" />
        </button>
        <div className="text-[8px] tracking-[2px] text-[#3D3D3D] w-full text-right">
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
                  }
            }
            className={`text-[#3D3D3D] hover:text-[#3D3D3D]/80 transition-colors justify-self-end cursor-pointer ${
              isModal ? 'col-start-6' : 'col-start-8'
            }`}
            title="Color palette"
            disabled={isBeingEdited}
          >
            <Icon name="palette" className="w-4 h-4" alt="Color palette" />
          </button>

          <button
            onClick={
              isBeingEdited
                ? undefined
                : (e) => {
                    e.stopPropagation();
                    onDelete(initialData?.id || '');
                  }
            }
            className={`text-[#3D3D3D] hover:text-red-600 transition-colors justify-self-end cursor-pointer ${
              isModal ? 'col-start-7' : 'col-start-9'
            }`}
            title="Delete card"
            disabled={isBeingEdited}
          >
            <Icon name="trash" className="w-4 h-4" alt="Delete card" />
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
              className="text-[#3D3D3D] hover:text-[#3D3D3D]/80 text-[18px] tracking-[3px] font-medium transition-colors justify-self-end cursor-pointer col-start-8 col-span-2"
              title="Save changes"
              disabled={isBeingEdited || !hasUnsavedChanges}
            >
              Save
            </button>
          )}
        </div>
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
