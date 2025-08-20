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
  | { type: 'todo'; index: number };

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface TodoCardProps {
  initialData?: TodoCardData;
  onSave?: (cardData: TodoCardData) => void;
  onDelete: (cardId: string) => void;
  isModal?: boolean;
  onClose?: () => void;
  onBackdropClick?: (cardData: TodoCardData) => void;
  focusTarget?: FocusTarget;
  onCardClick?: (focusTarget?: FocusTarget) => void;
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

export interface CardToolbarProps {
  isModal: boolean;
  isBeingEdited: boolean;
  initialData?: TodoCardData;
  backgroundColor: string;
  hasUnsavedChanges: boolean;
  onColorSelect: (color: string) => void;
  onDelete: (cardId: string) => void;
  onClose?: () => void;
  onSave: () => void;
  onColorPickerToggle?: (isOpen: boolean) => void;
  onAddTodo: () => void;
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

export interface UseKeyboardEventsProps {
  isModal: boolean;
  onClose?: () => void;
}

export interface UseInputValueProps {
  initialValue: string;
  onSave: (value: string) => void;
}

export interface UseCardRefsProps {
  isModal: boolean;
  focusTarget?: FocusTarget;
  todos: Todo[];
}

export interface UseTodoCardSaveProps {
  isModal: boolean;
  initialData: TodoCardData | undefined;
  upsertCard: (card: TodoCardData) => void;
}

// =============================================================================
// CONTEXT TYPES
// =============================================================================

export interface TodoContextType {
  // State
  todoCards: TodoCardData[];

  // Actions
  upsertCard: (cardData: TodoCardData) => void;
  deleteCard: (cardId: string) => void;
}

export interface TodoProviderProps {
  children: React.ReactNode;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================
