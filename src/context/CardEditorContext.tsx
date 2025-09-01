import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { FocusTarget } from '../types';

interface CardEditorState {
  cardId: string;
  focusTarget: FocusTarget;
}

interface CardEditorContextType {
  editingCardId: CardEditorState | null;
  setEditingCardId: (state: CardEditorState | null) => void;
  startEdit: (cardId: string, focusTarget?: FocusTarget) => void;
  finishEdit: () => void;
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

  const startEdit = useCallback((cardId: string, focusTarget: FocusTarget = 'title') => {
    setEditingCardId({ cardId, focusTarget });
  }, []);

  const finishEdit = useCallback(() => {
    setEditingCardId(null);
  }, []);

  const isEditing = useCallback((cardId: string) => {
    return editingCardId?.cardId === cardId;
  }, [editingCardId]);

  const value = useMemo(() => ({
    editingCardId,
    setEditingCardId,
    startEdit,
    finishEdit,
    isEditing,
  }), [editingCardId, setEditingCardId, startEdit, finishEdit, isEditing]);

  return (
    <CardEditorContext.Provider value={value}>
      {children}
    </CardEditorContext.Provider>
  );
};