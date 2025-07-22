import type { TodoItemProps } from '../types';
import { useInputValue } from '../hooks/useInputValue';
import { Icon } from './Icon';

export const TodoItem = ({
  todo,
  onDelete,
  onToggle,
  onEdit,
  onReorder,
  inputRef,
  onClick,
  index,
  isBeingEdited = false,
  autoSave,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDragEnd,
  isBeingDragged = false,
  isDropTarget = false,
}: TodoItemProps) => {
  const { value, handleChange, handleEnterKey, handleBlur } = useInputValue({
    initialValue: todo.task,
    onSave: (value) => {
      if (!isBeingEdited) {
        onEdit(todo.id, value);
        autoSave?.();
      }
    },
  });

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver?.();
  };

  const handleDragLeave = () => {
    onDragLeave?.();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (draggedIndex !== index && onReorder && !isBeingEdited) {
      onReorder(draggedIndex, index);
      autoSave?.();
    }
  };

  const handleDragEnd = () => {
    onDragEnd?.();
  };

  return (
    <div 
      className={`flex items-center gap-2 w-full ${isBeingEdited ? '' : 'transition-all duration-200'} ${
        isBeingDragged ? 'opacity-50' : ''
      } ${
        isDropTarget ? 'mt-12 relative before:content-["Drop_here"] before:absolute before:-top-10 before:left-0 before:right-0 before:h-8 before:bg-gray-100/50 before:border-2 before:border-dashed before:border-gray-300 before:rounded-md before:flex before:items-center before:justify-center before:text-xs before:text-gray-400' : ''
      }`}
      draggable={true}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
    >
      <Icon name="grabber" className={`w-4 h-4 cursor-grab active:cursor-grabbing hover:opacity-80 ${isBeingEdited ? '' : 'transition-all'}`} alt="grab and drag todoItem" />

      <div
        className="flex-shrink-0 w-3 h-3 cursor-pointer"
        onClick={(e) => {
          if (!isBeingEdited) {
            e.stopPropagation();
            onToggle(todo.id);
            autoSave?.();
          }
        }}
      >
        <Icon
          name={todo.completed ? 'checkbox-checked' : 'checkbox-empty'}
          className={`w-3 h-3 hover:opacity-80 ${isBeingEdited ? '' : 'transition-all'}`}
          alt={todo.completed ? 'Completed task' : 'Uncompleted task'}
        />
      </div>
      <input
        ref={(ref) => {
          if (typeof inputRef === 'function') {
            inputRef(ref);
          } else if (inputRef && 'current' in inputRef && ref) {
            inputRef.current = ref;
          }
        }}
        type="text"
        value={value}
        onChange={isBeingEdited ? undefined : handleChange}
        onKeyDown={isBeingEdited ? undefined : handleEnterKey}
        onBlur={isBeingEdited ? undefined : handleBlur}
        readOnly={isBeingEdited}
        onClick={(e) => {
          if (onClick && !isBeingEdited) {
            e.stopPropagation();
            onClick();
          }
        }}
        placeholder="Add task"
        className={`flex-1 bg-transparent border-none outline-none text-[18px] tracking-[3px] text-gray-700 min-w-0 ${
          todo.completed ? 'line-through text-gray-700/50' : 'no-underline'
        }`}
      />
      <button
        onClick={(e) => {
          if (!isBeingEdited) {
            e.stopPropagation();
            onDelete(todo.id);
            autoSave?.();
          }
        }}
        className={`flex-shrink-0 text-gray-700 hover:text-red-600 ${isBeingEdited ? '' : 'transition-colors'} p-1 rounded hover:bg-white/10 cursor-pointer`}
        title="Delete item"
        disabled={isBeingEdited}
      >
        <Icon name="x" className={`w-4 h-4 hover:opacity-80 ${isBeingEdited ? '' : 'transition-all'}`} alt="Delete item" />
      </button>
    </div>
  );
};
