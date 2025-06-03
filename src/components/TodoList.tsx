import { useState } from 'react'
import type { ChangeEvent } from 'react'

export const TodoList = () => {
  const [todos, setTodos] = useState<string[]>([''])
  const [title, setTitle] = useState<string>('')

  const handleTodoChange = (index: number, value: string) => {
    const newTodos = [...todos]
    newTodos[index] = value
    setTodos(newTodos)
  }

  return (
    <div>
      <h1>
        <input 
          placeholder="title"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        />
      </h1>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            <input 
              placeholder="add task" 
              value={todo}
              onChange={(e: ChangeEvent<HTMLInputElement>) => 
                handleTodoChange(index, e.target.value)
              }
            />
          </li>
        ))}
      </ul>
      <button onClick={() => setTodos([...todos, ''])}>Add Todo</button>
      <div role='toolbar'>
        <button>Delete</button>
      </div>
    </div>
  )
}