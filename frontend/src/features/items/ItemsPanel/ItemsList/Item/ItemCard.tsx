import { clsx } from 'clsx';
import type { Item } from 'shared';

import { useItemsStore, type ItemsPanelType } from '../../../useItemsStore';

import styles from './ItemCard.module.scss';

interface ItemCardProps {
    item: Item;
    type: ItemsPanelType;
}

export function ItemCard({ item, type }: ItemCardProps) {
    const isSelected = useItemsStore(state => state[type].selection.has(item.id));

    const toggle = useItemsStore(state => state[type].toggle);

    return (
        <button
            className={clsx(styles.card, isSelected && styles.selected)}
            type="button"
            onClick={() => toggle(item.id)}
        >
            {item.id}
        </button>
    );
}
