import { useState } from 'react'
import { TodoItem } from './TodoItem'
import type {TodoList as TodoListType } from '../types'

export const TodoList = () => {
  const [todoList, setTodoList] = useState<TodoListType>({
    id: '1',
    title: '',
    todos: [
      {
        id: '1',
        task: '',
        completed: false,
      }
    ],
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date()
  })

  const [showTooltip, setShowTooltip] = useState(false)

  const handleDelete = (id: string) => {
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
    setTodoList(prev => ({
      ...prev,
      todos: [...prev.todos, { id: `${prev.todos.length + 1}`, task: '', completed: false }]
    }))
  }

  return (
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
  )
}

//the deleteTodo button should prevent inital render or render an empty todo