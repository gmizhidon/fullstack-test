import { useInfiniteQuery } from '@tanstack/react-query';

import { getItems } from '../../api/itemsApi';
import { itemsQueryKeys } from '../../api/itemsQueryKeys';
import { type ItemsPanelType, useItemsStore } from '../../useItemsStore';

interface UseItemsOptions {
    type: ItemsPanelType;
    filter: string;
}

export function useItems({ type, filter }: UseItemsOptions) {
    const optimisticMove = useItemsStore(state => state.optimisticMove);

    const selected = type === 'selected';

    const query = useInfiniteQuery({
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

    const serverItems = query.data?.pages.flatMap(page => page.items) ?? [];

    const isMovingIn = optimisticMove?.selected === selected;

    const isMovingOut = optimisticMove !== null && optimisticMove.selected !== selected;

    let items = serverItems;

    if (isMovingOut) {
        items = items.filter(item => !optimisticMove.ids.has(item.id));
    }

    if (isMovingIn) {
        const existingIds = new Set(items.map(item => item.id));

        const optimisticItems = [...optimisticMove.ids]
            .filter(id => !filter || id.includes(filter))
            .filter(id => !existingIds.has(id))
            .map(id => ({ id }));

        items = [...items, ...optimisticItems];
    }

    return {
        items,
        isPending: query.isPending,
        isError: query.isError,
        hasNextPage: query.hasNextPage,
        fetchNextPage: query.fetchNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        isFetchNextPageError: query.isFetchNextPageError,
    };
}
