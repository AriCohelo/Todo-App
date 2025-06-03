import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TodoList } from '../TodoList'

describe('TodoList', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    render(<TodoList />)
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders initial empty state', () => {
      // Title section
      expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument()
      
      // List with one empty todo
      expect(screen.getByRole('list')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
      expect(screen.getByPlaceholderText(/add task/i)).toBeInTheDocument()
      
      // Buttons
      expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('updates title when typing', async () => {
      const titleInput = screen.getByPlaceholderText(/title/i)
      await user.type(titleInput, 'My Todo List')
      expect(titleInput).toHaveValue('My Todo List')
    })

    it('updates todo text when typing', async () => {
      const todoInput = screen.getByPlaceholderText(/add task/i)
      await user.type(todoInput, 'Buy milk')
      expect(todoInput).toHaveValue('Buy milk')
    })

    it('adds new todo when clicking Add Todo', async () => {
      const addButton = screen.getByRole('button', { name: /add todo/i })
      
      // Click Add Todo twice
      await user.click(addButton)
      await user.click(addButton)

      // Should have 3 list items now
      const listItems = screen.getAllByRole('listitem')
      expect(listItems).toHaveLength(3)
    })
  })

  describe('modal', () => {
    const modalTriggers = [
      { element: 'title', getElement: () => screen.getByPlaceholderText(/title/i) },
      { element: 'todo', getElement: () => screen.getByPlaceholderText(/add task/i) },
      { element: 'toolbar', getElement: () => screen.getByRole('toolbar') }
    ]

    it.each(modalTriggers)('opens when clicking $element', async ({ getElement }) => {
      const element = getElement()
      await user.click(element)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    it('activates title edit mode on click', async () => {
      const titleInput = screen.getByPlaceholderText(/title/i)
      await user.click(titleInput)
      expect(titleInput).toHaveFocus()
      expect(titleInput).toHaveAttribute('aria-selected', 'true')
    })
    it('activates todo edit mode on click', async () => {
      const todoInput = screen.getByPlaceholderText(/add task/i)
      await user.click(todoInput)
      expect(todoInput).toHaveFocus()
      expect(todoInput).toHaveAttribute('aria-selected', 'true')
    })
    it('activates list edit mode on toolbar click', async () => {
      const toolbar = screen.getByRole('toolbar')
      await user.click(toolbar)
      expect(screen.getByRole('list')).toHaveAttribute('aria-selected', 'true')
    })
  })
})