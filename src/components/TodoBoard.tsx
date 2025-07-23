import { TodoCard } from './TodoCard';
import { useTodoContext } from '../context/TodoContext';

export const TodoBoard = () => {
  const { todoCards, modalState, updateCard, deleteCard, openEditModal } =
    useTodoContext();

  return (
    <div
      data-testid="todoBoard"
      className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 auto-rows-min"
    >
      {todoCards.map((card) => (
        <div key={card.id} className="break-inside-avoid">
          <TodoCard
            initialData={card}
            onSave={updateCard}
            onDelete={deleteCard}
            onCardClick={openEditModal}
            isBeingEdited={
              modalState.isOpen && modalState.editingCardId === card.id
            }
          />
        </div>
      ))}
    </div>
  );
};
