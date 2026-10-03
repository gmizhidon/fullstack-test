import { afterEach, describe, expect, it, vi } from 'vitest';

import { ReadQueue } from './readQueue.js';

describe('ReadQueue', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('проверка обработки запроса', async () => {
        vi.useFakeTimers();

        const handler = vi.fn((query: string) => `result-${query}`);

        const queue = new ReadQueue<string, string>({
            interval: 1_000,
            getKey: query => query,
            handler,
        });

        const result = queue.enqueue('one');

        expect(handler).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(1_000);

        await expect(result).resolves.toBe('result-one');

        expect(handler).toHaveBeenCalledOnce();
        expect(handler).toHaveBeenCalledWith('one');
    });

    it('проверка дедупликации запросов', async () => {
        vi.useFakeTimers();

        const handler = vi.fn((query: string) => `result-${query}`);

        const queue = new ReadQueue<string, string>({
            interval: 1_000,
            getKey: query => query,
            handler,
        });

        const first = queue.enqueue('one');
        const second = queue.enqueue('one');

        await vi.advanceTimersByTimeAsync(1_000);

        await expect(first).resolves.toBe('result-one');
        await expect(second).resolves.toBe('result-one');

        expect(handler).toHaveBeenCalledOnce();
        expect(handler).toHaveBeenCalledWith('one');
    });
});
