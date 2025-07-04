import { useState } from 'react';
import { TodoItem } from './TodoItem';
import type { TodoCardProps, TodoCardData } from '../types';

export const TodoCard = ({
  initialData,
  onSave,
  onDelete,
  onAddTodo,
}: TodoCardProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [todos, setTodos] = useState(
    initialData?.todos || [
      { id: crypto.randomUUID(), task: '', completed: false },
    ]
  );

  const handleSave = () => {
    const cardData: TodoCardData = {
      id: initialData?.id || crypto.randomUUID(),
      title: title, // Use the form input value
      todos: todos,
      priority: initialData?.priority || 'medium',
      updatedAt: new Date(),
    };
    onSave(cardData); // Pass the complete object
  };
  return (
    <div data-testid="todoCard">
      <input
        type="text"
        placeholder="Enter a title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        data-testid="todoCard-title-input"
      />
      <div data-testid="todoItem-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={() => {}}
            onEdit={(todoId, newTask) => {
              setTodos((prev) =>
                prev.map((t) => (t.id === todoId ? { ...t, task: newTask } : t))
              );
            }}
            onToggle={() => {}}
          />
        ))}
      </div>
      <button onClick={() => onAddTodo(initialData?.id || '')}>+</button>
      <div role="toolbar">
        <button onClick={handleSave}>Save</button>
        <button onClick={() => onDelete(initialData?.id || '')}>Delete</button>
      </div>
    </div>
  );
};
