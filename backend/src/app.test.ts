import type { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { createApp } from './app.js';

describe('items api', () => {
    let app: Express;

    beforeEach(() => {
        app = createApp({
            addBatchInterval: 1,
            mutationBatchInterval: 1,
            readBatchInterval: 1,
        });
    });

    it('проверка получения элементов', async () => {
        const response = await request(app).get('/api/items');

        expect(response.status).toBe(200);
        expect(response.body.items).toHaveLength(20);
        expect(response.body.items[0]).toEqual({ id: '1' });
        expect(response.body.nextCursor).toEqual(expect.any(String));
    });

    it('проверка добавления элемента', async () => {
        const response = await request(app).post('/api/items').send({ id: 'custom-item' });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ id: 'custom-item' });
    });

    it('проверка дедупликации добавления', async () => {
        const [first, second] = await Promise.all([
            request(app).post('/api/items').send({ id: 'custom-item' }),
            request(app).post('/api/items').send({ id: 'custom-item' }),
        ]);

        expect(first.status).toBe(201);
        expect(second.status).toBe(201);

        const response = await request(app).get('/api/items').query({ filter: 'custom-item' });

        expect(response.body.items).toEqual([{ id: 'custom-item' }]);
    });

    it('проверка добавления существующего элемента', async () => {
        await request(app).post('/api/items').send({ id: 'custom-item' });

        const response = await request(app).post('/api/items').send({ id: 'custom-item' });

        expect(response.status).toBe(409);
        expect(response.body.code).toBe('ITEM_ALREADY_EXISTS');
    });

    it('проверка выбора элемента', async () => {
        const response = await request(app).patch('/api/items/1').send({ selected: true });

        expect(response.status).toBe(204);

        const selectedResponse = await request(app).get('/api/items').query({ selected: 'true' });

        expect(selectedResponse.body.items).toEqual([{ id: '1' }]);
    });

    it('проверка отмены выбора элемента', async () => {
        await request(app).patch('/api/items/1').send({ selected: true });

        const response = await request(app).patch('/api/items/1').send({ selected: false });

        expect(response.status).toBe(204);

        const selectedResponse = await request(app).get('/api/items').query({ selected: 'true' });

        expect(selectedResponse.body.items).toEqual([]);
    });

    it('проверка перемещения элемента', async () => {
        await request(app).patch('/api/items/1').send({ selected: true });

        await request(app).patch('/api/items/2').send({ selected: true });

        await request(app).patch('/api/items/3').send({ selected: true });

        const response = await request(app).patch('/api/items/3/order').send({ beforeId: '2' });

        expect(response.status).toBe(204);

        const selectedResponse = await request(app).get('/api/items').query({ selected: 'true' });

        expect(selectedResponse.body.items).toEqual([{ id: '1' }, { id: '3' }, { id: '2' }]);
    });

    it('проверка последовательной обработки мутаций', async () => {
        const select = request(app).patch('/api/items/1').send({ selected: true });

        const unselect = request(app).patch('/api/items/1').send({ selected: false });

        const responses = await Promise.all([select, unselect]);

        expect(responses[0].status).toBe(204);
        expect(responses[1].status).toBe(204);

        const selectedResponse = await request(app).get('/api/items').query({ selected: 'true' });

        expect(selectedResponse.body.items).toEqual([]);
    });

    it('проверка фильтрации элементов', async () => {
        const response = await request(app).get('/api/items').query({ filter: '123' });

        expect(response.status).toBe(200);
        expect(response.body.items.length).toBeLessThanOrEqual(20);

        for (const item of response.body.items) {
            expect(item.id).toContain('123');
        }
    });

    it('проверка пагинации элементов', async () => {
        const firstPage = await request(app).get('/api/items');

        expect(firstPage.status).toBe(200);
        expect(firstPage.body.items).toHaveLength(20);
        expect(firstPage.body.nextCursor).toEqual(expect.any(String));

        const secondPage = await request(app).get('/api/items').query({ cursor: firstPage.body.nextCursor });

        expect(secondPage.status).toBe(200);
        expect(secondPage.body.items).toHaveLength(20);
        expect(secondPage.body.items[0]).toEqual({ id: '21' });
    });

    it('проверка фильтрации выбранных элементов', async () => {
        await request(app).patch('/api/items/123').send({ selected: true });

        await request(app).patch('/api/items/456').send({ selected: true });

        await request(app).patch('/api/items/1234').send({ selected: true });

        const response = await request(app).get('/api/items').query({
            selected: 'true',
            filter: '123',
        });

        expect(response.status).toBe(200);
        expect(response.body.items).toEqual([{ id: '123' }, { id: '1234' }]);
    });
});
