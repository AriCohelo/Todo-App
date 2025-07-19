import { TodoCard } from './TodoCard';
import { useTodoContext } from '../context/TodoContext';

export const TodoBoard = () => {
  const { todoCards, modalState, updateCard, deleteCard, openEditModal } =
    useTodoContext();

  return (
    <div
      data-testid="todoBoard"
      className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 auto-rows-min"
    >
      {todoCards
        .filter((card) => !(modalState.isOpen && modalState.editingCardId === card.id))
        .map((card) => (
          <div key={card.id} className="break-inside-avoid">
            <TodoCard
              initialData={card}
              onSave={updateCard}
              onDelete={deleteCard}
              onCardClick={openEditModal}
              isBeingEdited={false}
            />
          </div>
        ))}
    </div>
  );
};
