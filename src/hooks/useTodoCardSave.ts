import { useState, useEffect } from 'react';
import type { TodoCardData, UseModalCardEditProps } from '../types';
import { createEmptyCard } from '../utils/todoHelpers';
import { getRandomColor } from '../constants/colors';

export const useModalCardEdit = ({
  initialData,
}: UseModalCardEditProps) => {
  const [newCard] = useState<TodoCardData>(() =>
    createEmptyCard(getRandomColor())
  );
  const [workingCard, setWorkingCard] = useState<TodoCardData>(
    initialData || newCard
  );

  useEffect(() => {
    if (initialData) {
      setWorkingCard(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      setWorkingCard(newCard);
    };
  }, [newCard]);

  const hasUnsavedChanges = !initialData
    ? JSON.stringify(workingCard) !== JSON.stringify(newCard)
    : JSON.stringify(workingCard) !== JSON.stringify(initialData);

  const updateCard = (updatedCard: TodoCardData) => {
    setWorkingCard(updatedCard);
  };

  const saveChanges = (onSave: (card: TodoCardData) => void) => {
    onSave(workingCard);
  };

  return {
    currentCard: workingCard,
    hasUnsavedChanges,
    updateCard,
    saveChanges,
  };
};
