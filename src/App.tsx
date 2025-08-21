import { CardProvider, useCardContext } from './context/CardContext';
import { ModalProvider, useModal } from './context/ModalContext';
import { TodoTrigger } from './components/TodoTrigger';
import { TodoBoard } from './components/TodoBoard';
import { TodoCardEditor } from './components/TodoCardEditor';
import type { TodoCardData, FocusTarget } from './types';
import { createEmptyCard } from './utils/todoHelpers';
import { getRandomColor } from './constants/colors';

function AppContent() {
  const { upsertCard } = useCardContext();
  const { openEdit, editingCardId, closeEdit } = useModal();

  const handleOpenEdit = (card: TodoCardData, focusTarget: FocusTarget = 'title') => {
    openEdit(card.id, focusTarget);
  };

  const handleCreateCard = () => {
    const newCard = createEmptyCard(getRandomColor());
    upsertCard(newCard);
    openEdit(newCard.id, 'title');
  };

  return (
    <div className="min-h-screen p-8 lg:p-16 app-background">
      <TodoTrigger onOpenCreate={handleCreateCard} />
      <TodoBoard onOpenEdit={handleOpenEdit} />
      {editingCardId && (
        <TodoCardEditor
          cardId={editingCardId.cardId}
          onClose={closeEdit}
          focusTarget={editingCardId.focusTarget}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <CardProvider>
      <ModalProvider>
        <AppContent />
      </ModalProvider>
    </CardProvider>
  );
}

export default App;
