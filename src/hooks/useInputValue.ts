import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import type { UseInputValueProps } from '../types';

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

  const handleBlur = () => {
    onSave(value);
  };

  return {
    value,
    handleChange,
    handleBlur,
  };
};