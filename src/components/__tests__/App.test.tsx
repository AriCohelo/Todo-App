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
})
