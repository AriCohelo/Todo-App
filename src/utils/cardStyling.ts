import { getColorById, migrateColor } from '../constants/colors';

/**
 * Generates the complete CSS classes for a todo card's styling
 */
export const getCardStyling = (backgroundColor?: string): string => {
  const colorId = migrateColor(backgroundColor);
  const colorOption = getColorById(colorId);
  return `${colorOption.gradientClass}`;
};
