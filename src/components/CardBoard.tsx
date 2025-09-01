import { memo } from 'react';
import { CardDisplay } from './CardDisplay';
import { useCardBoardContext } from '../context/CardBoardContext';
import { useCardEditorContext } from '../context/CardEditorContext';

export const CardBoard = memo(() => {
  const { todoCards } = useCardBoardContext();
  const { isEditing, startEdit } = useCardEditorContext();

  return (
    <div
      data-testid="todoBoard"
      className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 auto-rows-min"
    >
      {todoCards.map((card) => (
        <div
          key={card.id}
          className={`break-inside-avoid ${
            isEditing(card.id) ? 'invisible' : ''
          }`}
        >
          <CardDisplay
            cardId={card.id}
            onCardClick={(focusTarget) => startEdit(card.id, focusTarget)}
          />
        </div>
      ))}
    </div>
  );
});
