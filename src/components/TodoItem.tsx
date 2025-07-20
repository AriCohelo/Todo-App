import type { TodoItemProps } from '../types';
import { useInputValue } from '../hooks/useInputValue';
import { Icon } from './Icon';
import { useState } from 'react';

export const TodoItem = ({
  todo,
  onDelete,
  onToggle,
  onEdit,
  onReorder,
  inputRef,
  onClick,
  index,
}: TodoItemProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { value, handleChange, handleEnterKey, handleBlur } = useInputValue({
    initialValue: todo.task,
    onSave: (value) => onEdit(todo.id, value),
  });

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (draggedIndex !== index && onReorder) {
      onReorder(draggedIndex, index);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className={`flex items-center gap-2 w-full transition-all duration-200 ${
        isDragging ? 'opacity-50' : ''
      } ${
        dragOver ? 'bg-white/20 rounded-md' : ''
      }`}
      draggable={true}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
    >
      <Icon name="grabber" className="w-4 h-4 cursor-grab active:cursor-grabbing hover:opacity-80 transition-all" alt="grab and drag todoItem" />

      <div
        className="flex-shrink-0 w-3 h-3 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(todo.id);
        }}
      >
        <Icon
          name={todo.completed ? 'checkbox-checked' : 'checkbox-empty'}
          className="w-3 h-3 hover:opacity-80 transition-all"
          alt={todo.completed ? 'Completed task' : 'Uncompleted task'}
        />
      </div>
      <input
        ref={(ref) => {
          if (typeof inputRef === 'function') {
            inputRef(ref);
          } else if (inputRef && 'current' in inputRef && ref) {
            inputRef.current = ref;
          }
        }}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleEnterKey}
        onBlur={handleBlur}
        onClick={(e) => {
          if (onClick) {
            e.stopPropagation();
            onClick();
          }
        }}
        placeholder="Add task"
        className={`flex-1 bg-transparent border-none outline-none text-[18px] tracking-[3px] text-gray-700 min-w-0 ${
          todo.completed ? 'line-through text-gray-700/50' : 'no-underline'
        }`}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(todo.id);
        }}
        className="flex-shrink-0 text-gray-700 hover:text-red-600 transition-colors p-1 rounded hover:bg-white/10 cursor-pointer"
        title="Delete item"
      >
        <Icon name="x" className="w-4 h-4 hover:opacity-80 transition-all" alt="Delete item" />
      </button>
    </div>
  );
};
