import { beforeEach, describe, expect, it } from 'vitest';

import { ItemsStore } from './itemsStore.js';

describe('ItemsStore', () => {
    let store: ItemsStore;

    beforeEach(() => {
        store = new ItemsStore();
    });

    it('проверка базовых и пользовательских элементов', () => {
        expect(store.has('1')).toBe(true);
        expect(store.has('custom')).toBe(false);

        expect(store.add('custom')).toBe(true);
        expect(store.add('custom')).toBe(false);
        expect(store.has('custom')).toBe(true);
    });

    it('проверка выбора элемента', () => {
        store.select('1');

        expect(store.isSelected('1')).toBe(true);

        store.unselect('1');

        expect(store.isSelected('1')).toBe(false);
    });

    it('проверка выбранных элементов', () => {
        store.select('1');
        store.select('2');
        store.select('3');

        store.moveBefore('3', '2');

        const page = store.getSelectedItems(null);

        expect(page.items).toEqual([{ id: '1' }, { id: '3' }, { id: '2' }]);
    });

    it('проверка доступных элементов', () => {
        store.select('2');

        const page = store.getAvailableItems(null);

        expect(page.items.slice(0, 3)).toEqual([{ id: '1' }, { id: '3' }, { id: '4' }]);
    });
});
