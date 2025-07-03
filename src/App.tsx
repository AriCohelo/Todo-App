import { TodoTrigger } from './components/TodoTrigger';
import { TodoBoard } from './components/TodoBoard';
import { useState } from 'react';
import type { TodoCardData } from './types';

function App() {
  const [todoCards, setTodoCards] = useState<TodoCardData[]>([]);

  const onCreateCard = (cardData: TodoCardData) => {
    setTodoCards((prev) => [...prev, cardData]);
  };

  const onSaveCard = (updatedCard: TodoCardData) => {
    setTodoCards((prev) =>
      prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
  };

  return (
    <div className="flex flex-col items-center bg-zinc-700 min-h-screen p-8">
      <h1 className="mb-4 p-3  text-stone-300 text-center text-3xl">
        What Do I Want ToDo
      </h1>
      <TodoTrigger onCreateCard={onCreateCard} />
      <TodoBoard
        todoCards={todoCards}
        onSaveCard={onSaveCard}
        onDeleteCard={() => {}}
        onAddTodo={() => {}}
      />
    </div>
  );
}

export default App;
