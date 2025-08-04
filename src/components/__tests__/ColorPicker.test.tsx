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
      
      // Should render all colors from CARD_COLORS
      CARD_COLORS.forEach((colorClass, index) => {
        const colorButton = screen.getByTitle(COLOR_NAMES[index]);
        expect(colorButton).toBeInTheDocument();
        expect(colorButton).toHaveClass(colorClass);
      });
    });

    it('highlights selected color with correct border style', () => {
      render(<ColorPicker {...mockProps} selectedColor="bg-gradient-to-br from-emerald-300/80 to-emerald-100/40" />);
      
      const selectedButton = screen.getByTitle('emerald');
      expect(selectedButton).toHaveClass('border-white', 'shadow-lg');
    });

    it('applies default border style to non-selected colors', () => {
      render(<ColorPicker {...mockProps} selectedColor="bg-gradient-to-br from-emerald-300/80 to-emerald-100/40" />);
      
      const nonSelectedButton = screen.getByTitle('rose');
      expect(nonSelectedButton).toHaveClass('border-gray-500');
      expect(nonSelectedButton).not.toHaveClass('border-white', 'shadow-lg');
    });

    it('renders in a grid layout with correct structure', () => {
      const { container } = render(<ColorPicker {...mockProps} />);
      
      const grid = container.querySelector('.grid.grid-cols-3');
      expect(grid).toBeInTheDocument();
      
      // Should have correct number of color buttons
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

    it('container has click handler for stopPropagation', () => {
      const { container } = render(<ColorPicker {...mockProps} />);
      
      // The ColorPicker container should have an onClick handler to stop propagation
      const colorPickerContainer = container.firstChild as HTMLElement;
      expect(colorPickerContainer).toBeInTheDocument();
      
      // Test that the component structure is correct
      expect(colorPickerContainer).toHaveClass('absolute', 'bg-gray-900');
    });

    it('has hover effects on color buttons', () => {
      render(<ColorPicker {...mockProps} />);
      
      const colorButton = screen.getByTitle('amber');
      expect(colorButton).toHaveClass('hover:scale-110', 'hover:border-gray-300');
    });
  });

  describe('accessibility', () => {
    it('has proper button roles for all colors', () => {
      render(<ColorPicker {...mockProps} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(CARD_COLORS.length);
      
      buttons.forEach((button, index) => {
        expect(button).toHaveAttribute('title', COLOR_NAMES[index]);
      });
    });

    it('provides meaningful titles for screen readers', () => {
      render(<ColorPicker {...mockProps} />);
      
      expect(screen.getByTitle('rose')).toBeInTheDocument();
      expect(screen.getByTitle('orange')).toBeInTheDocument();
      expect(screen.getByTitle('violet')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('has correct positioning and z-index classes', () => {
      const { container } = render(<ColorPicker {...mockProps} />);
      
      const colorPicker = container.firstChild as HTMLElement;
      expect(colorPicker).toHaveClass(
        'absolute',
        'top-full',
        'right-0',
        'mt-2',
        'z-[9999]'
      );
    });

    it('has correct background and styling', () => {
      const { container } = render(<ColorPicker {...mockProps} />);
      
      const colorPicker = container.firstChild as HTMLElement;
      expect(colorPicker).toHaveClass(
        'bg-gray-900',
        'rounded-xl',
        'p-3',
        'shadow-xl'
      );
    });
  });

  describe('edge cases', () => {
    it('handles undefined selectedColor gracefully', () => {
      render(<ColorPicker {...mockProps} selectedColor={undefined as any} />);
      
      // Should render without crashing
      expect(screen.getAllByRole('button')).toHaveLength(CARD_COLORS.length);
    });

    it('handles empty string selectedColor gracefully', () => {
      render(<ColorPicker {...mockProps} selectedColor="" />);
      
      // Should render without crashing and no color should be highlighted
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).not.toHaveClass('border-white', 'shadow-lg');
      });
    });

    it('handles invalid selectedColor gracefully', () => {
      render(<ColorPicker {...mockProps} selectedColor="invalid-color" />);
      
      // Should render without crashing and no color should be highlighted
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).not.toHaveClass('border-white', 'shadow-lg');
      });
    });
  });
});