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
    optimisticMoves: Map<Item['id'], ItemsPanelType>;
    setOptimisticMoves: (ids: Set<Item['id']>, target: ItemsPanelType) => void;
    clearOptimisticMoves: (ids: Set<Item['id']>, target: ItemsPanelType) => void;
    clearSelections: () => void;
    optimisticAddedIds: Set<Item['id']>;
    addOptimisticItem: (id: Item['id']) => void;
    removeOptimisticItem: (id: Item['id']) => void;
}

export const useItemsStore = create<ItemsState>(set => {
    return {
        available: createPanelState('available'),
        selected: createPanelState('selected'),
        optimisticMoves: new Map(),
        setOptimisticMoves,
        clearOptimisticMoves,
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

    function setOptimisticMoves(ids: Set<Item['id']>, target: ItemsPanelType) {
        set(state => {
            const optimisticMoves = new Map(state.optimisticMoves);

            ids.forEach(id => {
                optimisticMoves.set(id, target);
            });

            return { optimisticMoves };
        });
    }

    function clearOptimisticMoves(ids: Set<Item['id']>, target: ItemsPanelType) {
        set(state => {
            const optimisticMoves = new Map(state.optimisticMoves);

            ids.forEach(id => {
                if (optimisticMoves.get(id) === target) {
                    optimisticMoves.delete(id);
                }
            });

            return { optimisticMoves };
        });
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
