import { createContext, useContext, useState, type ReactNode } from 'react';
import type { FocusTarget } from '../types';

interface ModalState {
  cardId: string;
  focusTarget: FocusTarget;
}

interface ModalContextType {
  editingCardId: ModalState | null;
  setEditingCardId: (state: ModalState | null) => void;
  openEdit: (cardId: string, focusTarget?: FocusTarget) => void;
  closeEdit: () => void;
  isEditing: (cardId: string) => boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [editingCardId, setEditingCardId] = useState<ModalState | null>(null);

  const openEdit = (cardId: string, focusTarget: FocusTarget = 'title') => {
    setEditingCardId({ cardId, focusTarget });
  };

  const closeEdit = () => {
    setEditingCardId(null);
  };

  const isEditing = (cardId: string) => {
    return editingCardId?.cardId === cardId;
  };

  return (
    <ModalContext.Provider
      value={{
        editingCardId,
        setEditingCardId,
        openEdit,
        closeEdit,
        isEditing,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};