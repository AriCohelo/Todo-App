import { TodoProvider, useTodoContext } from './context/TodoContext';
import { ModalProvider, useModal } from './context/ModalContext';
import { TodoTrigger } from './components/TodoTrigger';
import { TodoBoard } from './components/TodoBoard';
import { TodoCard } from './components/TodoCard';
import type { TodoCardData, FocusTarget } from './types';
import { useRef } from 'react';
import { createEmptyCard } from './utils/todoHelpers';
import { getRandomColor } from './constants/colors';

function AppContent() {
  const { upsertCard, deleteCard } = useTodoContext();
  const { editingCardId, openEdit, closeEdit } = useModal();

  const handleOpenEdit = (card: TodoCardData, focusTarget: FocusTarget = 'title') => {
    openEdit(card.id, focusTarget);
  };

  const handleCreateCard = () => {
    const newCard = createEmptyCard(getRandomColor());
    upsertCard(newCard);
    openEdit(newCard.id, 'title');
  };

  const currentCardRef = useRef<TodoCardData | null>(null);
  
  const updateCurrentCard = (card: TodoCardData) => {
    currentCardRef.current = card;
  };

  const handleSaveAndClose = (card: TodoCardData) => {
    upsertCard(card);
    closeEdit();
  };

  const handleBackdropClick = () => {
    if (currentCardRef.current) {
      handleSaveAndClose(currentCardRef.current);
    } else {
      closeEdit();
    }
  };

  return (
    <div className="min-h-screen p-8 lg:p-16 app-background">
      <TodoTrigger onOpenCreate={handleCreateCard} />
      <TodoBoard 
        onOpenEdit={handleOpenEdit}
      />

      {editingCardId && (
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
              key={editingCardId.cardId}
              isModal={true}
              cardId={editingCardId.cardId}
              onSave={handleSaveAndClose}
              onClose={closeEdit}
              onBackdropClick={updateCurrentCard}
              onDelete={(cardId) => {
                deleteCard(cardId);
                closeEdit();
              }}
              focusTarget={editingCardId.focusTarget}
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
      <ModalProvider>
        <AppContent />
      </ModalProvider>
    </TodoProvider>
  );
}

export default App;
