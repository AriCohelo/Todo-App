import { createContext, useContext, useState } from 'react';
import type {
  TodoCardData,
  FocusTarget,
  ModalState,
  TodoContextType,
  TodoProviderProps,
} from '../types';

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: TodoProviderProps) => {
  const [todoCards, setTodoCards] = useState<TodoCardData[]>([]);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: null,
    editingCardId: undefined,
    focusTarget: undefined,
  });

  const upsertCard = (cardData: TodoCardData) => {
    setTodoCards((prev) => {
      const existingIndex = prev.findIndex((card) => card.id === cardData.id);
      if (existingIndex >= 0) {
        return prev.map((card, index) =>
          index === existingIndex
            ? { ...cardData, updatedAt: new Date() }
            : card
        );
      } else {
        return [...prev, { ...cardData, updatedAt: new Date() }];
      }
    });
  };

  const deleteCard = (cardId: string) => {
    setTodoCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  const openCreateModal = () => {
    setModalState({
      isOpen: true,
      mode: 'create',
      editingCardId: undefined,
      focusTarget: 'title',
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
    upsertCard,
    deleteCard,
    openCreateModal,
    openEditModal,
    closeModal,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};
