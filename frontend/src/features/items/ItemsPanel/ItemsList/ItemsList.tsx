import { ItemCard } from './ItemCard/ItemCard';
import { useItems } from './useItems';
import type { ItemsPanelType } from '../../useItemsStore';

import styles from './ItemsList.module.scss';

interface ItemsListProps {
    type: ItemsPanelType;
    filter: string;
}

export function ItemsList({ type, filter }: ItemsListProps) {
    const { items, isPending, isError } = useItems({ type, filter });

    if (isPending) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Failed to load items</div>;
    }

    return (
        <div className={styles.list}>
            {items.map(item => (
                <ItemCard key={item.id} item={item} type={type} />
            ))}
        </div>
    );
}
