interface ReadQueueOptions<TQuery, TResult> {
    interval: number;
    getKey: (query: TQuery) => string;
    handler: (query: TQuery) => TResult | Promise<TResult>;
}

interface PendingRead<TQuery, TResult> {
    query: TQuery;
    requests: {
        resolve: (result: TResult) => void;
        reject: (error: unknown) => void;
    }[];
}

export class ReadQueue<TQuery, TResult> {
    private readonly pending = new Map<string, PendingRead<TQuery, TResult>>();

    private timer: ReturnType<typeof setTimeout> | null = null;

    constructor(private readonly options: ReadQueueOptions<TQuery, TResult>) {}

    enqueue(query: TQuery): Promise<TResult> {
        return new Promise<TResult>((resolve, reject) => {
            const key = this.options.getKey(query);
            const existing = this.pending.get(key);

            if (existing) {
                existing.requests.push({
                    resolve,
                    reject,
                });

                return;
            }

            this.pending.set(key, {
                query,
                requests: [
                    {
                        resolve,
                        reject,
                    },
                ],
            });

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
        const pending = [...this.pending.values()];

        this.pending.clear();
        this.timer = null;

        await Promise.all(pending.map(item => this.processItem(item)));

        if (this.pending.size) {
            this.schedule();
        }
    }

    private async processItem(item: PendingRead<TQuery, TResult>) {
        try {
            const result = await this.options.handler(item.query);

            for (const request of item.requests) {
                request.resolve(result);
            }
        } catch (error) {
            for (const request of item.requests) {
                request.reject(error);
            }
        }
    }
}
