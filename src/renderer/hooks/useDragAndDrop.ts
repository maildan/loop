// 🔥 통용 드래그 앤 드롭 훅
import { useCallback, useState } from 'react';

interface UseDragAndDropProps<T> {
    items: T[];
    onReorder: (newItems: T[]) => void;
    getItemId: (item: T) => string;
}

interface UseDragAndDropReturn {
    draggedItemId: string | null;
    dragOverItemId: string | null;
    handleDragStart: (itemId: string) => void;
    handleDragOver: (e: React.DragEvent, targetId: string) => void;
    handleDragEnd: () => void;
    handleDrop: (targetId: string) => void;
    getDragProps: (itemId: string) => {
        draggable: boolean;
        onDragStart: () => void;
        onDragOver: (e: React.DragEvent) => void;
        onDragEnd: () => void;
        onDrop: (e: React.DragEvent) => void;
        className: string;
    };
}

export function useDragAndDrop<T>({
    items,
    onReorder,
    getItemId
}: UseDragAndDropProps<T>): UseDragAndDropReturn {
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

    const handleDragStart = useCallback((itemId: string) => {
        setDraggedItemId(itemId);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        setDragOverItemId(targetId);
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedItemId(null);
        setDragOverItemId(null);
    }, []);

    const handleDrop = useCallback((targetId: string) => {
        if (!draggedItemId || draggedItemId === targetId) {
            handleDragEnd();
            return;
        }

        const draggedIndex = items.findIndex(item => getItemId(item) === draggedItemId);
        const targetIndex = items.findIndex(item => getItemId(item) === targetId);

        if (draggedIndex === -1 || targetIndex === -1) {
            handleDragEnd();
            return;
        }

        const newItems = [...items];
        const draggedItem = newItems.splice(draggedIndex, 1)[0];
        if (draggedItem) {
            newItems.splice(targetIndex, 0, draggedItem);
            onReorder(newItems);
        }

        handleDragEnd();
    }, [draggedItemId, items, getItemId, onReorder, handleDragEnd]);

    const getDragProps = useCallback((itemId: string) => ({
        draggable: true,
        onDragStart: () => handleDragStart(itemId),
        onDragOver: (e: React.DragEvent) => handleDragOver(e, itemId),
        onDragEnd: handleDragEnd,
        onDrop: (e: React.DragEvent) => {
            e.preventDefault();
            handleDrop(itemId);
        },
        className: `
      ${draggedItemId === itemId ? 'opacity-50 transform rotate-2' : ''}
      ${dragOverItemId === itemId ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : ''}
      transition-all duration-200
    `.trim()
    }), [draggedItemId, dragOverItemId, handleDragStart, handleDragOver, handleDragEnd, handleDrop]);

    return {
        draggedItemId,
        dragOverItemId,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleDrop,
        getDragProps
    };
}
