import { afterEach, describe, expect, it, vi } from 'vitest';

import { BatchQueue } from './batchQueue.js';

describe('BatchQueue', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('проверка обработки одним батчем', async () => {
        vi.useFakeTimers();

        const handler = vi.fn(() => [{ success: true } as const, { success: true } as const]);

        const queue = new BatchQueue<string>({
            interval: 1_000,
            handler,
        });

        const first = queue.enqueue('one');
        const second = queue.enqueue('two');

        expect(handler).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(1_000);

        await Promise.all([first, second]);

        expect(handler).toHaveBeenCalledOnce();
        expect(handler).toHaveBeenCalledWith(['one', 'two']);
    });

    it('проверка результата для каждой операции', async () => {
        vi.useFakeTimers();

        const error = new Error('test error');

        const queue = new BatchQueue<string>({
            interval: 1_000,
            handler: () => [{ success: true }, { success: false, error }],
        });

        const first = expect(queue.enqueue('one')).resolves.toBeUndefined();
        const second = expect(queue.enqueue('two')).rejects.toBe(error);

        await vi.advanceTimersByTimeAsync(1_000);

        await Promise.all([first, second]);
    });

    it('проверка дедупликации', async () => {
        vi.useFakeTimers();

        const handler = vi.fn(() => [{ success: true } as const, { success: true } as const]);

        const queue = new BatchQueue<string>({
            interval: 1_000,
            getKey: item => item,
            handler,
        });

        const first = queue.enqueue('one');
        const second = queue.enqueue('one');
        const third = queue.enqueue('two');

        await vi.advanceTimersByTimeAsync(1_000);

        await Promise.all([first, second, third]);

        expect(handler).toHaveBeenCalledOnce();
        expect(handler).toHaveBeenCalledWith(['one', 'two']);
    });
});
