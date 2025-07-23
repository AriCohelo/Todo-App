import { useState, useRef } from 'react';

export const useDragAndDrop = () => {
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const dragLeaveTimeoutRef = useRef<number | null>(null);

  const handleDragStart = (index: number, element?: HTMLElement, event?: React.DragEvent) => {
    setDraggedItemIndex(index);
    
    // Create custom drag preview if element and event are provided
    if (element && event) {
      const dragElement = element.cloneNode(true) as HTMLElement;
      dragElement.style.position = 'absolute';
      dragElement.style.top = '-1000px';
      dragElement.style.width = element.getBoundingClientRect().width + 'px';
      dragElement.style.opacity = '1';
      document.body.appendChild(dragElement);
      
      event.dataTransfer.setDragImage(dragElement, event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      
      setTimeout(() => {
        if (document.body.contains(dragElement)) {
          document.body.removeChild(dragElement);
        }
      }, 0);
    }
  };

  const handleDragOver = (index: number) => {
    if (draggedItemIndex !== null && draggedItemIndex !== index) {
      // Clear any pending drag leave timeout
      if (dragLeaveTimeoutRef.current) {
        clearTimeout(dragLeaveTimeoutRef.current);
        dragLeaveTimeoutRef.current = null;
      }
      setDropTargetIndex(index);
    }
  };

  const handleDragLeave = () => {
    // Use a small timeout to prevent flickering when moving between child elements
    dragLeaveTimeoutRef.current = setTimeout(() => {
      setDropTargetIndex(null);
    }, 50);
  };

  const handleDragEnd = () => {
    // Clear any pending timeout
    if (dragLeaveTimeoutRef.current) {
      clearTimeout(dragLeaveTimeoutRef.current);
      dragLeaveTimeoutRef.current = null;
    }
    setDraggedItemIndex(null);
    setDropTargetIndex(null);
  };

  const createDragStartHandler = (index: number) => (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    handleDragStart(index, e.currentTarget as HTMLElement, e);
  };

  const createDragOverHandler = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    handleDragOver(index);
  };

  const createDropEventHandler = (index: number, onReorder: (fromIndex: number, toIndex: number) => void, autoSave?: () => void, isBeingEdited?: boolean) => (e: React.DragEvent) => {
    e.preventDefault();
    
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (draggedIndex !== index && !isBeingEdited) {
      onReorder(draggedIndex, index);
      autoSave?.();
    }
  };

  const createReorderHandler = (onReorder: (fromIndex: number, toIndex: number) => void) => {
    return (fromIndex: number, toIndex: number) => {
      setDraggedItemIndex(null);
      setDropTargetIndex(null);
      onReorder(fromIndex, toIndex);
    };
  };

  const createDragEndHandler = () => () => {
    handleDragEnd();
  };

  return {
    draggedItemIndex,
    dropTargetIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDragEnd,
    createDragStartHandler,
    createDragOverHandler,
    createDropEventHandler,
    createReorderHandler,
    createDragEndHandler,
  };
};