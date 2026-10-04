import {
    DndContext,
    DragOverlay,
    PointerSensor,
    type DragEndEvent,
    type DragStartEvent,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState, type ReactNode } from 'react';
import type { Item } from 'shared';

interface SortableItemsProps {
    ids: Item['id'][];
    children: ReactNode;
    renderOverlay: (id: Item['id']) => ReactNode;
    onDragEnd: (event: DragEndEvent) => void;
}

export function SortableItems({ ids, children, renderOverlay, onDragEnd }: SortableItemsProps) {
    const [activeId, setActiveId] = useState<Item['id'] | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
    );

    function handleDragStart({ active }: DragStartEvent) {
        setActiveId(String(active.id));
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveId(null);
        onDragEnd(event);
    }

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                {children}
            </SortableContext>
            <DragOverlay>{activeId ? renderOverlay(activeId) : null}</DragOverlay>
        </DndContext>
    );
}
