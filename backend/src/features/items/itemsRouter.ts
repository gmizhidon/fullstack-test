import { Router } from 'express';

import { ItemsController } from './itemsController.js';
import { ItemsService } from './itemsService.js';
import { ItemsStore } from './itemsStore.js';

export function createItemsRouter() {
    const router = Router();

    const store = new ItemsStore();
    const service = new ItemsService(store);
    const controller = new ItemsController(service);

    router.get('/', controller.getItems);
    router.post('/', controller.addItem);
    router.patch('/:id', controller.updateItem);
    router.patch('/:id/order', controller.moveItem);

    return router;
}
