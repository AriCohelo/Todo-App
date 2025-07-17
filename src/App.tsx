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
    <div className="min-h-screen p-4 app-background">
      <h1 className="text-2xl font-bold text-center mb-8 text-[#3D3D3D]">
        What do I Want ToDo
      </h1>

      <TodoTrigger />

      <TodoBoard />

      {/* Single modal for entire app */}
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
