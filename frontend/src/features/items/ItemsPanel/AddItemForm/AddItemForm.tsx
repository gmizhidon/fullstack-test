import { useState, type SubmitEventHandler } from 'react';

import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import { ApiErrorMessage } from '@/shared/ui/ApiErrorMessage/ApiErrorMessage';

import { useAddItem } from './useAddItem';

import styles from './AddItemForm.module.scss';

export function AddItemForm() {
    const [id, setId] = useState('');

    const { addItem, error } = useAddItem();

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = event => {
        event.preventDefault();
        const trimmedId = id.trim();
        if (!trimmedId) {
            return;
        }
        addItem(trimmedId);
        setId('');
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <Input value={id} placeholder="New item ID" onChange={event => setId(event.target.value)} />
            <Button type="submit" disabled={!id.trim()}>
                Add
            </Button>
            {error && (
                <div className={styles.error}>
                    <ApiErrorMessage error={error} fallback="Failed to add item" />
                </div>
            )}
        </form>
    );
}
