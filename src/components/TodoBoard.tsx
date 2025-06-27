import { TodoCard } from './TodoCard';
import type { TodoBoardProps } from '../types';

export const TodoBoard = ({
  todoCards,
  onSaveCard,
  onDeleteCard,
  onAddTodo,
}: TodoBoardProps) => {
  return (
    <div>
      <h1>Todo Board</h1>
      {todoCards.map((card) => (
        <TodoCard
          key={card.id}
          initialData={card}
          onSave={onSaveCard}
          onDelete={onDeleteCard}
          onAddTodo={onAddTodo}
        />
      ))}
    </div>
  );
};
