import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CardToolbar } from '../CardToolbar';
import type { TodoCardData } from '../../types';

// Mock the ColorPicker component since it's tested separately
vi.mock('../ColorPicker', () => ({
  ColorPicker: vi.fn(({ onColorSelect, onClose }) => (
    <div data-testid="color-picker">
      <div onClick={() => onColorSelect('test-color')}>Test Color</div>
      <div onClick={onClose}>Close Picker</div>
    </div>
  ))
}));

// Mock the Icon component since it's tested separately
vi.mock('../Icon', () => ({
  Icon: vi.fn(({ name, alt }) => (
    <div data-testid={`icon-${name}`} aria-label={alt}>{name}</div>
  ))
}));

describe('CardToolbar', () => {
  const mockProps = {
    isModal: false,
    isBeingEdited: false,
    hasUnsavedChanges: false,
    onColorSelect: vi.fn(),
    onDelete: vi.fn(),
    onClose: vi.fn(),
    onSave: vi.fn(),
    onColorPickerToggle: vi.fn(),
    onAddTodo: vi.fn(),
  };

  const sampleCardData: TodoCardData = {
    id: 'test-card-id',
    title: 'Test Card',
    todos: [],
    updatedAt: new Date(),
    backgroundColor: 'rose'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders toolbar with correct role and essential buttons', () => {
      render(<CardToolbar {...mockProps} />);
      
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
      expect(screen.getByLabelText('add toDo')).toBeInTheDocument();
      expect(screen.getByTitle('Color palette')).toBeInTheDocument();
      expect(screen.getByTitle('Delete card')).toBeInTheDocument();
      expect(screen.getByTestId('icon-add-todoitem')).toBeInTheDocument();
      expect(screen.getByTestId('icon-palette')).toBeInTheDocument();
      expect(screen.getByTestId('icon-trash')).toBeInTheDocument();
    });

    it('renders save button only in modal mode', () => {
      render(<CardToolbar {...mockProps} isModal={true} />);
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

      cleanup();

      render(<CardToolbar {...mockProps} isModal={false} />);
      expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
    });

    it('applies correct styling based on modal vs board mode', () => {
      // Board mode has hover opacity styles
      render(<CardToolbar {...mockProps} isModal={false} />);
      const boardToolbar = screen.getByRole('toolbar');
      expect(boardToolbar).toHaveClass('opacity-0', 'group-hover:opacity-100', 'transition-opacity');

      cleanup();

      // Modal mode does not have hover opacity styles
      render(<CardToolbar {...mockProps} isModal={true} />);
      const modalToolbar = screen.getByRole('toolbar');
      expect(modalToolbar).not.toHaveClass('opacity-0', 'group-hover:opacity-100', 'transition-opacity');
    });
  });

  describe('user interactions', () => {
    it('calls onAddTodo when add button is clicked', async () => {
      const user = userEvent.setup();
      render(<CardToolbar {...mockProps} />);

      const addButton = screen.getByLabelText('add toDo');
      await user.click(addButton);

      expect(mockProps.onAddTodo).toHaveBeenCalledTimes(1);
    });

    it('opens color picker and handles color selection', async () => {
      const user = userEvent.setup();
      render(<CardToolbar {...mockProps} />);

      const paletteButton = screen.getByTitle('Color palette');
      await user.click(paletteButton);

      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
      expect(mockProps.onColorPickerToggle).toHaveBeenCalledWith(true);

      // Select a color
      const testColorButton = screen.getByText('Test Color');
      await user.click(testColorButton);

      expect(mockProps.onColorSelect).toHaveBeenCalledWith('test-color');
    });

    it('handles delete functionality in different modes', async () => {
      const user = userEvent.setup();
      
      // Board mode with data
      render(<CardToolbar {...mockProps} initialData={sampleCardData} />);
      const deleteButton = screen.getByTitle('Delete card');
      await user.click(deleteButton);
      expect(mockProps.onDelete).toHaveBeenCalledWith('test-card-id');

      cleanup();
      vi.clearAllMocks();

      // Modal mode without data - should show discard title
      render(<CardToolbar {...mockProps} isModal={true} />);
      const discardButton = screen.getByTitle('Discard changes and close');
      await user.click(discardButton);
      expect(mockProps.onDelete).not.toHaveBeenCalled();
      expect(mockProps.onClose).toHaveBeenCalled();
    });

    it('handles save functionality in modal mode', async () => {
      const user = userEvent.setup();
      render(<CardToolbar {...mockProps} isModal={true} hasUnsavedChanges={true} />);

      const saveButton = screen.getByRole('button', { name: 'Save' });
      expect(saveButton).toBeEnabled();
      
      await user.click(saveButton);
      expect(mockProps.onSave).toHaveBeenCalledTimes(1);
    });

    it('disables buttons when being edited', () => {
      render(<CardToolbar {...mockProps} isBeingEdited={true} isModal={true} hasUnsavedChanges={true} />);
      
      expect(screen.getByLabelText('add toDo')).toBeDisabled();
      expect(screen.getByTitle('Color palette')).toBeDisabled();
      expect(screen.getByTitle('Discard changes and close')).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });

    it('disables save button without unsaved changes', () => {
      render(<CardToolbar {...mockProps} isModal={true} hasUnsavedChanges={false} />);
      expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    });
  });

  describe('positioning and layout', () => {
    it('positions buttons correctly in modal vs board mode', () => {
      // Modal mode positioning
      render(<CardToolbar {...mockProps} isModal={true} />);
      expect(screen.getByTitle('Color palette')).toHaveClass('col-start-6');
      expect(screen.getByTitle('Discard changes and close')).toHaveClass('col-start-7');

      cleanup();

      // Board mode positioning
      render(<CardToolbar {...mockProps} isModal={false} />);
      expect(screen.getByTitle('Color palette')).toHaveClass('col-start-8');
      expect(screen.getByTitle('Delete card')).toHaveClass('col-start-9');
    });
  });

  describe('background color handling', () => {
    it('uses backgroundColor prop or falls back to initialData backgroundColor', async () => {
      const user = userEvent.setup();
      
      // With backgroundColor prop
      render(<CardToolbar {...mockProps} backgroundColor="blue" />);
      const paletteButton = screen.getByTitle('Color palette');
      await user.click(paletteButton);
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();

      cleanup();

      // Without backgroundColor prop, should use initialData
      render(<CardToolbar {...mockProps} initialData={sampleCardData} />);
      const paletteButton2 = screen.getByTitle('Color palette');
      await user.click(paletteButton2);
      expect(screen.getByTestId('color-picker')).toBeInTheDocument();
    });
  });
});