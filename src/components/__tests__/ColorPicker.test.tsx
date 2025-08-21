import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ColorPicker } from '../ColorPicker';
import { CARD_COLORS, COLOR_NAMES } from '../../constants/colors';

describe('ColorPicker', () => {
  const mockProps = {
    selectedColor: 'rose',
    onColorSelect: vi.fn(),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders all color options', () => {
      render(<ColorPicker {...mockProps} />);
      
      CARD_COLORS.forEach((colorClass, index) => {
        const colorButton = screen.getByTitle(COLOR_NAMES[index]);
        expect(colorButton).toBeInTheDocument();
        expect(colorButton).toHaveClass(colorClass);
      });
    });

    it('highlights selected color correctly', () => {
      render(<ColorPicker {...mockProps} selectedColor="bg-gradient-to-br from-emerald-300/80 to-emerald-100/40" />);
      
      const selectedButton = screen.getByTitle('emerald');
      expect(selectedButton).toHaveClass('border-white', 'shadow-lg');
      
      const nonSelectedButton = screen.getByTitle('rose');
      expect(nonSelectedButton).toHaveClass('border-gray-500');
    });

    it('renders correct number of color buttons', () => {
      render(<ColorPicker {...mockProps} />);
      const colorButtons = screen.getAllByRole('button');
      expect(colorButtons).toHaveLength(CARD_COLORS.length);
    });
  });

  describe('interactions', () => {
    it('calls onColorSelect and onClose when color is clicked', async () => {
      const user = userEvent.setup();
      render(<ColorPicker {...mockProps} />);

      const tealButton = screen.getByTitle('teal');
      await user.click(tealButton);

      expect(mockProps.onColorSelect).toHaveBeenCalledWith('bg-gradient-to-br from-teal-300/80 to-teal-100/40');
      expect(mockProps.onClose).toHaveBeenCalled();
    });

    it('stops propagation on color button click', async () => {
      const user = userEvent.setup();
      const parentClickHandler = vi.fn();
      
      render(
        <div onClick={parentClickHandler}>
          <ColorPicker {...mockProps} />
        </div>
      );

      const colorButton = screen.getByTitle('orange');
      await user.click(colorButton);

      expect(mockProps.onColorSelect).toHaveBeenCalledWith('bg-gradient-to-br from-orange-300/80 to-orange-100/40');
      expect(parentClickHandler).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('provides meaningful titles for screen readers', () => {
      render(<ColorPicker {...mockProps} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button, index) => {
        expect(button).toHaveAttribute('title', COLOR_NAMES[index]);
      });
    });
  });
});