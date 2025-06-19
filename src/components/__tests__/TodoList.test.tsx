import { render, screen } from '@testing-library/react'
import { TodoList } from '../TodoList'
import { describe, it, expect, beforeEach } from 'vitest'

describe('TodoList', ()=>{
  beforeEach(()=>{
    render(<TodoList />)
  })
  it('renders a title field', ()=>{
    const titleField = screen.getByPlaceholderText(/enter a title/i)
    expect(titleField).toBeInTheDocument()
  })
  it('renders a todo list container', ()=>{
    const todoListContainer = screen.getByTestId('todo-list-container')
    expect(todoListContainer).toBeInTheDocument()
  })
  it('renders a toolbar', ()=>{
    const toolbar = screen.getByRole('toolbar')
    expect(toolbar).toBeInTheDocument()
  })
})