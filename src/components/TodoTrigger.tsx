import { useTodoContext } from '../context/TodoContext';

export const TodoTrigger = () => {
  const { openCreateModal } = useTodoContext();
  return (
    <div data-testid="todoTrigger" className="flex justify-center mb-16 ">
      <div className="relative w-full max-w-2xl">
        <div className="flex items-center bg-zinc-800 rounded-lg border border-zinc-600 hover:border-zinc-500 transition-colors">
          <input
            placeholder="Take a note..."
            className="flex-1 p-4 bg-transparent text-zinc-300 placeholder-zinc-500 outline-none rounded-l-lg"
            data-testid="todoTrigger-input"
            onClick={() => openCreateModal('title')}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};
