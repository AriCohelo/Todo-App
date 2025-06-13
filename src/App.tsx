import { useState } from 'react'
import { TodoList } from './components/TodoList'
import type { TodoList as TodoListType } from './types'

function App() {
  const [todoBoard, setTodoBoard] = useState<TodoListType[]>([])
  
  const handleSaveTodoList = (todoListData: TodoListType) => {
    const hasContent = todoListData.title !== '' || 
                      todoListData.todos.some(todo => todo.task !== '')
    
    if (hasContent) {
      setTodoBoard(prev => [...prev, todoListData])
    }
  }

  return (
    <div>
      <h1>What I have ToDo</h1>
      
      {/* Empty template TodoList that always stays empty */}
      <TodoList onSave={handleSaveTodoList} />
      
      {/* Saved TodoLists */}
      {todoBoard.length > 0 && (
        <div>
          <h2>Saved Lists</h2>
          {todoBoard.map(todoList => 
            <TodoList 
              key={todoList.id} 
              initialData={todoList} 
              readOnly={true} 
            />
          )}
        </div>
      )}
    </div>
  )
}

export default App 

//EStoy por aplicar los cambios para que se pueda crear un todoBoard que renderiza los todoList