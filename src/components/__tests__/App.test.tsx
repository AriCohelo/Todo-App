import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../../App';
import userEvent from '@testing-library/user-event';

describe('App', () => {
  describe('rendering', () => {

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
      await user.type(titleInput, 'NewTestCard');

      // Save the card
      const saveButton = within(modal).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      // Modal should close and card should appear in TodoBoard
      expect(screen.queryByTestId('todoTrigger-modal')).not.toBeInTheDocument();

      const todoBoard = screen.getByTestId('todoBoard');
      expect(
        within(todoBoard).getByDisplayValue('NewTestCard')
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
      await user.type(titleInput, 'BackdropTestCard');

      // Click backdrop
      await user.click(modal);

      // Modal should close and card should appear in TodoBoard
      expect(screen.queryByTestId('todoTrigger-modal')).not.toBeInTheDocument();

      const todoBoard = screen.getByTestId('todoBoard');
      expect(
        within(todoBoard).getByDisplayValue('BackdropTestCard')
      ).toBeInTheDocument();
    });

    it('closes modal and saves when backdrop is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Open create modal - now creates card immediately
      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      // Click backdrop - should save and close
      const backdrop = screen.getByTestId('todoTrigger-modal');
      await user.click(backdrop);

      // Modal should close and card should be created on the board
      expect(screen.queryByTestId('todoTrigger-modal')).not.toBeInTheDocument();
      expect(screen.getByTestId('todoCard')).toBeInTheDocument();
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
      await user.type(titleInput, 'OriginalCard');

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
        within(editModal).getByDisplayValue('OriginalCard')
      ).toBeInTheDocument();

      // Card should be hidden in TodoBoard while being edited
      const cardContainer = todoBoard.querySelector('.hidden');
      expect(cardContainer).toBeInTheDocument();
    });

    it('updates existing card when Save button is clicked in edit mode', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Create a card first
      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      const modal = screen.getByTestId('todoTrigger-modal');
      const titleInput = within(modal).getByTestId('todoCard-title-input');
      await user.type(titleInput, 'OriginalCard');

      const saveButton = within(modal).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      // Click on the card to edit
      const todoBoard = screen.getByTestId('todoBoard');
      const cardElement = within(todoBoard).getByTestId('todoCard');
      await user.click(cardElement);

      // Card should be hidden in TodoBoard while being edited
      const cardContainer = todoBoard.querySelector('.hidden');
      expect(cardContainer).toBeInTheDocument();

      // Edit the title in the modal
      const editModal = screen.getByTestId('todoTrigger-modal');
      const modalTitleInput =
        within(editModal).getByDisplayValue('OriginalCard');
      await user.clear(modalTitleInput);
      await user.type(modalTitleInput, 'UpdatedCard');

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
        within(todoBoard).getByDisplayValue('UpdatedCard')
      ).toBeInTheDocument();
      expect(
        within(todoBoard).queryByDisplayValue('OriginalCard')
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
      await user.type(titleInput, 'TestCard');

      const saveButton = within(modal).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      // Click on the card to edit
      const todoBoard = screen.getByTestId('todoBoard');
      const cardElement = within(todoBoard).getByTestId('todoCard');
      await user.click(cardElement);

      expect(screen.getByTestId('todoTrigger-modal')).toBeInTheDocument();

      // Card should be hidden in TodoBoard while being edited
      const cardContainer = todoBoard.querySelector('.hidden');
      expect(cardContainer).toBeInTheDocument();

      // Press ESC to close
      await user.keyboard('{Escape}');

      expect(screen.queryByTestId('todoTrigger-modal')).not.toBeInTheDocument();

      // Card should reappear in TodoBoard after modal closes
      expect(
        within(todoBoard).getByDisplayValue('TestCard')
      ).toBeInTheDocument();
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
      await user.type(titleInput, 'TestCard');

      const saveButton = within(modal).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      // Click on the card to edit
      const todoBoard = screen.getByTestId('todoBoard');
      const cardElement = within(todoBoard).getByTestId('todoCard');
      await user.click(cardElement);

      // Card should be hidden in TodoBoard while being edited
      const cardContainer = todoBoard.querySelector('.hidden');
      expect(cardContainer).toBeInTheDocument();

      // In edit modal, click + button to add new todo
      const editModal = screen.getByTestId('todoTrigger-modal');
      const todoContainer = within(editModal).getByTestId('todoItem-list');
      
      // Should start with 1 todo
      let todoInputs = within(todoContainer).getAllByRole('textbox');
      expect(todoInputs).toHaveLength(1);

      // Click + button
      const addButton = within(editModal).getByRole('button', { name: 'add toDo' });
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
      await user.type(titleInput, 'CardtoDelete');

      const saveButton = within(modal).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      // Verify card exists in TodoBoard
      const todoBoard = screen.getByTestId('todoBoard');
      expect(
        within(todoBoard).getByDisplayValue('CardtoDelete')
      ).toBeInTheDocument();

      // Delete the card from TodoBoard
      const toolbar = within(todoBoard).getByRole('toolbar');
      const deleteButton = within(toolbar).getByRole('button', {
        name: 'Delete card',
      });
      await user.click(deleteButton);

      // Card should be removed from TodoBoard
      expect(
        within(todoBoard).queryByDisplayValue('CardtoDelete')
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
      await user.type(titleInput, 'FirstCard');

      const saveButton = within(modal).getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      // Create second card
      await user.click(triggerInput);

      const modal2 = screen.getByTestId('todoTrigger-modal');
      const titleInput2 = within(modal2).getByTestId('todoCard-title-input');
      await user.type(titleInput2, 'SecondCard');

      const saveButton2 = within(modal2).getByRole('button', { name: 'Save' });
      await user.click(saveButton2);

      // Both cards should exist in TodoBoard
      const todoBoard = screen.getByTestId('todoBoard');
      expect(
        within(todoBoard).getByDisplayValue('FirstCard')
      ).toBeInTheDocument();
      expect(
        within(todoBoard).getByDisplayValue('SecondCard')
      ).toBeInTheDocument();
      expect(within(todoBoard).getAllByTestId('todoCard')).toHaveLength(2);
    });
  });
});
