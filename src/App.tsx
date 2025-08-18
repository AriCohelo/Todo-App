import { TodoProvider, useTodoContext } from './context/TodoContext';
import { TodoTrigger } from './components/TodoTrigger';
import { TodoBoard } from './components/TodoBoard';
import { TodoCard } from './components/TodoCard';
import { useModalState } from './hooks/useModalState';
import type { TodoCardData } from './types';
import { useRef } from 'react';
import { createEmptyCard } from './utils/todoHelpers';
import { getRandomColor } from './constants/colors';

function AppContent() {
  const { todoCards, upsertCard, deleteCard } = useTodoContext();
  const { modalState, openEditModal, closeModal } = useModalState();
  const currentCardRef = useRef<TodoCardData | null>(null);

  const modalCard = modalState.cardId 
    ? todoCards.find(card => card.id === modalState.cardId)
    : undefined;

  const handleCreateCard = () => {
    const newCard = createEmptyCard(getRandomColor());
    upsertCard(newCard);
    openEditModal(newCard.id, 'title');
  };

  const handleSaveAndClose = (card: TodoCardData) => {
    upsertCard(card);
    closeModal();
  };

  const handleBackdropClick = () => {
    if (currentCardRef.current) {
      handleSaveAndClose(currentCardRef.current);
    } else {
      closeModal();
    }
  };

  const updateCurrentCard = (card: TodoCardData) => {
    currentCardRef.current = card;
  };

  return (
    <div className="min-h-screen p-8 lg:p-16 app-background">
      <TodoTrigger onOpenCreate={handleCreateCard} />
      <TodoBoard 
        onOpenEdit={(cardId, focusTarget) => openEditModal(cardId, focusTarget)} 
        editingCardId={modalState.cardId}
      />

      {modalState.isOpen && (
        <div
          data-testid="todoTrigger-modal"
          className="fixed inset-0 bg-gray-800/80 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div
            className="rounded-3xl shadow-lg w-full max-w-md app-background"
            onClick={(e) => e.stopPropagation()}
          >
            <TodoCard
              key={modalState.cardId}
              isModal={true}
              initialData={modalCard}
              onSave={upsertCard}
              onClose={closeModal}
              onBackdropClick={updateCurrentCard}
              onDelete={(cardId) => {
                deleteCard(cardId);
                closeModal();
              }}
              focusTarget={modalState.focusTarget || 'title'}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  );
}

export default App;
