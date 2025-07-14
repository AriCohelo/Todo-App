import type { TodoItemProps } from '../types';
import type { KeyboardEvent, ChangeEvent } from 'react';
import { useState, useEffect } from 'react';

export const TodoItem = ({
  todo,
  onDelete,
  onToggle,
  onEdit,
  inputRef,
  onClick,
}: TodoItemProps) => {
  const [TodoValue, setTodoValue] = useState(todo.task);

  // Sync internal state with prop changes
  useEffect(() => {
    setTodoValue(todo.task);
  }, [todo.task]);

  const handleEnterKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEdit(todo.id, TodoValue);
    }
  };

  const handleBlur = () => {
    onEdit(todo.id, TodoValue);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={(e) => {
          e.stopPropagation();
          onToggle(todo.id);
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex-shrink-0 w-4 h-4 rounded border border-zinc-500 bg-zinc-800 text-zinc-400 focus:ring-0 focus:border-zinc-400 checked:bg-zinc-800 checked:border-zinc-400 accent-zinc-400"
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
        value={TodoValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setTodoValue(e.target.value)
        }
        onKeyDown={handleEnterKey}
        onBlur={handleBlur}
        onClick={(e) => {
          if (onClick) {
            e.stopPropagation();
            onClick();
          }
        }}
        placeholder="add task"
        className={`flex-1 bg-transparent border-none outline-none text-sm min-w-0 ${
          todo.completed ? 'line-through text-zinc-500' : 'no-underline'
        }`}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(todo.id);
        }}
        className="flex-shrink-0 text-zinc-400 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-900/20"
        title="Delete item"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
