import {
    ITEMS_PATH,
    type CreateItemRequest,
    type CreateItemResponse,
    type GetItemsQuery,
    type GetItemsResponse,
    type Item,
    type MoveItemRequest,
    type UpdateItemRequest,
} from 'shared';

import { apiRequest } from '@/shared/api/apiClient';
import { createQueryString } from '@/shared/api/createQueryString';

export function getItems(query: GetItemsQuery = {}): Promise<GetItemsResponse> {
    return apiRequest<GetItemsResponse>(`${ITEMS_PATH}${createQueryString(query)}`);
}

export function createItem(body: CreateItemRequest): Promise<CreateItemResponse> {
    return apiRequest<CreateItemResponse>(ITEMS_PATH, {
        method: 'POST',
        body,
    });
}

export function updateItem(id: Item['id'], body: UpdateItemRequest): Promise<void> {
    return apiRequest(`${ITEMS_PATH}/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body,
    });
}

export function moveItem(id: Item['id'], body: MoveItemRequest): Promise<void> {
    return apiRequest(`${ITEMS_PATH}/${encodeURIComponent(id)}/order`, {
        method: 'PATCH',
        body,
    });
}
