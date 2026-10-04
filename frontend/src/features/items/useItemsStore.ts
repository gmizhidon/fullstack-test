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
    clearSelections: () => void;
    optimisticAddedIds: Set<Item['id']>;
    addOptimisticItem: (id: Item['id']) => void;
    removeOptimisticItem: (id: Item['id']) => void;
}

export interface OptimisticMove {
    ids: Set<Item['id']>;
    selected: boolean;
}

export const useItemsStore = create<ItemsState>(set => {
    return {
        available: createPanelState('available'),
        selected: createPanelState('selected'),
        optimisticMove: null,
        setOptimisticMove: optimisticMove => set({ optimisticMove }),
        clearSelections,
        optimisticAddedIds: new Set(),
        addOptimisticItem,
        removeOptimisticItem,
    };

    function createPanelState(type: ItemsPanelType): PanelState {
        return {
            selection: new Set(),
            toggle: id =>
                set(state => {
                    const selection = new Set(state[type].selection);

                    if (selection.has(id)) {
                        selection.delete(id);
                    } else {
                        selection.add(id);
                    }

                    return { [type]: { ...state[type], selection } };
                }),
            clear: () => set(state => ({ [type]: { ...state[type], selection: new Set() } })),
        };
    }

    function clearSelections() {
        set(state => ({
            available: { ...state.available, selection: new Set() },
            selected: { ...state.selected, selection: new Set() },
        }));
    }

    function addOptimisticItem(id: Item['id']) {
        set(state => {
            const optimisticAddedIds = new Set(state.optimisticAddedIds);
            optimisticAddedIds.add(id);

            return { optimisticAddedIds };
        });
    }

    function removeOptimisticItem(id: Item['id']) {
        set(state => {
            const optimisticAddedIds = new Set(state.optimisticAddedIds);
            optimisticAddedIds.delete(id);

            return { optimisticAddedIds };
        });
    }
});
