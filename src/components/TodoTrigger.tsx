import { useTodoContext } from '../context/TodoContext';

export const TodoTrigger = () => {
  const { openCreateModal } = useTodoContext();
  return (
    <div
      data-testid="todoTrigger"
      className="flex justify-center mb-8 bg-zinc-700"
    >
      <div className="relative w-full max-w-2xl">
        <div className="flex items-center bg-zinc-800 rounded-lg border border-zinc-600 hover:border-zinc-500 transition-colors">
          <input
            placeholder="Take a note..."
            className="flex-1 p-4 bg-transparent text-zinc-300 placeholder-zinc-500 outline-none rounded-l-lg"
            data-testid="todoTrigger-input"
            onClick={() => openCreateModal('title')}
            readOnly
          />
          <div className="flex items-center gap-2 pr-4">
            <button 
              className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
              onClick={() => openCreateModal('new-todo')}
              title="Create checklist"
            >
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button 
              className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
              onClick={() => openCreateModal('title')}
              title="Draw"
            >
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button 
              className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
              onClick={() => openCreateModal('title')}
              title="Add image"
            >
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
