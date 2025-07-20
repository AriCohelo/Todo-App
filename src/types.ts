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
  onReorder?: (fromIndex: number, toIndex: number) => void;
  inputRef?: React.RefObject<HTMLInputElement> | ((ref: HTMLInputElement | null) => void);
  onClick?: () => void;
  index: number;
}

export interface TodoCardData {
  id: string;
  title: string;
  todos: Todo[];
  updatedAt: Date;
  backgroundColor?: string;
}

export interface TodoCardProps {
  initialData?: TodoCardData;
  onSave: (cardData: TodoCardData) => void;
  onDelete: (cardId: string) => void;
  isModal?: boolean;
  onClose?: () => void;
  focusTarget?: FocusTarget;
  onCardClick?: (card: TodoCardData, focusTarget?: FocusTarget) => void;
  isBeingEdited?: boolean;
}

// TodoBoard and TodoTrigger no longer need props - they use context

export type FocusTarget = 'title' | 'new-todo' | { type: 'todo'; index: number };
