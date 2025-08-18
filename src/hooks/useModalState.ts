import { useState } from 'react';
import type { FocusTarget } from '../types';

interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | null;
  cardId?: string;
  focusTarget?: FocusTarget;
}

export const useModalState = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: null,
  });

  const openCreateModal = (focusTarget: FocusTarget = 'title') => {
    setModalState({
      isOpen: true,
      mode: 'create',
      focusTarget,
    });
  };

  const openEditModal = (cardId: string, focusTarget: FocusTarget = 'title') => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      cardId,
      focusTarget,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: null,
      focusTarget: undefined,
    });
  };

  return {
    modalState,
    openCreateModal,
    openEditModal,
    closeModal,
  };
};