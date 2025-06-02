import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TodoItem } from '../TodoItem'
import type { Todo } from '../../types'

describe('TodoItem', () => {
  const user = userEvent.setup()
  
  const todo: Todo = {
    id: '1',
    userId: '1',
    task: 'Test Todo',
    completed: false,
    priority: 'high',
    createdAt: new Date(),
    updatedAt: new Date(),  
  }

  const handlers = {
    onDelete: vi.fn(),
    onToggle: vi.fn(),
    onEdit: vi.fn(),
  }

  it('renders todo item correctly', () => {
    render(<TodoItem todo={todo} {...handlers} />)
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument()
  })
  it('should have a checkbox', () => {
    render(<TodoItem todo={todo} {...handlers} />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })
  it('should have a delete button', () => {
    render(<TodoItem todo={todo} {...handlers} />)
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })
  it('info should be displayed', () => {
    render(<TodoItem todo={todo} {...handlers} />)
    expect(screen.getByText(/Created:/)).toBeInTheDocument()
    expect(screen.getByText(/Updated:/)).toBeInTheDocument()
  })
  it('priority should be displayed', () => {
    render(<TodoItem todo={todo} {...handlers} />)
    expect(screen.getByText('Priority: high')).toBeInTheDocument()
  })
  it('should call onToggle when checkbox is clicked', async () => {
    render(<TodoItem todo={todo} {...handlers} />)
    await user.click(screen.getByRole('checkbox'))
    expect(handlers.onToggle).toHaveBeenCalledWith(todo.id)
  })
  it('should call onDelete when delete button is clicked', async () => {
    render(<TodoItem todo={todo} {...handlers} />)
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(handlers.onDelete).toHaveBeenCalledWith(todo.id)
  })
  it('should call onEdit when Enter is pressed', async () => {
    render(<TodoItem todo={todo} {...handlers} />)
    const input = screen.getByDisplayValue('Test Todo')
    await user.type(input, ' updated{Enter}')
    expect(handlers.onEdit).toHaveBeenCalledWith(todo.id, 'Test Todo updated')
  })
})

