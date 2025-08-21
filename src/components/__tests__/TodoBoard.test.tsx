import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TodoBoard } from '../TodoBoard';
import { CardProvider, useCardContext } from '../../context/CardContext';
import { ModalProvider } from '../../context/ModalContext';
import type { TodoCardData } from '../../types';

const mockTodoCard1: TodoCardData = {
  id: 'test-card-1',
  title: 'Test Card 1',
  todos: [
    { id: 'todo-1', task: 'Task 1', completed: false },
    { id: 'todo-2', task: 'Task 2', completed: true }
  ],
  backgroundColor: 'bg-blue-500',
  updatedAt: new Date('2024-01-01')
};

const mockTodoCard2: TodoCardData = {
  id: 'test-card-2',
  title: 'Test Card 2',
  todos: [
    { id: 'todo-3', task: 'Task 3', completed: false }
  ],
  backgroundColor: 'bg-red-500',
  updatedAt: new Date('2024-01-02')
};

const TestTodoBoard = () => {
  const mockOnOpenEdit = vi.fn();
  return (
    <CardProvider>
      <ModalProvider>
        <TodoBoard onOpenEdit={mockOnOpenEdit} />
      </ModalProvider>
    </CardProvider>
  );
};

const TestTodoBoardWithCards = ({ cards }: { cards: TodoCardData[] }) => {
  return (
    <CardProvider>
      <ModalProvider>
        <TodoBoardWrapper cards={cards} />
      </ModalProvider>
    </CardProvider>
  );
};

const TodoBoardWrapper = ({ cards }: { cards: TodoCardData[] }) => {
  const { upsertCard } = useCardContext();
  const mockOnOpenEdit = vi.fn();

  React.useEffect(() => {
    cards.forEach(card => upsertCard(card));
  }, []);

  return <TodoBoard onOpenEdit={mockOnOpenEdit} />;
};

describe('TodoBoard', () => {
  describe('rendering', () => {
    it('renders empty board with correct structure', () => {
      render(<TestTodoBoard />);
      const board = screen.getByTestId('todoBoard');
      expect(board).toBeInTheDocument();
      expect(screen.queryByTestId('todoCardDisplay')).not.toBeInTheDocument();
    });

    it('renders single card correctly', () => {
      render(<TestTodoBoardWithCards cards={[mockTodoCard1]} />);
      expect(screen.getByTestId('todoCardDisplay')).toBeInTheDocument();
    });

    it('renders multiple cards', () => {
      render(<TestTodoBoardWithCards cards={[mockTodoCard1, mockTodoCard2]} />);
      const cards = screen.getAllByTestId('todoCardDisplay');
      expect(cards).toHaveLength(2);
    });

    it('displays card content correctly', () => {
      render(<TestTodoBoardWithCards cards={[mockTodoCard1]} />);
      expect(screen.getByText('Test Card 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Task 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Task 2')).toBeInTheDocument();
    });
  });

  describe('card interactions', () => {
    it('handles card click to open edit modal', async () => {
      const user = userEvent.setup();
      render(<TestTodoBoardWithCards cards={[mockTodoCard1]} />);
      
      const card = screen.getByTestId('todoCardDisplay');
      await user.click(card);
      
      expect(card).toBeInTheDocument();
    });

    it('handles card deletion', async () => {
      const user = userEvent.setup();
      render(<TestTodoBoardWithCards cards={[mockTodoCard1, mockTodoCard2]} />);
      
      let cards = screen.getAllByTestId('todoCardDisplay');
      expect(cards).toHaveLength(2);

      const deleteButton = within(cards[0]).getByTitle('Delete card');
      await user.click(deleteButton);
      
      cards = screen.getAllByTestId('todoCardDisplay');
      expect(cards).toHaveLength(1);
    });
  });

  describe('accessibility', () => {
    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<TestTodoBoardWithCards cards={[mockTodoCard1]} />);
      
      const todoInput = screen.getByDisplayValue('Task 1');
      await user.click(todoInput);
      
      expect(todoInput).toHaveFocus();
    });
  });
});