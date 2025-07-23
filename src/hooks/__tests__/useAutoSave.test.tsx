import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAutoSave } from '../useAutoSave';
import { useEffect } from 'react';

// Test component to test the hook
interface TestComponentProps {
  isModal: boolean;
  hasUnsavedChanges: boolean;
  handleSave: () => void;
  onResult?: (result: any) => void;
  triggerAutoSave?: boolean;
}

const TestComponent = ({ 
  isModal, 
  hasUnsavedChanges, 
  handleSave, 
  onResult,
  triggerAutoSave 
}: TestComponentProps) => {
  const { triggerAutoSave: autoSaveTrigger } = useAutoSave({
    isModal,
    hasUnsavedChanges,
    handleSave
  });

  useEffect(() => {
    if (onResult) {
      onResult({ triggerAutoSave: autoSaveTrigger });
    }
  }, [autoSaveTrigger, onResult]);

  useEffect(() => {
    if (triggerAutoSave) {
      autoSaveTrigger();
    }
  }, [triggerAutoSave, autoSaveTrigger]);

  return <div>Test</div>;
};

describe('useAutoSave', () => {
  const mockHandleSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('provides triggerAutoSave function', () => {
      let hookResult: any;
      
      render(
        <TestComponent
          isModal={false}
          hasUnsavedChanges={false}
          handleSave={mockHandleSave}
          onResult={(result) => { hookResult = result; }}
        />
      );

      expect(typeof hookResult.triggerAutoSave).toBe('function');
    });

    it('does not auto-save in modal mode', () => {
      render(
        <TestComponent
          isModal={true}
          hasUnsavedChanges={true}
          handleSave={mockHandleSave}
          triggerAutoSave={true}
        />
      );

      expect(mockHandleSave).not.toHaveBeenCalled();
    });

    it('does not auto-save when no unsaved changes', () => {
      render(
        <TestComponent
          isModal={false}
          hasUnsavedChanges={false}
          handleSave={mockHandleSave}
          triggerAutoSave={true}
        />
      );

      expect(mockHandleSave).not.toHaveBeenCalled();
    });
  });

  describe('auto-save behavior', () => {
    it('auto-saves when not in modal and has unsaved changes', () => {
      render(
        <TestComponent
          isModal={false}
          hasUnsavedChanges={true}
          handleSave={mockHandleSave}
          triggerAutoSave={true}
        />
      );

      expect(mockHandleSave).toHaveBeenCalledTimes(1);
    });

    it('allows multiple separate saves when triggered separately', () => {
      let hookResult: any;
      
      render(
        <TestComponent
          isModal={false}
          hasUnsavedChanges={true}
          handleSave={mockHandleSave}
          onResult={(result) => { hookResult = result; }}
        />
      );

      // First trigger
      act(() => {
        hookResult.triggerAutoSave();
      });

      expect(mockHandleSave).toHaveBeenCalledTimes(1);

      // Second trigger - should work since state was reset after first save
      act(() => {
        hookResult.triggerAutoSave();
      });

      expect(mockHandleSave).toHaveBeenCalledTimes(2);
    });
  });

  describe('conditional auto-save scenarios', () => {
    it('auto-saves when isModal changes from true to false with unsaved changes', () => {
      const { rerender } = render(
        <TestComponent
          isModal={true}
          hasUnsavedChanges={true}
          handleSave={mockHandleSave}
          triggerAutoSave={true}
        />
      );

      // Should not save while in modal
      expect(mockHandleSave).not.toHaveBeenCalled();

      // Change to non-modal with trigger still active
      rerender(
        <TestComponent
          isModal={false}
          hasUnsavedChanges={true}
          handleSave={mockHandleSave}
          triggerAutoSave={true}
        />
      );

      expect(mockHandleSave).toHaveBeenCalledTimes(1);
    });

    it('auto-saves when hasUnsavedChanges changes from false to true with trigger active', () => {
      const { rerender } = render(
        <TestComponent
          isModal={false}
          hasUnsavedChanges={false}
          handleSave={mockHandleSave}
          triggerAutoSave={true}
        />
      );

      // Should not save without unsaved changes
      expect(mockHandleSave).not.toHaveBeenCalled();

      // Add unsaved changes with trigger still active
      rerender(
        <TestComponent
          isModal={false}
          hasUnsavedChanges={true}
          handleSave={mockHandleSave}
          triggerAutoSave={true}
        />
      );

      expect(mockHandleSave).toHaveBeenCalledTimes(1);
    });

    it('calls new handleSave when function changes and trigger is still active', () => {
      const newHandleSave = vi.fn();
      
      const { rerender } = render(
        <TestComponent
          isModal={false}
          hasUnsavedChanges={true}
          handleSave={mockHandleSave}
          triggerAutoSave={true}
        />
      );

      expect(mockHandleSave).toHaveBeenCalledTimes(1);

      // Change handleSave function - the useEffect dependency on handleSave will trigger again
      rerender(
        <TestComponent
          isModal={false}
          hasUnsavedChanges={true}
          handleSave={newHandleSave}
          triggerAutoSave={true}
        />
      );

      // The new handleSave should be called due to useEffect dependency change
      expect(newHandleSave).toHaveBeenCalledTimes(1);
      expect(mockHandleSave).toHaveBeenCalledTimes(1);
    });
  });

  describe('multiple trigger scenarios', () => {
    it('handles rapid successive triggers by saving once per render cycle', () => {
      let hookResult: any;
      
      render(
        <TestComponent
          isModal={false}
          hasUnsavedChanges={true}
          handleSave={mockHandleSave}
          onResult={(result) => { hookResult = result; }}
        />
      );

      // Trigger multiple times rapidly - should only save once per effect cycle
      act(() => {
        hookResult.triggerAutoSave();
        hookResult.triggerAutoSave();
        hookResult.triggerAutoSave();
      });

      // Should call handleSave only once since shouldAutoSave is reset after save
      expect(mockHandleSave).toHaveBeenCalledTimes(1);
    });

    it('resets shouldAutoSave state after successful save', () => {
      let hookResult: any;
      
      render(
        <TestComponent
          isModal={false}
          hasUnsavedChanges={true}
          handleSave={mockHandleSave}
          onResult={(result) => { hookResult = result; }}
        />
      );

      // Trigger auto-save
      act(() => {
        hookResult.triggerAutoSave();
      });

      expect(mockHandleSave).toHaveBeenCalledTimes(1);

      // The internal shouldAutoSave state should be reset after save
      // We can't directly test this, but we can verify behavior by triggering again
      act(() => {
        hookResult.triggerAutoSave();
      });

      expect(mockHandleSave).toHaveBeenCalledTimes(2);
    });
  });

  describe('edge cases', () => {
    it('requires handleSave to be a function', () => {
      // The hook expects handleSave to be a function and will throw if it's not
      expect(() => {
        render(
          <TestComponent
            isModal={false}
            hasUnsavedChanges={true}
            handleSave={undefined as any}
            triggerAutoSave={true}
          />
        );
      }).toThrow();
    });

    it('works with different combinations of props', () => {
      const testCases = [
        { isModal: true, hasUnsavedChanges: true, shouldSave: false },
        { isModal: true, hasUnsavedChanges: false, shouldSave: false },
        { isModal: false, hasUnsavedChanges: true, shouldSave: true },
        { isModal: false, hasUnsavedChanges: false, shouldSave: false },
      ];

      testCases.forEach(({ isModal, hasUnsavedChanges, shouldSave }, index) => {
        const testHandleSave = vi.fn();
        
        render(
          <TestComponent
            key={index}
            isModal={isModal}
            hasUnsavedChanges={hasUnsavedChanges}
            handleSave={testHandleSave}
            triggerAutoSave={true}
          />
        );

        if (shouldSave) {
          expect(testHandleSave).toHaveBeenCalledTimes(1);
        } else {
          expect(testHandleSave).not.toHaveBeenCalled();
        }
      });
    });
  });

  describe('useEffect dependency behavior', () => {
    it('reacts to changes in isModal prop', () => {
      const { rerender } = render(
        <TestComponent
          isModal={true}
          hasUnsavedChanges={true}
          handleSave={mockHandleSave}
          triggerAutoSave={true}
        />
      );

      expect(mockHandleSave).not.toHaveBeenCalled();

      // Change isModal to false
      rerender(
        <TestComponent
          isModal={false}
          hasUnsavedChanges={true}
          handleSave={mockHandleSave}
          triggerAutoSave={true}
        />
      );

      expect(mockHandleSave).toHaveBeenCalledTimes(1);
    });

    it('reacts to changes in hasUnsavedChanges prop', () => {
      const { rerender } = render(
        <TestComponent
          isModal={false}
          hasUnsavedChanges={false}
          handleSave={mockHandleSave}
          triggerAutoSave={true}
        />
      );

      expect(mockHandleSave).not.toHaveBeenCalled();

      // Change hasUnsavedChanges to true
      rerender(
        <TestComponent
          isModal={false}
          hasUnsavedChanges={true}
          handleSave={mockHandleSave}
          triggerAutoSave={true}
        />
      );

      expect(mockHandleSave).toHaveBeenCalledTimes(1);
    });

    it('reacts to changes in handleSave prop', () => {
      const newHandleSave = vi.fn();
      
      const { rerender } = render(
        <TestComponent
          isModal={false}
          hasUnsavedChanges={true}
          handleSave={mockHandleSave}
          triggerAutoSave={true}
        />
      );

      expect(mockHandleSave).toHaveBeenCalledTimes(1);

      // Change handleSave function and trigger again
      rerender(
        <TestComponent
          isModal={false}
          hasUnsavedChanges={true}
          handleSave={newHandleSave}
          triggerAutoSave={true}
        />
      );

      // The new handleSave should be called
      expect(newHandleSave).toHaveBeenCalledTimes(1);
      expect(mockHandleSave).toHaveBeenCalledTimes(1); // Original should not be called again
    });
  });
});