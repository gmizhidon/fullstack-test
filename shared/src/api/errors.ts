export type ApiErrorCode =
    | 'INVALID_REQUEST'
    | 'INVALID_ID'
    | 'ITEM_NOT_FOUND'
    | 'ITEM_ALREADY_EXISTS'
    | 'ITEM_NOT_SELECTED'
    | 'INVALID_CURSOR'
    | 'INVALID_FILTER';

export interface ApiError {
    code: ApiErrorCode;
    message: string;
}
