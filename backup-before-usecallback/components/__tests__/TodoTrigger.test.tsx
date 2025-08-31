import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { CardTrigger } from '../CardTrigger';
import { CardBoardProvider } from '../../context/CardBoardContext';
import { CardEditorProvider } from '../../context/CardEditorContext';

const TestTodoTrigger = () => {
  return (
    <CardBoardProvider>
      <CardEditorProvider>
        <CardTrigger />
      </CardEditorProvider>
    </CardBoardProvider>
  );
};

describe('CardTrigger', () => {
  describe('rendering', () => {
    it('renders todo trigger with input field', () => {
      render(<TestTodoTrigger />);
      
      const trigger = screen.getByTestId('todoTrigger');
      expect(trigger).toBeInTheDocument();
      
      const input = screen.getByTestId('todoTrigger-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Take a note...');
      expect(input).toHaveAttribute('readonly');
    });
  });

  describe('interactions', () => {
    it('focuses input when clicked', async () => {
      const user = userEvent.setup();
      render(<TestTodoTrigger />);
      
      const input = screen.getByTestId('todoTrigger-input');
      await user.click(input);
      
      expect(input).toHaveFocus();
    });

    it('prevents typing in read-only input', async () => {
      const user = userEvent.setup();
      render(<TestTodoTrigger />);
      
      const input = screen.getByTestId('todoTrigger-input') as HTMLInputElement;
      await user.click(input);
      await user.type(input, 'test text');
      
      expect(input.value).toBe('');
    });
  });

  describe('accessibility', () => {
    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<TestTodoTrigger />);
      
      const input = screen.getByTestId('todoTrigger-input');
      await user.tab();
      
      expect(input).toHaveFocus();
    });
  });
});