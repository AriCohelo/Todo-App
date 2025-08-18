import { useState } from 'react';
import type { FocusTarget } from '../types';

interface ModalState {
  isOpen: boolean;
  cardId?: string;
  focusTarget?: FocusTarget;
}

export const useModalState = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
  });

  const openEditModal = (cardId: string, focusTarget: FocusTarget = 'title') => {
    setModalState({
      isOpen: true,
      cardId,
      focusTarget,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      focusTarget: undefined,
    });
  };

  return {
    modalState,
    openEditModal,
    closeModal,
  };
};