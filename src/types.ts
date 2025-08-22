// =============================================================================
// DOMAIN TYPES
// =============================================================================

export interface Todo {
  id: string;
  task: string;
  completed: boolean;
}

export interface TodoCardData {
  id: string;
  title: string;
  todos: Todo[];
  updatedAt: Date;
  backgroundColor: string;
}

export type FocusTarget =
  | 'title'
  | 'new-todo'
  | number;

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface TodoCardDisplayProps {
  cardId: string;
  onCardClick?: (focusTarget: FocusTarget) => void;
}

export interface TodoCardEditorProps {
  cardId: string;
  onClose?: () => void;
  focusTarget?: FocusTarget;
}

export interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string, newTask: string) => void;
  inputRef?:
    | React.RefObject<HTMLInputElement>
    | ((ref: HTMLInputElement | null) => void);
  onClick?: () => void;
  isBeingEdited?: boolean;
}

export interface ColorPickerProps {
  selectedColor?: string;
  onColorSelect: (colorId: string) => void;
  onClose: () => void;
}


export type IconName =
  | 'plus'
  | 'palette'
  | 'trash'
  | 'x'
  | 'grabber'
  | 'checkbox-checked'
  | 'checkbox-empty'
  | 'add-todoitem';

export interface IconProps {
  name: IconName;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
  title?: string;
  alt?: string;
}

// =============================================================================
// HOOK PROPS
// =============================================================================

export interface UseCardRefsProps {
  isModal: boolean;
  focusTarget?: FocusTarget;
  todos: Todo[];
}

// =============================================================================
// CONTEXT TYPES
// =============================================================================

export interface CardContextType {
  // State
  todoCards: TodoCardData[];

  // Actions
  upsertCard: (cardData: TodoCardData) => void;
  deleteCard: (cardId: string) => void;
}
