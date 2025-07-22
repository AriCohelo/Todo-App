
import React from 'react';
import { CARD_COLORS } from '../constants/colors';
import type { ColorPickerProps } from '../types';

export const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(({ selectedColor, onColorSelect, onClose }, ref) => {
  const handleColorClick = (colorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onColorSelect(colorId);
    onClose();
  };

  return (
    <div 
      ref={ref}
      className="absolute top-full right-0 mt-2 bg-gray-900 rounded-xl p-3 z-50 shadow-xl w-max"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid grid-cols-5 gap-2 w-max">
        {CARD_COLORS.map((colorOption) => (
          <button
            key={colorOption.id}
            onClick={(e) => handleColorClick(colorOption.id, e)}
            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 opacity-100 ${
              selectedColor === colorOption.id 
                ? 'border-white shadow-lg' 
                : 'border-gray-500 hover:border-gray-300'
            }`}
            style={{ backgroundColor: colorOption.hexColor }}
            title={`Select ${colorOption.name}`}
          />
        ))}
      </div>
    </div>
  );
});