import type { Item as ItemData } from 'shared';

import type { ItemsPanelType } from '../../../useItemsStore';
import { ItemCard } from './ItemCard';
import { SortableItem } from './SortableItem';

interface ItemProps {
    item: ItemData;
    type: ItemsPanelType;
}

export function Item({ item, type }: ItemProps) {
    const card = <ItemCard item={item} type={type} />;

    if (type !== 'selected') {
        return card;
    }

    return <SortableItem id={item.id}>{card}</SortableItem>;
}
