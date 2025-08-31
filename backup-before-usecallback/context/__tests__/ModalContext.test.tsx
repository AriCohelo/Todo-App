import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CardEditorProvider, useCardEditorContext } from '../CardEditorContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CardEditorProvider>{children}</CardEditorProvider>
);

describe('CardEditorContext', () => {
  describe('initialization', () => {
    it('starts with no card being edited', () => {
      const { result } = renderHook(() => useCardEditorContext(), { wrapper });
      expect(result.current.editingCardId).toBeNull();
    });

    it('provides expected context functions', () => {
      const { result } = renderHook(() => useCardEditorContext(), { wrapper });
      expect(result.current.setEditingCardId).toBeTypeOf('function');
      expect(result.current.startEdit).toBeTypeOf('function');
      expect(result.current.finishEdit).toBeTypeOf('function');
      expect(result.current.isEditing).toBeTypeOf('function');
    });
  });

  describe('startEdit', () => {
    it('opens edit for card with default focus target', () => {
      const { result } = renderHook(() => useCardEditorContext(), { wrapper });

      act(() => {
        result.current.startEdit('card-1');
      });

      expect(result.current.editingCardId).toEqual({
        cardId: 'card-1',
        focusTarget: 'title'
      });
    });

    it('opens edit for card with specified focus target', () => {
      const { result } = renderHook(() => useCardEditorContext(), { wrapper });

      act(() => {
        result.current.startEdit('card-1', 0);
      });

      expect(result.current.editingCardId).toEqual({
        cardId: 'card-1',
        focusTarget: 0
      });
    });
  });

  describe('finishEdit', () => {
    it('closes modal and clears editing state', () => {
      const { result } = renderHook(() => useCardEditorContext(), { wrapper });

      act(() => {
        result.current.startEdit('card-1');
      });

      expect(result.current.editingCardId).not.toBeNull();

      act(() => {
        result.current.finishEdit();
      });

      expect(result.current.editingCardId).toBeNull();
    });
  });

  describe('isEditing', () => {
    it('returns true when card is being edited', () => {
      const { result } = renderHook(() => useCardEditorContext(), { wrapper });

      act(() => {
        result.current.startEdit('card-1');
      });

      expect(result.current.isEditing('card-1')).toBe(true);
      expect(result.current.isEditing('card-2')).toBe(false);
    });

    it('returns false when no card is being edited', () => {
      const { result } = renderHook(() => useCardEditorContext(), { wrapper });

      expect(result.current.isEditing('card-1')).toBe(false);
    });

    it('returns false after closing edit', () => {
      const { result } = renderHook(() => useCardEditorContext(), { wrapper });

      act(() => {
        result.current.startEdit('card-1');
      });

      expect(result.current.isEditing('card-1')).toBe(true);

      act(() => {
        result.current.finishEdit();
      });

      expect(result.current.isEditing('card-1')).toBe(false);
    });
  });

  describe('setEditingCardId', () => {
    it('can set editing state directly', () => {
      const { result } = renderHook(() => useCardEditorContext(), { wrapper });

      const modalState = { cardId: 'card-1', focusTarget: 0 as const };

      act(() => {
        result.current.setEditingCardId(modalState);
      });

      expect(result.current.editingCardId).toEqual(modalState);
    });

    it('can clear editing state directly', () => {
      const { result } = renderHook(() => useCardEditorContext(), { wrapper });

      act(() => {
        result.current.startEdit('card-1');
      });

      expect(result.current.editingCardId).not.toBeNull();

      act(() => {
        result.current.setEditingCardId(null);
      });

      expect(result.current.editingCardId).toBeNull();
    });
  });

  describe('error handling', () => {
    it('throws error when used outside provider', () => {
      expect(() => {
        renderHook(() => useCardEditorContext());
      }).toThrow('useCardEditorContext must be used within a CardEditorProvider');
    });
  });
});