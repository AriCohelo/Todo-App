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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSave = () => {
    const cardData: TodoCardData = {
      id: initialData?.id || crypto.randomUUID(),
      title: title,
      todos: todos,
      priority: initialData?.priority || 'medium',
      updatedAt: new Date(),
    };
    onSave(cardData);
    setHasUnsavedChanges(false);
  };

  return (
    <div data-testid="todoCard">
      <input
        type="text"
        placeholder="Enter a title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setHasUnsavedChanges(true);
        }}
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
              setHasUnsavedChanges(true);
            }}
            onToggle={(todoId) => {
              setTodos((prev) =>
                prev.map((t) =>
                  t.id === todoId ? { ...t, completed: !t.completed } : t
                )
              );
              setHasUnsavedChanges(true);
            }}
          />
        ))}
      </div>
      <button
        data-testid="todoCard-save-btn"
        onClick={() => {
          onAddTodo(initialData?.id || '');
          setHasUnsavedChanges(true);
        }}
      >
        +
      </button>
      <div role="toolbar">
        <button onClick={handleSave} disabled={!hasUnsavedChanges}>
          Save
        </button>
        <button onClick={() => onDelete(initialData?.id || '')}>Delete</button>
      </div>
    </div>
  );
};
