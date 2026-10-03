import { z } from 'zod';

import type { PaginatedResponse } from './pagination.js';

export const ITEMS_PATH = '/api/items' as const;

export interface Item {
    id: string;
}

export const getItemsQuerySchema = z.object({
    selected: z
        .enum(['true', 'false'])
        .transform(value => value === 'true')
        .optional(),
    filter: z.string().optional(),
    cursor: z.string().optional(),
});

export type GetItemsQuery = z.output<typeof getItemsQuerySchema>;

export type GetItemsResponse = PaginatedResponse<Item>;

export const createItemSchema = z.object({
    id: z.string().min(1),
});

export type CreateItemRequest = z.infer<typeof createItemSchema>;

export const updateItemSchema = z.object({
    selected: z.boolean(),
});

export type UpdateItemRequest = z.infer<typeof updateItemSchema>;

export const moveItemSchema = z.object({
    beforeId: z.string().min(1).nullable(),
});

export type MoveItemRequest = z.infer<typeof moveItemSchema>;
