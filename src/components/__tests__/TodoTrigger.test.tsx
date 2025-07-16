import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoTrigger } from '../TodoTrigger';
import { TodoProvider } from '../../context/TodoContext';

// Test wrapper component that provides context
const TestTodoTrigger = () => {
  return (
    <TodoProvider>
      <TodoTrigger />
    </TodoProvider>
  );
};

describe('TodoTrigger', () => {
  const user = userEvent.setup();

  describe('rendering', () => {
    beforeEach(() => {
      render(<TestTodoTrigger />);
    });

    it('renders title field within the trigger container', () => {
      expect(screen.getByTestId('todoTrigger-input')).toBeInTheDocument();
    });

    it('renders input with correct placeholder', () => {
      expect(screen.getByPlaceholderText('Take a note...')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('renders and works with context', async () => {
      render(<TestTodoTrigger />);

      const titleInput = screen.getByTestId('todoTrigger-input');
      expect(titleInput).toBeInTheDocument();
      
      // The actual modal opening functionality is tested in App.test.tsx
      // since it requires the full context setup
    });
  });
});
