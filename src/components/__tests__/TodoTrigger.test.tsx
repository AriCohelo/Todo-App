import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { TodoTrigger } from '../TodoTrigger'

describe('TodoTrigger', () => {
  const user = userEvent.setup()
  let triggerContainer: HTMLElement

  beforeEach(() => {
    render(<TodoTrigger />)
    triggerContainer = screen.getByTestId('todo-trigger')
  })

  it('renders title field and content field within the trigger container', () => {
    // Should render title input field within the container
    expect(within(triggerContainer).getByPlaceholderText(/title/i)).toBeInTheDocument()
    
    // Should render content area with at least one empty todo item within the container
    expect(within(triggerContainer).getByPlaceholderText(/add task/i)).toBeInTheDocument()
    
    // Should render the list container within the trigger
    expect(within(triggerContainer).getByRole('list')).toBeInTheDocument()
    expect(within(triggerContainer).getAllByRole('listitem')).toHaveLength(1)
  })

  describe('modal interactions', () => {
    it('initially modal should not be present inside trigger', () => {
      expect(within(triggerContainer).queryByTestId('todo-modal')).not.toBeInTheDocument()
    })

    it('opens modal inside trigger when title input is clicked', async () => {
      const titleInput = within(triggerContainer).getByPlaceholderText(/title/i)
      await user.click(titleInput)
      
      expect(within(triggerContainer).getByTestId('todo-modal')).toBeInTheDocument()
    })

    it('opens modal inside trigger when todo input is clicked', async () => {
      const todoInput = within(triggerContainer).getByPlaceholderText(/add task/i)
      await user.click(todoInput)
      
      expect(within(triggerContainer).getByTestId('todo-modal')).toBeInTheDocument()
    })

    it('closes modal inside trigger when ESC key is pressed', async () => {
      // First open the modal
      const titleInput = within(triggerContainer).getByPlaceholderText(/title/i)
      await user.click(titleInput)
      expect(within(triggerContainer).getByTestId('todo-modal')).toBeInTheDocument()
      
      // Then close with ESC
      await user.keyboard('{Escape}')
      expect(within(triggerContainer).queryByTestId('todo-modal')).not.toBeInTheDocument()
    })

    it('closes modal inside trigger when backdrop is clicked', async () => {
      // First open the modal
      const titleInput = within(triggerContainer).getByPlaceholderText(/title/i)
      await user.click(titleInput)
      expect(within(triggerContainer).getByTestId('todo-modal')).toBeInTheDocument()
      
      // Then close by clicking backdrop (the modal overlay, not the content)
      const modalBackdrop = within(triggerContainer).getByTestId('todo-modal')
      await user.click(modalBackdrop)
      expect(within(triggerContainer).queryByTestId('todo-modal')).not.toBeInTheDocument()
    })
  })
}) 