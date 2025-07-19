import { TodoProvider, useTodoContext } from './context/TodoContext';
import { TodoTrigger } from './components/TodoTrigger';
import { TodoBoard } from './components/TodoBoard';
import { TodoCard } from './components/TodoCard';

function AppContent() {
  const {
    todoCards,
    modalState,
    createCard,
    updateCard,
    deleteCard,
    closeModal,
  } = useTodoContext();

  return (
    <div className="min-h-screen p-16 app-background">
      <TodoTrigger />

      <TodoBoard />

      {modalState.isOpen && (
        <TodoCard
          key={modalState.editingCardId || 'create'}
          isModal={true}
          initialData={
            modalState.mode === 'edit'
              ? todoCards.find((card) => card.id === modalState.editingCardId)
              : undefined
          }
          onSave={modalState.mode === 'create' ? createCard : updateCard}
          onClose={closeModal}
          onDelete={deleteCard}
          focusTarget={modalState.focusTarget}
        />
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
