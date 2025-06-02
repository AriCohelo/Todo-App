// Todo related types
export interface Todo {
  id: string;
  userId: string;
  task: string;
  completed: boolean;
  category?: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string, newTask: string) => void;
}

// User related types
export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
} 