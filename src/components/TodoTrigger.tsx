import type { TodoTriggerProps } from '../types';

export const TodoTrigger = ({ onOpenModal }: TodoTriggerProps) => {
  return (
    <div
      data-testid="todoTrigger"
      className="flex flex-col items-center bg-zinc-700"
    >
      <input
        placeholder="take a note..."
        className="mb-4 p-3 border border-stone-300 rounded-lg focus:ring-2 outline-none text-stone-300"
        data-testid="todoTrigger-input"
        onClick={() => onOpenModal('title')}
      />
    </div>
  );
};
