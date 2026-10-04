import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';

import { ApiErrorMessage } from '@/shared/ui/ApiErrorMessage/ApiErrorMessage';

import type { ItemsPanelType } from '../../useItemsStore';
import { ItemCard } from './ItemCard/ItemCard';
import { useItems } from './useItems';

import styles from './ItemsList.module.scss';

const ESTIMATED_ITEM_SIZE = 40;
const ITEM_GAP = 8;
const OVERSCAN = 3;
const LOAD_MORE_THRESHOLD = 5;
const FILTERED_ITEMS_LIMIT = 20;

interface ItemsListProps {
    type: ItemsPanelType;
    filter: string;
}

export function ItemsList({ type, filter }: ItemsListProps) {
    const listRef = useRef<HTMLDivElement>(null);

    const {
        items,
        error,
        isPending,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isFetchNextPageError,
        fetchNextPageError,
    } = useItems({ type, filter });

    const isFiltered = filter.length > 0;

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => listRef.current,
        estimateSize: () => ESTIMATED_ITEM_SIZE,
        gap: ITEM_GAP,
        overscan: isFiltered ? 0 : OVERSCAN,
    });

    useEffect(() => {
        virtualizer.scrollToOffset(0);
    }, [filter, virtualizer]);

    const virtualItems = virtualizer.getVirtualItems();

    const measuredItemSize = virtualItems[0]?.size ?? ESTIMATED_ITEM_SIZE;

    const filteredMaxHeight = measuredItemSize * FILTERED_ITEMS_LIMIT + ITEM_GAP * (FILTERED_ITEMS_LIMIT - 1);

    useEffect(() => {
        const lastItem = virtualItems.at(-1);

        if (!lastItem) {
            return;
        }

        const isNearEnd = lastItem.index >= items.length - LOAD_MORE_THRESHOLD;

        if (isNearEnd && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [virtualItems, items.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isPending) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <ApiErrorMessage error={error} fallback="Failed to load items" />;
    }
    return (
        <div ref={listRef} className={styles.list} style={{ maxHeight: isFiltered ? filteredMaxHeight : undefined }}>
            <div className={styles.virtualList} style={{ height: virtualizer.getTotalSize() }}>
                {virtualItems.map(virtualItem => {
                    const item = items[virtualItem.index]!;

                    return (
                        <div
                            key={virtualItem.key}
                            ref={virtualizer.measureElement}
                            data-index={virtualItem.index}
                            className={styles.virtualItem}
                            style={{ transform: `translateY(${virtualItem.start}px)` }}
                        >
                            <ItemCard item={item} type={type} />
                        </div>
                    );
                })}
            </div>
            {isFetchingNextPage && <div className={styles.loader}>Loading...</div>}
            {isFetchNextPageError && (
                <ApiErrorMessage error={fetchNextPageError} fallback="Failed to load more items" />
            )}
        </div>
    );
}
