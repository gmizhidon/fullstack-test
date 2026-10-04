import { useEffect, useState } from 'react';

const DEFAULT_DELAY = 300;

export function useDebounce<T>(value: T, delay = DEFAULT_DELAY) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => setDebouncedValue(value), delay);

        return () => clearTimeout(timeoutId);
    }, [value, delay]);

    return debouncedValue;
}
