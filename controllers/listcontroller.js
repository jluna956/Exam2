import {saveListEntry} from '../services/listservice.js';

export function savetoList(req, res, next) {
    const itemId = req.params.id;
    try {
        const { status } = req.body || {};
        const { created } = saveListEntry({ userId: req.session.user.id, itemId, status });
        const message = created ? 'Added to your list.' : 'List status updated.';
        res.redirect(`/items/${encodeURIComponent(itemId)}?success=` + encodeURIComponent(message));
    } catch (error) {
        // rule failures go back to the item page as a message
        if (error.status === 400 || error.status === 409) {
            return res.redirect(`/items/${encodeURIComponent(itemId)}?error=` + encodeURIComponent(error.message));
        }
        next(error);
    }
}
