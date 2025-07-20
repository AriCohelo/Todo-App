
import React from 'react';

const COLORS = [
  "#77172e",
  "#692b17", 
  "#7c4a03",
  "#264d3b",
  "#0c625d",
  "#256377",
  "#284255",
  "#472e5b",
  "#4b443a"
];

interface ColorPickerProps {
  selectedColor?: string;
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

export const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(({ selectedColor, onColorSelect, onClose }, ref) => {
  const handleColorClick = (color: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onColorSelect(color);
    onClose();
  };

  return (
    <div 
      ref={ref}
      className="absolute top-full right-0 mt-2 bg-black/80 backdrop-blur-md rounded-xl p-3 z-50 shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={(e) => handleColorClick(color, e)}
            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
              selectedColor === color 
                ? 'border-white shadow-lg' 
                : 'border-gray-500 hover:border-gray-300'
            }`}
            style={{ backgroundColor: color }}
            title={`Select ${color}`}
          />
        ))}
      </div>
    </div>
  );
});