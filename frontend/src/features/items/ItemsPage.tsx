import { ItemsPanel } from './ItemsPanel/ItemsPanel';
import { SelectionButtons } from './SelectionButtons/SelectionButtons';

import styles from './ItemsPage.module.scss';

export function ItemsPage() {
    return (
        <main className={styles.page}>
            <h1 className={styles.title}>Items</h1>
            <div className={styles.panels}>
                <ItemsPanel title="Available" type="available" />
                <SelectionButtons />
                <ItemsPanel title="Selected" type="selected" />
            </div>
        </main>
    );
}
