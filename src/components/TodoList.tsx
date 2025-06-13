import { useState, useEffect } from 'react'
import { TodoItem } from './TodoItem'
import type {TodoList as TodoListType, TodoListProps } from '../types'

export const TodoList = ({ onSave, initialData, readOnly = false }: TodoListProps) => {
  // Use initialData if provided, otherwise create empty TodoList
  const defaultTodoList: TodoListType = {
    id: Date.now().toString(),
    title: '',
    todos: [{
      id: '1',
      task: '',
      completed: false,
    }],
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const [todoList, setTodoList] = useState<TodoListType>(initialData || defaultTodoList)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [originalTodoList, setOriginalTodoList] = useState<TodoListType>(initialData || defaultTodoList)

  const handleDelete = (id: string) => {
    if (readOnly) return
    
    setTodoList(prev => {
      const filteredTodos = prev.todos.filter(todo => todo.id !== id)
      
      // If we're deleting the last todo, add an empty one
      if (filteredTodos.length === 0) {
        return {
          ...prev,
          todos: [{
            id: Date.now().toString(),
            task: '',
            completed: false,
          }],
          updatedAt: new Date()
        }
      }
      
      return {
        ...prev,
        todos: filteredTodos,
        updatedAt: new Date()
      }
    })
  }

  const handleToggle = (id: string) => {
    if (readOnly) return
    
    setTodoList(prev => ({
      ...prev,
      todos: prev.todos.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      ),
      updatedAt: new Date()
    }))
  }

  const handleEdit = (id: string, newTask: string) => {
    if (readOnly) return
    
    setTodoList(prev => ({
      ...prev,
      todos: prev.todos.map(todo =>
        todo.id === id
          ? { ...todo, task: newTask }
          : todo
      ),
      updatedAt: new Date()
    }))
  }

  const handleAddTodo = () => {
    if (readOnly) return
    
    setTodoList(prev => ({
      ...prev,
      todos: [...prev.todos, { id: `${prev.todos.length + 1}`, task: '', completed: false }]
    }))
  }

  const handleElementClick = () => {
    if (readOnly) return
    setIsEditing(true)
    setOriginalTodoList(todoList) // Store original state
  }

  const handleCloseModal = () => {
    setIsEditing(false)
    
    // Only save if onSave callback exists and not readOnly
    if (onSave && !readOnly) {
      onSave(todoList)
      // Reset to empty template after saving
      setTodoList(defaultTodoList)
      setOriginalTodoList(defaultTodoList)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal()
    }
  }

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isEditing) {
        handleCloseModal()
      }
    }

    if (isEditing) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isEditing])

  return (
    <>
      {/* Normal View */}
      <div>
        <h1>
          <input 
            placeholder="title" 
            value={todoList.title}
            onChange={(e) => setTodoList(prev => ({ 
              ...prev, 
              title: e.target.value,
              updatedAt: new Date()
            }))}
            onClick={handleElementClick}
            readOnly={readOnly}
          />
        </h1>
        <ul>
          {todoList.todos.map((todo) => (
            <li key={todo.id}>
              <TodoItem 
                todo={todo}
                onDelete={handleDelete}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onClick={readOnly ? undefined : handleElementClick}
              />
            </li>
          ))}
          {!readOnly && <button onClick={handleAddTodo}>+</button>}
        </ul>
        <div role="toolbar">
          <span 
            aria-label="info" 
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            ℹ️
          </span>
          {showTooltip && (
            <div role="tooltip">
              Priority: {todoList.priority}
              <br />
              Created: {todoList.createdAt.toLocaleDateString()}
              <br />
              Updated: {todoList.updatedAt.toLocaleDateString()}
            </div>
          )}
          <button>Delete</button>
        </div>
      </div>

      {/* Modal View */}
      {isEditing && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={handleBackdropClick}
        >
          <div 
            role="dialog" 
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h1>
              <input 
                placeholder="title" 
                value={todoList.title}
                onChange={(e) => setTodoList(prev => ({ 
                  ...prev, 
                  title: e.target.value,
                  updatedAt: new Date()
                }))}
              />
            </h1>
            <ul>
              {todoList.todos.map((todo) => (
                <li key={todo.id}>
                  <TodoItem 
                    todo={todo}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                    onEdit={handleEdit}
                  />
                </li>
              ))}
              <button onClick={handleAddTodo}>+</button>
            </ul>
            <div role="toolbar">
              <span 
                aria-label="info" 
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                ℹ️
              </span>
              {showTooltip && (
                <div role="tooltip">
                  Priority: {todoList.priority}
                  <br />
                  Created: {todoList.createdAt.toLocaleDateString()}
                  <br />
                  Updated: {todoList.updatedAt.toLocaleDateString()}
                </div>
              )}
              <button>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

//the deleteTodo button should prevent inital render or render an empty todo