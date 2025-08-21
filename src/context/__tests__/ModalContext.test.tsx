import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ModalProvider, useModal } from '../ModalContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ModalProvider>{children}</ModalProvider>
);

describe('ModalContext', () => {
  describe('initialization', () => {
    it('starts with no card being edited', () => {
      const { result } = renderHook(() => useModal(), { wrapper });
      expect(result.current.editingCardId).toBeNull();
    });

    it('provides expected context functions', () => {
      const { result } = renderHook(() => useModal(), { wrapper });
      expect(result.current.setEditingCardId).toBeTypeOf('function');
      expect(result.current.openEdit).toBeTypeOf('function');
      expect(result.current.closeEdit).toBeTypeOf('function');
      expect(result.current.isEditing).toBeTypeOf('function');
    });
  });

  describe('openEdit', () => {
    it('opens edit for card with default focus target', () => {
      const { result } = renderHook(() => useModal(), { wrapper });

      act(() => {
        result.current.openEdit('card-1');
      });

      expect(result.current.editingCardId).toEqual({
        cardId: 'card-1',
        focusTarget: 'title'
      });
    });

    it('opens edit for card with specified focus target', () => {
      const { result } = renderHook(() => useModal(), { wrapper });

      act(() => {
        result.current.openEdit('card-1', 'todo');
      });

      expect(result.current.editingCardId).toEqual({
        cardId: 'card-1',
        focusTarget: 'todo'
      });
    });
  });

  describe('closeEdit', () => {
    it('closes modal and clears editing state', () => {
      const { result } = renderHook(() => useModal(), { wrapper });

      act(() => {
        result.current.openEdit('card-1');
      });

      expect(result.current.editingCardId).not.toBeNull();

      act(() => {
        result.current.closeEdit();
      });

      expect(result.current.editingCardId).toBeNull();
    });
  });

  describe('isEditing', () => {
    it('returns true when card is being edited', () => {
      const { result } = renderHook(() => useModal(), { wrapper });

      act(() => {
        result.current.openEdit('card-1');
      });

      expect(result.current.isEditing('card-1')).toBe(true);
      expect(result.current.isEditing('card-2')).toBe(false);
    });

    it('returns false when no card is being edited', () => {
      const { result } = renderHook(() => useModal(), { wrapper });

      expect(result.current.isEditing('card-1')).toBe(false);
    });

    it('returns false after closing edit', () => {
      const { result } = renderHook(() => useModal(), { wrapper });

      act(() => {
        result.current.openEdit('card-1');
      });

      expect(result.current.isEditing('card-1')).toBe(true);

      act(() => {
        result.current.closeEdit();
      });

      expect(result.current.isEditing('card-1')).toBe(false);
    });
  });

  describe('setEditingCardId', () => {
    it('can set editing state directly', () => {
      const { result } = renderHook(() => useModal(), { wrapper });

      const modalState = { cardId: 'card-1', focusTarget: 'todo' as const };

      act(() => {
        result.current.setEditingCardId(modalState);
      });

      expect(result.current.editingCardId).toEqual(modalState);
    });

    it('can clear editing state directly', () => {
      const { result } = renderHook(() => useModal(), { wrapper });

      act(() => {
        result.current.openEdit('card-1');
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
        renderHook(() => useModal());
      }).toThrow('useModal must be used within a ModalProvider');
    });
  });
});