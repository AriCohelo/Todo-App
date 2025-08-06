import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useInputValue } from '../useInputValue';

describe('useInputValue', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    mockOnSave.mockClear();
  });

  describe('initialization', () => {
    it('initializes with provided initial value', () => {
      const { result } = renderHook(() =>
        useInputValue({ initialValue: 'test value', onSave: mockOnSave })
      );

      expect(result.current.value).toBe('test value');
    });

    it('initializes with empty string', () => {
      const { result } = renderHook(() =>
        useInputValue({ initialValue: '', onSave: mockOnSave })
      );

      expect(result.current.value).toBe('');
    });

    it('provides handleChange and handleBlur functions', () => {
      const { result } = renderHook(() =>
        useInputValue({ initialValue: 'test', onSave: mockOnSave })
      );

      expect(typeof result.current.handleChange).toBe('function');
      expect(typeof result.current.handleBlur).toBe('function');
    });
  });

  describe('value synchronization', () => {
    it('updates internal value when initialValue prop changes', () => {
      const { result, rerender } = renderHook(
        ({ initialValue }) => useInputValue({ initialValue, onSave: mockOnSave }),
        { initialProps: { initialValue: 'initial' } }
      );

      expect(result.current.value).toBe('initial');

      rerender({ initialValue: 'updated' });

      expect(result.current.value).toBe('updated');
    });

    it('handles undefined initialValue', () => {
      const { result } = renderHook(() =>
        useInputValue({ initialValue: undefined as any, onSave: mockOnSave })
      );

      expect(result.current.value).toBe(undefined);
    });

    it('handles null initialValue', () => {
      const { result } = renderHook(() =>
        useInputValue({ initialValue: null as any, onSave: mockOnSave })
      );

      expect(result.current.value).toBe(null);
    });
  });

  describe('handleChange', () => {
    it('updates internal value on change', () => {
      const { result } = renderHook(() =>
        useInputValue({ initialValue: 'initial', onSave: mockOnSave })
      );

      const mockEvent = {
        target: { value: 'changed value' }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleChange(mockEvent);
      });

      expect(result.current.value).toBe('changed value');
    });

    it('calls onSave with new value on change', () => {
      const { result } = renderHook(() =>
        useInputValue({ initialValue: 'initial', onSave: mockOnSave })
      );

      const mockEvent = {
        target: { value: 'new value' }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleChange(mockEvent);
      });

      expect(mockOnSave).toHaveBeenCalledWith('new value');
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it('handles empty string changes', () => {
      const { result } = renderHook(() =>
        useInputValue({ initialValue: 'some text', onSave: mockOnSave })
      );

      const mockEvent = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleChange(mockEvent);
      });

      expect(result.current.value).toBe('');
      expect(mockOnSave).toHaveBeenCalledWith('');
    });

    it('handles special characters in input', () => {
      const { result } = renderHook(() =>
        useInputValue({ initialValue: '', onSave: mockOnSave })
      );

      const specialValue = 'Special chars: @#$%^&*()_+{}[]|\\:";\'<>?,./';
      const mockEvent = {
        target: { value: specialValue }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleChange(mockEvent);
      });

      expect(result.current.value).toBe(specialValue);
      expect(mockOnSave).toHaveBeenCalledWith(specialValue);
    });

    it('handles unicode characters', () => {
      const { result } = renderHook(() =>
        useInputValue({ initialValue: '', onSave: mockOnSave })
      );

      const unicodeValue = '🚀 Unicode test: café, naïve, 日本語';
      const mockEvent = {
        target: { value: unicodeValue }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleChange(mockEvent);
      });

      expect(result.current.value).toBe(unicodeValue);
      expect(mockOnSave).toHaveBeenCalledWith(unicodeValue);
    });
  });

  describe('handleBlur', () => {
    it('calls onSave with current value on blur', () => {
      const { result } = renderHook(() =>
        useInputValue({ initialValue: 'initial', onSave: mockOnSave })
      );

      act(() => {
        result.current.handleBlur();
      });

      expect(mockOnSave).toHaveBeenCalledWith('initial');
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it('calls onSave with updated value after changes', () => {
      const { result } = renderHook(() =>
        useInputValue({ initialValue: 'initial', onSave: mockOnSave })
      );

      // First change the value
      const mockEvent = {
        target: { value: 'modified' }
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleChange(mockEvent);
      });

      mockOnSave.mockClear(); // Clear the call from handleChange

      // Then blur
      act(() => {
        result.current.handleBlur();
      });

      expect(mockOnSave).toHaveBeenCalledWith('modified');
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it('handles blur with empty value', () => {
      const { result } = renderHook(() =>
        useInputValue({ initialValue: '', onSave: mockOnSave })
      );

      act(() => {
        result.current.handleBlur();
      });

      expect(mockOnSave).toHaveBeenCalledWith('');
    });
  });

  describe('integration scenarios', () => {
    it('handles multiple change events followed by blur', () => {
      const { result } = renderHook(() =>
        useInputValue({ initialValue: 'start', onSave: mockOnSave })
      );

      // Multiple changes
      act(() => {
        result.current.handleChange({
          target: { value: 'change1' }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.handleChange({
          target: { value: 'change2' }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.handleChange({
          target: { value: 'final' }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      // Clear previous calls to test blur behavior
      mockOnSave.mockClear();

      act(() => {
        result.current.handleBlur();
      });

      expect(result.current.value).toBe('final');
      expect(mockOnSave).toHaveBeenCalledWith('final');
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it('synchronizes correctly when prop changes during editing', () => {
      const { result, rerender } = renderHook(
        ({ initialValue }) => useInputValue({ initialValue, onSave: mockOnSave }),
        { initialProps: { initialValue: 'prop value' } }
      );

      // User starts editing
      act(() => {
        result.current.handleChange({
          target: { value: 'user edit' }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.value).toBe('user edit');

      // External prop change (e.g., from another component)
      rerender({ initialValue: 'external change' });

      expect(result.current.value).toBe('external change');
    });

    it('maintains state consistency across re-renders', () => {
      const { result, rerender } = renderHook(() =>
        useInputValue({ initialValue: 'consistent', onSave: mockOnSave })
      );

      act(() => {
        result.current.handleChange({
          target: { value: 'modified' }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      const firstValue = result.current.value;

      rerender();

      expect(result.current.value).toBe(firstValue);
      // Note: Function references may not be stable in this simple implementation
      // but that's fine for testing purposes
      expect(typeof result.current.handleChange).toBe('function');
      expect(typeof result.current.handleBlur).toBe('function');
    });

    it('handles rapid changes correctly', () => {
      const { result } = renderHook(() =>
        useInputValue({ initialValue: '', onSave: mockOnSave })
      );

      const changes = ['a', 'ab', 'abc', 'abcd', 'abcde'];
      
      changes.forEach(value => {
        act(() => {
          result.current.handleChange({
            target: { value }
          } as React.ChangeEvent<HTMLInputElement>);
        });
      });

      expect(result.current.value).toBe('abcde');
      expect(mockOnSave).toHaveBeenCalledTimes(changes.length);
      expect(mockOnSave).toHaveBeenLastCalledWith('abcde');
    });
  });

  describe('onSave callback variations', () => {
    it('works when onSave is undefined', () => {
      const { result } = renderHook(() =>
        useInputValue({ initialValue: 'test', onSave: undefined as any })
      );

      expect(() => {
        act(() => {
          result.current.handleChange({
            target: { value: 'new' }
          } as React.ChangeEvent<HTMLInputElement>);
        });
      }).toThrow(); // Should throw because onSave is required
    });

    it('handles onSave that throws an error', () => {
      const throwingOnSave = vi.fn(() => {
        throw new Error('Save failed');
      });

      const { result } = renderHook(() =>
        useInputValue({ initialValue: 'test', onSave: throwingOnSave })
      );

      expect(() => {
        act(() => {
          result.current.handleChange({
            target: { value: 'new' }
          } as React.ChangeEvent<HTMLInputElement>);
        });
      }).toThrow('Save failed');
    });
  });

  describe('edge cases', () => {
    it('handles very long strings', () => {
      const longString = 'a'.repeat(10000);
      const { result } = renderHook(() =>
        useInputValue({ initialValue: '', onSave: mockOnSave })
      );

      act(() => {
        result.current.handleChange({
          target: { value: longString }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.value).toBe(longString);
      expect(mockOnSave).toHaveBeenCalledWith(longString);
    });

    it('handles newlines in input', () => {
      const multilineValue = 'Line 1\nLine 2\nLine 3';
      const { result } = renderHook(() =>
        useInputValue({ initialValue: '', onSave: mockOnSave })
      );

      act(() => {
        result.current.handleChange({
          target: { value: multilineValue }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.value).toBe(multilineValue);
      expect(mockOnSave).toHaveBeenCalledWith(multilineValue);
    });
  });
});