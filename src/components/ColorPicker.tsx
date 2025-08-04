import React from 'react';
import { CARD_COLORS, COLOR_NAMES } from '../constants/colors';
import type { ColorPickerProps } from '../types';

export const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  ({ selectedColor, onColorSelect, onClose }, ref) => {
    const handleColorClick = (colorClass: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onColorSelect(colorClass);
      onClose();
    };

    return (
      <div
        ref={ref}
        className="absolute top-full right-0 mt-2 bg-gray-900 rounded-xl p-3 z-[9999] shadow-xl w-max"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-3 gap-2 w-max">
          {CARD_COLORS.map((colorClass, index) => (
            <button
              key={colorClass}
              onClick={(e) => handleColorClick(colorClass, e)}
              className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 cursor-pointer ${colorClass} ${
                selectedColor === colorClass
                  ? 'border-white shadow-lg'
                  : 'border-gray-500 hover:border-gray-300'
              }`}
              title={COLOR_NAMES[index]}
            />
          ))}
        </div>
      </div>
    );
  }
);
