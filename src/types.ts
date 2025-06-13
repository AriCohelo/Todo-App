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
  onClick?: () => void;
}

export interface TodoListProps {
  onSave?: (todoListData: TodoList) => void;
  initialData?: TodoList;
  readOnly?: boolean;
}