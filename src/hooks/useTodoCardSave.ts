import { useState, useEffect } from 'react';
import type { TodoCardData, UseTodoCardSaveProps } from '../types';
import { createEmptyCard } from '../utils/todoHelpers';
import { getRandomColor } from '../constants/colors';

export const useTodoCardSave = ({
  isModal,
  initialData,
  upsertCard,
}: UseTodoCardSaveProps) => {
  const [newCard] = useState<TodoCardData>(() => createEmptyCard(getRandomColor()));

  const [workingCard, setWorkingCard] = useState<TodoCardData>(newCard);

  useEffect(() => {
    if (initialData) {
      setWorkingCard(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      if (isModal) {
        setWorkingCard(newCard);
      }
    };
  }, [isModal, newCard]);

  const currentCard: TodoCardData = isModal
    ? workingCard
    : initialData || workingCard;

  const hasUnsavedChanges =
    isModal &&
    (!initialData
      ? JSON.stringify(workingCard) !== JSON.stringify(newCard)
      : JSON.stringify(workingCard) !== JSON.stringify(initialData));

  const updateCard = (updatedCard: TodoCardData) => {
    isModal ? setWorkingCard(updatedCard) : upsertCard(updatedCard);
  };

  const saveChanges = (onSave: (card: TodoCardData) => void) => {
    onSave(workingCard);
  };

  return {
    currentCard,
    hasUnsavedChanges,
    updateCard,
    saveChanges,
  };
};
