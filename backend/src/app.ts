import express from 'express';

import { createItemsRouter } from './features/index.js';
import { errorMiddleware } from './middleware/index.js';

export function createApp() {
    const app = express();

    app.use(express.json());

    app.use('/api/items', createItemsRouter());

    app.use(errorMiddleware);

    return app;
}
