import { useState } from 'react'
import {TodoTrigger} from './components/TodoTrigger'
import {TodoBoard} from './components/TodoBoard'
import type { TodoList as TodoListType } from './types'

function App() {
  const [todoLists, setTodoLists] = useState<TodoListType[]>([])

const handleSaveTodoList = (todoList: TodoListType) => {
  setTodoLists(prev => [...prev, todoList])
}
  return (
    <div className="flex flex-col items-center bg-zinc-700 min-h-screen p-8">
      <h1 className="mb-4 p-3  text-stone-300 text-center text-3xl">What Do I Want ToDo</h1>
      <TodoTrigger />
      <TodoBoard />
    </div>
  )
}

export default App 
