import { createContext, useContext, useState, type ReactNode } from 'react';
import type { FocusTarget } from '../types';

interface CardEditorState {
  cardId: string;
  focusTarget: FocusTarget;
}

interface CardEditorContextType {
  editingCardId: CardEditorState | null;
  setEditingCardId: (state: CardEditorState | null) => void;
  openEdit: (cardId: string, focusTarget?: FocusTarget) => void;
  closeEdit: () => void;
  isEditing: (cardId: string) => boolean;
}

const CardEditorContext = createContext<CardEditorContextType | undefined>(undefined);

export const useCardEditorContext = () => {
  const context = useContext(CardEditorContext);
  if (context === undefined) {
    throw new Error('useCardEditorContext must be used within a CardEditorProvider');
  }
  return context;
};

export const CardEditorProvider = ({ children }: { children: ReactNode }) => {
  const [editingCardId, setEditingCardId] = useState<CardEditorState | null>(null);

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
    <CardEditorContext.Provider
      value={{
        editingCardId,
        setEditingCardId,
        openEdit,
        closeEdit,
        isEditing,
      }}
    >
      {children}
    </CardEditorContext.Provider>
  );
};