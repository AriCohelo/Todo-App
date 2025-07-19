import type { TodoItemProps } from '../types';
import { useInputValue } from '../hooks/useInputValue';
import { Icon } from './Icon';

export const TodoItem = ({
  todo,
  onDelete,
  onToggle,
  onEdit,
  inputRef,
  onClick,
}: TodoItemProps) => {
  const { value, handleChange, handleEnterKey, handleBlur } = useInputValue({
    initialValue: todo.task,
    onSave: (value) => onEdit(todo.id, value),
  });

  return (
    <div className="flex items-center gap-2 w-full">
      <Icon name="grabber" className="w-4 h-4" alt="grab and drag todoItem" />

      <Icon
        name={todo.completed ? 'checkbox-checked' : 'checkbox-empty'}
        className="flex-shrink-0 w-3 h-3 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(todo.id);
        }}
        alt={todo.completed ? 'Completed task' : 'Uncompleted task'}
      />
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
        onChange={handleChange}
        onKeyDown={handleEnterKey}
        onBlur={handleBlur}
        onClick={(e) => {
          if (onClick) {
            e.stopPropagation();
            onClick();
          }
        }}
        placeholder="Add task"
        className={`flex-1 bg-transparent border-none outline-none text-[18px] tracking-[3px] text-[#3D3D3D] min-w-0 ${
          todo.completed ? 'line-through text-[#3D3D3D]/50' : 'no-underline'
        }`}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(todo.id);
        }}
        className="flex-shrink-0 text-[#3D3D3D] hover:text-red-600 transition-colors p-1 rounded hover:bg-white/10 cursor-pointer"
        title="Delete item"
      >
        <Icon name="x" className="w-4 h-4" alt="Delete item" />
      </button>
    </div>
  );
};
