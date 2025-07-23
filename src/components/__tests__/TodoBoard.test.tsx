import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TodoBoard } from '../TodoBoard';
import { TodoProvider } from '../../context/TodoContext';

// Test wrapper component that provides context
const TestTodoBoard = () => {
  return (
    <TodoProvider>
      <TodoBoard />
    </TodoProvider>
  );
};

describe('TodoBoard', () => {
  it('renders the TodoBoard component', () => {
    render(<TestTodoBoard />);
    expect(screen.getByTestId('todoBoard')).toBeInTheDocument();
  });

  it('renders empty board initially', () => {
    render(<TestTodoBoard />);
    expect(screen.queryByTestId('todoCard')).not.toBeInTheDocument();
  });

  // Note: Full functionality testing is done in App.test.tsx integration tests
  // since TodoBoard requires the complete context setup for meaningful testing
});
