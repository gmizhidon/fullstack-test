import { PAGE_SIZE, type Item } from 'shared';

import { BASE_ITEM_ID_MAX, BASE_ITEM_ID_MIN } from './itemsConstants.js';
import type { ItemsCursor } from './itemsCursor.js';
import { SelectedItemsList } from './selectedItemsList.js';

interface ItemsPage {
    items: Item[];
    nextCursor: ItemsCursor | null;
}

interface AvailableEntry {
    id: Item['id'];
    source: 'base' | 'custom';
    position: number;
}

export class ItemsStore {
    private readonly customIds: Item['id'][] = [];
    private readonly customIdSet = new Set<Item['id']>();
    private readonly selectedItems = new SelectedItemsList();

    has(id: Item['id']) {
        return this.isBaseItem(id) || this.customIdSet.has(id);
    }

    add(id: Item['id']) {
        if (this.has(id)) {
            return false;
        }

        this.customIds.push(id);
        this.customIdSet.add(id);

        return true;
    }

    isSelected(id: Item['id']) {
        return this.selectedItems.has(id);
    }

    select(id: Item['id']) {
        if (!this.has(id) || this.isSelected(id)) {
            return false;
        }

        this.selectedItems.append(id);

        return true;
    }

    unselect(id: Item['id']) {
        return this.selectedItems.remove(id);
    }

    moveBefore(id: Item['id'], beforeId: Item['id'] | null) {
        return this.selectedItems.moveBefore(id, beforeId);
    }

    getSelectedItems(cursor: ItemsCursor | null, filter?: string): ItemsPage {
        const fromId = cursor?.type === 'selected' ? cursor.id : null;
        const items: Item[] = [];

        for (const id of this.selectedItems.iterateFrom(fromId)) {
            if (!this.matchesFilter(id, filter)) {
                continue;
            }

            if (items.length === PAGE_SIZE) {
                return {
                    items,
                    nextCursor: {
                        type: 'selected',
                        id,
                    },
                };
            }

            items.push({ id });
        }

        return {
            items,
            nextCursor: null,
        };
    }

    getAvailableItems(cursor: ItemsCursor | null, filter?: string): ItemsPage {
        const items: Item[] = [];

        for (const entry of this.iterateAvailable(cursor)) {
            if (!this.matchesFilter(entry.id, filter)) {
                continue;
            }

            if (items.length === PAGE_SIZE) {
                return {
                    items,
                    nextCursor: {
                        type: 'available',
                        source: entry.source,
                        position: entry.position,
                    },
                };
            }

            items.push({ id: entry.id });
        }

        return {
            items,
            nextCursor: null,
        };
    }

    private *iterateAvailable(cursor: ItemsCursor | null): IterableIterator<AvailableEntry> {
        if (!cursor || (cursor.type === 'available' && cursor.source === 'base')) {
            const start = cursor?.type === 'available' ? cursor.position : BASE_ITEM_ID_MIN;

            for (let position = start; position <= BASE_ITEM_ID_MAX; position++) {
                const id = String(position);

                if (!this.selectedItems.has(id)) {
                    yield {
                        id,
                        source: 'base',
                        position,
                    };
                }
            }
        }

        const customStart = cursor?.type === 'available' && cursor.source === 'custom' ? cursor.position : 0;

        for (let position = customStart; position < this.customIds.length; position++) {
            const id = this.customIds[position]!;

            if (!this.selectedItems.has(id)) {
                yield {
                    id,
                    source: 'custom',
                    position,
                };
            }
        }
    }

    private matchesFilter(id: Item['id'], filter?: string) {
        return !filter || id.includes(filter);
    }

    private isBaseItem(id: Item['id']) {
        const value = Number(id);

        return (
            Number.isSafeInteger(value) &&
            value >= BASE_ITEM_ID_MIN &&
            value <= BASE_ITEM_ID_MAX &&
            String(value) === id
        );
    }
}
