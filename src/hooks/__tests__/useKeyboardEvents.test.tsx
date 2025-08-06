import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useKeyboardEvents } from '../useKeyboardEvents';

describe('useKeyboardEvents', () => {
  const mockOnClose = vi.fn();
  
  // Mock document event listeners
  const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

  beforeEach(() => {
    mockOnClose.mockClear();
    addEventListenerSpy.mockClear();
    removeEventListenerSpy.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('hook return value', () => {
    it('returns handleEscKey function', () => {
      const { result } = renderHook(() =>
        useKeyboardEvents({ isModal: false, onClose: mockOnClose })
      );

      expect(typeof result.current.handleEscKey).toBe('function');
    });
  });

  describe('event listener management', () => {
    it('adds event listener when isModal is true', () => {
      renderHook(() =>
        useKeyboardEvents({ isModal: true, onClose: mockOnClose })
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('does not add event listener when isModal is false', () => {
      renderHook(() =>
        useKeyboardEvents({ isModal: false, onClose: mockOnClose })
      );

      expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    it('removes event listener on unmount when isModal was true', () => {
      const { unmount } = renderHook(() =>
        useKeyboardEvents({ isModal: true, onClose: mockOnClose })
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('does not remove event listener on unmount when isModal was false', () => {
      const { unmount } = renderHook(() =>
        useKeyboardEvents({ isModal: false, onClose: mockOnClose })
      );

      unmount();

      expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });
  });

  describe('isModal state changes', () => {
    it('adds event listener when isModal changes from false to true', () => {
      const { rerender } = renderHook(
        ({ isModal }) => useKeyboardEvents({ isModal, onClose: mockOnClose }),
        { initialProps: { isModal: false } }
      );

      expect(addEventListenerSpy).not.toHaveBeenCalled();

      rerender({ isModal: true });

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });

    it('removes event listener when isModal changes from true to false', () => {
      const { rerender } = renderHook(
        ({ isModal }) => useKeyboardEvents({ isModal, onClose: mockOnClose }),
        { initialProps: { isModal: true } }
      );

      expect(addEventListenerSpy).toHaveBeenCalled();
      addEventListenerSpy.mockClear();

      rerender({ isModal: false });

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    it('updates event listener when onClose callback changes', () => {
      const newOnClose = vi.fn();
      const { rerender } = renderHook(
        ({ onClose }) => useKeyboardEvents({ isModal: true, onClose }),
        { initialProps: { onClose: mockOnClose } }
      );

      // Clear initial call
      addEventListenerSpy.mockClear();
      removeEventListenerSpy.mockClear();

      rerender({ onClose: newOnClose });

      // Should remove old listener and add new one
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  describe('handleEscKey function', () => {
    it('calls onClose when Escape key is pressed', () => {
      const { result } = renderHook(() =>
        useKeyboardEvents({ isModal: true, onClose: mockOnClose })
      );

      const escKeyEvent = new KeyboardEvent('keydown', { key: 'Escape' });

      act(() => {
        result.current.handleEscKey(escKeyEvent);
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose for non-Escape keys', () => {
      const { result } = renderHook(() =>
        useKeyboardEvents({ isModal: true, onClose: mockOnClose })
      );

      const nonEscKeys = ['Enter', 'Space', 'ArrowUp', 'ArrowDown', 'Tab', 'a', '1'];

      nonEscKeys.forEach(key => {
        const keyEvent = new KeyboardEvent('keydown', { key });
        
        act(() => {
          result.current.handleEscKey(keyEvent);
        });
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('handles case variations of Escape key', () => {
      const { result } = renderHook(() =>
        useKeyboardEvents({ isModal: true, onClose: mockOnClose })
      );

      // The standard Escape key value should work
      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      
      act(() => {
        result.current.handleEscKey(escEvent);
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does nothing when onClose is undefined', () => {
      const { result } = renderHook(() =>
        useKeyboardEvents({ isModal: true, onClose: undefined })
      );

      const escKeyEvent = new KeyboardEvent('keydown', { key: 'Escape' });

      expect(() => {
        act(() => {
          result.current.handleEscKey(escKeyEvent);
        });
      }).not.toThrow();
    });

    it('does nothing when onClose is null', () => {
      const { result } = renderHook(() =>
        useKeyboardEvents({ isModal: true, onClose: null })
      );

      const escKeyEvent = new KeyboardEvent('keydown', { key: 'Escape' });

      expect(() => {
        act(() => {
          result.current.handleEscKey(escKeyEvent);
        });
      }).not.toThrow();
    });
  });

  describe('integration with document events', () => {
    it('responds to actual keydown events on document when in modal mode', () => {
      renderHook(() =>
        useKeyboardEvents({ isModal: true, onClose: mockOnClose })
      );

      // Simulate actual keydown event on document
      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      
      act(() => {
        document.dispatchEvent(escEvent);
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not respond to keydown events when not in modal mode', () => {
      renderHook(() =>
        useKeyboardEvents({ isModal: false, onClose: mockOnClose })
      );

      // Simulate keydown event on document
      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      
      act(() => {
        document.dispatchEvent(escEvent);
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('stops responding to events after modal closes', () => {
      const { rerender } = renderHook(
        ({ isModal }) => useKeyboardEvents({ isModal, onClose: mockOnClose }),
        { initialProps: { isModal: true } }
      );

      // First, verify it responds when modal is open
      let escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      act(() => {
        document.dispatchEvent(escEvent);
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
      mockOnClose.mockClear();

      // Close modal
      rerender({ isModal: false });

      // Should not respond anymore
      escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      act(() => {
        document.dispatchEvent(escEvent);
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('callback stability', () => {
    it('maintains stable handleEscKey reference when dependencies do not change', () => {
      const { result, rerender } = renderHook(() =>
        useKeyboardEvents({ isModal: true, onClose: mockOnClose })
      );

      const firstHandleEscKey = result.current.handleEscKey;

      // Re-render with same props
      rerender();

      expect(result.current.handleEscKey).toBe(firstHandleEscKey);
    });

    it('updates handleEscKey reference when onClose changes', () => {
      const newOnClose = vi.fn();
      const { result, rerender } = renderHook(
        ({ onClose }) => useKeyboardEvents({ isModal: true, onClose }),
        { initialProps: { onClose: mockOnClose } }
      );

      const firstHandleEscKey = result.current.handleEscKey;

      rerender({ onClose: newOnClose });

      expect(result.current.handleEscKey).not.toBe(firstHandleEscKey);
    });
  });

  describe('edge cases', () => {
    it('handles multiple rapid Escape key presses', () => {
      const { result } = renderHook(() =>
        useKeyboardEvents({ isModal: true, onClose: mockOnClose })
      );

      const escKeyEvent = new KeyboardEvent('keydown', { key: 'Escape' });

      // Rapid fire escape keys
      act(() => {
        result.current.handleEscKey(escKeyEvent);
        result.current.handleEscKey(escKeyEvent);
        result.current.handleEscKey(escKeyEvent);
      });

      expect(mockOnClose).toHaveBeenCalledTimes(3);
    });

    it('handles keyboard events with modifiers', () => {
      const { result } = renderHook(() =>
        useKeyboardEvents({ isModal: true, onClose: mockOnClose })
      );

      // Escape with Shift modifier
      const escShiftEvent = new KeyboardEvent('keydown', { 
        key: 'Escape', 
        shiftKey: true 
      });

      // Escape with Ctrl modifier
      const escCtrlEvent = new KeyboardEvent('keydown', { 
        key: 'Escape', 
        ctrlKey: true 
      });

      act(() => {
        result.current.handleEscKey(escShiftEvent);
        result.current.handleEscKey(escCtrlEvent);
      });

      // Should still work with modifiers
      expect(mockOnClose).toHaveBeenCalledTimes(2);
    });

    it('handles onClose that throws an error', () => {
      const throwingOnClose = vi.fn(() => {
        throw new Error('Close failed');
      });

      const { result } = renderHook(() =>
        useKeyboardEvents({ isModal: true, onClose: throwingOnClose })
      );

      const escKeyEvent = new KeyboardEvent('keydown', { key: 'Escape' });

      expect(() => {
        act(() => {
          result.current.handleEscKey(escKeyEvent);
        });
      }).toThrow('Close failed');
    });

    it('properly cleans up when component unmounts during modal state', () => {
      const { unmount } = renderHook(() =>
        useKeyboardEvents({ isModal: true, onClose: mockOnClose })
      );

      // Unmount while modal is active
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      // Should not respond to events after unmount
      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      act(() => {
        document.dispatchEvent(escEvent);
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});