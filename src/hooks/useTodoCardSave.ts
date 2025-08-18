import { useState, useEffect } from 'react';
import type { TodoCardData, UseTodoCardSaveProps } from '../types';
import { createEmptyCard } from '../utils/todoHelpers';
import { getRandomColor } from '../constants/colors';

export const useTodoCardSave = ({
  isModal,
  initialData,
  upsertCard,
}: UseTodoCardSaveProps) => {
  // For modal mode: create draft state
  const [newCard] = useState<TodoCardData>(() => createEmptyCard(getRandomColor()));
  const [workingCard, setWorkingCard] = useState<TodoCardData>(newCard);

  // Initialize workingCard with initialData when provided (modal mode)
  useEffect(() => {
    if (isModal && initialData) {
      setWorkingCard(initialData);
    }
  }, [isModal, initialData]);

  // Reset workingCard on modal cleanup
  useEffect(() => {
    return () => {
      if (isModal) {
        setWorkingCard(newCard);
      }
    };
  }, [isModal, newCard]);

  // Simplified logic: clear separation between modal and board modes
  if (isModal) {
    // MODAL MODE: Use draft state with explicit save
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
  } else {
    // BOARD MODE: Direct state with immediate persistence
    const currentCard = initialData || newCard;

    const updateCard = (updatedCard: TodoCardData) => {
      upsertCard(updatedCard);
    };

    const saveChanges = () => {
      // No-op in board mode since changes are immediately persisted
    };

    return {
      currentCard,
      hasUnsavedChanges: false,
      updateCard,
      saveChanges,
    };
  }
};