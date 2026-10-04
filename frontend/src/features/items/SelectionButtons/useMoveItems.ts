import { useQueryClient } from '@tanstack/react-query';
import type { Item } from 'shared';

import { updateItem } from '../api/itemsApi';
import { itemsQueryKeys } from '../api/itemsQueryKeys';
import { useItemsStore } from '../useItemsStore';

export function useMoveItems() {
    const queryClient = useQueryClient();

    const moveItems = async (ids: Set<Item['id']>, selected: boolean) => {
        const movedIds = new Set(ids);

        const { available, selected: selectedPanel, setOptimisticMove, clearAll } = useItemsStore.getState();

        setOptimisticMove({
            ids: movedIds,
            selected,
        });

        if (selected) {
            available.clear();
        } else {
            selectedPanel.clear();
        }

        try {
            await Promise.all([...movedIds].map(id => updateItem(id, { selected })));

            await queryClient.invalidateQueries({
                queryKey: itemsQueryKeys.all,
            });
        } catch {
            clearAll();

            // toast позже
        } finally {
            setOptimisticMove(null);
        }
    };

    return {
        moveItems,
    };
}
