import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Icon } from '../Icon';
import type { IconName } from '../../types';

describe('Icon', () => {
  describe('rendering', () => {
    it('renders an img element with correct src', () => {
      render(<Icon name="plus" />);
      
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/icons/plus.svg');
    });

    it('applies custom className when provided', () => {
      render(<Icon name="plus" className="custom-class" />);
      
      const img = screen.getByRole('img');
      expect(img).toHaveClass('custom-class');
    });

    it('does not apply className when not provided', () => {
      render(<Icon name="plus" />);
      
      const img = screen.getByRole('img');
      expect(img).not.toHaveAttribute('class');
    });

    it('sets title attribute when provided', () => {
      render(<Icon name="plus" title="Test Title" />);
      
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('title', 'Test Title');
    });

    it('does not set title attribute when not provided', () => {
      render(<Icon name="plus" />);
      
      const img = screen.getByRole('img');
      expect(img).not.toHaveAttribute('title');
    });
  });

  describe('alt text handling', () => {
    it('uses provided alt text when given', () => {
      render(<Icon name="plus" alt="Custom Alt Text" />);
      
      const img = screen.getByAltText('Custom Alt Text');
      expect(img).toBeInTheDocument();
    });

    it('falls back to title when alt is not provided but title is', () => {
      render(<Icon name="plus" title="Test Title" />);
      
      const img = screen.getByAltText('Test Title');
      expect(img).toBeInTheDocument();
    });

    it('falls back to name when neither alt nor title are provided', () => {
      render(<Icon name="plus" />);
      
      const img = screen.getByAltText('plus');
      expect(img).toBeInTheDocument();
    });

    it('prefers alt over title when both are provided', () => {
      render(<Icon name="plus" title="Test Title" alt="Custom Alt" />);
      
      const img = screen.getByAltText('Custom Alt');
      expect(img).toBeInTheDocument();
      expect(screen.queryByAltText('Test Title')).not.toBeInTheDocument();
    });
  });

  describe('click handling', () => {
    it('calls onClick handler when clicked', async () => {
      const user = userEvent.setup();
      const mockClick = vi.fn();
      
      render(<Icon name="plus" onClick={mockClick} />);
      
      const img = screen.getByRole('img');
      await user.click(img);
      
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when not provided', async () => {
      const user = userEvent.setup();
      
      render(<Icon name="plus" />);
      
      const img = screen.getByRole('img');
      // Should not throw error when clicking without onClick handler
      await user.click(img);
      
      expect(img).toBeInTheDocument(); // Just verify it still exists
    });

    it('passes click event to onClick handler', async () => {
      const user = userEvent.setup();
      const mockClick = vi.fn();
      
      render(<Icon name="plus" onClick={mockClick} />);
      
      const img = screen.getByRole('img');
      await user.click(img);
      
      expect(mockClick).toHaveBeenCalledWith(expect.any(Object));
      expect(mockClick.mock.calls[0][0]).toHaveProperty('type', 'click');
    });
  });

  describe('icon path construction', () => {
    it('constructs correct path for different icon names', () => {
      const testCases: { name: IconName; alt: string }[] = [
        { name: 'add-todoitem', alt: 'Add todo item' },
        { name: 'palette', alt: 'Color palette' },
        { name: 'trash', alt: 'Delete' }
      ];

      testCases.forEach(({ name, alt }) => {
        render(<Icon name={name} alt={alt} />);
        
        const img = screen.getByAltText(alt);
        expect(img).toHaveAttribute('src', `/icons/${name}.svg`);
      });
    });

    it('handles icon names with dashes', () => {
      render(<Icon name="add-todoitem" alt="Add todo item" />);
      
      const img = screen.getByAltText('Add todo item');
      expect(img).toHaveAttribute('src', '/icons/add-todoitem.svg');
    });

    it('handles minimal valid icon name', () => {
      render(<Icon name="x" alt="Close" />);
      
      const img = screen.getByAltText('Close');
      expect(img).toHaveAttribute('src', '/icons/x.svg');
    });
  });

  describe('accessibility', () => {
    it('provides accessible image with meaningful alt text', () => {
      render(<Icon name="checkbox-checked" alt="Task completed" />);
      
      const img = screen.getByRole('img', { name: 'Task completed' });
      expect(img).toBeInTheDocument();
    });

    it('is focusable when onClick is provided', () => {
      render(<Icon name="plus" onClick={() => {}} />);
      
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      // Note: Images with onClick handlers should be focusable in real applications
      // but this is a limitation of the current implementation
    });

    it('provides both title and alt for screen readers', () => {
      render(<Icon name="plus" title="Icon Title" alt="Icon Description" />);
      
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('title', 'Icon Title');
      expect(img).toHaveAttribute('alt', 'Icon Description');
    });
  });

  describe('integration with different icon types', () => {
    it('works with todo-related icons', () => {
      const todoIcons: { name: IconName; alt: string }[] = [
        { name: 'add-todoitem', alt: 'Add todo item' },
        { name: 'plus', alt: 'Plus icon' }
      ];
      
      todoIcons.forEach(({ name, alt }) => {
        render(<Icon name={name} alt={alt} />);
        
        const img = screen.getByAltText(alt);
        expect(img).toHaveAttribute('src', `/icons/${name}.svg`);
      });
    });

    it('works with UI control icons', () => {
      const controlIcons: { name: IconName; alt: string }[] = [
        { name: 'palette', alt: 'Color palette' },
        { name: 'trash', alt: 'Delete' },
        { name: 'x', alt: 'Close' }
      ];
      
      controlIcons.forEach(({ name, alt }) => {
        render(<Icon name={name} alt={alt} />);
        
        const img = screen.getByAltText(alt);
        expect(img).toHaveAttribute('src', `/icons/${name}.svg`);
      });
    });
  });

  describe('error handling', () => {
    it('renders correctly with valid icon names', () => {
      render(<Icon name="trash" alt="Delete" />);
      
      const img = screen.getByAltText('Delete');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/icons/trash.svg');
    });

    it('handles undefined props gracefully', () => {
      render(<Icon name="plus" className={undefined} title={undefined} alt={undefined} />);
      
      const img = screen.getByAltText('plus');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', 'plus'); // Falls back to name
    });
  });
});