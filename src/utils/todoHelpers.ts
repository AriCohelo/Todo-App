import type { TodoCardData } from '../types';

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const addTodoItem = (card: TodoCardData): TodoCardData => ({
  ...card,
  todos: [...card.todos, { 
    id: generateUUID(), 
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
  id: generateUUID(),
  title: '',
  todos: [{ 
    id: generateUUID(), 
    task: '', 
    completed: false 
  }],
  backgroundColor,
  updatedAt: new Date()
});