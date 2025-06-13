import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from '../../App'

describe('App', () => {
  const user = userEvent.setup()

  describe('initial state', () => {
    it('renders the main title "What I have ToDo"', () => {
      render(<App />)
      
      expect(screen.getByText('What I have ToDo')).toBeInTheDocument()
    })

    it('renders an initial empty TodoList', () => {
      render(<App />)
      
      // Should show the initial TodoList with empty title and one empty todo
      expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument()
      expect(screen.getByRole('list')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
      expect(screen.getByPlaceholderText(/add task/i)).toBeInTheDocument()
    })
  })

  describe('modal interactions', () => {
    it('opens modal when title input is clicked', async () => {
      render(<App />)
      
      // Initially no modal should be present
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      
      // Click on the title input to open modal
      const titleInput = screen.getByPlaceholderText(/title/i)
      await user.click(titleInput)
      
      // Modal should appear
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('closes modal when ESC key is pressed', async () => {
      render(<App />)
      
      // Open modal by clicking title input
      const titleInput = screen.getByPlaceholderText(/title/i)
      await user.click(titleInput)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      
      // Press ESC to close
      await user.keyboard('{Escape}')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('closes modal when clicking away (backdrop)', async () => {
      render(<App />)
      
      // Open modal by clicking title input
      const titleInput = screen.getByPlaceholderText(/title/i)
      await user.click(titleInput)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      
      // Click on the backdrop (outside the dialog)
      const backdrop = screen.getByRole('dialog').parentElement
      await user.click(backdrop!)
      
      // Modal should close
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('opens modal when todo input is clicked', async () => {
      render(<App />)
      
      // Initially no modal should be present
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      
      // Click on the todo input to open modal
      const todoInput = screen.getByPlaceholderText(/add task/i)
      await user.click(todoInput)
      
      // Modal should appear
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })  
})

 