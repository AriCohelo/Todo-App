import { useState, useEffect } from 'react';
import type { TodoCardData } from '../types';
import { useTodoContext } from '../context/TodoContext';
import { createEmptyCard } from '../utils/todoHelpers';
import { getRandomColor } from '../constants/colors';

export const useModalCardEdit = ({ cardId }: { cardId?: string }) => {
  const { todoCards } = useTodoContext();

  const initialData = cardId
    ? todoCards.find((card) => card.id === cardId)
    : undefined;

  const [workingCard, setWorkingCard] = useState<TodoCardData>(
    () => initialData || createEmptyCard(getRandomColor())
  );

  useEffect(() => {
    const card = cardId
      ? todoCards.find((card) => card.id === cardId)
      : undefined;
    if (card) {
      setWorkingCard(card);
    }
  }, [cardId, todoCards]);

  const currentSavedCard = todoCards.find((card) => card.id === workingCard.id);

  const hasUnsavedChanges = currentSavedCard
    ? JSON.stringify(workingCard) !== JSON.stringify(currentSavedCard)
    : true;

  return {
    currentCard: workingCard,
    hasUnsavedChanges,
    updateCard: setWorkingCard,
  };
};
