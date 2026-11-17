
import { getTopRated, getItems, getItemById, media_types } from "../services/mediaservice.js";
import { getReviewsForItem } from "../services/reviewservice.js";
import { getEntryForItem, LIST_STATUSES } from "../services/listservice.js";


export function home(req, res, next) {
    try {
        res.render('home', { title: 'Home', active: 'home', topRated: getTopRated(4) });
    } catch (err) {
        next(err);
    }
}

export function browse(req, res, next) {
    try {
        // /browse?type=Book is a query string, so it's read from req.query
        const type = media_types.includes(req.query.type) ? req.query.type : "";
        res.render('browse', {
            title: 'Browse',
            active: 'browse',
            items: getItems(type),
            types: media_types,
            currentType: type
        });
    } catch (err) {
        next(err);
    }
}

export function show(req, res, next) {
    try {
        const item = getItemById(req.params.id); // throws a 404 if the item doesn't exist
        const reviews = getReviewsForItem(item.id);
        const user = req.session.user;

        res.render('item', {
            title: item.title,
            active: 'browse',
            item,
            reviews,
            userReview: user ? reviews.find(r => r.userId === user.id) || null : null,
            listEntry: user ? getEntryForItem(user.id, item.id) : null,
            statuses: LIST_STATUSES,
            error: req.query.error || null,
            success: req.query.success || null
        });
    } catch (err) {
        next(err);
    }
}
