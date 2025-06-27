import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../../App';

describe('App', () => {
  describe('rendering', () => {
    it('renders the main title "What I Want ToDo"', () => {
      render(<App />);
      expect(screen.getByText(/What do I Want ToDo/i)).toBeInTheDocument();
    });

    it('renders TodoTrigger component', () => {
      render(<App />);
      expect(screen.getByTestId('todo-trigger')).toBeInTheDocument();
    });

    it('renders TodoBoard component', () => {
      render(<App />);
      expect(screen.getByText('Todo Board')).toBeInTheDocument();
    });
  });

  describe('initial state', () => {
    it('renders TodoBoard with empty todoCards array', () => {
      render(<App />);
      // Verify no TodoCards are rendered initially
      expect(
        screen.queryByTestId('todo-list-container')
      ).not.toBeInTheDocument();
    });
  });
});
