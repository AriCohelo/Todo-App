import { useCardBoardContext } from '../context/CardBoardContext';
import { useCardEditorContext } from '../context/CardEditorContext';
import { createEmptyCard } from '../utils/todoHelpers';
import { getRandomColor } from '../constants/colors';

export const CardTrigger = () => {
  const { upsertCard } = useCardBoardContext();
  const { startEdit } = useCardEditorContext();

  const handleCreateCard = () => {
    const newCard = createEmptyCard(getRandomColor());
    upsertCard(newCard);
    startEdit(newCard.id, 'title');
  };

  return (
    <div data-testid="todoTrigger" className="flex justify-center mb-16">
      <div className="relative w-full max-w-2xl flex items-center bg-zinc-800 rounded-full border border-zinc-600 hover:border-zinc-500">
        <input
          placeholder="Take a note..."
          className="flex-1 p-4 bg-transparent text-zinc-300 placeholder-zinc-500 outline-none rounded-full"
          data-testid="todoTrigger-input"
          onClick={handleCreateCard}
          readOnly
        />
      </div>
    </div>
  );
};
