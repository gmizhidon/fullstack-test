import { useInfiniteQuery } from '@tanstack/react-query';

import { getItems } from '../../api/itemsApi';
import { itemsQueryKeys } from '../../api/itemsQueryKeys';

interface UseItemsOptions {
    selected: boolean;
    filter: string;
}

export function useItems({ selected, filter }: UseItemsOptions) {
    return useInfiniteQuery({
        queryKey: itemsQueryKeys.list(selected, filter),

        queryFn: ({ pageParam }) =>
            getItems({
                selected,
                filter: filter || undefined,
                cursor: pageParam,
            }),

        initialPageParam: undefined as string | undefined,

        getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    });
}
