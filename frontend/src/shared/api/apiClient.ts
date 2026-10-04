import type { ApiError } from 'shared';

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
    body?: unknown;
}

export async function apiRequest<T>(url: string, options: ApiRequestOptions = {}): Promise<T> {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
        const error = (await response.json()) as ApiError;

        throw error;
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}
