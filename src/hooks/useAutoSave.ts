import { useState, useEffect } from 'react';
import type { UseAutoSaveProps } from '../types';

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