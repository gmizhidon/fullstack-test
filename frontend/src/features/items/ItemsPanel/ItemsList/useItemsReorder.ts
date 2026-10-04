import { type DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { Item } from 'shared';

import { moveItem } from '../../api/itemsApi';
import { itemsQueryKeys } from '../../api/itemsQueryKeys';

export function useItemsReorder(items: Item[]) {
    const queryClient = useQueryClient();

    const [optimisticItems, setOptimisticItems] = useState<Item[] | null>(null);

    const reorderMutation = useMutation({
        mutationFn: moveItemMutation,
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: itemsQueryKeys.all }),
        onSettled: () => setOptimisticItems(null),
    });

    const displayedItems = optimisticItems ?? items;

    return {
        items: displayedItems,
        handleDragEnd,
        error: reorderMutation.error,
    };

    function handleDragEnd({ active, over }: DragEndEvent) {
        if (!over || active.id === over.id || reorderMutation.isPending) {
            return;
        }

        const oldIndex = displayedItems.findIndex(item => item.id === active.id);
        const newIndex = displayedItems.findIndex(item => item.id === over.id);

        if (oldIndex === -1 || newIndex === -1) {
            return;
        }

        const reorderedItems = arrayMove(displayedItems, oldIndex, newIndex);

        const movedIndex = reorderedItems.findIndex(item => item.id === active.id);
        const beforeId = reorderedItems[movedIndex + 1]?.id ?? null;

        setOptimisticItems(reorderedItems);

        reorderMutation.mutate({
            id: String(active.id),
            beforeId,
        });
    }

    function moveItemMutation({ id, beforeId }: { id: Item['id']; beforeId: Item['id'] | null }) {
        return moveItem(id, { beforeId });
    }
}
