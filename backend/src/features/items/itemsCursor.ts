import type { Item } from 'shared';

export type ItemsCursor =
    | {
          type: 'available';
          source: 'base' | 'custom';
          position: number;
      }
    | {
          type: 'selected';
          id: Item['id'];
      };

export function encodeItemsCursor(cursor: ItemsCursor): string {
    return Buffer.from(JSON.stringify(cursor)).toString('base64url');
}

export function decodeItemsCursor(cursor: string): ItemsCursor | null {
    try {
        const value: unknown = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));

        return isItemsCursor(value) ? value : null;
    } catch {
        return null;
    }
}

function isItemsCursor(value: unknown): value is ItemsCursor {
    if (!isRecord(value)) {
        return false;
    }

    if (value.type === 'selected') {
        return typeof value.id === 'string';
    }

    if (value.type === 'available') {
        return (
            (value.source === 'base' || value.source === 'custom') &&
            Number.isSafeInteger(value.position) &&
            Number(value.position) >= 0
        );
    }

    return false;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}
