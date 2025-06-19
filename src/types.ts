export interface Todo {
  id: string;
  task: string;
  completed: boolean;
}

export interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string, newTask: string) => void;
}

export interface TodoCard {
  id: string;
  title: string;
  todos: Todo[];
  priority: 'high' | 'medium' | 'low';
  updatedAt: Date;
}

export interface TodoCardProps {
  initialData?: TodoCard;
  onSave?: (todoCardData: TodoCard) => void;
  onDelete: (cardId: string) => void;
}
