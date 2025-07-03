import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../../App';
import userEvent from '@testing-library/user-event';

describe('App', () => {
  describe('rendering', () => {
    it('renders the main title "What I Want ToDo"', () => {
      render(<App />);
      expect(screen.getByText(/What do I Want ToDo/i)).toBeInTheDocument();
    });

    it('renders TodoTrigger component', () => {
      render(<App />);
      expect(screen.getByTestId('todo-trigger')).toBeInTheDocument();
    });

    it('renders TodoBoard component with empty todoCards array initially', () => {
      render(<App />);
      expect(screen.getByTestId('todoBoard')).toBeInTheDocument();
      expect(
        screen.queryByTestId('todo-list-container')
      ).not.toBeInTheDocument();
    });
  });
  describe('state management', () => {
    it('should add new cards to todoCards state when onCreateCard is called', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Create a card through TodoTrigger
      const triggerInput = screen.getByPlaceholderText(/take a note/i);
      await user.click(triggerInput);

      const modal = screen.getByTestId('todo-modal');
      const titleInput = within(modal).getByPlaceholderText(/enter a title/i);
      await user.type(titleInput, 'Test Card');

      const saveButton = within(modal).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      await user.keyboard('{Escape}');

      // Verify card was added to todoCards state and displays in TodoBoard
      expect(screen.getByTestId('todo-list-container')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Card')).toBeInTheDocument();
    });

    it('should edit an existing card', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Create a card through TodoTrigger
      const triggerInput = screen.getByPlaceholderText(/take a note/i);
      await user.click(triggerInput);

      const modal = screen.getByTestId('todo-modal');
      const titleInput = within(modal).getByPlaceholderText(/enter a title/i);
      await user.type(titleInput, 'Test Card');

      const saveButton = within(modal).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      await user.keyboard('{Escape}');

      // Verify card was added to todoCards state and displays in TodoBoard
      expect(screen.getByTestId('todo-list-container')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Card')).toBeInTheDocument();

      // Edit the card
      const existingTitleInput = screen.getByDisplayValue('Test Card');
      await user.clear(existingTitleInput);
      await user.type(existingTitleInput, 'Updated Test Card');

      // Save the edit
      const existingCard = existingTitleInput.closest('div')!;
      const editSaveButton = within(existingCard).getByRole('button', {
        name: 'Save',
      });
      await user.click(editSaveButton);

      // Verify card was updated in todoCards state and displays in TodoBoard
      expect(screen.getByTestId('todo-list-container')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Updated Test Card')).toBeInTheDocument();
    });
  });
});
