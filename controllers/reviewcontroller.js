import {addReview} from "../services/reviewservice.js";

export function createReview(req, res, next) {
    const itemId = req.params.id;
    try {
        const { rating, text } = req.body || {};
        addReview({ userId: req.session.user.id, itemId, rating, text });
        res.redirect(`/items/${encodeURIComponent(itemId)}?success=` + encodeURIComponent('Thanks! Your review was posted.'));
    } catch (error) {
        // rule failures go back to the item page as a message
        if (error.status === 400 || error.status === 409) {
            return res.redirect(`/items/${encodeURIComponent(itemId)}?error=` + encodeURIComponent(error.message));
        }
        next(error); // missing item (404) or unexpected errors go to the error handler
    }
}
