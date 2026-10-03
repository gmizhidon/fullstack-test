import express from 'express';

import { createItemsRouter } from './features/index.js';
import { errorMiddleware } from './middleware/index.js';

interface AppOptions {
    addBatchInterval?: number;
    mutationBatchInterval?: number;
    readBatchInterval?: number;
}

export function createApp({
    addBatchInterval = 10_000,
    mutationBatchInterval = 1_000,
    readBatchInterval = 1_000,
}: AppOptions = {}) {
    const app = express();

    app.use(express.json());

    app.use('/api/items', createItemsRouter({ addBatchInterval, mutationBatchInterval, readBatchInterval }));

    app.use(errorMiddleware);

    return app;
}
