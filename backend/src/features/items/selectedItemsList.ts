import type { Item } from 'shared';

interface ListNode {
    id: Item['id'];
    prev: ListNode | null;
    next: ListNode | null;
}

export class SelectedItemsList {
    private head: ListNode | null = null;
    private tail: ListNode | null = null;

    private readonly nodes = new Map<Item['id'], ListNode>();

    get size(): number {
        return this.nodes.size;
    }

    has(id: Item['id']): boolean {
        return this.nodes.has(id);
    }

    append(id: Item['id']): void {
        if (this.nodes.has(id)) {
            return;
        }

        const node: ListNode = {
            id,
            prev: this.tail,
            next: null,
        };

        if (this.tail) {
            this.tail.next = node;
        } else {
            this.head = node;
        }

        this.tail = node;
        this.nodes.set(id, node);
    }

    remove(id: Item['id']): boolean {
        const node = this.nodes.get(id);

        if (!node) {
            return false;
        }

        this.detach(node);
        this.nodes.delete(id);

        return true;
    }

    moveBefore(id: Item['id'], beforeId: Item['id'] | null): boolean {
        const node = this.nodes.get(id);

        if (!node) {
            return false;
        }

        if (beforeId === id) {
            return true;
        }

        if (beforeId === null) {
            if (node === this.tail) {
                return true;
            }

            this.detach(node);
            this.attachToEnd(node);

            return true;
        }

        const beforeNode = this.nodes.get(beforeId);

        if (!beforeNode) {
            return false;
        }

        if (node.next === beforeNode) {
            return true;
        }

        this.detach(node);
        this.attachBefore(node, beforeNode);

        return true;
    }

    *[Symbol.iterator](): IterableIterator<Item['id']> {
        let current = this.head;

        while (current) {
            yield current.id;
            current = current.next;
        }
    }

    private detach(node: ListNode): void {
        if (node.prev) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }

        if (node.next) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }

        node.prev = null;
        node.next = null;
    }

    private attachToEnd(node: ListNode): void {
        node.prev = this.tail;

        if (this.tail) {
            this.tail.next = node;
        } else {
            this.head = node;
        }

        this.tail = node;
    }

    private attachBefore(node: ListNode, beforeNode: ListNode): void {
        node.prev = beforeNode.prev;
        node.next = beforeNode;

        if (beforeNode.prev) {
            beforeNode.prev.next = node;
        } else {
            this.head = node;
        }

        beforeNode.prev = node;
    }
}
