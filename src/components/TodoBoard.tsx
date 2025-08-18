import { TodoCard } from './TodoCard';
import { useTodoContext } from '../context/TodoContext';

interface TodoBoardProps {
  onOpenEdit: (cardId: string, focusTarget?: import('../types').FocusTarget) => void;
  editingCardId?: string;
}

export const TodoBoard = ({ onOpenEdit, editingCardId }: TodoBoardProps) => {
  const { todoCards, deleteCard } = useTodoContext();

  return (
    <div
      data-testid="todoBoard"
      className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 auto-rows-min"
    >
      {todoCards.map((card) => (
        <div 
          key={card.id} 
          className={`break-inside-avoid ${editingCardId === card.id ? 'hidden' : ''}`}
        >
          <TodoCard
            initialData={card}
            onDelete={deleteCard}
            onCardClick={(focusTarget) => onOpenEdit(card.id, focusTarget)}
          />
        </div>
      ))}
    </div>
  );
};
