import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoCard } from '../TodoCard';
import type { TodoCardData } from '../../types';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TodoCard', () => {
  describe('rendering', () => {
    beforeEach(() => {
      render(
        <TodoCard onSave={() => {}} onDelete={() => {}} onAddTodo={() => {}} />
      );
    });

    it('renders a title field', () => {
      const titleField = screen.getByPlaceholderText(/enter a title/i);
      expect(titleField).toBeInTheDocument();
    });

    it('renders a todo list container', () => {
      const todoListContainer = screen.getByTestId('todoItem-list');
      expect(todoListContainer).toBeInTheDocument();
    });

    it('renders a add button', () => {
      const addButton = screen.getByRole('button', { name: '+' });
      expect(addButton).toBeInTheDocument();
    });

    it('renders a toolbar', () => {
      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();
    });

    it('renders a save button', () => {
      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeInTheDocument();
    });

    it('renders a delete button in toolbar', () => {
      const toolbar = screen.getByRole('toolbar');
      const deleteButton = within(toolbar).getByRole('button', {
        name: 'Delete',
      });
      expect(deleteButton).toBeInTheDocument();
    });

    it('renders empty TodoItem when no initialData', () => {
      const container = screen.getByTestId('todoItem-list');
      const checkboxes = within(container).getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(1);
      expect(checkboxes[0]).not.toBeChecked();
    });

    it('renders TodoItems when initialData has todos', () => {
      const sampleData: TodoCardData = {
        id: '1',
        title: 'Test Card',
        todos: [
          { id: '1', task: 'First todo', completed: false },
          { id: '2', task: 'Second todo', completed: true },
        ],
        priority: 'high',
        updatedAt: new Date(),
      };

      render(
        <TodoCard
          initialData={sampleData}
          onSave={() => {}}
          onDelete={() => {}}
          onAddTodo={() => {}}
        />
      );

      expect(screen.getByDisplayValue('First todo')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Second todo')).toBeInTheDocument();
    });

    it('populates title field with initial data title', () => {
      const sampleData: TodoCardData = {
        id: '1',
        title: 'Initial Title',
        todos: [{ id: '1', task: 'Sample todo', completed: false }],
        priority: 'high',
        updatedAt: new Date(),
      };

      render(
        <TodoCard
          initialData={sampleData}
          onSave={() => {}}
          onDelete={() => {}}
          onAddTodo={() => {}}
        />
      );

      expect(screen.getByDisplayValue('Initial Title')).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('calls onSave when Save button is clicked', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();

      render(
        <TodoCard onSave={onSave} onDelete={() => {}} onAddTodo={() => {}} />
      );

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
          priority: 'medium',
          updatedAt: expect.any(Date),
        })
      );
    });

    it('calls onDelete when Delete button is clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();

      render(
        <TodoCard onSave={() => {}} onDelete={onDelete} onAddTodo={() => {}} />
      );
      const toolbar = screen.getByRole('toolbar');
      await user.click(within(toolbar).getByRole('button', { name: 'Delete' }));
      expect(onDelete).toHaveBeenCalledWith('');
    });

    it('calls onAddTodo when + button is clicked', async () => {
      const user = userEvent.setup();
      const onAddTodo = vi.fn();

      render(
        <TodoCard onSave={() => {}} onDelete={() => {}} onAddTodo={onAddTodo} />
      );
      await user.click(screen.getByRole('button', { name: '+' }));
      expect(onAddTodo).toHaveBeenCalledWith('');
    });

    it('updates title state when typing in title field', async () => {
      const user = userEvent.setup();
      render(
        <TodoCard onSave={() => {}} onDelete={() => {}} onAddTodo={() => {}} />
      );

      const titleInput = screen.getByPlaceholderText(/enter a title/i);
      await user.type(titleInput, 'My New Title');

      expect(titleInput).toHaveValue('My New Title');
    });

    it('updates todo task when editing within the card', async () => {
      const user = userEvent.setup();
      render(
        <TodoCard onSave={() => {}} onDelete={() => {}} onAddTodo={() => {}} />
      );

      const todoContainer = screen.getByTestId('todoItem-list');
      const todoInput = within(todoContainer).getByDisplayValue('');

      await user.type(todoInput, 'Updated task');

      expect(todoInput).toHaveValue('Updated task');
    });

    it('disables save button initially and enables after user interaction', async () => {
      const user = userEvent.setup();
      render(
        <TodoCard onSave={() => {}} onDelete={() => {}} onAddTodo={() => {}} />
      );

      const saveButton = screen.getByRole('button', { name: 'Save' });

      expect(saveButton).toBeDisabled();

      const titleInput = screen.getByTestId('todoCard-title-input');
      await user.type(titleInput, 'Test');

      expect(saveButton).toBeEnabled();

      await user.click(saveButton);

      expect(saveButton).toBeDisabled();
    });

    it('enables save button when editing todo items', async () => {
      const user = userEvent.setup();
      render(
        <TodoCard onSave={() => {}} onDelete={() => {}} onAddTodo={() => {}} />
      );

      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeDisabled();

      const todoContainer = screen.getByTestId('todoItem-list');
      const todoInput = within(todoContainer).getByDisplayValue('');
      await user.type(todoInput, 'New todo task{Enter}');

      expect(saveButton).toBeEnabled();
    });
  });

  describe('modal behavior', () => {
    it('closes modal when ESC key is pressed', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <TodoCard
          isModal={true}
          onClose={onClose}
          onSave={() => {}}
          onDelete={() => {}}
          onAddTodo={() => {}}
        />
      );

      await user.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalled();
    });

    it('closes modal when backdrop is clicked without changes', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <TodoCard
          isModal={true}
          onClose={onClose}
          onSave={() => {}}
          onDelete={() => {}}
          onAddTodo={() => {}}
        />
      );

      const backdrop = screen.getByTestId('todoTrigger-modal');
      await user.click(backdrop);
      expect(onClose).toHaveBeenCalled();
    });

    it('saves and closes modal when backdrop is clicked with changes', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const onSave = vi.fn();

      render(
        <TodoCard
          isModal={true}
          onClose={onClose}
          onSave={onSave}
          onDelete={() => {}}
          onAddTodo={() => {}}
        />
      );

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
