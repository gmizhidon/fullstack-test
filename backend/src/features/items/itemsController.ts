import type { NextFunction, Request, Response } from 'express';
import {
    createItemSchema,
    GetItemsQuery,
    getItemsQuerySchema,
    GetItemsResponse,
    Item,
    moveItemSchema,
    updateItemSchema,
} from 'shared';

import { ItemMutation } from './itemsService.js';
import { BatchQueue } from '../../queue/batchQueue.js';
import { ReadQueue } from '../../queue/readQueue.js';

interface ItemParams {
    id: string;
}

export class ItemsController {
    constructor(
        private readonly createQueue: BatchQueue<Item['id']>,
        private readonly mutationQueue: BatchQueue<ItemMutation>,
        private readonly readQueue: ReadQueue<GetItemsQuery, GetItemsResponse>,
    ) {}

    getItems = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = getItemsQuerySchema.parse(req.query);
            const result = await this.readQueue.enqueue(query);

            res.json(result);
        } catch (error) {
            next(error);
        }
    };

    addItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = createItemSchema.parse(req.body);

            await this.createQueue.enqueue(id);

            res.status(201).json({ id });
        } catch (error) {
            next(error);
        }
    };

    updateItem = async (req: Request<ItemParams>, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { selected } = updateItemSchema.parse(req.body);

            await this.mutationQueue.enqueue({
                type: selected ? 'select' : 'unselect',
                id,
            });

            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    };

    moveItem = async (req: Request<ItemParams>, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { beforeId } = moveItemSchema.parse(req.body);

            await this.mutationQueue.enqueue({
                type: 'move',
                id,
                beforeId,
            });

            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    };
}
