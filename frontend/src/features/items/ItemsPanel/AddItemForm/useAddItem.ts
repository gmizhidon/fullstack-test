import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Item } from 'shared';

import { useItemsStore } from '@/features/items/useItemsStore';

import { createItem } from '../../api/itemsApi';
import { itemsQueryKeys } from '../../api/itemsQueryKeys';

export function useAddItem() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createItem,
        onSuccess: async (_, { id }) => {
            await queryClient.invalidateQueries({
                queryKey: itemsQueryKeys.all,
            });

            useItemsStore.getState().removeOptimisticItem(id);
        },
        onError: (_, { id }) => {
            useItemsStore.getState().removeOptimisticItem(id);
        },
    });

    const addItem = (id: Item['id']) => {
        useItemsStore.getState().addOptimisticItem(id);
        mutation.mutate({ id });
    };

    return {
        addItem,
        error: mutation.error,
    };
}
