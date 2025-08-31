import { useState, useRef, useEffect } from 'react';
import { TodoItem } from './TodoItem';
import { Icon } from './Icon';
import { ColorPicker } from './ColorPicker';
import { useCardBoardContext } from '../context/CardBoardContext';
import {
  addTodoItem,
  deleteTodoItem,
  toggleTodoItem,
  updateCardBackgroundColor,
  createEmptyCard,
} from '../utils/todoHelpers';
import { getRandomColor } from '../constants/colors';
import type { CardDisplayProps } from '../types';

export const CardDisplay = ({ cardId, onCardClick }: CardDisplayProps) => {
  const { upsertCard, deleteCard, todoCards } = useCardBoardContext();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const card =
    todoCards.find((c) => c.id === cardId) || createEmptyCard(getRandomColor());

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

  const handleDeleteCard = (cardId: string) => {
    deleteCard(cardId);
  };

  const handleClick = (action: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    action();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColorPicker]);

  return (
    <div
      data-testid="todoCardDisplay"
      className={`group p-4 md:p-6 rounded-3xl flex flex-col relative min-h-0 opacity-75 hover:opacity-90 transition-opacity duration-200
      shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),inset_-12px_-12px_15px_0px_rgba(55,65,81,0.24),inset_12px_12px_16px_0px_rgba(55,65,81,0.24)] 
      cursor-pointer w-full border-[3px] md:border-6 border-[#B7B7B7] ${
        card.backgroundColor ||
        'bg-gradient-to-br from-gray-300/80 to-gray-100/40'
      } ${showColorPicker ? 'z-[10000]' : ''}`}
      onClick={handleClick(() => onCardClick('title'))}
    >
      <div
        className="w-full bg-transparent border-none outline-none font-semibold text-xl md:text-2xl tracking-wide md:tracking-widest text-gray-700 placeholder-gray-700/60 mb-2 cursor-pointer"
        onClick={handleClick(() => onCardClick('title'))}
      >
        {card.title || 'Enter a title...'}
      </div>

      <div data-testid="todoItem-list" className="space-y-1 flex-1">
        {card.todos.map((todo, index) => (
          <div
            key={todo.id}
            onClick={handleClick(() => onCardClick(index))}
          >
            <TodoItem
              todo={todo}
              onDelete={handleDeleteTodo}
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

      <div
        className="mt-1 grid grid-cols-9 opacity-0 group-hover:opacity-100 transition-opacity"
        role="toolbar"
      >
        <button
          onClick={handleClick(() => handleAddTodo())}
          className="text-gray-700 hover:text-gray-700/80 justify-self-start cursor-pointer col-start-1"
          title="Add task"
          aria-label="add toDo"
        >
          <Icon
            name="add-todoitem"
            className="w-8 h-8 hover:opacity-80"
            alt="Add task"
          />
        </button>

        <button
          onClick={handleClick(() => {
            const newState = !showColorPicker;
            setShowColorPicker(newState);
          })}
          className="text-gray-700 hover:text-gray-700/80 justify-self-end cursor-pointer relative col-start-8"
          title="Color palette"
        >
          <Icon
            name="palette"
            className="w-4 h-4 hover:opacity-80"
            alt="Color palette"
          />
          {showColorPicker && (
            <ColorPicker
              ref={colorPickerRef}
              selectedColor={card.backgroundColor}
              onColorSelect={handleColorChange}
              onClose={() => {
                setShowColorPicker(false);
              }}
            />
          )}
        </button>

        <button
          onClick={handleClick(() => handleDeleteCard(card.id))}
          className="text-gray-700 hover:text-red-600 justify-self-end cursor-pointer col-start-9"
          title="Delete card"
        >
          <Icon
            name="trash"
            className="w-4 h-4 hover:opacity-80"
            alt="Delete card"
          />
        </button>
      </div>
    </div>
  );
};
