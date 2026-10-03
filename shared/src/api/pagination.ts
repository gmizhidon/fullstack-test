export const PAGE_SIZE = 20;

export type Cursor = string;

export interface PaginationParams {
    cursor?: Cursor;
}

export interface PaginatedResponse<T> {
    items: T[];
    nextCursor: Cursor | null;
}
