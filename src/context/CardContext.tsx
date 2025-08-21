import { createContext, useContext, useState } from 'react';
import type {
  TodoCardData,
  CardContextType,
} from '../types';

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider = ({ children }: { children: React.ReactNode }) => {
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


  const value: CardContextType = {
    todoCards,
    upsertCard,
    deleteCard,
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  return context;
};
