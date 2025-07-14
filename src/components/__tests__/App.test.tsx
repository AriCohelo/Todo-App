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

    it('initially modal should not be present', () => {
      render(<App />);
      expect(screen.queryByTestId('todoTrigger-modal')).not.toBeInTheDocument();
    });
  });

  describe('create mode functionality', () => {
    it('opens create modal when TodoTrigger input is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      expect(screen.queryByTestId('todoTrigger-modal')).not.toBeInTheDocument();

      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      expect(screen.getByTestId('todoTrigger-modal')).toBeInTheDocument();
    });

    it('closes create modal when ESC key is pressed', async () => {
      const user = userEvent.setup();
      render(<App />);

      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      expect(screen.getByTestId('todoTrigger-modal')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByTestId('todoTrigger-modal')).not.toBeInTheDocument();
    });

    it('creates a new card when Save button is clicked in create mode', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Open create modal
      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      // Fill in title in modal
      const modal = screen.getByTestId('todoTrigger-modal');
      const titleInput = within(modal).getByTestId('todoCard-title-input');
      await user.type(titleInput, 'New Test Card');

      // Save the card
      const saveButton = within(modal).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      // Modal should close and card should appear in TodoBoard
      expect(screen.queryByTestId('todoTrigger-modal')).not.toBeInTheDocument();

      const todoBoard = screen.getByTestId('todoBoard');
      expect(
        within(todoBoard).getByDisplayValue('New Test Card')
      ).toBeInTheDocument();
    });

    it('saves and closes modal when backdrop is clicked with changes in create mode', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Open create modal
      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      // Make changes in modal
      const modal = screen.getByTestId('todoTrigger-modal');
      const titleInput = within(modal).getByTestId('todoCard-title-input');
      await user.type(titleInput, 'Backdrop Test Card');

      // Click backdrop
      await user.click(modal);

      // Modal should close and card should appear in TodoBoard
      expect(screen.queryByTestId('todoTrigger-modal')).not.toBeInTheDocument();

      const todoBoard = screen.getByTestId('todoBoard');
      expect(
        within(todoBoard).getByDisplayValue('Backdrop Test Card')
      ).toBeInTheDocument();
    });

    it('closes modal without saving when backdrop is clicked without changes', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Open create modal
      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      // Click backdrop without making changes
      const backdrop = screen.getByTestId('todoTrigger-modal');
      await user.click(backdrop);

      // Modal should close and no card should be created
      expect(screen.queryByTestId('todoTrigger-modal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('todoCard')).not.toBeInTheDocument();
    });
  });

  describe('edit mode functionality', () => {
    it('opens edit modal when existing card is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      // First create a card
      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      const modal = screen.getByTestId('todoTrigger-modal');
      const titleInput = within(modal).getByTestId('todoCard-title-input');
      await user.type(titleInput, 'Original Card');

      const saveButton = within(modal).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      // Now click on the created card to edit it
      const todoBoard = screen.getByTestId('todoBoard');
      const cardElement = within(todoBoard).getByTestId('todoCard');
      await user.click(cardElement);

      // Modal should open with existing data
      expect(screen.getByTestId('todoTrigger-modal')).toBeInTheDocument();

      const editModal = screen.getByTestId('todoTrigger-modal');
      expect(
        within(editModal).getByDisplayValue('Original Card')
      ).toBeInTheDocument();
    });

    it('updates existing card when Save button is clicked in edit mode', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Create a card first
      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      const modal = screen.getByTestId('todoTrigger-modal');
      const titleInput = within(modal).getByTestId('todoCard-title-input');
      await user.type(titleInput, 'Original Card');

      const saveButton = within(modal).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      // Click on the card to edit
      const todoBoard = screen.getByTestId('todoBoard');
      const cardElement = within(todoBoard).getByTestId('todoCard');
      await user.click(cardElement);

      // Edit the title in the modal
      const editModal = screen.getByTestId('todoTrigger-modal');
      const modalTitleInput =
        within(editModal).getByDisplayValue('Original Card');
      await user.clear(modalTitleInput);
      await user.type(modalTitleInput, 'Updated Card');

      // Check if save button is enabled
      const modalSaveButton = within(editModal).getByRole('button', {
        name: 'Save',
      });
      expect(modalSaveButton).toBeEnabled();

      // Save the changes
      await user.click(modalSaveButton);

      // Modal should close and card should be updated
      expect(screen.queryByTestId('todoTrigger-modal')).not.toBeInTheDocument();

      // Wait a bit for the update to propagate
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(
        within(todoBoard).getByDisplayValue('Updated Card')
      ).toBeInTheDocument();
      expect(
        within(todoBoard).queryByDisplayValue('Original Card')
      ).not.toBeInTheDocument();
    });

    it('closes edit modal when ESC key is pressed', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Create a card first
      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      const modal = screen.getByTestId('todoTrigger-modal');
      const titleInput = within(modal).getByTestId('todoCard-title-input');
      await user.type(titleInput, 'Test Card');

      const saveButton = within(modal).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      // Click on the card to edit
      const todoBoard = screen.getByTestId('todoBoard');
      const cardElement = within(todoBoard).getByTestId('todoCard');
      await user.click(cardElement);

      expect(screen.getByTestId('todoTrigger-modal')).toBeInTheDocument();

      // Press ESC to close
      await user.keyboard('{Escape}');

      expect(screen.queryByTestId('todoTrigger-modal')).not.toBeInTheDocument();
    });
  });

  describe('todo management', () => {
    it('adds new todo to existing card when + button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Create a card first
      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      const modal = screen.getByTestId('todoTrigger-modal');
      const titleInput = within(modal).getByTestId('todoCard-title-input');
      await user.type(titleInput, 'Test Card');

      const saveButton = within(modal).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      // Click on the card to edit
      const todoBoard = screen.getByTestId('todoBoard');
      const cardElement = within(todoBoard).getByTestId('todoCard');
      await user.click(cardElement);

      // In edit modal, click + button to add new todo
      const editModal = screen.getByTestId('todoTrigger-modal');
      const todoContainer = within(editModal).getByTestId('todoItem-list');
      
      // Should start with 1 todo
      let todoInputs = within(todoContainer).getAllByRole('textbox');
      expect(todoInputs).toHaveLength(1);

      // Click + button
      const addButton = within(editModal).getByRole('button', { name: '+' });
      await user.click(addButton);

      // Should now have 2 todos
      todoInputs = within(todoContainer).getAllByRole('textbox');
      expect(todoInputs).toHaveLength(2);
    });
  });

  describe('card management', () => {
    it('deletes card when Delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Create a card first
      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      const modal = screen.getByTestId('todoTrigger-modal');
      const titleInput = within(modal).getByTestId('todoCard-title-input');
      await user.type(titleInput, 'Card to Delete');

      const saveButton = within(modal).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      // Verify card exists in TodoBoard
      const todoBoard = screen.getByTestId('todoBoard');
      expect(
        within(todoBoard).getByDisplayValue('Card to Delete')
      ).toBeInTheDocument();

      // Delete the card from TodoBoard
      const toolbar = within(todoBoard).getByRole('toolbar');
      const deleteButton = within(toolbar).getByRole('button', {
        name: 'Delete',
      });
      await user.click(deleteButton);

      // Card should be removed from TodoBoard
      expect(
        within(todoBoard).queryByDisplayValue('Card to Delete')
      ).not.toBeInTheDocument();
    });

    it('handles multiple cards correctly', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Create first card
      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      const modal = screen.getByTestId('todoTrigger-modal');
      const titleInput = within(modal).getByTestId('todoCard-title-input');
      await user.type(titleInput, 'First Card');

      const saveButton = within(modal).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      // Create second card
      await user.click(triggerInput);

      const modal2 = screen.getByTestId('todoTrigger-modal');
      const titleInput2 = within(modal2).getByTestId('todoCard-title-input');
      await user.type(titleInput2, 'Second Card');

      const saveButton2 = within(modal2).getByRole('button', { name: 'Save' });
      await user.click(saveButton2);

      // Both cards should exist in TodoBoard
      const todoBoard = screen.getByTestId('todoBoard');
      expect(
        within(todoBoard).getByDisplayValue('First Card')
      ).toBeInTheDocument();
      expect(
        within(todoBoard).getByDisplayValue('Second Card')
      ).toBeInTheDocument();
      expect(within(todoBoard).getAllByTestId('todoCard')).toHaveLength(2);
    });
  });
});
