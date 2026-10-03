import type { PaginationParams, PaginatedResponse } from './pagination.js';

export const ITEMS_PATH = '/api/items' as const;

export interface Item {
    id: number;
}

export interface GetItemsQuery extends PaginationParams {
    selected?: boolean;
    filter?: string;
}

export type GetItemsResponse = PaginatedResponse<Item>;

export interface CreateItemRequest {
    id: Item['id'];
}

export interface UpdateItemRequest {
    selected: boolean;
}

export interface MoveItemRequest {
    beforeId: Item['id'] | null;
}
