import { useState, useEffect } from 'react';
import type { TodoCardData, UseTodoCardSaveProps } from '../types';
import { createEmptyCard } from '../utils/todoHelpers';
import { getRandomColor } from '../constants/colors';

export const useTodoCardSave = ({ isModal, initialData, upsertCard }: UseTodoCardSaveProps) => {
  const [initialCard, setInitialCard] = useState<TodoCardData>(() => 
    initialData || createEmptyCard(getRandomColor())
  );
  
  const [workingCard, setWorkingCard] = useState<TodoCardData>(initialCard);

  useEffect(() => {
    if (initialData) {
      setWorkingCard(initialData);
    }
  }, [initialData]);

  const currentCard: TodoCardData = isModal ? workingCard : (initialData || workingCard);

  const hasUnsavedChanges = isModal && (
    !initialData ? 
      JSON.stringify(workingCard) !== JSON.stringify(initialCard) :
      JSON.stringify(workingCard) !== JSON.stringify(initialData)
  );

  const updateCard = (updatedCard: TodoCardData) => {
    if (isModal || !initialData) {
      setWorkingCard(updatedCard);
      if (!isModal) {
        upsertCard(updatedCard);
      }
    } else {
      upsertCard(updatedCard);
    }
  };

  const saveChanges = (onSave?: (card: TodoCardData) => void) => {
    if (isModal && onSave) {
      onSave(workingCard);
      if (!initialData) {
        const newEmptyCard = createEmptyCard(getRandomColor());
        setWorkingCard(newEmptyCard);
        setInitialCard(newEmptyCard);
      }
    }
  };

  return {
    currentCard,
    hasUnsavedChanges,
    updateCard,
    saveChanges,
  };
};