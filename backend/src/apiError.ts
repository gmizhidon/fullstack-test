import type { ApiError as ApiErrorResponse, ApiErrorCode } from 'shared';

export class ApiError extends Error implements ApiErrorResponse {
    constructor(
        public readonly code: ApiErrorCode,
        message: string,
    ) {
        super(message);
    }
}
