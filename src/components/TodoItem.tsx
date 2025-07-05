import type { TodoItemProps } from '../types';
import type { KeyboardEvent, ChangeEvent } from 'react';
import { useState, useEffect } from 'react';

export const TodoItem = ({
  todo,
  onDelete,
  onToggle,
  onEdit,
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
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <input
        type="text"
        value={TodoValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setTodoValue(e.target.value)
        }
        onKeyDown={handleEnterKey}
        onBlur={handleBlur}
        placeholder="add task"
      />
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
};
