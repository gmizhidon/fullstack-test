import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';

const ESTIMATED_ITEM_SIZE = 40;
const ITEM_GAP = 8;
const OVERSCAN = 3;
const LOAD_MORE_THRESHOLD = 5;
const FILTERED_ITEMS_LIMIT = 20;

interface UseItemsVirtualizerOptions {
    count: number;
    isFiltered: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => unknown;
}

export function useItemsVirtualizer({
    count,
    isFiltered,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
}: UseItemsVirtualizerOptions) {
    const listRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count,
        getScrollElement: () => listRef.current,
        estimateSize: () => ESTIMATED_ITEM_SIZE,
        gap: ITEM_GAP,
        overscan: isFiltered ? 0 : OVERSCAN,
    });

    const virtualItems = virtualizer.getVirtualItems();

    const measuredItemSize = virtualItems[0]?.size ?? ESTIMATED_ITEM_SIZE;

    const filteredMaxHeight = measuredItemSize * FILTERED_ITEMS_LIMIT + ITEM_GAP * (FILTERED_ITEMS_LIMIT - 1);

    useEffect(() => {
        const lastItem = virtualItems.at(-1);

        if (!lastItem) {
            return;
        }

        const isNearEnd = lastItem.index >= count - LOAD_MORE_THRESHOLD;

        if (isNearEnd && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
        }
    }, [virtualItems, count, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return {
        listRef,
        virtualizer,
        virtualItems,
        filteredMaxHeight,
    };
}
