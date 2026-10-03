import { beforeEach, describe, expect, it } from 'vitest';

import { SelectedItemsList } from './selectedItemsList.js';

describe('SelectedItemsList', () => {
    let list: SelectedItemsList;

    beforeEach(() => {
        list = new SelectedItemsList();
    });

    it('проверка на дубликаты', () => {
        list.append(1);
        list.append(2);
        list.append(1);

        expect([...list]).toEqual([1, 2]);
        expect(list.size).toBe(2);
    });

    it('проверка на удаление', () => {
        list.append(1);
        list.append(2);
        list.append(3);

        expect(list.remove(2)).toBe(true);
        expect([...list]).toEqual([1, 3]);
        expect(list.has(2)).toBe(false);
    });

    it('проверка на перемещение', () => {
        list.append(1);
        list.append(2);
        list.append(3);

        expect(list.moveBefore(3, 2)).toBe(true);
        expect([...list]).toEqual([1, 3, 2]);
    });

    it('проверка на перемещение в конец', () => {
        list.append(1);
        list.append(2);
        list.append(3);

        expect(list.moveBefore(1, null)).toBe(true);
        expect([...list]).toEqual([2, 3, 1]);
    });
});
