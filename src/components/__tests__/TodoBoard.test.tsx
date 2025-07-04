import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TodoBoard } from '../TodoBoard';
import type { TodoCardData } from '../../types';

describe('TodoBoard', () => {
  const mockHandlers = {
    onSaveCard: vi.fn(),
    onDeleteCard: vi.fn(),
    onAddTodo: vi.fn(),
  };

  describe('rendering', () => {
    it('renders no TodoCards when todoCards array is empty', () => {
      render(<TodoBoard todoCards={[]} {...mockHandlers} />);
      expect(screen.queryByTestId('todoItem-list')).not.toBeInTheDocument();
    });

    it('renders TodoCards when todoCards array has data', () => {
      const sampleCards: TodoCardData[] = [
        {
          id: '1',
          title: 'First Card',
          todos: [{ id: '1', task: 'First todo', completed: false }],
          priority: 'high',
          updatedAt: new Date(),
        },
        {
          id: '2',
          title: 'Second Card',
          todos: [{ id: '2', task: 'Second todo', completed: true }],
          priority: 'low',
          updatedAt: new Date(),
        },
      ];

      render(<TodoBoard todoCards={sampleCards} {...mockHandlers} />);

      expect(screen.getAllByTestId('todoItem-list')).toHaveLength(2);
      expect(screen.getByDisplayValue('First todo')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Second todo')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    const user = userEvent.setup();

    const sampleCard: TodoCardData = {
      id: '1',
      title: 'Test Card',
      todos: [],
      priority: 'medium',
      updatedAt: new Date(),
    };

    it('calls onSaveCard when TodoCard Save button is clicked', async () => {
      const onSaveCard = vi.fn();
      render(
        <TodoBoard
          todoCards={[sampleCard]}
          onSaveCard={onSaveCard}
          onDeleteCard={() => {}}
          onAddTodo={() => {}}
        />
      );

      // Make changes to enable the Save button
      const titleInput = screen.getByDisplayValue('Test Card');
      await user.type(titleInput, ' Updated');

      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(onSaveCard).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          title: 'Test Card Updated',
          todos: [],
          priority: 'medium',
          updatedAt: expect.any(Date),
        })
      );
    });

    it('calls onDeleteCard when TodoCard Delete button is clicked', async () => {
      const onDeleteCard = vi.fn();
      render(
        <TodoBoard
          todoCards={[sampleCard]}
          onSaveCard={() => {}}
          onDeleteCard={onDeleteCard}
          onAddTodo={() => {}}
        />
      );

      const toolbar = screen.getByRole('toolbar');
      await user.click(within(toolbar).getByRole('button', { name: 'Delete' }));
      expect(onDeleteCard).toHaveBeenCalledWith('1');
    });

    it('calls onAddTodo when TodoCard + button is clicked', async () => {
      const onAddTodo = vi.fn();
      render(
        <TodoBoard
          todoCards={[sampleCard]}
          onSaveCard={() => {}}
          onDeleteCard={() => {}}
          onAddTodo={onAddTodo}
        />
      );

      await user.click(screen.getByRole('button', { name: '+' }));
      expect(onAddTodo).toHaveBeenCalledWith('1');
    });
  });
});
