import type { TodoItemProps } from '../types';
import { useState, useEffect, memo } from 'react';
import { Icon } from './Icon';

export const TodoItem = memo(({
  todo,
  onDelete,
  onToggle,
  onEdit,
  inputRef,
  onClick,
}: TodoItemProps) => {
  const [value, setValue] = useState(todo.task);

  useEffect(() => {
    setValue(todo.task);
  }, [todo.task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onEdit?.(todo.id, e.target.value);
  };

  const handleBlur = () => {
    onEdit?.(todo.id, value);
  };

  const handleClick = (action: () => void) => (e: React.MouseEvent) => {
    // Allow drag events from grabber, but block other event bubbling
    if (!(e.target as HTMLElement).closest('[data-drag-handle]')) {
      e.stopPropagation();
    }
    action();
  };


  return (
    <div className="flex items-center gap-1 w-full">
      <Icon
        name="grabber"
        className="w-4 h-4 cursor-grab active:cursor-grabbing hover:opacity-80"
        alt="grab and drag todoItem"
      />

      <div
        className="flex-shrink-0 w-3 h-3 cursor-pointer"
        onClick={handleClick(() => onToggle(todo.id))}
      >
        <Icon
          name={todo.completed ? 'checkbox-checked' : 'checkbox-empty'}
          className="w-3 h-3 hover:opacity-80"
          alt={todo.completed ? 'Completed task' : 'Uncompleted task'}
        />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onClick={onClick ? handleClick(onClick) : undefined}
        placeholder="Add task"
        className={`flex-1 bg-transparent border-none outline-none text-[18px] tracking-[3px] text-gray-700 min-w-0 ${
          todo.completed ? 'line-through text-gray-700/50' : 'no-underline'
        }`}
      />
      <button
        onClick={handleClick(() => onDelete(todo.id))}
        className="flex-shrink-0 text-gray-700 hover:text-red-600 p-1 rounded hover:bg-white/10 cursor-pointer"
        title="Delete item"
      >
        <Icon name="x" className="w-4 h-4 hover:opacity-80" alt="Delete item" />
      </button>
    </div>
  );
});
