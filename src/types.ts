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
  inputRef?: React.RefObject<HTMLInputElement> | ((ref: HTMLInputElement | null) => void);
  onClick?: () => void;
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
  isModal?: boolean;
  onClose?: () => void;
  focusTarget?: FocusTarget;
  onCardClick?: (card: TodoCardData, focusTarget?: FocusTarget) => void;
}

export interface TodoBoardProps {
  todoCards: TodoCardData[];
  onCardClick: (card: TodoCardData, focusTarget?: FocusTarget) => void;
  onDeleteCard: (cardId: string) => void;
  onUpdateCard: (cardData: TodoCardData) => void;
}

export interface TodoTriggerProps {
  onOpenModal: (focusTarget?: FocusTarget) => void;
}

export type FocusTarget = 'title' | 'new-todo' | { type: 'todo'; index: number };
