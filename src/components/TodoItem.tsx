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
  showCheckbox = true,
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
    <div>
      {showCheckbox && (
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
      )}
      <input
        ref={(ref) => {
          if (typeof inputRef === 'function') {
            inputRef(ref);
          } else if (inputRef && 'current' in inputRef) {
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
      />
      <button onClick={(e) => {
        e.stopPropagation();
        onDelete(todo.id);
      }}>Delete</button>
    </div>
  );
};
