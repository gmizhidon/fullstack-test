import { useQueryClient } from '@tanstack/react-query';
import type { Item } from 'shared';

import { updateItem } from '../api/itemsApi';
import { itemsQueryKeys } from '../api/itemsQueryKeys';
import { type ItemsPanelType, useItemsStore } from '../useItemsStore';

export function useMoveItems() {
    const queryClient = useQueryClient();

    const moveItems = async (ids: Set<Item['id']>, target: ItemsPanelType) => {
        const movedIds = new Set(ids);
        const selected = target === 'selected';

        const {
            available,
            selected: selectedPanel,
            setOptimisticMoves,
            clearOptimisticMoves,
        } = useItemsStore.getState();

        setOptimisticMoves(movedIds, target);

        if (target === 'selected') {
            available.clear();
        } else {
            selectedPanel.clear();
        }

        try {
            await Promise.all([...movedIds].map(id => updateItem(id, { selected })));
        } catch {
            // Error is resolved by refetching server state.
        } finally {
            await queryClient.invalidateQueries({
                queryKey: itemsQueryKeys.all,
            });

            clearOptimisticMoves(movedIds, target);
        }
    };

    return {
        moveItems,
    };
}
