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
  backgroundColor?: string; // Color ID from CARD_COLORS (e.g. 'rose', 'blue', etc.)
}

export type FocusTarget = 'title' | 'new-todo' | { type: 'todo'; index: number };

// =============================================================================
// COMPONENT PROPS
// =============================================================================

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

export interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (id: string, newTask: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  inputRef?: React.RefObject<HTMLInputElement> | ((ref: HTMLInputElement | null) => void);
  onClick?: () => void;
  index: number;
  isBeingEdited?: boolean;
  autoSave?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: () => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  isBeingDragged?: boolean;
  isDropTarget?: boolean;
  draggedItemIndex?: number | null;
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
  backgroundColor?: string;
  hasUnsavedChanges: boolean;
  onColorSelect: (color: string) => void;
  onDelete: (cardId: string) => void;
  onClose?: () => void;
  onSave: () => void;
  onColorPickerToggle?: (isOpen: boolean) => void;
}

export type IconName = 'plus' | 'palette' | 'trash' | 'x' | 'grabber' | 'checkbox-checked' | 'checkbox-empty' | 'add-todoitem';

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

export interface UseFormStateProps {
  initialData?: TodoCardData;
  onSave: (cardData: TodoCardData) => void;
  isModal: boolean;
  onClose?: () => void;
}

export interface UseFocusManagementProps {
  isModal: boolean;
  focusTarget?: FocusTarget;
  todos: Todo[];
}

export interface UseKeyboardEventsProps {
  isModal: boolean;
  onClose?: () => void;
}

export interface UseAutoSaveProps {
  isModal: boolean;
  hasUnsavedChanges: boolean;
  handleSave: () => void;
}

export interface UseInputValueProps {
  initialValue: string;
  onSave: (value: string) => void;
}

export interface UseCardStateProps {
  initialData?: TodoCardData;
  onSave: (cardData: TodoCardData) => void;
  isModal: boolean;
  onClose?: () => void;
}

export interface UseCardRefsProps {
  isModal: boolean;
  focusTarget?: FocusTarget;
  todos: Todo[];
}

// =============================================================================
// CONTEXT TYPES
// =============================================================================

export interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | null;
  editingCardId?: string;
  focusTarget?: FocusTarget;
}

export interface TodoContextType {
  // State
  todoCards: TodoCardData[];
  modalState: ModalState;
  
  // Actions
  createCard: (cardData: TodoCardData) => void;
  updateCard: (cardData: TodoCardData) => void;
  deleteCard: (cardId: string) => void;
  openCreateModal: (focusTarget?: FocusTarget) => void;
  openEditModal: (card: TodoCardData, focusTarget?: FocusTarget) => void;
  closeModal: () => void;
}

export interface TodoProviderProps {
  children: React.ReactNode;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export interface ColorOption {
  id: string;
  name: string;
  hexColor: string; // For display purposes
  gradientClass: string; // Tailwind gradient class
  borderClass: string; // Border class for the card
}
