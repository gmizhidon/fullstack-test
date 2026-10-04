import type { GetItemsQuery, GetItemsResponse, Item } from 'shared';

import { decodeItemsCursor, encodeItemsCursor, type ItemsCursor } from './itemsCursor.js';
import { ItemsStore } from './itemsStore.js';
import { ApiError } from '../../apiError.js';
import type { BatchResult } from '../../queue/batchQueue.js';

export type ItemMutation =
    | {
          type: 'select';
          id: Item['id'];
      }
    | {
          type: 'unselect';
          id: Item['id'];
      }
    | {
          type: 'move';
          id: Item['id'];
          beforeId: Item['id'] | null;
      };

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

    addItems(ids: Item['id'][]): BatchResult[] {
        const results = this.store.add(ids);

        return results.map(result => {
            if (result.success) {
                return {
                    success: true,
                };
            }

            return {
                success: false,
                error: new ApiError('ITEM_ALREADY_EXISTS', `Item "${result.id}" already exists`),
            };
        });
    }

    mutateItems(mutations: ItemMutation[]): BatchResult[] {
        return mutations.map(mutation => {
            try {
                switch (mutation.type) {
                    case 'select':
                        this.selectItem(mutation.id);
                        break;

                    case 'unselect':
                        this.unselectItem(mutation.id);
                        break;

                    case 'move':
                        this.moveItem(mutation.id, mutation.beforeId);
                        break;
                }

                return {
                    success: true,
                };
            } catch (error) {
                return {
                    success: false,
                    error,
                };
            }
        });
    }

    selectItem(id: Item['id']): void {
        if (!this.store.has(id)) {
            throw new ApiError('ITEM_NOT_FOUND', `Item "${id}" not found`);
        }

        if (!this.store.isSelected(id)) {
            this.store.select(id);
        }
    }

    unselectItem(id: Item['id']): void {
        if (!this.store.has(id)) {
            throw new ApiError('ITEM_NOT_FOUND', `Item "${id}" not found`);
        }

        if (this.store.isSelected(id)) {
            this.store.unselect(id);
        }
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
