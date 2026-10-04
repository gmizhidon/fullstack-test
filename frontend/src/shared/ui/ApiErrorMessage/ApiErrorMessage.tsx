import type { ApiError } from 'shared';

import styles from './ApiErrorMessage.module.scss';

interface ApiErrorMessageProps {
    error: unknown;
    fallback?: string;
}

function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        'message' in error &&
        typeof error.code === 'string' &&
        typeof error.message === 'string'
    );
}

export function ApiErrorMessage({ error, fallback = 'Something went wrong' }: ApiErrorMessageProps) {
    return (
        <div className={styles.error} role="alert">
            {isApiError(error) ? error.message : fallback}
        </div>
    );
}
