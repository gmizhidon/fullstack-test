import { create } from 'zustand';
import type { Item } from 'shared';

export type ItemsPanelType = 'available' | 'selected';

interface PanelState {
    selection: Set<Item['id']>;
    toggle: (id: Item['id']) => void;
    clear: () => void;
}

interface ItemsState {
    available: PanelState;
    selected: PanelState;
    optimisticMove: OptimisticMove | null;
    setOptimisticMove: (move: OptimisticMove | null) => void;
    clearAll: () => void;
}

export interface OptimisticMove {
    ids: Set<Item['id']>;
    selected: boolean;
}

export const useItemsStore = create<ItemsState>(set => {
    const createPanelState = (type: ItemsPanelType): PanelState => ({
        selection: new Set(),
        toggle: id => set(state => {
            const selection = new Set(state[type].selection);

            if (selection.has(id)) {
                selection.delete(id);
            } else {
                selection.add(id);
            }

            return {
                [type]: {
                    ...state[type],
                    selection,
                },
            } as Pick<ItemsState, ItemsPanelType>;
        }),
        clear: () => set(state =>({
            [type]: {
                ...state[type],
                selection: new Set(),
            },
        }) as Pick<ItemsState, ItemsPanelType>),
    });

    return {
        available: createPanelState('available'),
        selected: createPanelState('selected'),
        optimisticMove: null,
        setOptimisticMove: optimisticMove => set({ optimisticMove }),
        clearAll: () =>
            set(state => ({
                available: {
                    ...state.available,
                    selection: new Set(),
                },
                selected: {
                    ...state.selected,
                    selection: new Set(),
                },
            })),
    };
});
