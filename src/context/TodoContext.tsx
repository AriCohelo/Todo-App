import { createContext, useContext, useState, ReactNode } from 'react';
import type { TodoCardData, FocusTarget } from '../types';

interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | null;
  editingCardId?: string;
  focusTarget?: FocusTarget;
}

interface TodoContextType {
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

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider = ({ children }: TodoProviderProps) => {
  const [todoCards, setTodoCards] = useState<TodoCardData[]>([]);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: null,
    editingCardId: undefined,
    focusTarget: undefined,
  });

  const createCard = (cardData: TodoCardData) => {
    setTodoCards((prev) => [...prev, cardData]);
  };

  const updateCard = (cardData: TodoCardData) => {
    setTodoCards((prev) =>
      prev.map((card) => (card.id === cardData.id ? cardData : card))
    );
  };

  const deleteCard = (cardId: string) => {
    setTodoCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  const openCreateModal = (focusTarget?: FocusTarget) => {
    setModalState({
      isOpen: true,
      mode: 'create',
      editingCardId: undefined,
      focusTarget: focusTarget || 'title',
    });
  };

  const openEditModal = (card: TodoCardData, focusTarget?: FocusTarget) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      editingCardId: card.id,
      focusTarget: focusTarget || 'title',
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: null,
      editingCardId: undefined,
      focusTarget: undefined,
    });
  };

  const value: TodoContextType = {
    todoCards,
    modalState,
    createCard,
    updateCard,
    deleteCard,
    openCreateModal,
    openEditModal,
    closeModal,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};