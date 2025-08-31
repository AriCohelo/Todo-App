import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CardBoardProvider, useCardBoardContext } from '../CardBoardContext';
import type { TodoCardData } from '../../types';

const mockDate = new Date('2024-01-01T00:00:00.000Z');
vi.setSystemTime(mockDate);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CardBoardProvider>{children}</CardBoardProvider>
);

const sampleCard: TodoCardData = {
  id: 'card-1',
  title: 'Test Card',
  todos: [
    { id: 'todo-1', task: 'Test Task', completed: false }
  ],
  backgroundColor: 'bg-blue-500',
  updatedAt: new Date('2023-01-01')
};

describe('CardBoardContext', () => {
  describe('initialization', () => {
    it('starts with empty todoCards array', () => {
      const { result } = renderHook(() => useCardBoardContext(), { wrapper });
      expect(result.current.todoCards).toEqual([]);
    });

    it('provides expected context functions', () => {
      const { result } = renderHook(() => useCardBoardContext(), { wrapper });
      expect(result.current.upsertCard).toBeTypeOf('function');
      expect(result.current.deleteCard).toBeTypeOf('function');
    });
  });

  describe('upsertCard', () => {
    it('adds new card to empty list', () => {
      const { result } = renderHook(() => useCardBoardContext(), { wrapper });

      act(() => {
        result.current.upsertCard(sampleCard);
      });

      expect(result.current.todoCards).toHaveLength(1);
      expect(result.current.todoCards[0].title).toBe('Test Card');
      expect(result.current.todoCards[0].updatedAt).toEqual(mockDate);
    });

    it('adds new card to beginning of existing list', () => {
      const { result } = renderHook(() => useCardBoardContext(), { wrapper });

      const firstCard = { ...sampleCard, id: 'card-1', title: 'First Card' };
      const secondCard = { ...sampleCard, id: 'card-2', title: 'Second Card' };

      act(() => {
        result.current.upsertCard(firstCard);
        result.current.upsertCard(secondCard);
      });

      expect(result.current.todoCards).toHaveLength(2);
      expect(result.current.todoCards[0].title).toBe('Second Card');
      expect(result.current.todoCards[1].title).toBe('First Card');
    });

    it('updates existing card in place', () => {
      const { result } = renderHook(() => useCardBoardContext(), { wrapper });

      act(() => {
        result.current.upsertCard(sampleCard);
      });

      const updatedCard = { ...sampleCard, title: 'Updated Card' };

      act(() => {
        result.current.upsertCard(updatedCard);
      });

      expect(result.current.todoCards).toHaveLength(1);
      expect(result.current.todoCards[0].title).toBe('Updated Card');
      expect(result.current.todoCards[0].updatedAt).toEqual(mockDate);
    });
  });

  describe('deleteCard', () => {
    it('removes card by id', () => {
      const { result } = renderHook(() => useCardBoardContext(), { wrapper });

      act(() => {
        result.current.upsertCard(sampleCard);
      });

      expect(result.current.todoCards).toHaveLength(1);

      act(() => {
        result.current.deleteCard('card-1');
      });

      expect(result.current.todoCards).toHaveLength(0);
    });

    it('only removes matching card when multiple exist', () => {
      const { result } = renderHook(() => useCardBoardContext(), { wrapper });

      const card1 = { ...sampleCard, id: 'card-1', title: 'Card 1' };
      const card2 = { ...sampleCard, id: 'card-2', title: 'Card 2' };

      act(() => {
        result.current.upsertCard(card1);
        result.current.upsertCard(card2);
      });

      expect(result.current.todoCards).toHaveLength(2);

      act(() => {
        result.current.deleteCard('card-1');
      });

      expect(result.current.todoCards).toHaveLength(1);
      expect(result.current.todoCards[0].title).toBe('Card 2');
    });

    it('does nothing when card id does not exist', () => {
      const { result } = renderHook(() => useCardBoardContext(), { wrapper });

      act(() => {
        result.current.upsertCard(sampleCard);
      });

      expect(result.current.todoCards).toHaveLength(1);

      act(() => {
        result.current.deleteCard('non-existent-id');
      });

      expect(result.current.todoCards).toHaveLength(1);
    });
  });

  describe('error handling', () => {
    it('throws error when used outside provider', () => {
      expect(() => {
        renderHook(() => useCardBoardContext());
      }).toThrow('useCardBoardContext must be used within a CardBoardProvider');
    });
  });
});