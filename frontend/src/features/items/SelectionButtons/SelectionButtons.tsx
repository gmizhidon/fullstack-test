import { Button } from '@/shared/ui/Button/Button';

import { useMoveItems } from './useMoveItems';
import { useItemsStore } from '../useItemsStore';

import styles from './SelectionButtons.module.scss';

export function SelectionButtons() {
    const availableSelection = useItemsStore(state => state.available.selection);

    const selectedSelection = useItemsStore(state => state.selected.selection);

    const isPending = useItemsStore(state => state.optimisticMove !== null);

    const { moveItems } = useMoveItems();

    return (
        <div className={styles.buttons}>
            <Button
                aria-label="Select items"
                disabled={availableSelection.size === 0 || isPending}
                onClick={() => moveItems(availableSelection, true)}
            >
                →
            </Button>

            <Button
                aria-label="Unselect items"
                disabled={selectedSelection.size === 0 || isPending}
                onClick={() => moveItems(selectedSelection, false)}
            >
                ←
            </Button>
        </div>
    );
}
