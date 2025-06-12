import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { TodoList } from '../TodoList'

describe('TodoList', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    render(<TodoList />)
  })

  describe('initial state', () => {
    it('renders todo list with title and initial todo placeholders', () => {
      // Should render title input with placeholder
      expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument()
      
      // Should render list with one initial todo item placeholder
      expect(screen.getByRole('list')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
      expect(screen.getByPlaceholderText(/add task/i)).toBeInTheDocument()

      // Should render add todo button
      expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
      
      // Should render toolbar with info icon and delete button
      const toolbar = screen.getByRole('toolbar')
      expect(toolbar).toBeInTheDocument()
      expect(screen.getByLabelText(/info/i)).toBeInTheDocument()
      expect(within(toolbar).getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })
  })

  describe('todo interactions', () => {
    it('updates todo text when editing', async () => {
      const todoInput = screen.getByPlaceholderText(/add task/i)
      await user.type(todoInput, 'Buy milk')
      await user.keyboard('{Enter}')
      
      expect(todoInput).toHaveValue('Buy milk')
    })

    it('toggles todo completion when checkbox is clicked', async () => {
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
      
      await user.click(checkbox)
      expect(checkbox).toBeChecked()
    })

    it('adds a new todo when add todo button is clicked', async () => {
      // Initially should have 1 todo item
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
      
      const addTodoButton = screen.getByRole('button', { name: '+' })
      await user.click(addTodoButton)
      
      // After clicking, should have 2 todo items
      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })

    it('deletes todo when delete button is clicked', async () => {
      // Add another todo first so we're not deleting the last one
      const addTodoButton = screen.getByRole('button', { name: '+' })
      await user.click(addTodoButton)
      
      // Should have 2 todos now
      expect(screen.getAllByRole('listitem')).toHaveLength(2)
      
      // Delete the first todo
      const listItems = screen.getAllByRole('listitem')
      const deleteButton = within(listItems[0]).getByRole('button', { name: 'Delete' })
      await user.click(deleteButton)
      
      // Should have 1 todo remaining
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
    })

    it('shows tooltip with metadata when info icon is hovered', async () => {
      const infoIcon = screen.getByLabelText(/info/i)
      
      // Initially tooltip should not be visible
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      
      // Hover over info icon
      await user.hover(infoIcon)
      
      // Tooltip should appear with metadata
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toBeInTheDocument()
      expect(tooltip).toHaveTextContent(/priority:/i)
      expect(tooltip).toHaveTextContent(/medium/i)
      expect(tooltip).toHaveTextContent(/created:/i)
      expect(tooltip).toHaveTextContent(/updated:/i)
      
      // Tooltip should disappear when no longer hovering
      await user.unhover(infoIcon)
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    it('maintains at least one empty todo when deleting the last todo with delete button', async () => {
      // Initially should have 1 todo item
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
      
      // Delete the only todo using the TodoItem delete button
      const listItem = screen.getByRole('listitem')
      const deleteButton = within(listItem).getByRole('button', { name: 'Delete' })
      await user.click(deleteButton)
      
      // Should still have 1 empty todo item (prevent empty list)
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
    })
  })
})