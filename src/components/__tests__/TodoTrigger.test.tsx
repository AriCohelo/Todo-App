import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoTrigger } from '../TodoTrigger';

describe('TodoTrigger', () => {
  const user = userEvent.setup();

  describe('rendering', () => {
    let triggerContainer: HTMLElement;

    beforeEach(() => {
      render(<TodoTrigger onCreateCard={() => {}} />);
      triggerContainer = screen.getByTestId('todo-trigger');
    });

    it('renders title field within the trigger container', () => {
      expect(
        within(triggerContainer).getByPlaceholderText(/take a note/i)
      ).toBeInTheDocument();
    });

    it('initially modal should not be present', () => {
      expect(
        within(triggerContainer).queryByTestId('todo-modal')
      ).not.toBeInTheDocument();
    });

    it('renders modal when title input is clicked', async () => {
      const titleInput =
        within(triggerContainer).getByPlaceholderText(/take a note/i);
      await user.click(titleInput);
      expect(
        within(triggerContainer).getByTestId('todo-modal')
      ).toBeInTheDocument();
    });
  });

  describe('modal interactions', () => {
    let triggerContainer: HTMLElement;

    beforeEach(() => {
      render(<TodoTrigger onCreateCard={() => {}} />);
      triggerContainer = screen.getByTestId('todo-trigger');
    });

    it('opens modal when title input is clicked', async () => {
      const titleInput =
        within(triggerContainer).getByPlaceholderText(/take a note/i);
      await user.click(titleInput);

      expect(
        within(triggerContainer).getByTestId('todo-modal')
      ).toBeInTheDocument();
    });

    it('closes modal when ESC key is pressed', async () => {
      const titleInput =
        within(triggerContainer).getByPlaceholderText(/take a note/i);

      // Open modal
      await user.click(titleInput);
      expect(
        within(triggerContainer).getByTestId('todo-modal')
      ).toBeInTheDocument();

      // Close with ESC
      await user.keyboard('{Escape}');
      expect(
        within(triggerContainer).queryByTestId('todo-modal')
      ).not.toBeInTheDocument();
    });

    it('closes modal when backdrop is clicked', async () => {
      const titleInput =
        within(triggerContainer).getByPlaceholderText(/take a note/i);

      // Open modal
      await user.click(titleInput);
      expect(
        within(triggerContainer).getByTestId('todo-modal')
      ).toBeInTheDocument();

      // Close by clicking backdrop
      const modalBackdrop = within(triggerContainer).getByTestId('todo-modal');
      await user.click(modalBackdrop);
      expect(
        within(triggerContainer).queryByTestId('todo-modal')
      ).not.toBeInTheDocument();
    });
  });

  describe('card creation', () => {
    it('calls onCreateCard when Save button is clicked with updated data', async () => {
      const onCreateCard = vi.fn();
      render(<TodoTrigger onCreateCard={onCreateCard} />);

      const triggerContainer = screen.getByTestId('todo-trigger');
      const titleInput =
        within(triggerContainer).getByPlaceholderText(/take a note/i);

      // Open modal
      await user.click(titleInput);

      // Update data in the TodoCard form
      const cardTitleInput =
        within(triggerContainer).getByPlaceholderText(/enter a title/i);
      await user.clear(cardTitleInput);
      await user.type(cardTitleInput, 'New Card Title');

      // Click Save button
      const saveButton = within(triggerContainer).getByRole('button', {
        name: /save/i,
      });
      await user.click(saveButton);

      // Verify onCreateCard was called with updated data
      expect(onCreateCard).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          title: 'New Card Title',
          todos: expect.any(Array),
          priority: expect.any(String),
          updatedAt: expect.any(Date),
        })
      );
    });

    it('calls onCreateCard when backdrop is clicked with updated data', async () => {
      const onCreateCard = vi.fn();
      render(<TodoTrigger onCreateCard={onCreateCard} />);

      const triggerContainer = screen.getByTestId('todo-trigger');
      const titleInput =
        within(triggerContainer).getByPlaceholderText(/take a note/i);

      // Open modal
      await user.click(titleInput);

      // Update data in the TodoCard form
      const cardTitleInput =
        within(triggerContainer).getByPlaceholderText(/enter a title/i);
      await user.clear(cardTitleInput);
      await user.type(cardTitleInput, 'Backdrop Card Title');

      // Click backdrop to close and save
      const modalBackdrop = within(triggerContainer).getByTestId('todo-modal');
      await user.click(modalBackdrop);

      // Verify onCreateCard was called with updated data
      expect(onCreateCard).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          title: 'Backdrop Card Title',
          todos: expect.any(Array),
          priority: expect.any(String),
          updatedAt: expect.any(Date),
        })
      );
    });

    it('does not call onCreateCard when modal is closed without data changes', async () => {
      const onCreateCard = vi.fn();
      render(<TodoTrigger onCreateCard={onCreateCard} />);

      const triggerContainer = screen.getByTestId('todo-trigger');
      const titleInput =
        within(triggerContainer).getByPlaceholderText(/take a note/i);

      // Open modal
      await user.click(titleInput);

      // Close modal without making changes
      await user.keyboard('{Escape}');

      // Verify onCreateCard was not called
      expect(onCreateCard).not.toHaveBeenCalled();
    });
  });
});
