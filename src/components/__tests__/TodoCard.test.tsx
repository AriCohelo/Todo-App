import { render, screen, within, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoCard } from '../TodoCard';
import { TodoProvider } from '../../context/TodoContext';
import type { TodoCardData, TodoCardProps } from '../../types';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const renderTodoCard = (props: Partial<TodoCardProps> = {}) => {
  const defaultProps: TodoCardProps = {
    onSave: vi.fn(),
    onDelete: vi.fn(),
    ...props
  };
  
  return render(
    <TodoProvider>
      <TodoCard {...defaultProps} />
    </TodoProvider>
  );
};

describe('TodoCard', () => {
  describe('rendering', () => {
    beforeEach(() => {
      renderTodoCard();
    });

    it('renders a title field', () => {
      const titleField = screen.getByPlaceholderText(/enter a title/i);
      expect(titleField).toBeInTheDocument();
    });

    it('renders a todo list container', () => {
      const todoListContainer = screen.getByTestId('todoItem-list');
      expect(todoListContainer).toBeInTheDocument();
    });

    it('renders add button in board view', () => {
      const addButton = screen.getByRole('button', { name: 'add toDo' });
      expect(addButton).toBeInTheDocument();
    });

    it('renders add button in modal view', () => {
      cleanup();
      renderTodoCard({ isModal: true });
      const addButton = screen.getByRole('button', { name: 'add toDo' });
      expect(addButton).toBeInTheDocument();
    });

    it('renders a toolbar', () => {
      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();
    });

    it('renders a save button only in modal mode', () => {
      cleanup();
      renderTodoCard({ isModal: true });
      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeInTheDocument();
    });

    it('does not render a save button in board mode', () => {
      const saveButton = screen.queryByRole('button', { name: 'Save' });
      expect(saveButton).not.toBeInTheDocument();
    });

    it('renders a delete button in toolbar', () => {
      const toolbar = screen.getByRole('toolbar');
      const deleteButton = within(toolbar).getByRole('button', {
        name: 'Delete card',
      });
      expect(deleteButton).toBeInTheDocument();
    });

    it('renders empty TodoItem when no initialData', () => {
      const container = screen.getByTestId('todoItem-list');
      // Checkbox icons should be visible in both modal and board view
      const checkboxIcons = within(container).queryAllByAltText('Uncompleted task');
      expect(checkboxIcons).toHaveLength(1);
      
      // Text inputs should be there
      const textInputs = within(container).getAllByRole('textbox');
      expect(textInputs).toHaveLength(1);
    });

    it('renders checkbox icons in modal mode', () => {
      // Clean up any existing renders
      cleanup();
      
      renderTodoCard({ isModal: true });
      
      const container = screen.getByTestId('todoItem-list');
      const checkboxIcons = within(container).getAllByAltText('Uncompleted task');
      expect(checkboxIcons).toHaveLength(1);
    });

    it('renders TodoItems when initialData has todos', () => {
      const sampleData: TodoCardData = {
        id: '1',
        title: 'Test Card',
        todos: [
          { id: '1', task: 'First todo', completed: false },
          { id: '2', task: 'Second todo', completed: true },
        ],
        updatedAt: new Date(),
      };

      renderTodoCard({ initialData: sampleData });

      expect(screen.getByDisplayValue('First todo')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Second todo')).toBeInTheDocument();
    });

    it('populates title field with initial data title', () => {
      const sampleData: TodoCardData = {
        id: '1',
        title: 'Initial Title',
        todos: [{ id: '1', task: 'Sample todo', completed: false }],
        updatedAt: new Date(),
      };

      renderTodoCard({ initialData: sampleData });

      expect(screen.getByDisplayValue('Initial Title')).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('calls onSave when Save button is clicked', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();

      renderTodoCard({ onSave, isModal: true });

      // First enable the save button by interacting
      const titleInput = screen.getByTestId('todoCard-title-input');
      await user.type(titleInput, 'Test');

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          title: 'Test',
          todos: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              task: '',
              completed: false,
            }),
          ]),
            updatedAt: expect.any(Date),
        })
      );
    });

    it('calls onDelete when Delete button is clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();

      renderTodoCard({ onDelete });
      const toolbar = screen.getByRole('toolbar');
      await user.click(within(toolbar).getByRole('button', { name: 'Delete card' }));
      expect(onDelete).toHaveBeenCalledWith('');
    });


    it('adds new todo item locally when + button is clicked', async () => {
      const user = userEvent.setup();
      const sampleData: TodoCardData = {
        id: '1',
        title: 'Test Card',
        todos: [
          { id: '1', task: 'First todo', completed: false },
        ],
        updatedAt: new Date(),
      };

      renderTodoCard({ initialData: sampleData, isModal: true });

      // Should start with 1 todo
      const todoContainer = screen.getByTestId('todoItem-list');
      let todoInputs = within(todoContainer).getAllByRole('textbox');
      expect(todoInputs).toHaveLength(1);

      // Click + button
      await user.click(screen.getByRole('button', { name: 'add toDo' }));

      // Should now have 2 todos
      todoInputs = within(todoContainer).getAllByRole('textbox');
      expect(todoInputs).toHaveLength(2);
      
      // The new todo should be empty
      expect(todoInputs[1]).toHaveValue('');
    });

    it('updates title state when typing in title field', async () => {
      const user = userEvent.setup();
      renderTodoCard({ isModal: true });

      const titleInput = screen.getByPlaceholderText(/enter a title/i);
      await user.type(titleInput, 'My New Title');

      expect(titleInput).toHaveValue('MyNewTitle');
    });

    it('updates todo task when editing within the card', async () => {
      const user = userEvent.setup();
      renderTodoCard();

      const todoContainer = screen.getByTestId('todoItem-list');
      const todoInput = within(todoContainer).getByDisplayValue('');

      await user.type(todoInput, 'Updated task');

      expect(todoInput).toHaveValue('Updated task');
    });

    it('disables save button initially and enables after user interaction', async () => {
      const user = userEvent.setup();
      renderTodoCard({ isModal: true });

      const saveButton = screen.getByRole('button', { name: 'Save' });

      expect(saveButton).toBeDisabled();

      const titleInput = screen.getByTestId('todoCard-title-input');
      await user.type(titleInput, 'Test');

      expect(saveButton).toBeEnabled();
    });

    it('enables save button when editing todo items', async () => {
      const user = userEvent.setup();
      renderTodoCard({ isModal: true });

      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeDisabled();

      const todoContainer = screen.getByTestId('todoItem-list');
      const todoInput = within(todoContainer).getByDisplayValue('');
      await user.type(todoInput, 'New todo task');
      
      await act(async () => {
        todoInput.blur();
      });

      expect(saveButton).toBeEnabled();
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

    it('closes modal when backdrop is clicked without changes', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      renderTodoCard({ isModal: true, onClose });

      const backdrop = screen.getByTestId('todoTrigger-modal');
      await user.click(backdrop);
      expect(onClose).toHaveBeenCalled();
    });

    it('saves and closes modal when backdrop is clicked with changes', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn();

      renderTodoCard({ isModal: true, onClose, onSave });

      // Make changes
      const titleInput = screen.getByTestId('todoCard-title-input');
      await user.type(titleInput, 'Test Title');

      // Click backdrop
      const backdrop = screen.getByTestId('todoTrigger-modal');
      await user.click(backdrop);

      expect(onSave).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });
});
