import type { TodoCardData } from '../types';

export const addTodoItem = (card: TodoCardData): TodoCardData => ({
  ...card,
  todos: [...card.todos, { 
    id: crypto.randomUUID(), 
    task: '', 
    completed: false 
  }],
  updatedAt: new Date()
});

export const deleteTodoItem = (card: TodoCardData, todoId: string): TodoCardData => ({
  ...card,
  todos: card.todos.filter(todo => todo.id !== todoId),
  updatedAt: new Date()
});

export const editTodoItem = (card: TodoCardData, todoId: string, newTask: string): TodoCardData => ({
  ...card,
  todos: card.todos.map(todo =>
    todo.id === todoId ? { ...todo, task: newTask } : todo
  ),
  updatedAt: new Date()
});

export const toggleTodoItem = (card: TodoCardData, todoId: string): TodoCardData => ({
  ...card,
  todos: card.todos.map(todo =>
    todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
  ),
  updatedAt: new Date()
});

export const updateCardTitle = (card: TodoCardData, title: string): TodoCardData => ({
  ...card,
  title,
  updatedAt: new Date()
});

export const updateCardBackgroundColor = (card: TodoCardData, backgroundColor: string): TodoCardData => ({
  ...card,
  backgroundColor,
  updatedAt: new Date()
});

export const createEmptyCard = (backgroundColor: string): TodoCardData => ({
  id: crypto.randomUUID(),
  title: '',
  todos: [{ 
    id: crypto.randomUUID(), 
    task: '', 
    completed: false 
  }],
  backgroundColor,
  updatedAt: new Date()
});