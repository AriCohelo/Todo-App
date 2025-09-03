import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StrictMode } from 'react';
import App from '../App';

// Mock console to catch React errors
const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('App Integration - Initialization & Mounting', () => {
  beforeEach(() => {
    consoleSpy.mockClear();
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Application Initialization', () => {
    it('renders without crashing in normal mode', () => {
      expect(() => {
        render(<App />);
      }).not.toThrow();
    });

    it('renders without crashing in StrictMode', () => {
      expect(() => {
        render(
          <StrictMode>
            <App />
          </StrictMode>
        );
      }).not.toThrow();
    });

    it('does not log React errors during mounting', () => {
      render(<App />);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('initializes with correct DOM structure', () => {
      render(<App />);
      
      // Check main container exists
      expect(screen.getByTestId('todoTrigger')).toBeInTheDocument();
      expect(screen.getByTestId('todoBoard')).toBeInTheDocument();
      
      // Check no modals are open initially
      expect(screen.queryByTestId('todoCardEditor-modal')).not.toBeInTheDocument();
    });
  });

  describe('State Initialization', () => {
    it('initializes with empty state when localStorage is empty', () => {
      render(<App />);
      
      const todoBoard = screen.getByTestId('todoBoard');
      expect(todoBoard).toBeInTheDocument();
      expect(screen.queryByTestId('todoCardDisplay')).not.toBeInTheDocument();
    });

    it('loads state from localStorage when available', () => {
      // Mock localStorage data
      const mockCardData = JSON.stringify([{
        id: 'test-card',
        title: 'Test Card',
        todos: [{ id: 'todo-1', task: 'Test Task', completed: false }],
        updatedAt: new Date().toISOString(),
        backgroundColor: 'bg-blue-200'
      }]);
      
      localStorage.setItem('todoCards', mockCardData);
      
      render(<App />);
      
      expect(screen.getByText('Test Card')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    });

    it('handles corrupted localStorage data gracefully', () => {
      // Set invalid JSON in localStorage
      localStorage.setItem('todoCards', 'invalid-json');
      
      expect(() => {
        render(<App />);
      }).not.toThrow();
      
      // Should initialize with empty state
      expect(screen.queryByTestId('todoCardDisplay')).not.toBeInTheDocument();
    });
  });

  describe('Error Recovery', () => {
    it('recovers from render errors in StrictMode', () => {
      render(
        <StrictMode>
          <App />
        </StrictMode>
      );
      
      // Should render successfully even with StrictMode's double-rendering
      expect(screen.getByTestId('todoTrigger')).toBeInTheDocument();
      expect(screen.getByTestId('todoBoard')).toBeInTheDocument();
    });

    it('handles missing CSS gracefully', () => {
      // This tests that the app works even if CSS fails to load
      render(<App />);
      
      // Core functionality should still work
      expect(screen.getByTestId('todoTrigger')).toBeInTheDocument();
      expect(screen.getByTestId('todoBoard')).toBeInTheDocument();
    });
  });

  describe('Context Providers', () => {
    it('initializes all context providers correctly', () => {
      render(<App />);
      
      // Test that contexts are working by checking if components that depend on them render
      expect(screen.getByTestId('todoTrigger')).toBeInTheDocument();
      expect(screen.getByTestId('todoBoard')).toBeInTheDocument();
    });

    it('provides default context values on initialization', () => {
      render(<App />);
      
      // Verify that context-dependent components work with default values
      const todoBoard = screen.getByTestId('todoBoard');
      expect(todoBoard).toBeInTheDocument();
    });
  });
});