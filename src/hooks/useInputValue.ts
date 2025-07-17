import { useState, useEffect } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';

interface UseInputValueProps {
  initialValue: string;
  onSave: (value: string) => void;
}

export const useInputValue = ({ initialValue, onSave }: UseInputValueProps) => {
  const [value, setValue] = useState(initialValue);

  // Sync internal state with prop changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSave(e.target.value);
  };

  const handleEnterKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSave(value);
    }
  };

  const handleBlur = () => {
    onSave(value);
  };

  return {
    value,
    handleChange,
    handleEnterKey,
    handleBlur,
  };
};