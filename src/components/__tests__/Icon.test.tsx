import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Icon } from '../Icon';

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

    it('sets title attribute when provided', () => {
      render(<Icon name="plus" title="Test Title" />);
      
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('title', 'Test Title');
    });
  });

  describe('alt text handling', () => {
    it('uses provided alt text when given', () => {
      render(<Icon name="plus" alt="Custom Alt Text" />);
      expect(screen.getByAltText('Custom Alt Text')).toBeInTheDocument();
    });

    it('falls back to title when alt is not provided', () => {
      render(<Icon name="plus" title="Test Title" />);
      expect(screen.getByAltText('Test Title')).toBeInTheDocument();
    });

    it('falls back to name when neither alt nor title are provided', () => {
      render(<Icon name="plus" />);
      expect(screen.getByAltText('plus')).toBeInTheDocument();
    });

    it('prefers alt over title when both are provided', () => {
      render(<Icon name="plus" title="Test Title" alt="Custom Alt" />);
      
      expect(screen.getByAltText('Custom Alt')).toBeInTheDocument();
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

    it('passes click event to onClick handler', async () => {
      const user = userEvent.setup();
      const mockClick = vi.fn();
      
      render(<Icon name="plus" onClick={mockClick} />);
      
      const img = screen.getByRole('img');
      await user.click(img);
      
      expect(mockClick).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('accessibility', () => {
    it('provides accessible image with meaningful alt text', () => {
      render(<Icon name="checkbox-checked" alt="Task completed" />);
      expect(screen.getByRole('img', { name: 'Task completed' })).toBeInTheDocument();
    });

    it('provides both title and alt for screen readers', () => {
      render(<Icon name="plus" title="Icon Title" alt="Icon Description" />);
      
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('title', 'Icon Title');
      expect(img).toHaveAttribute('alt', 'Icon Description');
    });
  });
});