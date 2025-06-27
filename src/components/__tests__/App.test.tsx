import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../../App';

describe('App', () => {
  describe('initial state', () => {
    it('renders the main title "What I Want ToDo"', () => {
      render(<App />);

      expect(screen.getByText(/What do I Want ToDo/i)).toBeInTheDocument();
    });
  });
});
