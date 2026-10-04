import type { VirtualItem } from '@tanstack/react-virtual';

import { ApiErrorMessage } from '@/shared/ui/ApiErrorMessage/ApiErrorMessage';

import type { ItemsPanelType } from '../../useItemsStore';
import { ItemCard } from './Item/ItemCard';
import { Item } from './Item/Item';
import { useItems } from './useItems';
import { useItemsVirtualizer } from './useItemsVirtualizer';
import { SortableItems } from './SortableItems';
import { useItemsReorder } from './useItemsReorder';

import styles from './ItemsList.module.scss';

interface ItemsListProps {
    type: ItemsPanelType;
    filter: string;
}

export function ItemsList({ type, filter }: ItemsListProps) {
    const { items, error, isPending, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isFetchNextPageError } =
        useItems({
            type,
            filter,
        });
    const { items: displayedItems, handleDragEnd, error: reorderError } = useItemsReorder(items);

    const isFiltered = filter.length > 0;

    const { listRef, virtualizer, virtualItems, filteredMaxHeight } = useItemsVirtualizer({
        count: displayedItems.length,
        isFiltered,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    if (isPending) {
        return <div className={styles.status}>Loading...</div>;
    }

    if (isError) {
        return <ApiErrorMessage error={error} fallback="Failed to load items" />;
    }

    let virtualList = (
        <div className={styles.virtualList} style={{ height: virtualizer.getTotalSize() }}>
            {virtualItems.map(renderVirtualItem)}
        </div>
    );

    if (type === 'selected') {
        virtualList = (
            <SortableItems
                ids={displayedItems.map(item => item.id)}
                onDragEnd={handleDragEnd}
                renderOverlay={id => <ItemCard item={{ id }} type="selected" />}
            >
                {virtualList}
            </SortableItems>
        );
    }

    return (
        <div ref={listRef} className={styles.list} style={{ maxHeight: isFiltered ? filteredMaxHeight : undefined }}>
            {virtualList}
            {isFetchingNextPage && <div className={styles.status}>Loading...</div>}
            {isFetchNextPageError && (
                <div className={styles.status}>
                    <ApiErrorMessage error={error} fallback="Failed to load more items" />
                </div>
            )}
            {reorderError && (
                <div className={styles.status}>
                    <ApiErrorMessage error={reorderError} fallback="Failed to reorder item" />
                </div>
            )}
        </div>
    );

    function renderVirtualItem(virtualItem: VirtualItem) {
        const item = displayedItems[virtualItem.index]!;

        return (
            <div
                key={virtualItem.key}
                ref={virtualizer.measureElement}
                data-index={virtualItem.index}
                className={styles.virtualItem}
                style={{ transform: `translateY(${virtualItem.start}px)` }}
            >
                <Item item={item} type={type} />
            </div>
        );
    }
}
