import type { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { createApp } from './app.js';

describe('items api', () => {
    let app: Express;

    beforeEach(() => {
        app = createApp();
    });

    it('получение элементов', async () => {
        const response = await request(app).get('/api/items');

        expect(response.status).toBe(200);
        expect(response.body.items).toHaveLength(20);
        expect(response.body.items[0]).toEqual({ id: '1' });
        expect(response.body.nextCursor).toEqual(expect.any(String));
    });

    it('добавление элемента', async () => {
        const response = await request(app).post('/api/items').send({ id: 'custom-item' });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ id: 'custom-item' });
    });

    it('выбор элемента', async () => {
        const response = await request(app).patch('/api/items/1').send({ selected: true });

        expect(response.status).toBe(204);

        const selectedResponse = await request(app).get('/api/items').query({ selected: 'true' });

        expect(selectedResponse.body.items).toContainEqual({ id: '1' });
    });

    it('перемещение элемента', async () => {
        await request(app).patch('/api/items/2').send({ selected: true });

        await request(app).patch('/api/items/3').send({ selected: true });

        const response = await request(app).patch('/api/items/3/order').send({ beforeId: '2' });

        expect(response.status).toBe(204);

        const selectedResponse = await request(app).get('/api/items').query({ selected: 'true' });

        expect(selectedResponse.body.items).toEqual([{ id: '3' }, { id: '2' }]);
    });
});
