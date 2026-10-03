export type BatchResult =
    | { success: true }
    | {
          success: false;
          error: unknown;
      };

interface BatchQueueOptions<TItem> {
    interval: number;
    handler: (items: TItem[]) => BatchResult[] | Promise<BatchResult[]>;
    getKey?: (item: TItem) => string;
}

interface PendingRequest {
    resolve: () => void;
    reject: (error: unknown) => void;
}

interface PendingItem<TItem> {
    item: TItem;
    key?: string;
    requests: PendingRequest[];
}

export class BatchQueue<TItem> {
    private pending: PendingItem<TItem>[] = [];
    private readonly pendingByKey = new Map<string, PendingItem<TItem>>();
    private timer: ReturnType<typeof setTimeout> | null = null;

    constructor(private readonly options: BatchQueueOptions<TItem>) {}

    enqueue(item: TItem): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const request: PendingRequest = {
                resolve,
                reject,
            };

            const key = this.options.getKey?.(item);

            if (key !== undefined) {
                const existingItem = this.pendingByKey.get(key);

                if (existingItem) {
                    existingItem.requests.push(request);
                    return;
                }
            }

            const pendingItem: PendingItem<TItem> = {
                item,
                key,
                requests: [request],
            };

            this.pending.push(pendingItem);

            if (key !== undefined) {
                this.pendingByKey.set(key, pendingItem);
            }

            this.schedule();
        });
    }

    private schedule() {
        if (this.timer) {
            return;
        }

        this.timer = setTimeout(() => this.processBatch(), this.options.interval);
    }

    private async processBatch() {
        const pending = this.pending;

        this.pending = [];
        this.timer = null;

        try {
            const results = await this.options.handler(pending.map(item => item.item));

            for (const [index, item] of pending.entries()) {
                const result = results[index];

                this.deleteKey(item);

                for (const request of item.requests) {
                    if (result?.success) {
                        request.resolve();
                    } else {
                        request.reject(result?.error ?? new Error('Batch result is missing'));
                    }
                }
            }
        } catch (error) {
            for (const item of pending) {
                this.deleteKey(item);

                for (const request of item.requests) {
                    request.reject(error);
                }
            }
        }

        if (this.pending.length) {
            this.schedule();
        }
    }

    private deleteKey(item: PendingItem<TItem>) {
        if (item.key !== undefined) {
            this.pendingByKey.delete(item.key);
        }
    }
}
