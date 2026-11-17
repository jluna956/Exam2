import { addItem, getGenres, media_types } from '../services/mediaservice.js';
import { getAllUsers } from '../services/userservice.js';

export function showAdmin(req, res, next) {
    try{
        res.render('admin', {
            title: 'Admin',
            active: 'admin',
            types: media_types,
            genres: getGenres(),
            users: getAllUsers(),
            error: req.query.error || null,
            success: req.query.success || null
        });
    }catch(err){
        next(err);
    }
}

export function createItem(req, res, next) {
    try{
        const item = addItem(req.body || {});
        res.redirect('/admin?success=' + encodeURIComponent(`"${item.title}" was added to the catalog.`));
    } catch (err) {
        // rule failures go back to the admin page as a message
        if (err.status === 400) {
            return res.redirect('/admin?error=' + encodeURIComponent(err.message));
        }
        next(err);
    }
}