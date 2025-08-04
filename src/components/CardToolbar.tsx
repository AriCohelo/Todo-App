import { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { ColorPicker } from './ColorPicker';
import type { CardToolbarProps } from '../types';

export const CardToolbar = ({
  isModal,
  isBeingEdited,
  initialData,
  backgroundColor,
  hasUnsavedChanges,
  onColorSelect,
  onDelete,
  onClose,
  onSave,
  onColorPickerToggle,
  onAddTodo,
}: CardToolbarProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const toggleColorPicker = (isOpen: boolean) => {
    setShowColorPicker(isOpen);
    onColorPickerToggle?.(isOpen);
  };
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        toggleColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker]);

  return (
    <div
      className={`mt-1 grid grid-cols-9 ${
        isModal ? '' : 'opacity-0 group-hover:opacity-100 transition-opacity'
      }`}
      role="toolbar"
    >
      <button
        onClick={
          isBeingEdited
            ? undefined
            : (e) => {
                e.stopPropagation();
                onAddTodo();
              }
        }
        className="text-gray-700 hover:text-gray-700/80 transition-colors justify-self-start cursor-pointer col-start-1"
        title="Add task"
        aria-label="add toDo"
        disabled={isBeingEdited}
      >
        <Icon
          name="add-todoitem"
          className="w-8 h-8 hover:opacity-80 transition-all"
          alt="Add task"
        />
      </button>

      <button
        onClick={
          isBeingEdited
            ? undefined
            : (e) => {
                e.stopPropagation();
                toggleColorPicker(!showColorPicker);
              }
        }
        className={`text-gray-700 hover:text-gray-700/80 transition-colors justify-self-end cursor-pointer relative ${
          isModal ? 'col-start-6' : 'col-start-8'
        }`}
        title="Color palette"
        disabled={isBeingEdited}
      >
        <Icon
          name="palette"
          className="w-4 h-4 hover:opacity-80 transition-all"
          alt="Color palette"
        />
        {showColorPicker && (
          <ColorPicker
            ref={colorPickerRef}
            selectedColor={backgroundColor || initialData?.backgroundColor || 'bg-gradient-to-br from-gray-300/80 to-gray-100/40'}
            onColorSelect={onColorSelect}
            onClose={() => toggleColorPicker(false)}
          />
        )}
      </button>

      <button
        onClick={
          isBeingEdited
            ? undefined
            : (e) => {
                e.stopPropagation();
                if (isModal) {
                  if (initialData) {
                    onDelete(initialData.id);
                    if (onClose) onClose();
                  } else {
                    if (onClose) onClose();
                  }
                } else {
                  onDelete(initialData?.id || '');
                }
              }
        }
        className={`text-gray-700 hover:text-red-600 transition-colors justify-self-end cursor-pointer ${
          isModal ? 'col-start-7' : 'col-start-9'
        }`}
        title={
          isModal
            ? initialData
              ? 'Delete card'
              : 'Discard changes and close'
            : 'Delete card'
        }
        disabled={isBeingEdited}
      >
        <Icon
          name="trash"
          className="w-4 h-4 hover:opacity-80 transition-all"
          alt="Delete card"
        />
      </button>

      {isModal && (
        <button
          onClick={
            isBeingEdited
              ? undefined
              : (e) => {
                  e.stopPropagation();
                  onSave();
                }
          }
          className="text-gray-700 hover:text-gray-700/80 text-lg tracking-widest font-medium transition-colors justify-self-end cursor-pointer col-start-8 col-span-2"
          title="Save changes"
          disabled={isBeingEdited || !hasUnsavedChanges}
        >
          Save
        </button>
      )}
    </div>
  );
};
