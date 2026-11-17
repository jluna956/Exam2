import { httpError } from './httperror.js';
import { getItemById } from './mediaservice.js';

export const LIST_STATUSES = ['want to', 'completed'];

class ListEntry {
    constructor({ id, userId, itemId, status, dateAdded = new Date() }) {
        this.id = id;
        this.userId = userId;
        this.itemId = itemId;
        this.status = status;
        this.dateAdded = dateAdded;
    }
}

// seed entries for the demo user (id 2)
const entries = [
    new ListEntry({ id: 1, userId: 2, itemId: 2, status: 'want to' }),
    new ListEntry({ id: 2, userId: 2, itemId: 1, status: 'completed' })
];
let nextEntryId = entries.length + 1;

// the user's entry for one item, or null if it's not on their list
export function getEntryForItem(userId, itemId) {
    return entries.find(e => e.userId === Number(userId) && e.itemId === Number(itemId)) || null;
}

// business rules: adds the item to the user's list, or updates the status if it's already there
export function saveListEntry({ userId, itemId, status }) {
    if (!LIST_STATUSES.includes(status)) {
        throw httpError(400, 'Status must be "want to" or "completed".');
    }
    getItemById(itemId); // throws a 404 if the item doesn't exist

    //check if the item is already on the user's list: if so update the status, otherwise create a new entry
    const existingEntry = getEntryForItem(userId, itemId); // only ever finds this user's own entry
    if (existingEntry) {
        if (existingEntry.status === status) {
            throw httpError(409, `This is already on your list as "${status}".`);
        }
        existingEntry.status = status;
        return { entry: existingEntry, created: false };
    }

    const newEntry = new ListEntry({ id: nextEntryId++, userId: Number(userId), itemId: Number(itemId), status });
    entries.push(newEntry);
    return { entry: newEntry, created: true };
}

// used by the My List page: the user's entries with item details, newest first
export function getListForUser(userId) {
    return entries
        .filter(e => e.userId === Number(userId))
        .sort((a, b) => b.dateAdded - a.dateAdded)
        .map(e => ({
            ...e,
            item: getItemById(e.itemId),
            dateLabel: e.dateAdded.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }));
}
