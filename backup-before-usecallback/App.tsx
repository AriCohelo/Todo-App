import { CardBoardProvider } from './context/CardBoardContext';
import { CardEditorProvider, useCardEditorContext } from './context/CardEditorContext';
import { CardTrigger } from './components/CardTrigger';
import { CardBoard } from './components/CardBoard';
import { CardEditor } from './components/CardEditor';

function AppContent() {
  const { editingCardId } = useCardEditorContext();



  return (
    <div className="min-h-screen p-8 lg:p-16 app-background">
      <CardTrigger />
      <CardBoard />
      {editingCardId && (
        <CardEditor
          cardId={editingCardId.cardId}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <CardBoardProvider>
      <CardEditorProvider>
        <AppContent />
      </CardEditorProvider>
    </CardBoardProvider>
  );
}

export default App;
