import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Item } from 'shared';

import { moveItem } from '../../api/itemsApi';
import { itemsQueryKeys } from '../../api/itemsQueryKeys';

interface ReorderItemVariables {
    id: Item['id'];
    beforeId: Item['id'] | null;
}

export function useReorderItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, beforeId }: ReorderItemVariables) => moveItem(id, { beforeId }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: itemsQueryKeys.all,
            });
        },
    });
}
