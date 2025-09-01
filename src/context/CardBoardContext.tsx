import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type {
  TodoCardData,
  CardBoardContextType,
} from '../types';

const CardBoardContext = createContext<CardBoardContextType | undefined>(undefined);

const STORAGE_KEY = 'todoCards';
const loadCards = () => { 
  try { 
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').map((c: TodoCardData) => ({
      ...c, 
      updatedAt: new Date(c.updatedAt)
    })); 
  } catch { 
    return []; 
  } 
};
const saveCards = (cards: TodoCardData[]) => { 
  try { 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards)); 
  } catch {
    // Silent fail for storage unavailability
  } 
};

export const CardBoardProvider = ({ children }: { children: React.ReactNode }) => {
  const [todoCards, setTodoCards] = useState<TodoCardData[]>(loadCards);

  const upsertCard = useCallback((cardData: TodoCardData) => {
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
  }, []);

  const deleteCard = useCallback((cardId: string) => {
    setTodoCards((prev) => prev.filter((card) => card.id !== cardId));
  }, []);

  useEffect(() => {
    saveCards(todoCards);
  }, [todoCards]);


  const value = useMemo(() => ({
    todoCards,
    upsertCard,
    deleteCard,
  }), [todoCards, upsertCard, deleteCard]);

  return <CardBoardContext.Provider value={value}>{children}</CardBoardContext.Provider>;
};

export const useCardBoardContext = () => {
  const context = useContext(CardBoardContext);
  if (context === undefined) {
    throw new Error('useCardBoardContext must be used within a CardBoardProvider');
  }
  return context;
};
