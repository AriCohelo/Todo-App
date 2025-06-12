import type { TodoItemProps } from '../types'
import type { KeyboardEvent, ChangeEvent } from 'react'
import { useState } from 'react'

export const TodoItem = ({ todo, onDelete, onToggle, onEdit }: TodoItemProps) => {
  const [inputValue, setInputValue] = useState(todo.task)

  const handleEnterKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEdit(todo.id, inputValue)
    }
  }

  const handleBlur = () => {
    onEdit(todo.id, inputValue)
  }

  return (
    <div>
      <input 
        type="checkbox" 
        checked={todo.completed} 
        onChange={() => onToggle(todo.id)} 
      />
      <input
        type="text"
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
        onKeyDown={handleEnterKey}
        onBlur={handleBlur}
        placeholder="add task"
      />
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  )
}