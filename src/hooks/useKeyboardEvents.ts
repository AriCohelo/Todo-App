import { useEffect, useCallback } from 'react';
import type { UseKeyboardEventsProps } from '../types';

export const useKeyboardEvents = ({ isModal, onClose }: UseKeyboardEventsProps) => {
  const handleEscKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onClose) onClose();
      }
    },
    [onClose]
  );

  // Handle ESC key if in modal mode
  useEffect(() => {
    if (isModal) {
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [isModal, handleEscKey]);

  return {
    handleEscKey,
  };
};