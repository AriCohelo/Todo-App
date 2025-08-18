import { createContext, useContext, useState } from 'react';
import type {
  TodoCardData,
  TodoContextType,
  TodoProviderProps,
} from '../types';

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: TodoProviderProps) => {
  const [todoCards, setTodoCards] = useState<TodoCardData[]>([]);

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
        return [{ ...cardData, updatedAt: new Date() }, ...prev];
      }
    });
  };

  const deleteCard = (cardId: string) => {
    setTodoCards((prev) => prev.filter((card) => card.id !== cardId));
  };


  const value: TodoContextType = {
    todoCards,
    upsertCard,
    deleteCard,
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
