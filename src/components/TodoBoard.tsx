import { TodoCard } from './TodoCard';
import type { TodoBoardProps } from '../types';

export const TodoBoard = ({
  todoCards,
  onCardClick,
  onDeleteCard,
  onUpdateCard,
}: TodoBoardProps) => {
  return (
    <div data-testid="todoBoard">
      {todoCards.map((card) => (
        <div key={card.id}>
          <TodoCard
            initialData={card}
            onSave={onUpdateCard}
            onDelete={onDeleteCard}
            onCardClick={onCardClick}
          />
        </div>
      ))}
    </div>
  );
};
