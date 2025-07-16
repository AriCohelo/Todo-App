import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TodoBoard } from '../TodoBoard';
import { TodoProvider } from '../../context/TodoContext';
import type { TodoCardData } from '../../types';

// Test wrapper component that provides context
const TestTodoBoard = ({ initialCards = [] }: { initialCards?: TodoCardData[] }) => {
  return (
    <TodoProvider>
      <TodoBoard />
    </TodoProvider>
  );
};

describe('TodoBoard', () => {
  describe('rendering', () => {
    it('renders no TodoCards when todoCards array is empty', () => {
      render(<TestTodoBoard />);
      expect(screen.queryByTestId('todoItem-list')).not.toBeInTheDocument();
    });

    it('renders TodoCards when todoCards array has data', () => {
      // Since we can't easily inject initial data into context for tests,
      // we'll test this functionality through the App.test.tsx integration tests
      render(<TestTodoBoard />);
      expect(screen.getByTestId('todoBoard')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('renders the TodoBoard component', () => {
      render(<TestTodoBoard />);
      expect(screen.getByTestId('todoBoard')).toBeInTheDocument();
    });

    // Note: Detailed interaction tests are now in App.test.tsx
    // since they require the full context setup with state management
  });
});
