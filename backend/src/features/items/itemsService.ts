import type { GetItemsQuery, GetItemsResponse, Item } from 'shared';

import { decodeItemsCursor, encodeItemsCursor, type ItemsCursor } from './itemsCursor.js';
import { ItemsStore } from './itemsStore.js';
import { ApiError } from '../../apiError.js';

export class ItemsService {
    constructor(private readonly store: ItemsStore) {}

    getItems(query: GetItemsQuery): GetItemsResponse {
        const cursor = query.cursor ? decodeItemsCursor(query.cursor) : null;
        const selected = query.selected ?? false;

        if (query.cursor && (!cursor || !this.isCursorValid(cursor, selected))) {
            throw new ApiError('INVALID_CURSOR', 'Invalid cursor');
        }

        const page = selected
            ? this.store.getSelectedItems(cursor, query.filter)
            : this.store.getAvailableItems(cursor, query.filter);

        return {
            items: page.items,
            nextCursor: page.nextCursor ? encodeItemsCursor(page.nextCursor) : null,
        };
    }

    addItem(id: Item['id']): void {
        if (this.store.has(id)) {
            throw new ApiError('ITEM_ALREADY_EXISTS', `Item "${id}" already exists`);
        }

        this.store.add(id);
    }

    selectItem(id: Item['id']): void {
        if (!this.store.has(id)) {
            throw new ApiError('ITEM_NOT_FOUND', `Item "${id}" not found`);
        }

        if (this.store.isSelected(id)) {
            throw new ApiError('ITEM_ALREADY_SELECTED', `Item "${id}" is already selected`);
        }

        this.store.select(id);
    }

    unselectItem(id: Item['id']): void {
        if (!this.store.isSelected(id)) {
            throw new ApiError('ITEM_NOT_SELECTED', `Item "${id}" is not selected`);
        }

        this.store.unselect(id);
    }

    moveItem(id: Item['id'], beforeId: Item['id'] | null): void {
        if (!this.store.isSelected(id)) {
            throw new ApiError('ITEM_NOT_SELECTED', `Item "${id}" is not selected`);
        }

        if (beforeId !== null && !this.store.isSelected(beforeId)) {
            throw new ApiError('ITEM_NOT_SELECTED', `Item "${beforeId}" is not selected`);
        }

        this.store.moveBefore(id, beforeId);
    }

    private isCursorValid(cursor: ItemsCursor, selected: boolean) {
        return selected ? cursor.type === 'selected' : cursor.type === 'available';
    }
}
