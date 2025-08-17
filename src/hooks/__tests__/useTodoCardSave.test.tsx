import { renderHook, act } from '@testing-library/react';
import { useTodoCardSave } from '../useTodoCardSave';
import { createEmptyCard } from '../../utils/todoHelpers';
import { getRandomColor } from '../../constants/colors';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('useTodoCardSave', () => {
  const mockUpsertCard = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('creates empty card when no initialData provided', () => {
      const { result } = renderHook(() =>
        useTodoCardSave({
          isModal: false,
          initialData: undefined,
          upsertCard: mockUpsertCard,
        })
      );

      expect(result.current.currentCard).toBeDefined();
      expect(result.current.currentCard.title).toBe('');
      expect(result.current.currentCard.todos).toHaveLength(1);
      expect(result.current.currentCard.todos[0].task).toBe('');
    });

    it('uses initialData when provided', () => {
      const testCard = createEmptyCard(getRandomColor());
      testCard.title = 'Test Card';

      const { result } = renderHook(() =>
        useTodoCardSave({
          isModal: false,
          initialData: testCard,
          upsertCard: mockUpsertCard,
        })
      );

      expect(result.current.currentCard).toEqual(testCard);
    });
  });

  describe('modal mode', () => {
    it('tracks unsaved changes in create mode', () => {
      const { result } = renderHook(() =>
        useTodoCardSave({
          isModal: true,
          initialData: undefined,
          upsertCard: mockUpsertCard,
        })
      );

      expect(result.current.hasUnsavedChanges).toBe(false);

      act(() => {
        const updatedCard = { ...result.current.currentCard, title: 'New Title' };
        result.current.updateCard(updatedCard);
      });

      expect(result.current.hasUnsavedChanges).toBe(true);
    });

    it('does not call upsertCard immediately in modal mode', () => {
      const { result } = renderHook(() =>
        useTodoCardSave({
          isModal: true,
          initialData: undefined,
          upsertCard: mockUpsertCard,
        })
      );

      act(() => {
        const updatedCard = { ...result.current.currentCard, title: 'New Title' };
        result.current.updateCard(updatedCard);
      });

      expect(mockUpsertCard).not.toHaveBeenCalled();
    });

    it('calls onSave when saveChanges is called', () => {
      const { result } = renderHook(() =>
        useTodoCardSave({
          isModal: true,
          initialData: undefined,
          upsertCard: mockUpsertCard,
        })
      );

      act(() => {
        const updatedCard = { ...result.current.currentCard, title: 'New Title' };
        result.current.updateCard(updatedCard);
      });

      act(() => {
        result.current.saveChanges(mockOnSave);
      });

      expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Title'
      }));
    });
  });

  describe('board mode', () => {
    it('calls upsertCard immediately when initialData exists', () => {
      const testCard = createEmptyCard(getRandomColor());
      
      const { result } = renderHook(() =>
        useTodoCardSave({
          isModal: false,
          initialData: testCard,
          upsertCard: mockUpsertCard,
        })
      );

      act(() => {
        const updatedCard = { ...result.current.currentCard, title: 'Updated Title' };
        result.current.updateCard(updatedCard);
      });

      expect(mockUpsertCard).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Updated Title'
      }));
    });

  });

  describe('updateCard', () => {
    it('updates working state correctly', () => {
      const { result } = renderHook(() =>
        useTodoCardSave({
          isModal: true,
          initialData: undefined,
          upsertCard: mockUpsertCard,
        })
      );

      const originalTitle = result.current.currentCard.title;

      act(() => {
        const updatedCard = { ...result.current.currentCard, title: 'Updated Title' };
        result.current.updateCard(updatedCard);
      });

      expect(result.current.currentCard.title).toBe('Updated Title');
      expect(result.current.currentCard.title).not.toBe(originalTitle);
    });
  });
});