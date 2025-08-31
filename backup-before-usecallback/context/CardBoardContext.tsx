import { createContext, useContext, useState } from 'react';
import type {
  TodoCardData,
  CardBoardContextType,
} from '../types';

const CardBoardContext = createContext<CardBoardContextType | undefined>(undefined);

export const CardBoardProvider = ({ children }: { children: React.ReactNode }) => {
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


  const value: CardBoardContextType = {
    todoCards,
    upsertCard,
    deleteCard,
  };

  return <CardBoardContext.Provider value={value}>{children}</CardBoardContext.Provider>;
};

export const useCardBoardContext = () => {
  const context = useContext(CardBoardContext);
  if (context === undefined) {
    throw new Error('useCardBoardContext must be used within a CardBoardProvider');
  }
  return context;
};
