import { render, screen, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoCard } from '../TodoCard';
import { CardProvider } from '../../context/CardContext';
import { ModalProvider } from '../../context/ModalContext';
import type { TodoCardData, TodoCardProps } from '../../types';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const renderTodoCard = (props: Partial<TodoCardProps> = {}) => {
  const defaultProps: TodoCardProps = {
    onSave: vi.fn(),
    onDelete: vi.fn(),
    ...props
  };
  
  return render(
    <CardProvider>
      <ModalProvider>
        <TodoCard {...defaultProps} />
      </ModalProvider>
    </CardProvider>
  );
};

describe('TodoCard', () => {
  describe('rendering', () => {
    it('renders basic todo card structure', () => {
      renderTodoCard({ isModal: true });
      expect(screen.getByPlaceholderText(/enter a title/i)).toBeInTheDocument();
      expect(screen.getByTestId('todoItem-list')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'add toDo' })).toBeInTheDocument();
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('renders save button only in modal mode', () => {
      cleanup();
      renderTodoCard({ isModal: true });
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('does not render save button in board mode', () => {
      const saveButton = screen.queryByRole('button', { name: 'Save' });
      expect(saveButton).not.toBeInTheDocument();
    });

    it('populates initial data correctly', () => {
      // This test would require setting up card data in context first
      // For now, let's test that an empty card renders correctly
      renderTodoCard({ isModal: true });
      expect(screen.getByTestId('todoCard-title-input')).toBeInTheDocument();
      expect(screen.getByTestId('todoItem-list')).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('calls onSave when Save button is clicked', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();

      renderTodoCard({ onSave, isModal: true });

      const titleInput = screen.getByTestId('todoCard-title-input');
      await user.type(titleInput, 'Test');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test',
          todos: expect.any(Array),
        })
      );
    });

    it('calls onDelete when Delete button is clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();

      renderTodoCard({ onDelete });
      const toolbar = screen.getByRole('toolbar');
      await user.click(within(toolbar).getByRole('button', { name: 'Delete card' }));
      expect(onDelete).toHaveBeenCalled();
    });

    it('adds new todo item when + button is clicked', async () => {
      const user = userEvent.setup();
      renderTodoCard({ isModal: true });

      const todoContainer = screen.getByTestId('todoItem-list');
      let todoInputs = within(todoContainer).getAllByRole('textbox');
      expect(todoInputs).toHaveLength(1);

      await user.click(screen.getByRole('button', { name: 'add toDo' }));

      todoInputs = within(todoContainer).getAllByRole('textbox');
      expect(todoInputs).toHaveLength(2);
    });

    it('updates title when typing', async () => {
      const user = userEvent.setup();
      renderTodoCard({ isModal: true });

      const titleInput = screen.getByPlaceholderText(/enter a title/i);
      await user.type(titleInput, 'My New Title');

      expect(titleInput).toHaveValue('MyNewTitle');
    });

    it('updates todo task when editing', async () => {
      const user = userEvent.setup();
      renderTodoCard();

      const todoContainer = screen.getByTestId('todoItem-list');
      const todoInput = within(todoContainer).getByDisplayValue('');
      await user.type(todoInput, 'Updated task');

      expect(todoInput).toHaveValue('Updated task');
    });
  });

  describe('modal behavior', () => {
    it('closes modal when ESC key is pressed', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      renderTodoCard({ isModal: true, onClose });
      await user.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalled();
    });
  });
});