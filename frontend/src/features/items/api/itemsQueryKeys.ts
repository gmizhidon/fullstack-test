export const itemsQueryKeys = {
    all: ['items'] as const,
    list: (selected: boolean, filter: string) =>
        [
            ...itemsQueryKeys.all,
            'list',
            {
                selected,
                filter,
            },
        ] as const,
};
