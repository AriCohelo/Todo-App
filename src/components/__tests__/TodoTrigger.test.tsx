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
    expect(within(triggerContainer).getByPlaceholderText(/take a note/i)).toBeInTheDocument()
    
  })
  
describe ('modal rendering', ()=>{
  it('initially modal should not be present inside trigger', () => {
    expect(within(triggerContainer).queryByTestId('todo-modal')).not.toBeInTheDocument()
  })
  it('modal should be present inside trigger when title input is clicked', async () => {
    const titleInput = within(triggerContainer).getByPlaceholderText(/take a note/i)
    await user.click(titleInput)
    expect(within(triggerContainer).getByTestId('todo-modal')).toBeInTheDocument()
  })

})
  describe('modal interactions', () => {

    it('opens modal inside trigger when title input is clicked', async () => {
      const titleInput = within(triggerContainer).getByPlaceholderText(/take a note/i)
      await user.click(titleInput)
      
      expect(within(triggerContainer).getByTestId('todo-modal')).toBeInTheDocument()
    })

  

    it('closes modal inside trigger when ESC key is pressed', async () => {
      // First open the modal
      const titleInput = within(triggerContainer).getByPlaceholderText(/take a note/i)
      await user.click(titleInput)
      expect(within(triggerContainer).getByTestId('todo-modal')).toBeInTheDocument()
      
      // Then close with ESC
      await user.keyboard('{Escape}')
      expect(within(triggerContainer).queryByTestId('todo-modal')).not.toBeInTheDocument()
    })

    it('closes modal inside trigger when backdrop is clicked', async () => {
      // First open the modal
      const titleInput = within(triggerContainer).getByPlaceholderText(/take a note/i)
      await user.click(titleInput)
      expect(within(triggerContainer).getByTestId('todo-modal')).toBeInTheDocument()
      
      // Then close by clicking backdrop (the modal overlay, not the content)
      const modalBackdrop = within(triggerContainer).getByTestId('todo-modal')
      await user.click(modalBackdrop)
      expect(within(triggerContainer).queryByTestId('todo-modal')).not.toBeInTheDocument()
    })
  })
}) 