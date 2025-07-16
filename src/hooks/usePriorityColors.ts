import type { TodoCardData } from '../types';

interface UsePriorityColorsProps {
  priority: TodoCardData['priority'];
}

export const usePriorityColors = ({ priority }: UsePriorityColorsProps) => {
  const getCardBackgroundColor = () => {
    switch (priority) {
      case 'high':
        return 'bg-green-700 text-white';
      case 'medium':
        return 'bg-zinc-800 text-zinc-300';
      case 'low':
        return 'bg-yellow-700 text-white';
      default:
        return 'bg-zinc-800 text-zinc-300';
    }
  };

  return {
    cardBackgroundColor: getCardBackgroundColor(),
  };
};