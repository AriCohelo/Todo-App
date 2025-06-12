// Todo related types
export interface Todo {
  id: string;
  task: string;
  completed: boolean;
  category?: string;
}

export interface TodoList {
  id: string;
  title: string;
  todos: Todo[];
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string, newTask: string) => void;
}

export interface TodoListProps {
  todoList: TodoList;
  onUpdateList: (updatedList: TodoList) => void;
}

// User related types
export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
} 