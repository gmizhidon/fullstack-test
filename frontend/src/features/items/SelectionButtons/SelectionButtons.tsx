import { Button } from '@/shared/ui/Button/Button';

import { useItemsStore } from '../useItemsStore';

import styles from './SelectionButtons.module.scss';

export function SelectionButtons() {
    const availableSelection = useItemsStore(
        state => state.available.selection,
    );

    const selectedSelection = useItemsStore(
        state => state.selected.selection,
    );

    return (
        <div className={styles.buttons}>
            <Button
                disabled={availableSelection.size === 0}
                aria-label="Select items"
            >
                →
            </Button>
            <Button
                disabled={selectedSelection.size === 0}
                aria-label="Unselect items"
            >
                ←
            </Button>
        </div>
    );
}
