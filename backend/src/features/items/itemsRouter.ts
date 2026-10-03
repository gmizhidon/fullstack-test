import { Router } from 'express';
import { GetItemsQuery, GetItemsResponse, Item } from 'shared';

import { ItemsController } from './itemsController.js';
import { ItemMutation, ItemsService } from './itemsService.js';
import { ItemsStore } from './itemsStore.js';
import { BatchQueue } from '../../queue/batchQueue.js';
import { ReadQueue } from '../../queue/readQueue.js';

interface ItemsRouterOptions {
    addBatchInterval: number;
    mutationBatchInterval: number;
    readBatchInterval: number;
}

export function createItemsRouter({ addBatchInterval, mutationBatchInterval, readBatchInterval }: ItemsRouterOptions) {
    const router = Router();

    const store = new ItemsStore();
    const service = new ItemsService(store);

    const addQueue = new BatchQueue<Item['id']>({
        interval: addBatchInterval,
        getKey: id => id,
        handler: ids => service.addItems(ids),
    });
    const mutationQueue = new BatchQueue<ItemMutation>({
        interval: mutationBatchInterval,
        handler: mutations => service.mutateItems(mutations),
    });
    const readQueue = new ReadQueue<GetItemsQuery, GetItemsResponse>({
        interval: readBatchInterval,
        getKey: query => JSON.stringify(query),
        handler: query => service.getItems(query),
    });

    const controller = new ItemsController(addQueue, mutationQueue, readQueue);

    router.get('/', controller.getItems);
    router.post('/', controller.addItem);
    router.patch('/:id', controller.updateItem);
    router.patch('/:id/order', controller.moveItem);

    return router;
}
