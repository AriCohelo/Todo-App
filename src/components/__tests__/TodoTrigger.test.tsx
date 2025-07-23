import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
  it('renders input field with correct placeholder', () => {
    render(<TestTodoTrigger />);
    expect(screen.getByTestId('todoTrigger-input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Take a note...')).toBeInTheDocument();
  });

  // Note: Full functionality testing (modal opening, interactions) is done in 
  // App.test.tsx integration tests since it requires the complete context setup
});
