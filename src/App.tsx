import { TodoTrigger } from './components/TodoTrigger';
import { TodoBoard } from './components/TodoBoard';
import { useState } from 'react';
import type { TodoCardData } from './types';

function App() {
  const [todoCards, setTodoCards] = useState<TodoCardData[]>([]);
  return (
    <div className="flex flex-col items-center bg-zinc-700 min-h-screen p-8">
      <h1 className="mb-4 p-3  text-stone-300 text-center text-3xl">
        What Do I Want ToDo
      </h1>
      <TodoTrigger />
      <TodoBoard
        todoCards={todoCards}
        onSaveCard={() => {}}
        onDeleteCard={() => {}}
        onAddTodo={() => {}}
      />
    </div>
  );
}

export default App;
