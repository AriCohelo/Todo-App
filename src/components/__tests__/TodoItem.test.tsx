import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TodoItem } from '../TodoItem';
import type { Todo } from '../../types';

describe('TodoItem', () => {
  const user = userEvent.setup();

  const todo: Todo = {
    id: '1',
    task: 'Test Todo',
    completed: false,
  };

  const handlers = {
    onDelete: vi.fn(),
    onToggle: vi.fn(),
    onEdit: vi.fn(),
  };

  beforeEach(() => {
    render(<TodoItem todo={todo} {...handlers} />);
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders task input', () => {
      expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
    });

    it('renders checkbox', () => {
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders delete button', () => {
      expect(
        screen.getByRole('button', { name: 'Delete item' })
      ).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('edits task when Enter is pressed', async () => {
      const input = screen.getByDisplayValue('Test Todo');
      await user.type(input, ' updated{Enter}');
      expect(handlers.onEdit).toHaveBeenCalledWith(
        todo.id,
        'Test Todo updated'
      );
    });
    it('edits task when input loses focus (blur)', async () => {
      const input = screen.getByDisplayValue('Test Todo');

      await user.type(input, ' updated');
      input.blur();

      expect(handlers.onEdit).toHaveBeenCalledWith(
        todo.id,
        'Test Todo updated'
      );
    });
    it('toggles completion when checkbox is clicked', async () => {
      await user.click(screen.getByRole('checkbox'));
      expect(handlers.onToggle).toHaveBeenCalledWith(todo.id);
    });
    it('deletes todo when delete button is clicked', async () => {
      await user.click(screen.getByRole('button', { name: 'Delete item' }));
      expect(handlers.onDelete).toHaveBeenCalledWith(todo.id);
    });
    it('updates input value when typing', async () => {
      const input = screen.getByDisplayValue('Test Todo');

      await user.type(input, ' updated');

      expect(input).toHaveValue('Test Todo updated');
      // onEdit should NOT be called yet (only on Enter/blur)
      expect(handlers.onEdit).not.toHaveBeenCalled();
    });
  });
});
