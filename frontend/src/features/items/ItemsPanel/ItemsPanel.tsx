import { useState } from 'react';

import { Input } from '@/shared/ui/Input/Input';
import { useDebounce } from '@/shared/hooks/useDebounce';

import { AddItemForm } from './AddItemForm/AddItemForm';
import { ItemsList } from './ItemsList/ItemsList';
import type { ItemsPanelType } from '../useItemsStore';

import styles from './ItemsPanel.module.scss';

interface ItemsPanelProps {
    title: string;
    type: ItemsPanelType;
}

export function ItemsPanel({ title, type }: ItemsPanelProps) {
    const [filter, setFilter] = useState('');
    const debouncedFilter = useDebounce(filter);

    return (
        <section className={styles.panel}>
            <h2 className={styles.title}>{title}</h2>
            {type === 'available' && <AddItemForm />}
            <Input value={filter} placeholder="Filter by ID" onChange={event => setFilter(event.target.value)} />
            <ItemsList type={type} filter={debouncedFilter} />
        </section>
    );
}
