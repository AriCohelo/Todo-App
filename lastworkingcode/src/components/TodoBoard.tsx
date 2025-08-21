import { TodoCard } from './TodoCard';
import { useTodoContext } from '../context/TodoContext';
import { useModal } from '../context/ModalContext';

interface TodoBoardProps {
  onOpenEdit: (
    card: import('../types').TodoCardData,
    focusTarget?: import('../types').FocusTarget
  ) => void;
}

export const TodoBoard = ({ onOpenEdit }: TodoBoardProps) => {
  const { todoCards, deleteCard } = useTodoContext();
  const { isEditing } = useModal();

  return (
    <div
      data-testid="todoBoard"
      className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 auto-rows-min"
    >
      {todoCards.map((card) => (
        <div
          key={card.id}
          className={`break-inside-avoid ${
            isEditing(card.id) ? 'invisible' : ''
          }`}
        >
          <TodoCard
            cardId={card.id}
            onDelete={deleteCard}
            onCardClick={(focusTarget) => onOpenEdit(card, focusTarget)}
          />
        </div>
      ))}
    </div>
  );
};
