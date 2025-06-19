import { useState, useEffect } from 'react'
import { TodoItem } from './TodoItem'
import type {TodoList as TodoListType, TodoListProps } from '../types'
  
export const TodoList = ()=>{
    const [todoList, setTodoList] = useState<TodoListType>({
        id: '',
        title: '',
        todos: [],
        priority: 'low',
        updatedAt: new Date(),
    })
    return (
        <div>
            <input type="text" placeholder="Enter a title" />
            <div data-testid="todo-list-container">TodoList Container</div>
                <button>Add Todo</button>
            <div role="toolbar" >
                <button>Delete Todo List</button>
            </div>
        </div>
    )
}