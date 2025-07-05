import { useState } from 'react';
import { TodoTrigger } from './components/TodoTrigger';
import { TodoBoard } from './components/TodoBoard';
import { TodoCard } from './components/TodoCard';
import type { TodoCardData } from './types';

function App() {
  const [todoCards, setTodoCards] = useState<TodoCardData[]>([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null as 'create' | 'edit' | null,
    editingCard: undefined as TodoCardData | undefined,
  });

  const handleOpenCreateModal = () => {
    setModalState({
      isOpen: true,
      mode: 'create',
      editingCard: undefined,
    });
  };

  const handleOpenEditModal = (card: TodoCardData) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      editingCard: card,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: null,
      editingCard: undefined,
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

  const handleAddTodo = (cardId: string) => {
    // Add todo logic
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
        onAddTodo={handleAddTodo}
      />

      {/* Single modal for entire app */}
      {modalState.isOpen && (
        <TodoCard
          isModal={true}
          initialData={modalState.editingCard}
          onSave={
            modalState.mode === 'create' ? handleCreateCard : handleUpdateCard
          }
          onClose={handleCloseModal}
          onDelete={handleDeleteCard}
          onAddTodo={handleAddTodo}
        />
      )}
    </div>
  );
}

export default App;
