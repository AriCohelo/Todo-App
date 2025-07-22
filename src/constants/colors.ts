import type { ColorOption } from '../types';

export const CARD_COLORS: ColorOption[] = [
  {
    id: 'rose',
    name: 'Rose',
    hexColor: '#77172e',
    gradientClass: 'bg-gradient-to-br from-rose-300/80 to-rose-100/40',
    borderClass: 'border-rose-300/80'
  },
  {
    id: 'orange',
    name: 'Orange', 
    hexColor: '#692b17',
    gradientClass: 'bg-gradient-to-br from-orange-300/80 to-orange-100/40',
    borderClass: 'border-orange-300/80'
  },
  {
    id: 'amber',
    name: 'Amber',
    hexColor: '#7c4a03',
    gradientClass: 'bg-gradient-to-br from-amber-300/80 to-amber-100/40',
    borderClass: 'border-amber-300/80'
  },
  {
    id: 'emerald',
    name: 'Emerald',
    hexColor: '#264d3b',
    gradientClass: 'bg-gradient-to-br from-emerald-300/80 to-emerald-100/40',
    borderClass: 'border-emerald-300/80'
  },
  {
    id: 'teal',
    name: 'Teal',
    hexColor: '#0c625d',
    gradientClass: 'bg-gradient-to-br from-teal-300/80 to-teal-100/40',
    borderClass: 'border-teal-300/80'
  },
  {
    id: 'cyan',
    name: 'Cyan',
    hexColor: '#256377',
    gradientClass: 'bg-gradient-to-br from-cyan-300/80 to-cyan-100/40',
    borderClass: 'border-cyan-300/80'
  },
  {
    id: 'slate',
    name: 'Slate',
    hexColor: '#284255',
    gradientClass: 'bg-gradient-to-br from-slate-300/80 to-slate-100/40',
    borderClass: 'border-slate-300/80'
  },
  {
    id: 'violet',
    name: 'Violet',
    hexColor: '#472e5b',
    gradientClass: 'bg-gradient-to-br from-violet-300/80 to-violet-100/40',
    borderClass: 'border-violet-300/80'
  },
  {
    id: 'stone',
    name: 'Stone',
    hexColor: '#4b443a',
    gradientClass: 'bg-gradient-to-br from-stone-300/80 to-stone-100/40',
    borderClass: 'border-stone-300/80'
  }
];

// Default color (equivalent to #f87171)
export const DEFAULT_COLOR: ColorOption = {
  id: 'red',
  name: 'Red',
  hexColor: '#f87171',
  gradientClass: 'bg-gradient-to-br from-red-300/80 to-red-100/40',
  borderClass: 'border-red-300/80'
};

export const getColorById = (id: string): ColorOption => {
  return CARD_COLORS.find(color => color.id === id) || DEFAULT_COLOR;
};

export const getColorByHex = (hexColor: string): ColorOption => {
  return CARD_COLORS.find(color => color.hexColor === hexColor) || DEFAULT_COLOR;
};

// Migration function to convert old hex values to new color IDs
export const migrateColor = (colorValue?: string): string => {
  if (!colorValue) return DEFAULT_COLOR.id;
  
  // If it's already a color ID, return it
  if (CARD_COLORS.some(color => color.id === colorValue)) {
    return colorValue;
  }
  
  // If it's a hex value, find the matching color ID
  const colorOption = getColorByHex(colorValue);
  return colorOption.id;
};