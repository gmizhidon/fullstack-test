type SearchParams = Record<string, string | number | boolean | null | undefined>;

export function createQueryString(params: SearchParams) {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
            searchParams.set(key, String(value));
        }
    }

    const search = searchParams.toString();

    return search ? `?${search}` : '';
}
