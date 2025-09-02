import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Icon } from '../Icon';

describe('Icon', () => {
  describe('rendering', () => {
    it('renders a div element with correct background image', () => {
      const { container } = render(<Icon name="plus" />);
      
      const icon = container.firstChild as HTMLElement;
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveStyle('background-image: url("/icons/plus.svg")');
    });

    it('applies custom className when provided', () => {
      const { container } = render(<Icon name="plus" className="custom-class" />);
      
      const icon = container.firstChild as HTMLElement;
      expect(icon).toHaveClass('custom-class');
    });

    it('sets title attribute when provided', () => {
      const { container } = render(<Icon name="plus" title="Test Title" />);
      
      const icon = container.firstChild as HTMLElement;
      expect(icon).toHaveAttribute('title', 'Test Title');
    });
  });

  describe('alt text handling', () => {
    it('uses provided alt text when given', () => {
      const { container } = render(<Icon name="plus" alt="Custom Alt Text" />);
      const icon = container.firstChild as HTMLElement;
      expect(icon).toBeInTheDocument();
    });

    it('falls back to title when alt is not provided', () => {
      const { container } = render(<Icon name="plus" title="Test Title" />);
      const icon = container.firstChild as HTMLElement;
      expect(icon).toHaveAttribute('title', 'Test Title');
    });

    it('falls back to name when neither alt nor title are provided', () => {
      const { container } = render(<Icon name="plus" />);
      const icon = container.firstChild as HTMLElement;
      expect(icon).toBeInTheDocument();
    });

    it('prefers alt over title when both are provided', () => {
      const { container } = render(<Icon name="plus" title="Test Title" alt="Custom Alt" />);
      const icon = container.firstChild as HTMLElement;
      expect(icon).toHaveAttribute('title', 'Test Title');
    });
  });

  describe('click handling', () => {
    it('calls onClick handler when clicked', async () => {
      const user = userEvent.setup();
      const mockClick = vi.fn();
      
      const { container } = render(<Icon name="plus" onClick={mockClick} />);
      
      const icon = container.firstChild as HTMLElement;
      await user.click(icon);
      
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('passes click event to onClick handler', async () => {
      const user = userEvent.setup();
      const mockClick = vi.fn();
      
      const { container } = render(<Icon name="plus" onClick={mockClick} />);
      
      const icon = container.firstChild as HTMLElement;
      await user.click(icon);
      
      expect(mockClick).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('accessibility', () => {
    it('provides accessible image with meaningful alt text', () => {
      const { container } = render(<Icon name="checkbox-checked" alt="Task completed" />);
      const icon = container.firstChild as HTMLElement;
      expect(icon).toBeInTheDocument();
    });

    it('provides both title and alt for screen readers', () => {
      const { container } = render(<Icon name="plus" title="Icon Title" alt="Icon Description" />);
      
      const icon = container.firstChild as HTMLElement;
      expect(icon).toHaveAttribute('title', 'Icon Title');
    });
  });
});