// Quick test to understand the issue
import { useState } from 'react';

// Simplified version of the hook logic
const testHook = () => {
  const newCard = { id: '1', title: '', todos: [], backgroundColor: 'blue' };
  const [workingCard, setWorkingCard] = useState(newCard);
  
  const hasUnsavedChanges = JSON.stringify(workingCard) !== JSON.stringify(newCard);
  
  console.log('Initial state:', { workingCard, hasUnsavedChanges });
  
  // Simulate title change
  const changedCard = { ...workingCard, title: 'Test' };
  setWorkingCard(changedCard);
  
  console.log('After change:', { workingCard: changedCard, hasUnsavedChanges: JSON.stringify(changedCard) !== JSON.stringify(newCard) });
};

testHook();