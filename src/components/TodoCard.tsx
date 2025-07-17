import { TodoItem } from './TodoItem';
import { useFormState } from '../hooks/useFormState';
import { useFocusManagement } from '../hooks/useFocusManagement';
import { useKeyboardEvents } from '../hooks/useKeyboardEvents';
import { useAutoSave } from '../hooks/useAutoSave';
// import { usePriorityColors } from '../hooks/usePriorityColors';
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

  // const { cardBackgroundColor } = usePriorityColors({
  //   priority: initialData?.priority || 'medium',
  // });

  const handleBackdropClick = () => {
    if (hasUnsavedChanges) {
      handleSave();
    } else {
      if (onClose) onClose();
    }
  };

  // If being edited, render invisible placeholder
  if (isBeingEdited) {
    return (
      <div
        data-testid="todoCard"
        className="p-[6px] rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.25)] opacity-[0.77] invisible w-full"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 1.0) 0%, rgba(255, 255, 255, 1.0) 77.404%, rgba(102, 102, 102, 1.0) 100%)'
        }}
      >
        <div 
          className="p-8 rounded-[14px] backdrop-blur-[30px] flex flex-col relative min-h-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 95, 95, 0.4) 0%, rgba(255, 95, 95, 0.1) 100%)'
          }}
        >
        <input
          type="text"
          placeholder="Enter a title..."
          value={title}
          className="w-full bg-transparent border-none outline-none font-semibold text-[23px] tracking-[3px] text-[#3D3D3D] placeholder-[#3D3D3D]/60 mb-2"
          readOnly
        />
        <div className="space-y-1 flex-1">
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-center gap-2 w-full">
              <input type="checkbox" className="flex-shrink-0 w-3 h-3 border-2 border-[#3D3D3D] rounded-sm" readOnly />
              <input
                type="text"
                value={todo.task}
                className="flex-1 bg-transparent border-none outline-none text-[18px] tracking-[3px] text-[#3D3D3D] min-w-0"
                readOnly
              />
            </div>
          ))}
        </div>
        <button className="flex items-center gap-1 text-[#3D3D3D] text-[18px] tracking-[3px] transition-colors mt-2 w-full justify-center py-1 rounded">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add task</span>
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
        
        {/* Date modified text - positioned to overlap padding */}
        <div className="mt-1 text-right -mb-6 -mr-6 text-[8px] tracking-[2px] text-[#3D3D3D]">
          Edited Jul 17
        </div>
        </div>
      </div>
    );
  }

  const cardContent = (
    <div
      className="p-[6px] rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.25)] opacity-[0.77] hover:opacity-90 transition-all cursor-pointer w-full"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 1.0) 0%, rgba(255, 255, 255, 1.0) 77.404%, rgba(102, 102, 102, 1.0) 100%)'
      }}
      onClick={() => {
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
          background: 'linear-gradient(135deg, rgba(255, 95, 95, 0.4) 0%, rgba(255, 95, 95, 0.1) 100%)'
        }}
      >
      <input
        ref={titleInputRef}
        type="text"
        placeholder="Enter a title..."
        value={title}
        onChange={(e) => updateTitle(e.target.value)}
        onClick={(e) => {
          if (!isModal && onCardClick && initialData) {
            e.stopPropagation();
            onCardClick(initialData, 'title');
          }
        }}
        className="w-full bg-transparent border-none outline-none font-semibold text-[23px] tracking-[3px] text-[#3D3D3D] placeholder-[#3D3D3D]/60 mb-2"
        data-testid="todoCard-title-input"
      />
      <div data-testid="todoItem-list" className="space-y-1 flex-1">
        {todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            inputRef={(ref: HTMLInputElement | null) => {
              setTodoItemRef(index, ref);
            }}
            onClick={() => {
              if (!isModal && onCardClick && initialData) {
                onCardClick(initialData, { type: 'todo', index });
              }
            }}
            onDelete={(todoId) => {
              deleteTodo(todoId);
              // Trigger auto-save when not in modal mode
              if (!isModal) {
                triggerAutoSave();
              }
            }}
            onEdit={(todoId, newTask) => {
              editTodo(todoId, newTask);
              // Trigger auto-save when not in modal mode
              if (!isModal) {
                triggerAutoSave();
              }
            }}
            onToggle={(todoId) => {
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
        onClick={(e) => {
          e.stopPropagation();
          addTodo();
          // Trigger auto-save when not in modal mode
          if (!isModal) {
            triggerAutoSave();
          }
        }}
        className="flex items-center gap-1 text-[#3D3D3D] hover:text-[#3D3D3D]/80 text-[18px] tracking-[3px] transition-colors mt-2 w-full justify-center py-1 rounded hover:bg-white/10"
        title="Add task"
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
        <span>Add task</span>
      </button>

      <div className="mt-3 flex items-center justify-between" role="toolbar">
        <div></div>

        <div className="flex items-center">
          {/* Palette icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Add palette functionality here
            }}
            className="text-[#3D3D3D] hover:text-[#3D3D3D]/80 transition-colors"
            title="Color palette"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <g clipPath="url(#clip0_25_24)">
                <path d="M5.33331 7C5.33331 7.55227 4.8856 8 4.33331 8C3.78103 8 3.33331 7.55227 3.33331 7C3.33331 6.44771 3.78103 6 4.33331 6C4.8856 6 5.33331 6.44771 5.33331 7Z" fill="#3D3D3D"/>
                <path d="M7 5.33334C7.55227 5.33334 8 4.88563 8 4.33334C8 3.78106 7.55227 3.33334 7 3.33334C6.44771 3.33334 6 3.78106 6 4.33334C6 4.88563 6.44771 5.33334 7 5.33334Z" fill="#3D3D3D"/>
                <path d="M11.3333 4.33334C11.3333 4.88563 10.8856 5.33334 10.3333 5.33334C9.78105 5.33334 9.33331 4.88563 9.33331 4.33334C9.33331 3.78106 9.78105 3.33334 10.3333 3.33334C10.8856 3.33334 11.3333 3.78106 11.3333 4.33334Z" fill="#3D3D3D"/>
                <path d="M5 11.3333C5.55229 11.3333 6 10.8856 6 10.3333C6 9.78108 5.55229 9.33334 5 9.33334C4.44771 9.33334 4 9.78108 4 10.3333C4 10.8856 4.44771 11.3333 5 11.3333Z" fill="#3D3D3D"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M0.666687 7.99999C0.666687 3.9499 3.94993 0.666656 8.00002 0.666656C11.9808 0.666656 15.3334 3.56613 15.3334 7.33332V7.34306C15.3334 7.69532 15.3334 8.29719 15.1217 8.99912C14.5668 10.8383 12.5469 11.3309 10.9966 10.9349C10.674 10.8525 10.3496 10.7633 10.0379 10.6738C9.50082 10.5194 9.01182 10.9931 9.11075 11.4877L9.32249 12.5465L9.39889 13.0045C9.59689 14.1927 8.66795 15.401 7.34435 15.2332C5.10015 14.9487 3.41323 14.0671 2.29065 12.7553C1.1715 11.4473 0.666687 9.77419 0.666687 7.99999ZM8.00002 1.99999C4.68631 1.99999 2.00002 4.68628 2.00002 7.99999C2.00002 9.52359 2.43117 10.8687 3.30372 11.8884C4.17285 12.9041 5.53335 13.6596 7.51209 13.9105C7.82315 13.9499 8.15655 13.661 8.08369 13.2237L8.01089 12.7869L7.80329 11.7491C7.49782 10.2217 8.96155 8.97712 10.4062 9.39232C10.708 9.47906 11.0194 9.56459 11.3265 9.64306C12.5172 9.94719 13.583 9.48326 13.8452 8.61399C13.998 8.10732 14 7.67059 14 7.33332C14 4.43385 11.383 1.99999 8.00002 1.99999Z" fill="#3D3D3D"/>
              </g>
              <defs>
                <clipPath id="clip0_25_24">
                  <rect width="16" height="16" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>

          {/* 7px gap */}
          <div className="w-[7px]"></div>

          {/* Trashcan icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(initialData?.id || '');
            }}
            className="text-[#3D3D3D] hover:text-red-600 transition-colors"
            title="Delete card"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M12.272 5.37602H3.72801C3.60001 5.37602 3.48801 5.42402 3.39201 5.52002C3.29601 5.61601 3.24801 5.72801 3.24801 5.85602L3.85601 13.936C3.86667 14.0747 3.93067 14.1893 4.04801 14.28C4.16534 14.3707 4.32534 14.416 4.52801 14.416H11.472C11.664 14.416 11.8187 14.3707 11.936 14.28C12.0533 14.1893 12.1227 14.0747 12.144 13.936L12.752 5.85602C12.752 5.72801 12.704 5.61601 12.608 5.52002C12.512 5.42402 12.4 5.37602 12.272 5.37602ZM5.50401 13.456C5.39734 13.456 5.30134 13.408 5.21601 13.312C5.13067 13.216 5.08801 13.104 5.08801 12.976L4.67201 6.80001C4.67201 6.67202 4.72001 6.56268 4.81601 6.47201C4.91201 6.38135 5.02401 6.33602 5.15201 6.33602C5.28001 6.33602 5.39201 6.38135 5.48801 6.47201C5.58401 6.56268 5.63201 6.67202 5.63201 6.80001L5.92001 12.976C5.92001 13.104 5.88001 13.216 5.80001 13.312C5.72001 13.408 5.62134 13.456 5.50401 13.456ZM8.41601 12.96C8.41601 13.0987 8.37601 13.216 8.296 13.312C8.216 13.408 8.11734 13.456 8.00001 13.456C7.88267 13.456 7.78401 13.408 7.70401 13.312C7.624 13.216 7.584 13.0987 7.584 12.96L7.52001 6.80001C7.52001 6.67202 7.56801 6.56268 7.664 6.47201C7.76 6.38135 7.872 6.33602 8.00001 6.33602C8.12801 6.33602 8.24001 6.38135 8.33601 6.47201C8.432 6.56268 8.48 6.67202 8.48 6.80001L8.41601 12.96ZM10.912 12.976C10.912 13.104 10.8693 13.216 10.784 13.312C10.6987 13.408 10.6027 13.456 10.496 13.456C10.3787 13.456 10.28 13.408 10.2 13.312C10.12 13.216 10.08 13.104 10.08 12.976L10.368 6.80001C10.368 6.67202 10.416 6.56268 10.512 6.47201C10.608 6.38135 10.72 6.33602 10.848 6.33602C10.976 6.33602 11.088 6.38135 11.184 6.47201C11.28 6.56268 11.328 6.67202 11.328 6.80001L10.912 12.976ZM12.528 3.29602L9.664 2.81602C9.53601 2.79468 9.45601 2.71468 9.42401 2.57601L9.296 2.04801C9.25334 1.83468 9.17867 1.69601 9.072 1.63201C9.00801 1.60001 8.89067 1.58401 8.72001 1.58401H7.28C7.10934 1.58401 6.98667 1.60001 6.912 1.63201C6.80534 1.69601 6.73601 1.83468 6.70401 2.04801L6.57601 2.57601C6.55467 2.71468 6.47467 2.79468 6.33601 2.81602L3.47201 3.29602C3.26934 3.32801 3.10134 3.40535 2.96801 3.52802C2.83467 3.65068 2.76801 3.80268 2.76801 3.98401V4.43201C2.76801 4.52802 2.80267 4.60802 2.87201 4.67201C2.94134 4.73602 3.02401 4.76802 3.12001 4.76802H12.88C12.976 4.76802 13.0587 4.73602 13.128 4.67201C13.1973 4.60802 13.232 4.52802 13.232 4.43201V3.98401C13.232 3.80268 13.1653 3.65068 13.032 3.52802C12.8987 3.40535 12.7307 3.32801 12.528 3.29602Z" fill="#3D3D3D"/>
            </svg>
          </button>

          {/* 13px gap */}
          <div className="w-[13px]"></div>

          {/* Close/Save button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isModal) {
                handleSave();
              }
              // In non-modal mode, this acts as a close/save action
              if (!isModal && hasUnsavedChanges) {
                handleSave();
              }
            }}
            className="text-[#3D3D3D] hover:text-[#3D3D3D]/80 text-[18px] tracking-[3px] font-medium transition-colors"
            title={isModal ? "Save changes" : "Close"}
          >
            Close
          </button>
        </div>
      </div>

      {/* Date modified text - positioned to overlap padding */}
      <div className="mt-1 text-right -mb-6 -mr-6 text-[8px] tracking-[2px] text-[#3D3D3D]">
        Edited {initialData?.updatedAt 
          ? new Date(initialData.updatedAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })
          : 'Jul 17'
        }
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
