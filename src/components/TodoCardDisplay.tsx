import { useState, useRef } from 'react';
import { TodoItem } from './TodoItem';
import { CardToolbar } from './CardToolbar';
import { useCardContext } from '../context/CardContext';
import {
  addTodoItem,
  deleteTodoItem,
  toggleTodoItem,
  updateCardBackgroundColor,
  createEmptyCard,
} from '../utils/todoHelpers';
import { getRandomColor } from '../constants/colors';
import type { FocusTarget } from '../types';

interface TodoCardDisplayProps {
  cardId: string;
  onCardClick?: (focusTarget: FocusTarget) => void;
}

export const TodoCardDisplay = ({ cardId, onCardClick }: TodoCardDisplayProps) => {
  const { upsertCard, deleteCard, todoCards } = useCardContext();
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const todoInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const card = todoCards.find(c => c.id === cardId) || createEmptyCard(getRandomColor());

  const handleColorChange = (newColor: string) => {
    const updatedCard = updateCardBackgroundColor(card, newColor);
    upsertCard(updatedCard);
  };

  const handleAddTodo = () => {
    const updatedCard = addTodoItem(card);
    upsertCard(updatedCard);
  };

  const handleDeleteTodo = (todoId: string) => {
    const updatedCard = deleteTodoItem(card, todoId);
    upsertCard(updatedCard);
  };

  const handleToggleTodo = (todoId: string) => {
    const updatedCard = toggleTodoItem(card, todoId);
    upsertCard(updatedCard);
  };

  const handleDeleteCard = (cardIdToDelete: string) => {
    deleteCard(cardIdToDelete);
  };

  const handleClick = (action: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      data-testid="todoCardDisplay"
      className={`group p-6 rounded-3xl flex flex-col relative min-h-0 opacity-75 hover:opacity-90 transition-opacity duration-200
      shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),inset_-12px_-12px_15px_0px_rgba(55,65,81,0.24),inset_12px_12px_16px_0px_rgba(55,65,81,0.24)] 
      cursor-pointer w-full border-6 border-[#B7B7B7] ${
        card.backgroundColor || 'bg-gradient-to-br from-gray-300/80 to-gray-100/40'
      } ${isColorPickerOpen ? 'z-[10000]' : ''}`}
      onClick={onCardClick ? handleClick(() => onCardClick('title')) : undefined}
    >
      <div
        className="w-full bg-transparent border-none outline-none font-semibold text-2xl tracking-widest text-gray-700 placeholder-gray-700/60 mb-2 cursor-pointer"
        onClick={onCardClick ? handleClick(() => onCardClick('title')) : undefined}
      >
        {card.title || 'Enter a title...'}
      </div>

      <div data-testid="todoItem-list" className="space-y-1 flex-1">
        {card.todos.map((todo, index) => (
          <div key={todo.id} onClick={onCardClick ? handleClick(() => onCardClick(index)) : undefined}>
            <TodoItem
              todo={todo}
              inputRef={(ref: HTMLInputElement | null) => {
                todoInputRefs.current[index] = ref;
              }}
              onDelete={handleDeleteTodo}
              onEdit={() => {}}
              onToggle={handleToggleTodo}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 text-xs tracking-wide text-gray-700 w-full text-right opacity-0 group-hover:opacity-100">
        <span>
          Edited{' '}
          {new Date(card.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>

      <CardToolbar
        isModal={false}
        isBeingEdited={false}
        initialData={card}
        backgroundColor={card.backgroundColor}
        hasUnsavedChanges={false}
        onColorSelect={handleColorChange}
        onDelete={handleDeleteCard}
        onSave={() => {}}
        onColorPickerToggle={setIsColorPickerOpen}
        onAddTodo={handleAddTodo}
      />
    </div>
  );
};