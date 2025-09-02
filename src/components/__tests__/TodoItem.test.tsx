import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TodoItem } from '../TodoItem';
import { Reorder } from 'framer-motion';
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

  const renderTodoItem = () => {
    return render(
      <Reorder.Group axis="y" values={[todo]} onReorder={() => {}}>
        <TodoItem todo={todo} {...handlers} />
      </Reorder.Group>
    );
  };

  beforeEach(() => {
    renderTodoItem();
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders task input', () => {
      expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
    });

    it('renders checkbox icon', () => {
      const checkboxIcon = document.querySelector('div[style*="checkbox-empty.svg"]');
      expect(checkboxIcon).toBeInTheDocument();
    });

    it('renders delete button', () => {
      expect(
        screen.getByRole('button', { name: 'Delete item' })
      ).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('edits task when input loses focus (blur)', async () => {
      const input = screen.getByDisplayValue('Test Todo');

      await user.type(input, ' updated');
      input.blur();

      expect(handlers.onEdit).toHaveBeenCalledWith(
        todo.id,
        'Test Todo updated'
      );
    });
    it('toggles completion when checkbox icon is clicked', async () => {
      const checkboxContainer = document.querySelector('.flex-shrink-0.w-3.h-3.cursor-pointer') as HTMLElement;
      await user.click(checkboxContainer);
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
      // onEdit should be called on every keystroke to update hasUnsavedChanges
      expect(handlers.onEdit).toHaveBeenCalled();
    });
  });
});
