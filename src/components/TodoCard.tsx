import { TodoItem } from './TodoItem';
import type { TodoCardProps } from '../types';

export const TodoCard = ({
  initialData,
  onSave,
  onDelete,
  onAddTodo,
}: TodoCardProps) => {
  return (
    <div>
      <input type="text" placeholder="Enter a title" />

      <div data-testid="todo-list-container">
        {initialData?.todos.length ? (
          initialData.todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={() => {}}
              onEdit={() => {}}
              onToggle={() => {}}
            />
          ))
        ) : (
          <TodoItem
            todo={{ id: '', task: '', completed: false }}
            onDelete={() => {}}
            onToggle={() => {}}
            onEdit={() => {}}
          />
        )}
      </div>
      <button onClick={() => onAddTodo(initialData?.id || '')}>+</button>
      <div role="toolbar">
        <button onClick={() => onSave(initialData?.id || '')}>Save</button>
        <button onClick={() => onDelete(initialData?.id || '')}>Delete</button>
      </div>
    </div>
  );
};
