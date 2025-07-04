import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../../App';
import userEvent from '@testing-library/user-event';

describe('App', () => {
  describe('rendering', () => {
    it('renders the main title "What I Want ToDo"', () => {
      render(<App />);
      expect(
        screen.getByRole('heading', { name: /What do I Want ToDo/i })
      ).toBeInTheDocument();
    });

    it('renders TodoTrigger component', () => {
      render(<App />);
      expect(screen.getByTestId('todoTrigger')).toBeInTheDocument();
    });

    it('renders TodoBoard component with empty todoCards array initially', () => {
      render(<App />);
      expect(screen.getByTestId('todoBoard')).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('shows and hides TodoTrigger modal when triggered', async () => {
      const user = userEvent.setup();
      render(<App />);

      expect(screen.queryByTestId('todoTrigger-modal')).not.toBeInTheDocument();

      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      expect(screen.getByTestId('todoTrigger-modal')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByTestId('todoTrigger-modal')).not.toBeInTheDocument();
    });
  });

  describe('integration', () => {
    it('should add new cards to todoCards state when onCreateCard is called', async () => {
      const user = userEvent.setup();
      render(<App />);

      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      const triggerModal = screen.getByTestId('todoTrigger-modal');
      const titleInput = screen.getByTestId('todoCard-title-input');
      await user.type(titleInput, 'Test Card');

      const saveButton = within(triggerModal).getByRole('button', {
        name: 'Save',
      });
      await user.click(saveButton);

      await user.keyboard('{Escape}');

      expect(screen.getByTestId('todoCard')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Card')).toBeInTheDocument();
    });

    it('should edit an existing card', async () => {
      const user = userEvent.setup();

      // create a card (setup)
      render(<App />);
      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      const titleInput = screen.getByTestId('todoCard-title-input');
      await user.type(titleInput, 'Original Card');

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);
      await user.keyboard('{Escape}');

      // test editing the existing card in TodoBoard
      const existingTitleInput = screen.getByDisplayValue('Original Card');
      await user.clear(existingTitleInput);
      await user.type(existingTitleInput, 'Updated Card');

      const editSaveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(editSaveButton);

      // verify the edit worked
      expect(screen.getByDisplayValue('Updated Card')).toBeInTheDocument();
      expect(
        screen.queryByDisplayValue('Original Card')
      ).not.toBeInTheDocument();
    });
  });
});
