import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../../App';
import userEvent from '@testing-library/user-event';

const createCard = async (user: ReturnType<typeof userEvent.setup>, title: string) => {
  const triggerInput = screen.getByTestId('todoTrigger-input');
  await user.click(triggerInput);

  const modal = screen.getByTestId('todoCardEditor-modal');
  const titleInput = within(modal).getByTestId('todoCardEditor-title-input');
  await user.type(titleInput, title);

  const saveButton = within(modal).getByRole('button', { name: 'Save' });
  await user.click(saveButton);
};

describe('App', () => {
  describe('initial state', () => {
    it('renders main components', () => {
      render(<App />);
      expect(screen.getByTestId('todoTrigger')).toBeInTheDocument();
      expect(screen.getByTestId('todoBoard')).toBeInTheDocument();
      expect(screen.queryByTestId('todoCardEditor-modal')).not.toBeInTheDocument();
    });
  });

  describe('create workflow', () => {
    it('opens create modal when trigger is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      expect(screen.getByTestId('todoCardEditor-modal')).toBeInTheDocument();
    });

    it('creates new card when saved', async () => {
      const user = userEvent.setup();
      render(<App />);

      await createCard(user, 'NewTestCard');

      expect(screen.queryByTestId('todoCardEditor-modal')).not.toBeInTheDocument();
      const todoBoard = screen.getByTestId('todoBoard');
      expect(within(todoBoard).getByText('NewTestCard')).toBeInTheDocument();
    });

    it('closes modal on ESC key', async () => {
      const user = userEvent.setup();
      render(<App />);

      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);
      expect(screen.getByTestId('todoCardEditor-modal')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(screen.queryByTestId('todoCardEditor-modal')).not.toBeInTheDocument();
    });

    it('saves and closes on backdrop click', async () => {
      const user = userEvent.setup();
      render(<App />);

      const triggerInput = screen.getByTestId('todoTrigger-input');
      await user.click(triggerInput);

      const backdrop = screen.getByTestId('todoCardEditor-modal');
      await user.click(backdrop);

      expect(screen.queryByTestId('todoCardEditor-modal')).not.toBeInTheDocument();
      expect(screen.getByTestId('todoCardDisplay')).toBeInTheDocument();
    });
  });

  describe('edit workflow', () => {
    it('opens edit modal when card is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      await createCard(user, 'OriginalCard');

      const todoBoard = screen.getByTestId('todoBoard');
      const cardElement = within(todoBoard).getByTestId('todoCardDisplay');
      await user.click(cardElement);

      expect(screen.getByTestId('todoCardEditor-modal')).toBeInTheDocument();
      const editModal = screen.getByTestId('todoCardEditor-modal');
      expect(within(editModal).getByDisplayValue('OriginalCard')).toBeInTheDocument();
    });

    it('updates existing card when saved', async () => {
      const user = userEvent.setup();
      render(<App />);

      await createCard(user, 'OriginalCard');

      const todoBoard = screen.getByTestId('todoBoard');
      const cardElement = within(todoBoard).getByTestId('todoCardDisplay');
      await user.click(cardElement);

      const editModal = screen.getByTestId('todoCardEditor-modal');
      const modalTitleInput = within(editModal).getByDisplayValue('OriginalCard');
      await user.clear(modalTitleInput);
      await user.type(modalTitleInput, 'UpdatedCard');

      const modalSaveButton = within(editModal).getByRole('button', { name: 'Save' });
      await user.click(modalSaveButton);

      expect(screen.queryByTestId('todoCardEditor-modal')).not.toBeInTheDocument();
      expect(within(todoBoard).getByText('UpdatedCard')).toBeInTheDocument();
      expect(within(todoBoard).queryByText('OriginalCard')).not.toBeInTheDocument();
    });

    it('closes edit modal on ESC key', async () => {
      const user = userEvent.setup();
      render(<App />);

      await createCard(user, 'TestCard');

      const todoBoard = screen.getByTestId('todoBoard');
      const cardElement = within(todoBoard).getByTestId('todoCardDisplay');
      await user.click(cardElement);

      expect(screen.getByTestId('todoCardEditor-modal')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(screen.queryByTestId('todoCardEditor-modal')).not.toBeInTheDocument();
    });
  });

  describe('todo management', () => {
    it('adds new todo to card', async () => {
      const user = userEvent.setup();
      render(<App />);

      await createCard(user, 'TestCard');

      const todoBoard = screen.getByTestId('todoBoard');
      const cardElement = within(todoBoard).getByTestId('todoCardDisplay');
      await user.click(cardElement);

      const editModal = screen.getByTestId('todoCardEditor-modal');
      const todoContainer = within(editModal).getByTestId('todoItem-list');
      
      let todoInputs = within(todoContainer).getAllByRole('textbox');
      expect(todoInputs).toHaveLength(1);

      const addButton = within(editModal).getByRole('button', { name: 'add toDo' });
      await user.click(addButton);

      todoInputs = within(todoContainer).getAllByRole('textbox');
      expect(todoInputs).toHaveLength(2);
    });
  });

  describe('card deletion', () => {
    it('deletes card when Delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);

      await createCard(user, 'CardToDelete');

      const todoBoard = screen.getByTestId('todoBoard');
      expect(within(todoBoard).getByText('CardToDelete')).toBeInTheDocument();

      const toolbar = within(todoBoard).getByRole('toolbar');
      const deleteButton = within(toolbar).getByRole('button', { name: 'Delete card' });
      await user.click(deleteButton);

      expect(within(todoBoard).queryByText('CardToDelete')).not.toBeInTheDocument();
    });
  });

  describe('multiple cards', () => {
    it('handles multiple cards correctly', async () => {
      const user = userEvent.setup();
      render(<App />);

      await createCard(user, 'FirstCard');
      await createCard(user, 'SecondCard');

      const todoBoard = screen.getByTestId('todoBoard');
      expect(within(todoBoard).getByText('FirstCard')).toBeInTheDocument();
      expect(within(todoBoard).getByText('SecondCard')).toBeInTheDocument();
      expect(within(todoBoard).getAllByTestId('todoCardDisplay')).toHaveLength(2);
    });
  });
});