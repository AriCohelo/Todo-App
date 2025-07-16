import { useState, useEffect } from 'react';

interface UseAutoSaveProps {
  isModal: boolean;
  hasUnsavedChanges: boolean;
  handleSave: () => void;
}

export const useAutoSave = ({ isModal, hasUnsavedChanges, handleSave }: UseAutoSaveProps) => {
  const [shouldAutoSave, setShouldAutoSave] = useState(false);

  // Auto-save when shouldAutoSave is true and component has unsaved changes
  useEffect(() => {
    if (shouldAutoSave && !isModal && hasUnsavedChanges) {
      handleSave();
      setShouldAutoSave(false);
    }
  }, [shouldAutoSave, isModal, hasUnsavedChanges, handleSave]);

  const triggerAutoSave = () => {
    setShouldAutoSave(true);
  };

  return { triggerAutoSave };
};