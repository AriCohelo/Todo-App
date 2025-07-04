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

export interface TodoCardData {
  id: string;
  title: string;
  todos: Todo[];
  priority: 'high' | 'medium' | 'low';
  updatedAt: Date;
}

export interface TodoCardProps {
  initialData?: TodoCardData;
  onSave: (cardData: TodoCardData) => void;
  onDelete: (cardId: string) => void;
  onAddTodo: (cardId: string) => void;
  isModal?: boolean;
  onClose?: () => void;
}

export interface TodoBoardProps {
  todoCards: TodoCardData[];
  onCardClick: (card: TodoCardData) => void;
  onDeleteCard: (cardId: string) => void;
  onAddTodo: (cardId: string) => void;
}

export interface TodoTriggerProps {
  onOpenModal: () => void;
}
