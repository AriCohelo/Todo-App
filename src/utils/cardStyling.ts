import { getColorById, migrateColor } from '../constants/colors';

/**
 * Generates the complete CSS classes for a todo card's styling
 * including gradient, border, and visual effects
 */
export const getCardStyling = (backgroundColor?: string): string => {
  const colorId = migrateColor(backgroundColor);
  const colorOption = getColorById(colorId);
  return `${colorOption.gradientClass} ${colorOption.borderClass} border-6 backdrop-blur-2xl`;
};