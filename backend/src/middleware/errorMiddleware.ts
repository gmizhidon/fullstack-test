import type { NextFunction, Request, Response } from 'express';
import type { ApiError as ApiErrorResponse } from 'shared';
import { ZodError } from 'zod';

import { ApiError } from '../apiError.js';

export function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (error instanceof ZodError) {
        res.status(400).json({
            code: 'INVALID_REQUEST',
            message: 'Invalid request',
        });
        return;
    }

    if (error instanceof ApiError) {
        const body: ApiErrorResponse = {
            code: error.code,
            message: error.message,
        };

        res.status(getStatusCode(error.code)).json(body);
        return;
    }

    console.error(error);

    res.status(500).json({
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
    });
}

function getStatusCode(code: ApiError['code']) {
    switch (code) {
        case 'ITEM_NOT_FOUND':
            return 404;

        case 'ITEM_ALREADY_EXISTS':
        case 'ITEM_ALREADY_SELECTED':
        case 'ITEM_NOT_SELECTED':
            return 409;

        default:
            return 400;
    }
}
