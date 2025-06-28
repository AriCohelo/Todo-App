import { TodoTrigger } from './components/TodoTrigger';
import { TodoBoard } from './components/TodoBoard';
import { useState } from 'react';
import type { TodoCardData } from './types';

function App() {
  const [todoCards, setTodoCards] = useState<TodoCardData[]>([]);

  const onToggle = (cardId: string, todoId: string) => {
    setTodoCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              todos: card.todos.map((todo) =>
                todo.id === todoId
                  ? { ...todo, completed: !todo.completed }
                  : todo
              ),
            }
          : card
      )
    );
  };

  const onCreateCard = (cardData: TodoCardData) => {
    setTodoCards((prev) => [...prev, cardData]);
  };

  return (
    <div className="flex flex-col items-center bg-zinc-700 min-h-screen p-8">
      <h1 className="mb-4 p-3  text-stone-300 text-center text-3xl">
        What Do I Want ToDo
      </h1>
      <TodoTrigger onCreateCard={onCreateCard} />
      <TodoBoard
        todoCards={todoCards}
        onSaveCard={() => {}}
        onDeleteCard={() => {}}
        onAddTodo={() => {}}
        onToggle={onToggle}
      />
    </div>
  );
}

export default App;
