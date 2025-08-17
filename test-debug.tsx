// Quick test to understand the issue
import { useState } from 'react';

// Simplified version of the hook logic
const testHook = () => {
  const initialCard = { id: '1', title: '', todos: [], backgroundColor: 'blue' };
  const [workingCard, setWorkingCard] = useState(initialCard);
  
  const hasUnsavedChanges = JSON.stringify(workingCard) !== JSON.stringify(initialCard);
  
  console.log('Initial state:', { workingCard, hasUnsavedChanges });
  
  // Simulate title change
  const newCard = { ...workingCard, title: 'Test' };
  setWorkingCard(newCard);
  
  console.log('After change:', { workingCard: newCard, hasUnsavedChanges: JSON.stringify(newCard) !== JSON.stringify(initialCard) });
};

testHook();