// Original 9-color palette with gradient transparency
export const CARD_COLORS = [
  'bg-gradient-to-br from-rose-300/80 to-rose-100/40',
  'bg-gradient-to-br from-orange-300/80 to-orange-100/40',
  'bg-gradient-to-br from-amber-300/80 to-amber-100/40',
  'bg-gradient-to-br from-emerald-300/80 to-emerald-100/40',
  'bg-gradient-to-br from-teal-300/80 to-teal-100/40',
  'bg-gradient-to-br from-cyan-300/80 to-cyan-100/40',
  'bg-gradient-to-br from-slate-300/80 to-slate-100/40',
  'bg-gradient-to-br from-violet-300/80 to-violet-100/40',
  'bg-gradient-to-br from-stone-300/80 to-stone-100/40'
];

// Color names for titles (extracted from gradient classes)
export const COLOR_NAMES = [
  'rose', 'orange', 'amber', 'emerald', 'teal', 'cyan', 'slate', 'violet', 'stone'
];

export const getRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * CARD_COLORS.length);
  return CARD_COLORS[randomIndex];
};