import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoTrigger } from '../TodoTrigger';

describe('TodoTrigger', () => {
  const user = userEvent.setup();

  describe('rendering', () => {
    let triggerContainer: HTMLElement;

    beforeEach(() => {
      render(<TodoTrigger onOpenModal={() => {}} />);
      triggerContainer = screen.getByTestId('todoTrigger');
    });

    it('renders title field within the trigger container', () => {
      expect(screen.getByTestId('todoTrigger-input')).toBeInTheDocument();
    });

    it('renders input with correct placeholder', () => {
      expect(screen.getByPlaceholderText('take a note...')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onOpenModal when input is clicked', async () => {
      const onOpenModal = vi.fn();
      render(<TodoTrigger onOpenModal={onOpenModal} />);

      const titleInput = screen.getByTestId('todoTrigger-input');
      await user.click(titleInput);

      expect(onOpenModal).toHaveBeenCalled();
    });
  });
});
