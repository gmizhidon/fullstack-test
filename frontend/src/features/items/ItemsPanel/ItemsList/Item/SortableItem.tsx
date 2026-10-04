import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ReactNode } from 'react';
import type { Item } from 'shared';

interface SortableItemProps {
    id: Item['id'];
    children: ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
            }}
            {...attributes}
            {...listeners}
        >
            {children}
        </div>
    );
}
