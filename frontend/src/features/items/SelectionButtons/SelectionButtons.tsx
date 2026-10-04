import { Button } from '@/shared/ui/Button/Button';

import { useItemsStore } from '../useItemsStore';
import { useMoveItems } from './useMoveItems';

import styles from './SelectionButtons.module.scss';

export function SelectionButtons() {
    const availableSelection = useItemsStore(state => state.available.selection);
    const selectedSelection = useItemsStore(state => state.selected.selection);

    const { moveItems } = useMoveItems();

    return (
        <div className={styles.buttons}>
            <Button
                aria-label="Select items"
                disabled={availableSelection.size === 0}
                onClick={() => moveItems(availableSelection, 'selected')}
            >
                →
            </Button>
            <Button
                aria-label="Unselect items"
                disabled={selectedSelection.size === 0}
                onClick={() => moveItems(selectedSelection, 'available')}
            >
                ←
            </Button>
        </div>
    );
}
