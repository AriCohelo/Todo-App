import { useState } from 'react';
import { TodoTrigger } from './components/TodoTrigger';
import { TodoBoard } from './components/TodoBoard';
import { TodoCard } from './components/TodoCard';
import type { TodoCardData, FocusTarget } from './types';

function App() {
  const [todoCards, setTodoCards] = useState<TodoCardData[]>([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null as 'create' | 'edit' | null,
    editingCardId: undefined as string | undefined,
    focusTarget: undefined as FocusTarget | undefined,
  });

  const handleOpenCreateModal = (focusTarget?: FocusTarget) => {
    setModalState({
      isOpen: true,
      mode: 'create',
      editingCardId: undefined,
      focusTarget: focusTarget || 'title',
    });
  };

  const handleOpenEditModal = (card: TodoCardData, focusTarget?: FocusTarget) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      editingCardId: card.id,
      focusTarget: focusTarget || 'title',
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: null,
      editingCardId: undefined,
      focusTarget: undefined,
    });
  };

  const handleCreateCard = (cardData: TodoCardData) => {
    setTodoCards((prev) => [...prev, cardData]);
  };

  const handleUpdateCard = (cardData: TodoCardData) => {
    setTodoCards((prev) =>
      prev.map((card) => (card.id === cardData.id ? cardData : card))
    );
  };

  const handleDeleteCard = (cardId: string) => {
    setTodoCards((prev) => prev.filter((card) => card.id !== cardId));
  };


  return (
    <div className="min-h-screen bg-zinc-700 p-4">
      <h1 className="text-2xl font-bold text-center mb-8">
        What do I Want ToDo
      </h1>

      <TodoTrigger onOpenModal={handleOpenCreateModal} />

      <TodoBoard
        todoCards={todoCards}
        onCardClick={handleOpenEditModal}
        onDeleteCard={handleDeleteCard}
        onUpdateCard={handleUpdateCard}
      />

      {/* Single modal for entire app */}
      {modalState.isOpen && (
        <TodoCard
          key={modalState.editingCardId || 'create'}
          isModal={true}
          initialData={
            modalState.mode === 'edit' 
              ? todoCards.find(card => card.id === modalState.editingCardId)
              : undefined
          }
          onSave={
            modalState.mode === 'create' ? handleCreateCard : handleUpdateCard
          }
          onClose={handleCloseModal}
          onDelete={handleDeleteCard}
          focusTarget={modalState.focusTarget}
        />
      )}
    </div>
  );
}

export default App;
