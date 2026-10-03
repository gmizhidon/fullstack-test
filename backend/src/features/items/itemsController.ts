import type { NextFunction, Request, Response } from 'express';
import { createItemSchema, getItemsQuerySchema, moveItemSchema, updateItemSchema } from 'shared';

import { ItemsService } from './itemsService.js';

interface ItemParams {
    id: string;
}

export class ItemsController {
    constructor(private readonly service: ItemsService) {}

    getItems = (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = getItemsQuerySchema.parse(req.query);

            res.json(this.service.getItems(query));
        } catch (error) {
            next(error);
        }
    };

    addItem = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = createItemSchema.parse(req.body);

            this.service.addItem(id);

            res.status(201).json({ id });
        } catch (error) {
            next(error);
        }
    };

    updateItem = (req: Request<ItemParams>, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { selected } = updateItemSchema.parse(req.body);

            if (selected) {
                this.service.selectItem(id);
            } else {
                this.service.unselectItem(id);
            }

            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    };

    moveItem = (req: Request<ItemParams>, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { beforeId } = moveItemSchema.parse(req.body);

            this.service.moveItem(id, beforeId);

            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    };
}
