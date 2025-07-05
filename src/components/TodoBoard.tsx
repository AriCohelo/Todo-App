import { TodoCard } from './TodoCard';
import type { TodoBoardProps } from '../types';

export const TodoBoard = ({
  todoCards,
  onCardClick,
  onDeleteCard,
  onAddTodo,
}: TodoBoardProps) => {
  return (
    <div data-testid="todoBoard">
      {todoCards.map((card) => (
        <div key={card.id} onClick={() => onCardClick(card)}>
          <TodoCard
            initialData={card}
            onSave={() => {}} // Not used in board view
            onDelete={onDeleteCard}
            onAddTodo={onAddTodo}
          />
        </div>
      ))}
    </div>
  );
};
