import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useModalCardEdit } from '../useTodoCardSave';
import { createEmptyCard } from '../../utils/todoHelpers';
import { getRandomColor } from '../../constants/colors';
import { CardBoardProvider, useCardBoardContext } from '../../context/CardBoardContext';
import { describe, it, expect } from 'vitest';

describe('useModalCardEdit', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CardBoardProvider>{children}</CardBoardProvider>
  );

  describe('initialization', () => {
    it('creates empty card when no cardId provided', () => {
      const { result } = renderHook(() =>
        useModalCardEdit({
          cardId: undefined,
        }), { wrapper }
      );

      expect(result.current.currentCard).toBeDefined();
      expect(result.current.currentCard.title).toBe('');
      expect(result.current.currentCard.todos).toHaveLength(1);
      expect(result.current.currentCard.todos[0].task).toBe('');
    });

    it('uses card from context when cardId provided', () => {
      const testCard = createEmptyCard(getRandomColor());
      testCard.title = 'Test Card';

      // Create a wrapper that pre-loads the card into context
      const WrapperWithCard = ({ children }: { children: React.ReactNode }) => {
        const TestComponent = () => {
          const { upsertCard } = useCardBoardContext();
          React.useEffect(() => {
            upsertCard(testCard);
          }, []);
          return <>{children}</>;
        };

        return (
          <CardBoardProvider>
            <TestComponent />
          </CardBoardProvider>
        );
      };

      const { result } = renderHook(() =>
        useModalCardEdit({
          cardId: testCard.id,
        }), { wrapper: WrapperWithCard }
      );

      expect(result.current.currentCard.title).toBe('Test Card');
      expect(result.current.currentCard.id).toBe(testCard.id);
    });
  });

  describe('unsaved changes tracking', () => {
    it('tracks unsaved changes in create mode', () => {
      const { result } = renderHook(() =>
        useModalCardEdit({
          cardId: undefined,
        }), { wrapper }
      );

      expect(result.current.hasUnsavedChanges).toBe(true);

      act(() => {
        const updatedCard = { ...result.current.currentCard, title: 'New Title' };
        result.current.updateCard(updatedCard);
      });

      expect(result.current.hasUnsavedChanges).toBe(true);
    });

    it('tracks unsaved changes in edit mode', () => {
      const testCard = createEmptyCard(getRandomColor());
      testCard.title = 'Original Title';

      // Create a wrapper that pre-loads the card into context
      const WrapperWithCard = ({ children }: { children: React.ReactNode }) => {
        const TestComponent = () => {
          const { upsertCard } = useCardBoardContext();
          React.useEffect(() => {
            upsertCard(testCard);
          }, []);
          return <>{children}</>;
        };

        return (
          <CardBoardProvider>
            <TestComponent />
          </CardBoardProvider>
        );
      };

      const { result } = renderHook(() =>
        useModalCardEdit({
          cardId: testCard.id,
        }), { wrapper: WrapperWithCard }
      );

      expect(result.current.hasUnsavedChanges).toBe(false);

      act(() => {
        const updatedCard = { ...result.current.currentCard, title: 'New Title' };
        result.current.updateCard(updatedCard);
      });

      expect(result.current.hasUnsavedChanges).toBe(true);
    });

  });


  describe('updateCard', () => {
    it('updates working state correctly', () => {
      const { result } = renderHook(() =>
        useModalCardEdit({
          cardId: undefined,
        }), { wrapper }
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